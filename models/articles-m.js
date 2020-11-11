const connection = require("../db/connection.js");

exports.fetchAllArticles = () => {
  return connection
    .select("articles.*")
    .count("comment_id AS comment_count")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .groupBy("articles.article_id")
    .then((article) => {
      return article;
    });
};

exports.fetchArticleById = (articleId) => {
  return connection
    .select("articles.*")
    .count("comment_id AS comment_count")
    .from("articles")
    .where("article_id", "=", articleId)
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .groupBy("articles.article_id")
    .then((article) => {
      return article;
    });
};

exports.updateArticle = (articleId, voteChangeBy) => {
  console.log("in the model...");
  return connection("articles")
    .where("article_id", "=", articleId)
    .increment("votes", voteChangeBy)
    .returning("*")
    .then((updatedArticle) => {
      return updatedArticle;
    });
};

exports.makeComment = (articleID, comment) => {
  console.log("in the model...");
};

exports.fetchComment = () => {};
