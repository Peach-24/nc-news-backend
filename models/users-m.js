const connection = require("../db/connection.js");

exports.fetchUserByUsername = (username) => {
  console.log("in the model...");
  return connection.select("*").from("users").where("username", "=", username);
};
