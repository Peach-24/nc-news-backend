const { fetchUserByUsername } = require("../models/users-m");

exports.getUserByUsername = (req, res, next) => {
  console.log("in the controller...");
  const { username } = req.params;
  fetchUserByUsername(username)
    .then((user) => {
      console.log(user);
      if (user.length > 0) {
        res.status(200).send({ user });
      } else {
        res.status(404).send({ msg: "Not found" });
      }
    })
    .catch(next);
};
