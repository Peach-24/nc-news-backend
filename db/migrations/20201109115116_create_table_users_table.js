exports.up = function (knex) {
  return knex.schema.createTable("users", (usersTable) => {
    usersTable.text("username").primary();
    usersTable
      .text("avatar_url")
      .defaultTo(
        "https://images.clipartlogo.com/files/istock/previews/1048/104876297-cartoon-monster-face-vector-halloween-blue-monster-avatar.jpg"
      );
    usersTable.text("name").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
