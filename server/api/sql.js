const { asyncErrorWrapper } = require("../helper");
const path = require("path");
const fs = require("fs");

module.exports = router => {
  router.get(
    "/getDBList",
    asyncErrorWrapper(async (req, res) => {
      const appDir = path.dirname(require.main.filename);
      const directoryPath = path.join(appDir, "./exercises/sql/database");
      const dbList = await new Promise((resolve, reject) => {
        return fs.readdir(directoryPath, (err, filenames) => {
          if (err) reject(err);
          resolve(filenames.map(filename => {
            let src = '<img src="https://miro.medium.com/max/2426/1*I3bp6yGM27SyMZYv3kqIwA.png" alt=""></img><br><button class="openEditor">Editor öffnen!</button>';
            let img = src;
            if (/^[abc].*/.test(filename)) {
              src = path.join(appDir, `./exercises/sql/database/${filename}/${filename}.png`);  
              img = fs.readFileSync(src, 'base64');
              img = "data:image/png;base64, " + img;
            } 
            return {
              dbName: filename, 
              value: img,
              img
            };
          }));
        });
      });
      res.status(201).json(dbList);
    })
  );

  router.get(
    "/getDBQuestions",
    asyncErrorWrapper(async (req, res) => {
      const { dbName } = req.query;
      const questionPath = path.resolve(require.main.filename, `../exercises/sql/sortedQueries.json`);
      const sortedQuestions = await new Promise((resolve, reject) => {
        return fs.readFile(questionPath, "utf8", (err, file) => {
          if (err) reject(err);
          resolve(JSON.parse(file));
        });
      });

      res.status(201).json(sortedQuestions[dbName].map(question => ({
        question: question.question, 
        id: question.id, 
        query: question.query,
        userQuery: "",
        result: "",
        userResult: ""
      })));
    })
  );

  router.post("/submitQuery", asyncErrorWrapper(async (req, res) => {
    const { dbName, userQuery, query, index } = req.body;
    let userResult = 'No Query was passed', result;
    const location = path.resolve(require.main.filename, `../exercises/sql/database/${dbName}/${dbName}.sqlite`);
    const sqlConfig = { flavour: process.env.sqlFlavour, location };
    const sqlDB = await require("../exercises/sql/sqlDAO")(sqlConfig);
    try {
      if (userQuery) {
        [userResult, result] = await Promise.all([
          sqlDB.all(userQuery, req.params.id),
          sqlDB.all(query)
        ]);
        console.log(`Ran queries:\n${userQuery}\n${query}`);
      }
      res.status(201).json({index, userResult, result});
    } catch (err) {
      res.status(201).json({index, userResult: err.message, result, err});
    } finally {
      sqlDB.adapter.closeDB(sqlDB);
    }
    })
  );

  router.post(
    "/createDB",
    asyncErrorWrapper(async (req, res) => {
      let { uuid, sourceCode, dbName, sourceFlavour } = req.body;
      const dbDir = path.resolve(require.main.filename, `../exercises/sql/database/${dbName}`);
      const exists = fs.existsSync(dbDir);
      if (exists) throw new Error("dbName already exists");
      // create database 
      fs.mkdirSync(dbDir);
      const location = path.resolve(require.main.filename, `../exercises/sql/database/${dbName}/${dbName}.sqlite`);
      const sqlConfig = { flavour: process.env.sqlFlavour, location };
      const sqlDB = await require("../exercises/sql/sqlDAO")(sqlConfig);

      // parse sourceCode from User
      const sql = await require("../exercises/sql/parser/sqlParser")(sourceCode, sourceFlavour, sqlDB);

      // fill database 
      sql.forEach(createTable =>
        sqlDB.serialize(() =>
          sqlDB.run(createTable, err => {
            if (err) console.log(err + "\n" + createTable);
          })
        )
      );
      res.status(201).json({});
    })
  );

  router.post(
    "/createQueries",
    asyncErrorWrapper(async (req, res) => {
      let { uuid, dbName } = req.body;
      const dbLocation = path.resolve(require.main.filename, `../exercises/sql/database/${dbName}/${dbName}.sqlite`);
      const sqlConfig = { flavour: process.env.sqlFlavour, location: dbLocation };
      const sqlDB = await require("../exercises/sql/sqlDAO")(sqlConfig);

      const reflectTables = "SELECT sql FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';";

      await sqlDB.all(reflectTables, [], async (err, rows) => {
        if (err) throw err;
        const sourceCode = rows;

        // parse metadata to json format
        const parsedTables = await require("../exercises/sql/parser/sqlParser")({ sourceCode, sourceFlavour: "json", sqlDB });

        const paths = parsedTables.reduce((paths, tables) => {

        }, [])

        
        res.status(201).json(parsedTables);
      });

    })
  );

  return router;
};
