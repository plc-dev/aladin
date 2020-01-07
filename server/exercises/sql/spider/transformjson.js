const fs = require("fs");
const path = require("path");
const devloc = path.resolve(require.main.filename, `../dev.json`);
const train1loc = path.resolve(require.main.filename, `../train_others.json`);
const train2loc = path.resolve(require.main.filename, `../train_spider.json`);

const dev = JSON.parse(fs.readFileSync(devloc, "utf8"));
const train1 = JSON.parse(fs.readFileSync(train1loc, "utf8"));
const train2 = JSON.parse(fs.readFileSync(train2loc, "utf8"));

const combined = [...dev, ...train1, ...train2];

const result = {};

combined.forEach(question => {
  if (result[question["db_id"]] === undefined) result[question["db_id"]] = [];
  result[question["db_id"]].push({
    question: question.question,
    query: question.query,
    id: question["db_id"]
  });
});

let total = 0;
let questionsPerDB = Object.keys(result).reduce((string, key) => {
  total += result[key].length;
  return (string += `${key} ${result[key].length}\n`);
}, "");

questionsPerDB += `\n\nSum: ${total}`;

fs.writeFileSync("questionsPerDB.txt", questionsPerDB);
fs.writeFileSync("./combined.json", JSON.stringify(combined, null, 2));
fs.writeFileSync("./sorted_questions.json", JSON.stringify(result, null, 2));
