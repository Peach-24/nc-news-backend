const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticle,
} = require("../controllers/articles-c.js");

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);

module.exports = articlesRouter;
