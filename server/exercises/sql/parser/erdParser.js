const { templateString } = require("../../../helper");

module.exports = async (sourceCode, sqlDB) => {
  return new Promise((resolve, reject) => {
    try {
      const entities = sourceCode.match(entitiesRegex);
      const relations = sourceCode.match(relationsRegex);
      const parsedERD = parseERD(entities, relations);
      const sql = parseToSQL(parsedERD, sqlDB.adapter);
      resolve(sql);
    } catch (err) {
      if (err) reject(err);
    }
  });
};

/**
 * \[\w*\]          -> match entity enclosed in brackets
 * [\w*"{}:,+\s]*   -> match valid table description syntax
 * (#\w*)?          -> match color code if existing
 * [\w*"{}:,+\s]*   -> match valid table description syntax
 */
const entitiesRegex = new RegExp(`\\[\\w*\\][\\w*"{}:,+\\s]*(#\\w*)?[\\w*"{}:,+\\s]*`, "ig");

/**
 * \\\[(\\w*)\\]     -> group holds entity name
 */
const entityNameRegex = new RegExp(`\\[([a-zA-Z_-]*)\\]`, "i");

/**
 * (?<=[\\n\\r])    -> omit first line
 * [*+\\w{}"":, ]*   -> match valid column description syntax
 */
const columnRegex = new RegExp(`(?<=[\\n\\r])[*+\\w{}"":, ]*`, "ig");

/**
 * ([+*]{0,2})      -> first group holds constraints if existing
 * ([a-zA-Z_ -]*)   -> second group holds column name
 * {[\\w\\s:]*"     -> match unneeded characters before column attributes
 * ([\\w, _-]*)     -> third group holds column attributes
 * "}               -> match end of the column attributes
 */
const columnPartsRegex = new RegExp(`([+*]{0,2})([a-zA-Z_ -]*){[\\w\\s:]*"([\\w, _-]*)"}`, "i");

/**
 * [w_ {}:"-]           -> match first entity and column
 * [?*+1]{1}--[?*+1]{1} -> match cardinality, eg. *--+
 * [\w_ {}:"-]*         -> match second entity and column
 */
const relationsRegex = new RegExp(`[\\w_ <>{}:"-]*[?*+1]{1}--[?*+1]{1}[\\w_ <>{}:"-]*`, "ig");

/**
 * ([\\w_ -]*)          -> first group holds table name receiving a foreign key
 * <([\\w_ -]*)>        -> second group holds name of the foreign key
 * [+*1 -]*             -> match whitespace and cardinality
 * ([\\w_ -]*)          -> third group holds table name providing a foreign key
 * <([\\w_ -]*)>        -> fourth group holds name of the field in the original table
 */
const relationPartsRegex = new RegExp(`([\\w_ -]*)<([\\w_ -]*)>[+*1 -]*([\\w_ -]*)<([\\w_ -]*)>`, "i");

function isMatchFound(returnValue) {
  if (returnValue === null) throw new Error("no match found");
}

function isColumnDuplicate(tables) {
  tables.forEach(table => {
    const columns = table[Object.keys(table)].map(column => column.name);
    const columnSet = new Set(columns);
    if (columnSet.size !== columns.length) throw new Error("duplicate column in table");
  });
}

function parseERD(entities, relations) {
  isMatchFound(entities);
  isMatchFound(relations);
  let tables = entities.map(entity => parseEntity(entity));
  isColumnDuplicate(tables);

  return parseRelations(relations, tables);
}

function parseEntity(entity) {
  const tableName = entity.match(entityNameRegex)[1];
  const tableColumns = entity.match(columnRegex);
  isMatchFound(tableColumns);
  const parsedColumns = parseColumns(tableColumns);
  return { [tableName]: parsedColumns };
}

function parseColumns(columns) {
  return columns
    .filter(column => column)
    .map(column => {
      const [, constraints, name, attributes] = column.match(columnPartsRegex);
      return {
        constraints: constraints.trim(),
        name: name.trim(),
        attributes: attributes.split(",").map(attribute => attribute.trim())
      };
    });
}

function parseRelations(relations, tables) {
  relations.forEach(relation => {
    let [, receivingTable, foreignKey, originalColumn, providingTable] = relation.match(relationPartsRegex);

    tables.findIndex(table => {
      const tableName = Object.keys(table)[0];
      receivingTable = receivingTable.trim();
      if (tableName == receivingTable) {
        const currentTable = table[tableName];
        currentTable.push({
          foreignKey: foreignKey.trim(),
          originalColumn: originalColumn.trim(),
          providingTable: providingTable.trim()
        });
      }
    });
  });
  return tables;
}

function parseToSQL(parsedSource, adapter) {
  const createTables = parsedSource.map(table => {
    let createTable = `CREATE TABLE ${Object.keys(table)[0]}(\n`;
    const primary = [];
    table[Object.keys(table)[0]].map(line => {
      if (line.constraints !== undefined) {
        if (/\*/.test(line.constraints)) primary.push(line.name);
        createTable += `"${line.name}" ${adapter.types[line.attributes[0]]}`;
        secondAttribute = line.attributes.length === 2 ? ` ${line.attributes[1]}` : "";
        createTable += secondAttribute + ",\n";
      } else {
        createTable +=
          templateString(adapter.createForeignKey, {
            foreignKey: line.foreignKey,
            originalColumn: line.originalColumn,
            providingTable: line.providingTable
          }) + "\n";
      }
    });
    if (primary.length) createTable += templateString(adapter.createPrimaryKey, { primary }, ", ");
    else createTable = createTable.replace(/,([^,]*)$/, "");
    createTable += "\n);";
    return createTable;
  });

  return createTables;
}
