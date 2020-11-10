const knex = require("knex");
const dbConfig = require("../knexfile.js");
const connection = knex(dbConfig);

module.exports = connection;
