module.exports = async sourceCode => {
    return new Promise((resolve, reject) => {
      try {
          const parsedDB = {
              tables: [],
              edges: []
          }; 
          parsedDB.tables = sourceCode.map(table => parse(table.sql));
          resolve(parsedDB);
      } catch (err) {
        if (err) reject(err);
      }
    });
};

const parse = statement => statement.split('\n').reduce((table, line) => {
    const tableNameRegex = /CREATE TABLE ["\[]([\w\s]{1,200})["\]]/;
    const columnRegex = /["\[](\w{1,200})["\]]\s?(\w{1,200})\s?(PRIMARY KEY)?/;
    const foreignKeyRegex = /["\[](\w*)["\]]\) REFERENCES ["\`[](\w*)["`\]]\s?\(["\[](\w*)["\]]/;

    if(tableNameRegex.test(line)) table.tableName = line.match(tableNameRegex)[1];
    if(columnRegex.test(line)) {
        const [, columnName, type, isPrimary] = line.match(columnRegex);
        table.columns.push({columnName, type});

        if(isPrimary) table.keyConstraints.push({primary: columnName});
    }
    if(/(PRIMARY KEY) \(.*\)/.test(line) && /["\[]([\w]*)["\]]/g.test(line)) table.keyConstraints.push({primary: line.match(/["\[]([\w]*)["\]]/g).map(column => column.replace(/["\[\]]/g, ""))});
    if(foreignKeyRegex.test(line)) {
        const [, column, tableReference, columnReference] = line.match(foreignKeyRegex);
        table.keyConstraints.push({foreign: column, referencing: {table: tableReference, column: columnReference}});
    }

    return table;
}, {columns: [], keyConstraints: []});
    
