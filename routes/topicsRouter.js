const topicsRouter = require("express").Router();
const { getAllTopics, postNewTopic } = require("../controllers/topics-c.js");
const { handle405 } = require("../controllers/error-controllers.js");

topicsRouter.route("/").get(getAllTopics).post(postNewTopic).all(handle405);

module.exports = topicsRouter;
