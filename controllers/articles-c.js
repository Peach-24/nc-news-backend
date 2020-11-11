const {
  fetchArticleById,
  fetchAllArticles,
  updateArticle,
  makeComment,
  fetchComments,
} = require("../models/articles-m.js");

exports.getAllArticles = (req, res, next) => {
  console.log("in the controller...");
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
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
      res.status(202).send({ updatedArticle });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  console.log("in the controller");
  const { article_id } = req.params;
  const comment = req.body;
  if (Object.keys(comment) == ["username", "body"]) {
    makeComment(article_id, comment).then((postedComment) => {
      res.status(201).send({ postedComment }).catch(next);
    });
  } else {
    res.status(400).send({ msg: "Bad request" });
  }
};

exports.getComment = () => {};
