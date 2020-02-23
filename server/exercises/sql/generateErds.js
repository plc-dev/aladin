const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const appDir = path.dirname(require.main.filename);
const directoryPath = path.join(appDir, "./database");
const dbList = fs.readdirSync(directoryPath);

const executablePath = path.join(
  appDir,
  "./schemacrawler/_schemacrawler/schemacrawler.cmd"
);

dbList.forEach((dbName, index) => {
  if (!index) {
    const bat = spawn(
      `cmd`,
      [
        `/c`,
        `${executablePath}`,
        `--database=${directoryPath}/${dbName}/${dbName}.sqlite`,
        `--command=schema`,
        `--output-format=svg`,
        `--output-file=${directoryPath}/${dbName}/${dbName}.svg`,
        `--info-level=maximum`,
        `--server=sqlite`,
        `--table-types=TABLE`
      ],
      { shell: true }
    );

    bat.stdout.on("data", data => {
      console.log(data.toString());
    });

    bat.stderr.on("data", data => {
      console.error(data.toString());
    });

    bat.on("exit", code => {
      console.log(`Child exited with code ${code}`);
    });
  }
});
