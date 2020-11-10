process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");

describe("/api", () => {
  afterAll(() => {
    return connection.destroy();
  });
  beforeEach(() => {
    return connection.seed.run();
  });
  describe("/api/topics", () => {
    describe("GET", () => {
      it("status:200 - responds with an array of all topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then((res) => {
            expect(res.body.topics.length).toBe(3);
          });
      });
      it("topics array has a slug prop and a description prop, with string values", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then((res) => {
            expect(Object.keys(res.body.topics[0])).toEqual([
              "slug",
              "description",
            ]);
            let values = Object.values(res.body.topics[0]);
            let datatypes = values.map((value) => typeof value);
            expect(datatypes).toEqual(["string", "string"]);
          });
      });
      it("status:404 - appropriate error message if spelling of endpoint is inaccurate", () => {
        return request(app)
          .get("/api/topix")
          .expect(404)
          .then((res) => {
            expect(res.body).toEqual({ msg: "Not found" });
          });
      });
    });
  });
  describe.only("/api/users/:username", () => {
    describe("GET", () => {
      it("status:200 - returns an array of the right user from their username", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then((res) => {
            expect(Array.isArray(res.body.user) === true);
            expect(res.body.user[0].name === "jonny");
          });
      });
      it("status:404 - Not Found for incorrect username endpoint", () => {
        return request(app)
          .get("/api/users/Peach-24")
          .expect(404)
          .then((res) => {
            console.log(res.body);
          });
      });
    });
  });
});
