const {
  fetchArticleById,
  fetchAllArticles,
  updateArticle,
  makeComment,
  fetchCommentsByArticleId,
} = require("../models/articles-m.js");

const {
  formatArticleComments,
  removeBodyProperty,
} = require("../db/utils/data-manipulation");

exports.getAllArticles = (req, res, next) => {
  // console.log("in the controller...");
  fetchAllArticles()
    .then((articles) => {
      const formattedArticles = removeBodyProperty(articles);
      res.status(200).send({ articles: formattedArticles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  // console.log("in the controller...");
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  // console.log("in the controller");
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
  // console.log("in the controller");
  if (req.body.hasOwnProperty("username") && req.body.hasOwnProperty("body")) {
    const articleId = req.params.article_id;
    const { username, body } = req.body;
    const comment = { author: username, article_id: articleId, body: body };
    makeComment(comment)
      .then((newComment) => {
        res.status(201).send(newComment);
      })
      .catch(next);
  } else {
    res.status(400).send({ msg: "Bad request" });
  }
};

exports.getCommentsByArticleId = (req, res, next) => {
  console.log("In the controller...");
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  fetchCommentsByArticleId(article_id, sort_by, order)
    .then((comments) => {
      const formattedComments = formatArticleComments(comments);
      if (comments.length === 0) {
        res.status(400).send({ msg: "Bad request" });
      } else {
        res.status(200).send({ comments: formattedComments });
      }
    })
    .catch(next);
};
