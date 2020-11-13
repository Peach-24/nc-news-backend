const connection = require("../db/connection.js");

exports.fetchAllUsers = () => {
  return connection.select("*").from("users");
};

exports.fetchUserByUsername = (username) => {
  return connection.select("*").from("users").where("username", "=", username);
};

exports.insertNewUser = (userInfo) => {
  return connection.insert(userInfo).into("users").returning("*");
};
