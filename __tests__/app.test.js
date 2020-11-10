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
  describe("/api/users/:username", () => {
    describe("GET", () => {
      it("status:200 - returns an object for the correct user from their username", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then((res) => {
            expect(typeof res.body === "object");
            expect(res.body.user[0].name === "jonny");
          });
      });
      it("status:404 - Not Found for incorrect username endpoint", () => {
        return request(app)
          .get("/api/users/Peach-24")
          .expect(404)
          .then((res) => {
            expect(res.body).toMatchObject({ msg: "Not found" });
          });
      });
    });
  });
  describe.only("/api/articles/:article_id", () => {
    describe("GET", () => {
      it("status:200 - returns an object for the correct article from the article_id", () => {
        return request(app)
          .get("/api/articles/3")
          .expect(200)
          .then((res) => {
            expect(typeof res.body === "object");
            console.log(res.body);
            expect(
              res.body.article[0].title ===
                "Eight pug gifs that remind me of mitch"
            );
          });
      });
      xit("returns an object with all of the required properties", () => {
        return request(app)
          .get("/api/articles/3")
          .expect(200)
          .then((res) => {
            expect(Object.keys(res.body.article[0])).toEqual(
              expect.arrayContaining([
                "author",
                "title",
                "article_id",
                "body",
                "topic",
                "created_at",
                "votes",
                "comment_count",
              ])
            );
          });
      });
    });
    describe("PATCH", () => {
      it("status:201 - updates the article's vote count", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({ inc_votes: 1 })
          .expect(201)
          .then((res) => {
            expect(res.body.updatedArticle[0]).toMatchObject({
              article_id: 3,
              title: "Eight pug gifs that remind me of mitch",
              body: "some gifs",
              votes: 1,
              topic: "mitch",
              author: "icellusedkars",
              created_at: "2010-11-17T12:21:54.000Z",
            });
          });
      });
    });
  });
});
