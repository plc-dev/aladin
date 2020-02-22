module.exports = async sourceCode => {
  return new Promise((resolve, reject) => {
    try {
      const parsedDB = {
        tables: [],
        edges: []
      };
      parsedDB.tables = sourceCode.map(table => parse(table.sql));
      parsedDB.edges = parsedDB.tables.reduce(
        (edges, table) => [
          ...edges,
          ...table.keyConstraints
            .filter(constraint => constraint.hasOwnProperty("foreign"))
            .map(constraint => [
              { table: table.tableName, column: constraint.foreign },
              {
                table: constraint.referencing.table,
                column: constraint.referencing.column
              }
            ])
        ],
        []
      );
      resolve(parsedDB);
    } catch (err) {
      if (err) reject(err);
    }
  });
};

const parse = statement =>
  statement.split("\n").reduce(
    (table, line) => {
      const tableNameRegex = /CREATE TABLE ["\[]?([\w\s]{1,200})["\] ]/i;
      const columnRegex1 = /["'\[\s]((?!NOT|NULL|DELETE)\w{1,200})["\] ]\s?(\w{1,200})\s?(PRIMARY KEY)?/i;
      const columnRegex2 = /^["\[ ]?((?!NOT|NULL|DELETE)\w{1,200})["\] ]\s?(\w{1,200})\s?(PRIMARY KEY)?/gim;
      const foreignKeyRegex = /["\[]?([\w, ]*)["\]]?\) REFERENCES ["\`[]?(\w*)["`\]]?\s?\(["\[]?([\w, ]*)["\]]?/i;
      const primaryKeyRegex = /\(["\[]?([\w, ]*)["\]]?/g;

      const multipleKeys = string =>
        string.split(",").map(column => column.replace(/["\(\[\] ]/g, ""));

      // table name
      if (tableNameRegex.test(line))
        table.tableName = line.match(tableNameRegex)[1];
      // primary key
      else if (
        /(PRIMARY KEY)\s?\(.*\)/i.test(line) &&
        primaryKeyRegex.test(line)
      )
        table.keyConstraints.push({
          primary: multipleKeys(line.match(primaryKeyRegex)[0])
        });
      // foreign keys
      else if (foreignKeyRegex.test(line)) {
        const [, column, tableReference, columnReference] = line.match(
          foreignKeyRegex
        );
        table.keyConstraints.push({
          foreign: multipleKeys(column),
          referencing: {
            table: tableReference,
            column: multipleKeys(columnReference)
          }
        });
        // column name
      } else if (
        (!/foreign key/i.test(line) && columnRegex1.test(line)) ||
        columnRegex2.test(line)
      ) {
        let complete, columnName, type, isPrimary;
        if (columnRegex1.test(line)) {
          [complete, columnName, type, isPrimary] = line.match(columnRegex1);
        }
        if (!type || type === "NOT") {
          [complete, columnName, type, isPrimary] = line.match(columnRegex2);
          [columnName, type] = complete.split(" ");
        }
        table.columns.push({ columnName, type });

        if (isPrimary) table.keyConstraints.push({ primary: columnName });
      }

      return table;
    },
    { columns: [], keyConstraints: [], edges: [] }
  );
