const {
  updateComment,
  removeComment,
  fetchAllComments,
} = require("../models/comments-m.js");

exports.getAllComments = (req, res, next) => {
  fetchAllComments()
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  const voteChangeBy = inc_votes;
  updateComment(comment_id, voteChangeBy)
    .then((comment) => {
      if (comment.length === 0) {
        res.status(404).send({ msg: "Cannot find a comment with that id" });
      } else {
        res.status(202).send({ comment });
      }
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then((comments) => {
      if (comments.length === 0) {
        res.status(404).send({ msg: "Cannot find a comment with that id" });
      } else {
        res.status(204).send();
      }
    })
    .catch(next);
};
