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
  describe("/api/articles", () => {
    describe("GET", () => {
      it("status:200 - returns array of all articles", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toEqual(12);
          });
      });
      it("array contains all the necessary properties", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(Object.keys(body.articles[0])).toEqual(
              expect.arrayContaining([
                "author",
                "title",
                "article_id",
                "topic",
                "created_at",
                "votes",
                "comment_count",
              ])
            );
            expect(Object.keys(body.articles[0])).toEqual(
              expect.not.arrayContaining(["body"])
            );
          });
      });
      describe.only("QUERY settings for articles", () => {
        /* MUST ACCEPT QUERIES FOR: 
      - sort_by (any column, defaults to date)
      - order (which can be set to asc or desc, defaults to desc)
      - author (filters the articles by the username value, specified in the query)
      - topic (filters the articles by the topic value, specified in the query)  */
        it("status:400 for invalid sort by column", () => {
          return request(app)
            .get("/api/articles/?sort_by=potatoes")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad request");
            });
        });
        it("status:200 for valid sort_by query", () => {
          return request(app)
            .get("/api/articles/?sort_by=votes")
            .expect(200)
            .then(({ body }) => {
              console.log(body);
              expect(body.comments).toBeSortedBy("votes", {
                descending: true,
                coerce: true,
              });
              console.log(body);
            });
        });
        it("status:200 - Can include ORDER query which sorts results either ASC or DESC", () => {
          return request(app)
            .get("/api/articles/?sort_by=votes&order=ASC")
            .expect(200)
            .then(({ body }) => {
              console.log(body);
              expect(body.comments).toBeSortedBy("votes", {
                descending: false,
                coerce: true,
              });
            });
        });
        it("status:200 - by default, should be sorted by created_at, in descending order", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).toBeSortedBy("date", {
                descending: true,
                coerce: true,
              });
            });
        });
      });
    });
  });
  describe("/api/articles/:article_id", () => {
    describe("GET", () => {
      it("status:200 - returns an object for the correct article from the article_id", () => {
        return request(app)
          .get("/api/articles/3")
          .expect(200)
          .then(({ body }) => {
            expect(typeof body).toBe("object");
            // console.log(res.body);
            expect(body.article[0].title).toBe(
              "Eight pug gifs that remind me of mitch"
            );
          });
      });
      it("return objects have all of the required properties", () => {
        return request(app)
          .get("/api/articles/3")
          .expect(200)
          .then(({ body }) => {
            expect(Object.keys(body.article[0])).toEqual(
              expect.arrayContaining([
                "author",
                "title",
                "article_id",
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
      it("status:202 - updates the article's vote count", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({ inc_votes: 1 })
          .expect(202)
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
  describe("/api/articles/:article_id/comments", () => {
    describe("POST", () => {
      it("status:400 - rejects an object without a username and body property", () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send({
            username: "butter_bridge",
            comment: "Great list",
          })
          .expect(400)
          .then((res) => {
            expect(res.body).toMatchObject({ msg: "Bad request" });
          });
      });
      it("status:201 - Created for a valid post request", () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send({
            username: "butter_bridge",
            body: "I think this should be a longer list!",
          })
          .expect(201)
          .then((res) => {
            expect(Object.keys(res.body[0])).toEqual([
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body",
            ]);
          });
      });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    describe("GET", () => {
      it("status 200: - returns an array of all of a specified articles' comments", () => {
        return request(app)
          .get("/api/articles/5/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toEqual(2);
          });
      });
      it("status 200: - returns an array with specified props only", () => {
        return request(app)
          .get("/api/articles/5/comments")
          .expect(200)
          .then(({ body }) => {
            expect(Object.keys(body.comments[0])).toEqual(
              expect.not.arrayContaining(["article_id"])
            );
          });
      });
      it("status 400: - Bad Request when there's no article with the id provided", () => {
        return request(app)
          .get("/api/articles/700/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ msg: "Bad request" });
          });
      });
      describe.only("QUERY settings for article's comments", () => {
        it("status:400 for invalid sort by column", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=potatoes")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad request");
            });
        });
        it("status:200 for valid sort_by query", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes")
            .expect(200)
            .then(({ body }) => {
              console.log(body);
              expect(body.comments).toBeSortedBy("votes", {
                descending: true,
                coerce: true,
              });
              console.log(body);
            });
        });
        it("status:200 - Can include ORDER query which sorts results either ASC or DESC", () => {
          return request(app)
            .get("/api/articles/5/comments?sort_by=votes&order=DESC")
            .expect(200)
            .then(({ body }) => {
              console.log(body);
              expect(body.comments).toBeSortedBy("votes", {
                descending: true,
                coerce: true,
              });
            });
        });
        it("status:200 - by default, should be sorted by created_at, in descending order", () => {
          return request(app)
            .get("/api/articles/5/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).toBeSortedBy("created_at", {
                descending: true,
                coerce: true,
              });
            });
        });
      });
    });
  });
  describe("/api/comments", () => {
    describe("GET", () => {
      it("status:200 - returns array of all comments", () => {
        return request(app)
          .get("/api/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toEqual(18);
          });
      });
    });
  });
  describe("/api/comments/:commentId", () => {
    describe("PATCH", () => {
      it("status:202 - updates the comment's vote count", () => {
        return request(app)
          .patch("/api/comments/2")
          .send({ inc_votes: 3 })
          .expect(202)
          .then(({ body }) => {
            expect(body.comment[0].votes).toEqual(17);
          });
      });
      it("status:202 - can successfully decrement the comment's vote count", () => {
        return request(app)
          .patch("/api/comments/2")
          .send({ inc_votes: -3 })
          .expect(202)
          .then(({ body }) => {
            expect(body.comment[0].votes).toEqual(11);
          });
      });
      it("status:202 - responds with the updated comment", () => {
        return request(app)
          .patch("/api/comments/2")
          .send({ inc_votes: -3 })
          .expect(202)
          .then(({ body }) => {
            console.log(body);
            expect(body.comment[0]).toEqual({
              comment_id: 2,
              author: "butter_bridge",
              article_id: 1,
              votes: 11,
              created_at: "2016-11-22T12:36:03.000Z",
              body:
                "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
            });
          });
      });
      it("status:404 - Not found for an invalid comment_id", () => {
        return request(app)
          .patch("/api/comments/6970")
          .send({ inc_votes: -3 })
          .expect(404)
          .then(({ body }) => {
            console.log(body);
            expect(body).toEqual({ msg: "Cannot find a comment with that id" });
          });
      });
    });
    describe("DELETE", () => {
      it("status: 204 - deletes the given comment by comment_id", () => {
        /*  TEST DATA COMMENTS.length = 18.
        TEST COMMENT TO BE DELETED
         comment_id: 16 | butter_bridge | article_id  6 | votes:    1 | 2002-11-26 12:36:03+00 | body: This is a bad article name*/
        return request(app)
          .delete("/api/comments/16")
          .expect(204)
          .then(() => {
            return request(app)
              .get("/api/comments")
              .expect(200)
              .then(({ body }) => {
                console.log(body);
                expect(body.comments.length).toEqual(17);
              });
          });
      });
      it("status:404 - Not found for an invalid comment_id", () => {
        return request(app)
          .delete("/api/comments/6780")
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({ msg: "Cannot find a comment with that id" });
          });
      });
    });
  });
});
