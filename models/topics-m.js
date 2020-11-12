const connection = require("../db/connection.js");

exports.fetchAllTopics = () => {
  return connection.select("*").from("topics");
};
