const express = require('express');
const app = express()

require('./settings/config')(app, express);

require('./settings/db')();

require('./settings/logging')();

const { swaggerUi, swaggerSpec } = require("./settings/swagger");

const routes = require('./modules');

app.use('/api', routes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`> Server ready on http://localhost:${PORT}`);
});