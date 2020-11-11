const articlesRouter = require("express").Router();
const {
  getArticleById,
  getAllArticles,
  patchArticle,
  getComment,
  postComment,
} = require("../controllers/articles-c.js");

articlesRouter.route("/").get(getAllArticles);
articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);
articlesRouter.route("/:article_id/comments").get(getComment).post(postComment);

module.exports = articlesRouter;
