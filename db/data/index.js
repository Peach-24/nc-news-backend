const testData = require("./test-data/index.js");
const devData = require("./development-data/index.js");

const ENV = process.env.NODE_ENV || "development";

const data = {
  development: devData,
  test: testData,
  production: devData,
};

module.exports = data[ENV];
