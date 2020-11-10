const connection = require("../db/connection.js");

exports.fetchAllTopics = () => {
  console.log("In the model...");
  return connection.select("*").from("topics");
};
