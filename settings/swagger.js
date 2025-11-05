const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vinesh Shop API",
      version: "1.0.0",
      description: "API documentation for Vinesh backend",
    },
    servers: [
      { url: "http://localhost:5000/api" },
    ],
  },
  apis: ["./modules/**/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
