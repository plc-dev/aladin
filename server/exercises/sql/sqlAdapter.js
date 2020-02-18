/**
 * adapter for different sql flavours
 */
const adapter = {
  sqlite: {
    connectDB: config => {
      const sqlite = require("sqlite");
      return sqlite.open(config.location, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
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
    createForeignKey: "FOREIGN KEY (${foreignKey}) REFERENCES ${providingTable} (${originalColumn})",
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