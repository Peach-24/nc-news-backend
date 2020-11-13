const articlesRouter = require("express").Router();
const {
  getArticleById,
  getAllArticles,
  patchArticle,
  getCommentsByArticleId,
  postComment,
  deleteArticle,
} = require("../controllers/articles-c.js");
const { handle405 } = require("../controllers/error-controllers.js");

articlesRouter.route("/").get(getAllArticles).all(handle405);
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticle)
  .delete(deleteArticle)
  .all(handle405);
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment)
  .all(handle405);

module.exports = articlesRouter;
