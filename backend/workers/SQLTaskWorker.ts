import { PgClient } from "../database/postgres/postgresDAO";
import { QueryResult } from "pg";
import { templateString, toPascalCase } from "../helperFunctions";

import fs from "fs";

const reflectionQueries = {
    tables: `SELECT columns.table_name,
                    columns.column_name,
                    columns.data_type
            FROM information_schema.columns
            WHERE table_name in 
                    (SELECT tables.table_name
                    FROM information_schema.tables
                    WHERE tables.table_schema = '\${schema}' 
                    AND tables.table_name != 'schema_version' 
                    AND tables.table_type = 'BASE TABLE');`,
    foreignKeys: `SELECT m.relname AS source_table,
                        (SELECT a.attname FROM pg_attribute a WHERE a.attrelid = m.oid AND a.attnum = o.conkey[1] AND a.attisdropped = false) AS source_column,
                        f.relname AS target_table,
                        (SELECT a.attname FROM pg_attribute a WHERE a.attrelid = f.oid AND a.attnum = o.confkey[1] AND a.attisdropped = false) AS target_column
                FROM pg_constraint o LEFT JOIN pg_class f ON f.oid = o.confrelid LEFT JOIN pg_class m ON m.oid = o.conrelid
                WHERE o.contype = 'f' AND o.conrelid IN (SELECT oid FROM pg_class c WHERE c.relkind = 'r')
                and o.connamespace::regnamespace::text = '\${schema}';`,
};

class SQLDBReflection {
    constructor(private schema: Array<string>, private dbClient: PgClient) {}

    public async reflectDB() {
        return { foreignKeys: await this.reflectForeignKeys(), tables: await this.reflectTables() };
    }
    public async reflectForeignKeys() {
        const result: QueryResult = await this.dbClient.queryDB(templateString(reflectionQueries.foreignKeys, { schema: this.schema }));
        return result.rows;
    }
    public async reflectTables() {
        const result: QueryResult = await this.dbClient.queryDB(templateString(reflectionQueries.tables, { schema: this.schema }));
        return result.rows;
    }
}

type Await<T> = T extends {
    then(onfulfilled?: (value: infer U) => unknown): unknown;
}
    ? U
    : T;

interface IReference {
    columns: { target: string; source: string };
    table: string;
    selfJoin?: boolean;
}

interface IParsedTable {
    [key: string]: {
        references: Array<IReference>;
        columns: {
            [key: string]: {
                type: keyof SQLMetaDataParser["typeMap"] | "unknown";
            };
        };
    };
}

class SQLMetaDataParser {
    private typeMap = {
        number: ["real", "int", "decimal", "numeric", "double", "precision", "serial"],
        string: ["char", "text"],
        date: ["date", "time", "interval"],
        boolean: ["boolean"],
        uuid: ["uuid"],
        binary: ["bytea"],
        currency: ["money"],
    };

    constructor(private metadata: Await<ReturnType<SQLDBReflection["reflectDB"]>>) {}

    public parseMetaData() {
        const tables = this.parseTables();
        const foreignKeys = this.parseForeignKeys(tables);
        return { tables, foreignKeys };
    }

    private harmonizeType(dataType: string) {
        for (const [harmonizedType, patterns] of Object.entries(this.typeMap)) {
            for (const pattern of patterns) {
                const isHarmonizedType = new RegExp(pattern, "i").test(dataType.toLowerCase());
                if (isHarmonizedType) {
                    return harmonizedType;
                }
            }
        }
        return "unknown";
    }

    private parseTables(): IParsedTable {
        const { tables } = this.metadata;
        return tables.reduce((parsedTables, row) => {
            const { table_name, column_name, data_type } = row;
            const harmonizedType = this.harmonizeType(data_type);
            if (Object.keys(parsedTables).includes(table_name)) {
                parsedTables[table_name].columns[column_name] = { type: harmonizedType };
            } else {
                parsedTables[table_name] = { columns: { [column_name]: { type: harmonizedType } }, references: [] };
            }
            return parsedTables;
        }, {});
    }

