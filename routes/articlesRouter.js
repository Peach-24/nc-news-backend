const articlesRouter = require("express").Router();
const {
  getArticleById,
  getAllArticles,
  patchArticle,
  getCommentsByArticleId,
  postComment,
} = require("../controllers/articles-c.js");

articlesRouter.route("/").get(getAllArticles);
articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articlesRouter;
