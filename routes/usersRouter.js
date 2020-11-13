const usersRouter = require("express").Router();
const {
  getUserByUsername,
  getAllUsers,
  postNewUser,
} = require("../controllers/users-c.js");
const { handle405 } = require("../controllers/error-controllers.js");

usersRouter.route("/").get(getAllUsers).post(postNewUser).all(handle405);
usersRouter.route("/:username").get(getUserByUsername).all(handle405);

module.exports = usersRouter;
