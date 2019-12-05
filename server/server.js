require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const webpush = require("web-push");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const { languageLoader } = require("./helper");

const app = express();

(async function main() {
  const port = process.env.PORT || 3000;

  app.use(cors());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

  // load all possible Languages
  const languages = languageLoader();

  // setup web-push
  webpush.setVapidDetails("mailto:test@test.de", process.env.publicVapidKey, process.env.privateVapidKey);

  // Set up mongoDB
  const db = await require("./database/database")();

  // setup swagger documentation
  const { serve, docs } = require("./swagger");
  app.use("/api-doc", serve, docs);

  // setup and handle api
  const authentication = require("./api/authentication")(express.Router(), jwt, db.models.User);
  const settings = require("./api/settings")(express.Router(), db.models.User, webpush, languages);
  app.use("/api", authentication);
  app.use("/api", settings);

  // set static folder to compiled Vue Frontend
  app.use(express.static(__dirname + "/public/"));

  // load error handling middleware to avoid verbose try/catch on every route
  app.use(require("./errorHandling/errorHandler"));

  require("http")
    .createServer(app)
    .listen(port, () => {
      console.log(`server | http server listening on ${port}`);
    });
})();
