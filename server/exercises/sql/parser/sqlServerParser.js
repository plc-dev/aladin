const { templateString } = require("../../../helper");

module.exports = async (sourceCode, sqlDB) => {
    return new Promise((resolve, reject) => {
      try {
          

        resolve(sql);
      } catch (err) {
        if (err) reject(err);
      }
    });
};