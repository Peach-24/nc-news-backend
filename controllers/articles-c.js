const {
  fetchArticleById,
  fetchAllArticles,
  updateArticle,
  makeComment,
  fetchCommentsByArticleId,
  removeArticle,
} = require('../models/articles-m.js');

const {
  formatArticleComments,
  removeBodyProperty,
} = require('../db/utils/data-manipulation');

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  const limit = req.query.limit;
  const offset = (req.query.p - 1) * limit;
  fetchAllArticles(sort_by, order, author, topic, limit, offset)
    .then((articles) => {
      const formattedArticles = removeBodyProperty(articles);
      if (formattedArticles.length === 0) {
        res.status(400).send({ msg: 'Bad request' });
      } else {
        res.status(200).send({ articles: formattedArticles });
      }
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      if (article.length === 0) {
        res.status(400).send({ msg: 'No article with that id.' });
      } else {
        res.status(200).send({ article });
      }
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
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
  if (req.body.hasOwnProperty('username') && req.body.hasOwnProperty('body')) {
    const articleId = req.params.article_id;
    const { username, body } = req.body;
    const comment = { author: username, article_id: articleId, body: body };
    makeComment(comment)
      .then((newComment) => {
        res.status(201).send(newComment);
      })
      .catch(next);
  } else {
    res.status(400).send({ msg: 'Bad request' });
  }
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  const limit = req.query.limit;
  const offset = (req.query.p - 1) * limit;
  fetchCommentsByArticleId(article_id, sort_by, order, limit, offset)
    .then((comments) => {
      const formattedComments = formatArticleComments(comments);
      if (comments.length === 0) {
        res.status(400).send({ msg: 'Bad request' });
      } else {
        res.status(200).send({ comments: formattedComments });
      }
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  removeArticle(article_id)
    .then((article) => {
      if (article.length === 0) {
        res.status(404).send({ msg: 'Not found' });
      } else {
        res.status(204).send();
      }
    })
    .catch(next);
};
