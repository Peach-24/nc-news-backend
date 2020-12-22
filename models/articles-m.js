const connection = require('../db/connection.js');

exports.fetchAllArticles = (sort_by, order, author, topic, limit, offset) => {
  return connection
    .select('articles.*')
    .count('comment_id AS comment_count')
    .limit(limit || '12')
    .offset(offset || '0')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .groupBy('articles.article_id')
    .orderBy(sort_by || 'created_at', order || 'desc')

    .modify((query) => {
      if (author) query.where('articles.author', author);
      if (topic) query.where('articles.topic', topic);
    });
};

exports.fetchArticleById = (articleId) => {
  return connection
    .select('articles.*')
    .count('comment_id AS comment_count')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .groupBy('articles.article_id')
    .where('articles.article_id', '=', articleId);
};

exports.updateArticle = (articleId, voteChangeBy) => {
  return connection('articles')
    .where('article_id', '=', articleId)
    .increment('votes', voteChangeBy)
    .returning('*');
};

exports.makeComment = (comment) => {
  return connection.insert(comment).into('comments').returning('*');
};

exports.fetchCommentsByArticleId = (
  article_id,
  sort_by,
  order,
  limit,
  offset
) => {
  return connection
    .select('*')
    .from('comments')
    .limit(limit || '10')
    .offset(offset || '0')
    .where('article_id', '=', article_id)
    .orderBy(sort_by || 'created_at', order || 'desc')
    .then((comments) => {
      return comments;
    });
};

exports.removeArticle = (articleId) => {
  return connection('articles')
    .where('article_id', '=', articleId)
    .delete()
    .returning('*');
};
