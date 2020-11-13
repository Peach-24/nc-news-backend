const topicsRouter = require("express").Router();
const { getAllTopics, postNewTopic } = require("../controllers/topics-c.js");

topicsRouter.route("/").get(getAllTopics).post(postNewTopic);

module.exports = topicsRouter;