    private parseForeignKeys(tables: ReturnType<SQLMetaDataParser["parseTables"]>) {
        const { foreignKeys } = this.metadata;
        const edges = foreignKeys.map((foreignKey) => {
            const { source_table, source_column, target_column, target_table } = foreignKey;
            const edge = {
                source: { table: source_table, columns: { source: source_column, target: target_column } },
                target: { table: target_table, columns: { source: target_column, target: source_column } },
            };

            // add edges to tables
            const { source, target } = edge;
            if (source.table != target.table) {
                tables[source.table].references.push(target);
                tables[target.table].references.push(source);
            } else {
                tables[source.table].references.push({ ...target, selfJoin: true });
            }

            return edge;
        });
        return edges;
    }
}

interface IOptions {
    joins: number;
    groupBy: boolean;
    where: boolean;
    orderBy: boolean;
}

class QueryBuilder {
    aliasDictionary = {};
    constructor(private parsedMetaData: ReturnType<SQLMetaDataParser["parseMetaData"]>, private options: IOptions) {
        const { tables } = parsedMetaData;
        this.aliasDictionary = Object.keys(tables).reduce((aliasDictionary, table) => {
            let alias = toPascalCase(table).match(/[A-Z]/g).join("").toLowerCase();
            let bandWidth = 1;
            while (Object.values(aliasDictionary).filter((a) => a === alias).length) {
                const regex = new RegExp(`[A-Z][a-z]{1,${bandWidth}}`, "g");
                alias = toPascalCase(table).match(regex).join("").toLowerCase();
                bandWidth++;
            }
            aliasDictionary[table] = alias;
            return aliasDictionary;
        }, {} as { [key: string]: string });
    }

    public generateQuery() {
        const { joins, groupBy, where, orderBy } = this.options;
        const paths = this.findAllPaths();
        fs.writeFileSync("tables.json", JSON.stringify(this.parsedMetaData.tables));
        fs.writeFileSync("paths.json", JSON.stringify(paths));
        // console.dir(paths, { depth: null });
    }

    private findAllPathsFromNode(
        tables: IParsedTable,
        node: keyof IParsedTable,
        visited: [keyof IParsedTable],
        path: Array<{ table: keyof IParsedTable; column: string } | any>,
        paths: Array<Array<{ table: keyof IParsedTable; column: string }>>
    ): Array<Array<{ table: keyof IParsedTable; column: string }>> {
        const currentTable = tables[node];
        for (const { table, columns, selfJoin } of currentTable.references) {
            if ((selfJoin && visited.filter((v) => v === table).length >= 2) || (!selfJoin && visited.includes(table))) {
                continue;
            }
            visited.push(node);
            path = [...path, { table, columns }];
            paths = [path, ...this.findAllPathsFromNode(tables, table, visited, path, paths)];
            path = [];
        }
        return paths;
    }

    private findAllPaths() {
        const { tables } = this.parsedMetaData;
        const pathsPerTable = Object.keys(tables).reduce((pathsPerTable, table, i) => {
            if (!i) {
                const paths = this.findAllPathsFromNode(tables, table, [table], [], []);
                return { ...pathsPerTable, [table]: paths };
            }
            return pathsPerTable;
        }, {});
        return pathsPerTable;
    }
}

(async () => {
    const sqlTaskClient = new PgClient("test");
    const reflector = new SQLDBReflection(["northwind"], sqlTaskClient);
    const reflection = await reflector.reflectDB();
    const parser = new SQLMetaDataParser(reflection);
    const parsedMetaData = parser.parseMetaData();
    // console.dir(parsedMetaData, { depth: null });
    const qb = new QueryBuilder(parsedMetaData, { joins: 0, groupBy: false, where: false, orderBy: false });
    qb.generateQuery();
    // console.log(qb.aliasDictionary);
})();
