const connection = require("../db/connection.js");

exports.fetchArticleById = (articleId) => {
  console.log("in the model...");
  //   console.log("articleID in the model:", articleId);
  return connection
    .select("*")
    .from("articles")
    .where("article_id", "=", articleId);
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
