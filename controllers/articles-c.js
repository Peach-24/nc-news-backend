const { fetchArticleById, updateArticle } = require("../models/articles-m.js");

exports.getArticleById = (req, res, next) => {
  console.log("in the controller...");
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  console.log("in the controller");
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const voteChangeBy = inc_votes;

  updateArticle(article_id, voteChangeBy)
    .then((updatedArticle) => {
      res.status(201).send({ updatedArticle });
    })
    .catch(next);
};
