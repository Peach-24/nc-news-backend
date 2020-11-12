const express = require("express");
const apiRouter = require("./routes/apiRouter");
const app = express();

const {
  send404,
  handleInternalErrors,
  handlePSQLErrors,
} = require("./controllers/error-controllers");

app.use(express.json());
app.use("/api", apiRouter);

app.all("/*", send404);

app.use(handlePSQLErrors);
app.use(handleInternalErrors);

module.exports = app;
