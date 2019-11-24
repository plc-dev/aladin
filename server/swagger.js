const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Aladin API",
      description: "Documentation and test environment for the Aladin API",
      contact: {
        name: "Paul Christ",
        url: "https://github.com/plc-dev",
        email: "paul.l.christ@web.de"
      },
      license: {
        name: "WTFPL",
        url: "http://www.wtfpl.net/"
      },
      version: "1.0.0",
      servers: [{ url: "http://localhost:8080", description: "Local dev-server" }]
    },
    basePath: "/api"
  },
  apis: ["./server/api/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { serve: swaggerUi.serve, docs: swaggerUi.setup(swaggerDocs) };
