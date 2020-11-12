const { fetchAllTopics } = require("../models/topics-m.js");

exports.getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch(next);
};
