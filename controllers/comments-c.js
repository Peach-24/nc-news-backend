const { updateComment, removeComment } = require("../models/comments-m/js");

exports.patchComment = (req, res, next) => {
  console.log("inside the patchComment controller...");
  const { comment_id } = req.params;
  updateComment();
};

exports.deleteComment = (req, res, next) => {
  console.log("inside the deleteComment controller...");
  const { comment_id } = req.params;
  removeComment();
};
