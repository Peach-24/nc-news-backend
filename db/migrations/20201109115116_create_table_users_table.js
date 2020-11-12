exports.up = function (knex) {
  // console.log("Creating users table...");
  return knex.schema.createTable("users", (usersTable) => {
    usersTable.text("username").primary().unique();
    usersTable.text("avatar_url");
    usersTable.text("name");
  });
};

exports.down = function (knex) {
  // console.log("Removing users table...");
  return knex.schema.dropTable("users");
};
