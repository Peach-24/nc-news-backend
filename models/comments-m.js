const connection = require("../db/connection.js");

exports.fetchAllComments = () => {
  return connection.select("*").from("comments");
};

exports.updateComment = (commentId, voteChangeBy) => {
  return connection("comments")
    .where("comment_id", "=", commentId)
    .increment("votes", voteChangeBy)
    .returning("*")
    .then((updatedComment) => {
      return updatedComment;
    });
};

exports.doesCommentExist = (commentId) => {
  return connection
    .select("*")
    .from("comments")
    .where("comment_id", "=", commentId)
    .then((comments) => {
      if (comments.length === 0) return false;
      else return true;
    });
};

exports.removeComment = (commentId) => {
  return connection("comments")
    .where("comment_id", "=", commentId)
    .delete()
    .returning("*");
};
