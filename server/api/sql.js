const { asyncErrorWrapper, flattenObj } = require("../helper");
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
          resolve(
            filenames.map(filename => {
              let src =
                '<img src="https://miro.medium.com/max/2426/1*I3bp6yGM27SyMZYv3kqIwA.png" alt=""></img><br><button class="openEditor">Editor öffnen!</button>';
              let img = src;
              // TODO Remove check after every db has an <erd>.png
              if (/^[abc].*/.test(filename)) {
                src = path.join(
                  appDir,
                  `./exercises/sql/database/${filename}/${filename}.png`
                );
                img = fs.readFileSync(src, "base64");
                img = "data:image/png;base64, " + img;
              }
              return {
                dbName: filename,
                value: img,
                img
              };
            })
          );
        });
      });
      res.status(201).json(dbList);
    })
  );

  router.get(
    "/getDBQuestions",
    asyncErrorWrapper(async (req, res) => {
      const asyncRead = async path =>
        await new Promise((resolve, reject) => {
          return fs.readFile(path, "utf8", (err, file) => {
            if (err) reject(err);
            resolve(JSON.parse(file));
          });
        });
      const buildListObject = async queryLists => {
        return Object.keys(queryLists).reduce((listObject, key) => {
          if (!queryLists[key][dbName]) listObject[key] = [];
          else
            listObject[key] = queryLists[key][dbName].map(question => ({
              question: question.question,
              id: question.id,
              query: question.query,
              userQuery: "",
              result: "",
              userResult: ""
            }));
          return listObject;
        }, {});
      };

      const { dbName } = req.query;
      const queryLists = {
        existing: path.resolve(
          require.main.filename,
          `../exercises/sql/sortedQueries.json`
        ),
        proposed: path.resolve(
          require.main.filename,
          `../exercises/sql/proposedQueries.json`
        )
      };
      const [existing, proposed] = await Promise.all([
        asyncRead(queryLists.existing),
        asyncRead(queryLists.proposed)
      ]);
      res.status(201).json(await buildListObject({ existing, proposed }));
    })
  );

  router.post(
    "/submitQuery",
    asyncErrorWrapper(async (req, res) => {
      const { dbName, userQuery, query, index, type } = req.body;
      let userResult = "No Query was passed",
        result = "false";
      const location = path.resolve(
        require.main.filename,
        `../exercises/sql/database/${dbName}/${dbName}.sqlite`
      );
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
        res.status(201).json({ index, userResult, result, type });
      } catch (err) {
        res
          .status(201)
          .json({ index, userResult: err.message, result, err, type });
      } finally {
        sqlDB.adapter.closeDB(sqlDB);
      }
    })
  );

  router.post(
    "/createDB",
    asyncErrorWrapper(async (req, res) => {
      let { uuid, sourceCode, dbName, sourceFlavour } = req.body;
      const dbDir = path.resolve(
        require.main.filename,
        `../exercises/sql/database/${dbName}`
      );
      const exists = fs.existsSync(dbDir);
      if (exists) throw new Error("dbName already exists");
      // create database
      fs.mkdirSync(dbDir);
      const location = path.resolve(
        require.main.filename,
        `../exercises/sql/database/${dbName}/${dbName}.sqlite`
      );
      const sqlConfig = { flavour: process.env.sqlFlavour, location };
      const sqlDB = await require("../exercises/sql/sqlDAO")(sqlConfig);

      // parse sourceCode from User
      const sql = await require("../exercises/sql/parser/sqlParser")(
        sourceCode,
        sourceFlavour,
        sqlDB
      );

      // fill database  TODO: ADJUST TO ASYNC INTERFACE
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
    "/generateQuery",
    asyncErrorWrapper(async (req, res) => {
      let { uuid, dbName } = req.body;
      const dbLocation = path.resolve(
        require.main.filename,
        `../exercises/sql/database/${dbName}/${dbName}.sqlite`
      );
      const sqlConfig = {
        flavour: process.env.sqlFlavour,
        location: dbLocation
      };
      const sqlDB = await require("../exercises/sql/sqlDAO")(sqlConfig);

      const {
        query,
        questionBluePrint
      } = await require("../exercises/sql/queryBuilder")(sqlDB);

      const question = require("../exercises/sql/naturalLanguageParser")(
        questionBluePrint,
        sqlDB
      );

      sqlDB.adapter.closeDB(sqlDB);

      const builtQuery = Object.keys(query)
        .map(key => query[key])
        .join("");

      console.log(
        "Generated Query: \n",
        builtQuery,
        "\nGenerated Question: \n",
        question
      );
      res.status(201).json({ query: builtQuery, question });
    })
  );

  router.post(
    "/proposeQuery",
    asyncErrorWrapper(async (req, res) => {
      const { query, question, difficulty, id } = req.body;
      const questionPath = path.resolve(
        require.main.filename,
        `../exercises/sql/proposedQueries.json`
      );
      const proposedQueries = await new Promise((resolve, reject) => {
        return fs.readFile(questionPath, "utf8", (err, file) => {
          if (err) reject(err);
          resolve(JSON.parse(file));
        });
      });

      if (!proposedQueries[id]) proposedQueries[id] = [];
      proposedQueries[id].push({
        query,
        question,
        difficulty,
        id
      });
      await new Promise((resolve, reject) => {
        return fs.writeFile(
          questionPath,
          JSON.stringify(proposedQueries, null, 4),
          err => {
            if (err) reject(err);
            resolve();
          }
        );
      });
      res.status(201).json();
    })
  );

  return router;
};
