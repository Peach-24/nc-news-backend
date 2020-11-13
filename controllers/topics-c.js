const { fetchAllTopics, insertNewTopic } = require("../models/topics-m.js");

exports.getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch(next);
};

exports.postNewTopic = (req, res, next) => {
  const topicInfo = req.body;
  if (
    topicInfo.hasOwnProperty("slug") &&
    topicInfo.hasOwnProperty("description")
  ) {
    insertNewTopic(topicInfo)
      .then((newTopic) => {
        res.status(201).send({ newTopic });
      })
      .catch(next);
  } else {
    res.status(400).send({ msg: "Bad request" });
  }
};
