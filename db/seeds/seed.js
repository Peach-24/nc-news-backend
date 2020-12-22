const {
  topicData,
  articleData,
  commentData,
  userData,
} = require('../data/index.js');

const {
  formatTimeStamp,
  createArticleRef,
  formatComments,
} = require('../utils/data-manipulation');

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex.insert(topicData).into('topics').returning('*');
    })
    .then(() => {
      return knex.insert(userData).into('users').returning('*');
    })
    .then(() => {
      const formattedArticles = formatTimeStamp(articleData);
      return knex.insert(formattedArticles).into('articles').returning('*');
    })
    .then((articleRows) => {
      const articleRef = createArticleRef(articleRows);
      const timeStampedComments = formatTimeStamp(commentData);
      const formattedComments = formatComments(timeStampedComments, articleRef);
      return knex.insert(formattedComments).into('comments').returning('*');
    });
};
