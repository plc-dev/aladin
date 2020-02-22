/**
 * Module containing various helper functions
 * @module helper
 */
module.exports = {
  // Make sure to `.catch()` any errors and pass them along to the `next()`
  // middleware in the chain, in this case the error handler.
  asyncErrorWrapper: fn => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  },

  /**
   * JWT Validation Middleware
   */
  jwtValidationMiddleware: async (req, res, next, jwt) => {
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    if (token.startsWith("Bearer")) {
      token = token.slice(7, token.length);
    }
    if (token) {
      jwt.verify(token, process.env.jwtSecret, err => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Token is not valid"
          });
          throw new Error();
        } else {
          // next();
        }
      });
    } else {
      throw new Error("No Token supplied");
    }
  },

  /**
   * Loader that reads all the language configurations from the specified directory
   */
  languageLoader: () => {
    const path = require("path");
    const fs = require("fs");
    // finds path to main file, specified in package.json
    const appDir = path.dirname(require.main.filename);
    const directoryPath = path.join(appDir, "./i18n");
    let languages = {};
    fs.readdirSync(directoryPath).forEach(file => {
      const countryCode = file.match(/(\w{2})\./)[1];
      const languageJson = {
        [countryCode]: JSON.parse(fs.readFileSync(`${directoryPath}/${file}`))
      };
      Object.assign(languages, languageJson);
    });
    return languages;
  },

  /**
   * Returns a random Integer between the range
   */
  getRandomInt: (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Returns a dynamically filled string on runtime
   * Takes a template string in the form of 'This is a ...${template} ${string}' and an object with string/array values {template: ['template', 'engine'], string: 'string'}
   * ...${} to concat an array of unknown length to a string on runtime
   * ${} to substitute the placeholder for the passed value on runtime
   * standard for concatWith is a empty space ' '
   */
  templateString: (template, values, concatWith) => {
    let output = template;
    concatWith = concatWith || " ";
    Object.keys(values).forEach(key => {
      output = output
        .replace(new RegExp("\\$" + `{\\.\\.\\.${key}}`, "g"), () =>
          values[key].reduce((string, value, i) => {
            return !i ? value : string + concatWith + value;
          }, "")
        )
        .replace(new RegExp("\\$" + `{${key}}`, "g"), values[key]);
    });
    return output;
  }
};
