const apiRouter = require("express").Router();

const topicsRouter = require("./topicsRouter.js");
const usersRouter = require("./usersRouter.js");
const articlesRouter = require("./articlesRouter.js");
const commentsRouter = require("./commentsRouter.js");
const endpoints = require("../endpoints.json");
const { handle405 } = require("../controllers/error-controllers.js");

apiRouter
  .route("/")
  .get((req, res, next) => {
    res.status(200).send({ endpoints });
  })
  .all(handle405);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
