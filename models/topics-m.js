const connection = require("../db/connection.js");

exports.fetchAllTopics = () => {
  return connection.select("*").from("topics");
};

exports.insertNewTopic = (topicInfo) => {
  return connection.insert(topicInfo).into("topics").returning("*");
};
