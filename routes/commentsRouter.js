const commentsRouter = require("express").Router();
const {
  patchComment,
  deleteComment,
  getAllComments,
} = require("../controllers/comments-c.js");
const { handle405 } = require("../controllers/error-controllers.js");

commentsRouter.route("/").get(getAllComments).all(handle405);
commentsRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment)
  .all(handle405);

module.exports = commentsRouter;
