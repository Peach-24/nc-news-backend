const topicsRouter = require("express").Router();
const { getAllTopics } = require("../controllers/topics-c.js");

topicsRouter.route("/").get(getAllTopics);

module.exports = topicsRouter;
