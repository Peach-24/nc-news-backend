const commentsRouter = require("express").Router();
const {
  patchComment,
  deleteComment,
  getAllComments,
} = require("../controllers/comments-c.js");

commentsRouter.route("/").get(getAllComments);
commentsRouter.route("/:comment_id").patch(patchComment).delete(deleteComment);

module.exports = commentsRouter;
