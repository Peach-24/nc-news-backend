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
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", "=", articleId);
};

exports.updateArticle = (articleId, voteChangeBy) => {
  return connection("articles")
    .where("article_id", "=", articleId)
    .increment("votes", voteChangeBy)
    .returning("*")
    .then((updatedArticle) => {
      return updatedArticle;
    });
};

exports.makeComment = (comment) => {
  return connection.insert(comment).into("comments").returning("*");
};

exports.fetchCommentsByArticleId = (article_id, sort_by, order = "desc") => {
  return connection
    .select("*")
    .from("comments")
    .where("article_id", "=", article_id)
    .orderBy(sort_by || "created_at", order);
};