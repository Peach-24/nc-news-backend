exports.up = function (knex) {
  // console.log("Creating users table...");
  return knex.schema.createTable("users", (usersTable) => {
    usersTable.text("username").primary().unique();
    usersTable
      .text("avatar_url")
      .defaultTo(
        "https://images.clipartlogo.com/files/istock/previews/1048/104876297-cartoon-monster-face-vector-halloween-blue-monster-avatar.jpg"
      );
    usersTable.text("name");
  });
};

exports.down = function (knex) {
  // console.log("Removing users table...");
  return knex.schema.dropTable("users");
};
