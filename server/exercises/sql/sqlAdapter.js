module.exports = flavour => {
  /**
   * adapter for different sql flavours
   */
  const adapter = {
    sqlite: {
      connectDB: config => {
        const sqlite3 = require("sqlite3").verbose();
        return new sqlite3.Database(config.location, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, err => {
          if (err) {
            console.log("Could not connect to database", err);
          } else {
            console.log("Connected to database");
          }
        });
      },
      types: {
        null: "NULL",
        integer: "INTEGER",
        float: "REAL",
        string: "TEXT",
        blob: "BLOB"
      },
      createForeignKey: "FOREIGN KEY (${foreignKey}) REFERENCES ${providingTable} (${originalColumn})",
      createPrimaryKey: "PRIMARY KEY(${...primary})"
    }
  };
  return adapter[flavour];
};
