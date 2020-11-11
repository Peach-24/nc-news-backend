const commentsRouter = require("express").Router();
const { patchComment, deleteComment } = require("../controllers/comments-c.js");

commentsRouter.route("/:comment_id").patch(patchComment).delete(deleteComment);

module.exports = commentsRouter;
