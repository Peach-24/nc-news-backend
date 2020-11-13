const {
  fetchUserByUsername,
  fetchAllUsers,
  insertNewUser,
} = require("../models/users-m");

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then((user) => {
      if (user.length > 0) {
        res.status(200).send({ user });
      } else {
        res.status(404).send({ msg: "Not found" });
      }
    })
    .catch(next);
};

exports.postNewUser = (req, res, next) => {
  const userInfo = req.body;
  if (userInfo.hasOwnProperty("name") && userInfo.hasOwnProperty("username")) {
    insertNewUser(userInfo)
      .then((newUser) => {
        res.status(201).send({ newUser });
      })
      .catch(next);
  } else {
    res.status(400).send({ msg: "Bad request" });
  }
};
