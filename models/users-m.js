const connection = require("../db/connection.js");

exports.fetchUserByUsername = (username) => {
  return connection.select("*").from("users").where("username", "=", username);
};
