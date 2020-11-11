\c nc_news_test


-- -- GET ALL ARTICLES WITH COMMENT_COUNTs
-- SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles
-- LEFT JOIN comments ON articles.article_id = comments.article_id
-- GROUP BY articles.article_id;

-- SELECT comment_id, author AS username, article_id, votes, created_at FROM comments;

-- INSERT INTO comments (username AS author, article_id, body) VALUES ('butter_bridge', 3, 'I think this should be a longer list!')

-- SELECT * FROM comments
-- where article_id = 5;