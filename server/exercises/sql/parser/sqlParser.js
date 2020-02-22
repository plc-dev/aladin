const parserMap = {
  "sqlite": async () => sourceCode,
  //"sql_server_2000": require("sqlServerParser"),
  "json": require("./jsonParser")
};

module.exports = async ({sourceCode, sourceFlavour, sqlDB}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = await parserMap[sourceFlavour](sourceCode, sqlDB); 
      resolve(sql);
    } catch (err) {
      reject(err);
    }
  });
};