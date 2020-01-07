const { asyncErrorWrapper } = require("../helper");

module.exports = (router, User) => {
  router.get(
    "/getAllDB",
    asyncErrorWrapper(async (req, res) => {
      const path = require("path");
      const fs = require("fs");
      const appDir = path.dirname(require.main.filename);
      const directoryPath = path.join(appDir, "./exercises/sql/database");
      const dbList = await new Promise((resolve, reject) => {
        return fs.readdir(directoryPath, (err, filenames) => {
          if (err) reject(err);
          resolve(filenames);
        });
      });
      res.status(201).json(dbList);
    })
  );

  router.get(
    "/getDBQuestions",
    asyncErrorWrapper(async (req, res) => {
      const { dbName } = req.query;
      const path = require("path");
      const fs = require("fs");
      const questionPath = path.resolve(require.main.filename, `../exercises/sql/spider/sorted_questions.json`);
      const sortedQuestions = await new Promise((resolve, reject) => {
        return fs.readFile(questionPath, "utf8", (err, file) => {
          if (err) reject(err);
          resolve(JSON.parse(file));
        });
      });

      res.status(201).json({ questions: sortedQuestions[dbName] });
    })
  );

  router.post(
    "/createDB",
    asyncErrorWrapper(async (req, res) => {
      let { uuid, sourceCode, dbName } = req.body;
      const dbDir = require("path").resolve(require.main.filename, `../exercises/sql/database/${dbName}`);
      const fs = require("fs");
      const exists = fs.existsSync(dbDir);
      if (exists) throw new Error("dbName already exists");
      fs.mkdirSync(dbDir);
      const location = require("path").resolve(require.main.filename, `../exercises/sql/database/${dbName}/${dbName}.sqlite`);

      const sqlConfig = { flavour: process.env.sqlFlavour, location };
      const sqlDB = await require("../exercises/sql/sqlDAO")(sqlConfig);

      const sql = await require("../exercises/sql/sqlParser")(sourceCode, sqlDB);
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

  /**
   * @swagger
   * /generateERD:
   *  post:
   *    summary: Validates the login data and sends user settings and ID to client
   *    parameters:
   *      - in: body
   *        name: user
   *        schema:
   *          type: object
   *          required:
   *            - email
   *              password
   *          properties:
   *            email:
   *              type: string
   *            password:
   *              type: string
   *    responses:
   *      '200':
   *        description: Login data valid
   *      '409':
   *        description: Validation error
   */
  router.post(
    "/generateERD",
    asyncErrorWrapper(async (req, res) => {
      try {
        const { uuid, sourceCode } = req.body;

        // const { spawn } = require("child_process");
        // const path = require("path");
        // const pathToErd = path.resolve(__dirname, "../sql", "erd");
        // const child = spawn(pathToErd, ["--fmt=png", "--output=" + "test"], { input: string, shell: true }).on("error", err => console.log(err));
        // process.stdin.resume();
        // child.stdin.resume();
        // child.stdin.setEncoding("utf-8");
        // child.stdin.write(string);
        // // use child.stdout.setEncoding('utf8'); if you want text chunks
        // child.stdout.on("data", chunk => {
        //   // data from standard output is here as buffers
        //   console.log(chunk);
        // });
        // child.on("exit", code => {
        //   console.log(`child process exited with code ${code}`);
        // });

        // const { spawnSync } = require("child_process");
        // const path = require("path");
        // const pathToErd = path.resolve(__dirname, "../sql", "erd");
        // // const pathToErd = require.resolve("../erd/erd");
        // const child = spawnSync(pathToErd, ["--fmt=png", "--output=" + "test"], { input: string, shell: true });
        // console.log(child.stderr.toString());
        // console.log(child.stdout.toString());
        // require("fs").writeFile("logo.png", child.output[2], "binary", function(err) {
        //   if (err) throw err;
        //   console.log("File saved.");
        // });

        const { execFileSync } = require("child_process");
        const path = require("path");
        const pathToErd = path.resolve(__dirname, "../sql", "erd");
        console.log("test");
        const child = execFileSync(pathToErd, ["--fmt=png", "--output=" + "test"], { input: string, shell: true });
        console.log(child.toString());

        // const user = await User.findOneAndUpdate({ _id: uuid }, { subscription }, { upsert: true });
        res.status(201).json({});
      } catch (err) {
        console.log(err);
      }
    })
  );

  return router;
};
