/**
 * adapter for different sql flavours
 */
const adapter = {
  sqlite: {
    connectDB: config => {
      const sqlite = require("sqlite");
      return sqlite.open(
        config.location,
        sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE
      );
    },
    closeDB: db => {
      const sqlite = require("sqlite");
      console.log(`sqlite-DB closed!`);
      sqlite.close(db);
      return;
    },
    queryDB: async (db, query) => await db.all(query),
    numericOperators: ["BETWEEN", "<>", "<", ">", "<=", ">=", "="],
    textOperators: ["LIKE", "NOT LIKE", "<>", "="],
    aggregateTypes: ["MAX", "MIN", "AVG", "COUNT", "SUM"],
    textualRepresentation: {
      BETWEEN: "zwischen ${value1} und ${value2} liegt",
      "<>": "ungleich",
      "<": "kleiner",
      ">": "größer",
      "<=": "kleiner oder gleich",
      ">=": "größer oder gleich",
      "=": "gleich",
      LIKE: [
        '"${value}" enthalten muss"',
        'mit "${value}" enden muss',
        'mit "${value}" beginnen muss'
      ],
      "NOT LIKE": [
        'nicht "${value}" enthalten darf',
        'nicht "mit ${value}" enden darf',
        'nicht mit "${value}" beginnen darf'
      ],
      SUM: "die Summe von ${column}",
      AVG: "den Durchschnitt von ${column}",
      MAX: "das Maximum von ${column}",
      MIN: "das Minimum von ${column}",
      COUNT: "die Anzahl von ${column}"
    },
    types: {
      null: "NULL",
      notNull: "",
      integer: "INTEGER",
      float: "REAL",
      string: "TEXT",
      blob: "BLOB",
      autoIncrement: "",
      date: "TEXT"
    },
    joinTypes: ["LEFT JOIN", "LEFT OUTER JOIN", "CROSS JOIN", "INNER JOIN"],
    createForeignKey:
      "FOREIGN KEY (${foreignKey}) REFERENCES ${providingTable} (${originalColumn})",
    createPrimaryKey: "PRIMARY KEY(${...primary})"
  },
  sqlServer: {
    // TODO: Fill in proper connect function
    connectDB: config => null,
    types: {
      null: "NULL",
      notNull: "NOT NULL",
      integer: ["int", "bigint"],
      autoIncrement: "IDENTITIY (${seed}, ${increment})",
      float: "",
      string: ["nchar (${length})", "nvarchar (${length})", "ntext"],
      blob: "image",
      date: "datetime"
    }
  }
};

module.exports = flavour => adapter[flavour];
