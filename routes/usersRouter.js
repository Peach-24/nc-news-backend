const usersRouter = require("express").Router();
const {
  getUserByUsername,
  getAllUsers,
  postNewUser,
} = require("../controllers/users-c.js");

usersRouter.route("/").get(getAllUsers).post(postNewUser);
usersRouter.route("/:username").get(getUserByUsername);

module.exports = usersRouter;
