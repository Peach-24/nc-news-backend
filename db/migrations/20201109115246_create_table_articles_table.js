exports.up = function (knex) {
  // console.log("Creating articles table...");
  return knex.schema.createTable("articles", (articlesTable) => {
    articlesTable.increments("article_id").primary();
    articlesTable.text("title");
    articlesTable.text("body");
    articlesTable.integer("votes").default(0);
    articlesTable.text("topic").references("topics");
    articlesTable.text("author").references("users.username");
    articlesTable.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  // console.log("Removing articles table...");
  return knex.schema.dropTable("articles");
};
