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

  it("/api - status 200: returns a json file of all the endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body)).toEqual(["endpoints"]);
      });
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
    describe("POST", () => {
      it("status:201 - Created for valid new topic request, returns the new topic", () => {
        return request(app)
          .post("/api/topics")
          .send({
            slug: "COVID-19",
            description:
              "A global pandemic caused by an airborne coronavirus, which has killed over a million people worldwide ",
          })
          .expect(201)
          .then(({ body }) => {
            expect(body.newTopic[0].slug).toBe("COVID-19");
            expect(body.newTopic[0].description).toBe(
              "A global pandemic caused by an airborne coronavirus, which has killed over a million people worldwide "
            );
          });
      });
      it("status:400 - rejects an object without slug and description properties", () => {
        return request(app)
          .post("/api/topics")
          .send({ test: "nothing", test2: "also-nothing" })
          .expect(400)
          .then(({ body }) => {
            expect(body).toMatchObject({ msg: "Bad request" });
          });
      });
    });
  });
  describe("/api/users", () => {
    describe("GET", () => {
      it("status:200 - returns array of all users", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.users)).toBe(true);
            expect(body.users.length).toEqual(4);
          });
      });
    });
    describe("POST", () => {
      it("status:201 - Created for valid new user request, returns the new user (with the right properties)", () => {
        return request(app)
          .post("/api/users")
          .send({ name: "Josh", username: "Peach-24" })
          .expect(201)
          .then(({ body }) => {
            expect(body.newUser[0].name).toBe("Josh");
            expect(body.newUser[0].username).toBe("Peach-24");
            expect(Object.keys(body.newUser[0])).toEqual([
              "username",
              "avatar_url",
              "name",
            ]);
          });
      });
      it("status:400 - rejects an object without username and name properties", () => {
        return request(app)
          .post("/api/users")
          .send({ test: "nothing", test2: "also-nothing" })
          .expect(400)
          .then(({ body }) => {
            expect(body).toMatchObject({ msg: "Bad request" });
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
      it("status:404 - Not Found for non-existent username endpoint", () => {
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
          .get("/api/articles?limit=1000")
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
      describe("QUERY settings for articles", () => {
        it("status:200 for valid sort_by query", () => {
          return request(app)
            .get("/api/articles?sort_by=votes")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy("votes", {
                descending: true,
                coerce: true,
              });
            });
        });
        it("status:200 - can accept LIMIT query, which limits returned articles", () => {
          const limit = 5; // <-- change this value to test different limits
          return request(app)
            .get(`/api/articles?sort_by=votes&limit=${limit}`)
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).toEqual(5);
              expect(body.articles).toBeSortedBy("votes", {
                descending: true,
                coerce: true,
              });
            });
        });
        it("status:200 - when no LIMIT query is provided, default limit is 10", () => {
          return request(app)
            .get("/api/articles?sort_by=votes")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).toEqual(10);
              expect(body.articles).toBeSortedBy("votes", {
                descending: true,
                coerce: true,
              });
            });
        });
        it("status:200 - can accept P (page) query, which specifies which page to start results at", () => {
          return request(app)
            .get("/api/articles?sort_by=article_id&order=ASC&limit=2&p=2")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy("article_id", {
                descending: false,
                coerce: true,
              });

              expect(body.articles[0].article_id).toBe(3);
            });
        });
        it("status:200 - Can include ORDER query which sorts results either ASC or DESC", () => {
          return request(app)
            .get("/api/articles?sort_by=votes&order=ASC")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy("votes", {
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
              expect(body.articles).toBeSortedBy("created_at", {
                descending: true,
                coerce: true,
              });
            });
        });
        it("status:200 - valid AUTHOR queries accepted, which filters results accordingly ", () => {
          return request(app)
            .get("/api/articles?author=butter_bridge")
            .expect(200)
            .then(({ body }) => {
              const author = "butter_bridge";
              const allBelongToAuthor = body.articles.every((article) => {
                return article.author === author;
              });
              expect(allBelongToAuthor).toBe(true);
            });
        });
        it("status:200 - valid TOPIC queries accepted, which filters results accordingly ", () => {
          return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({ body }) => {
              const topic = "mitch";
              const underTopic = body.articles.every((article) => {
                return article.topic === topic;
              });
              expect(underTopic).toBe(true);
            });
        });
        it("status:400 - for invalid sort by column", () => {
          return request(app)
            .get("/api/articles?sort_by=potatoes")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad request");
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
    describe("DELETE", () => {
      it("status:204 - successful deletion of an article using article_id", () => {
        return request(app)
          .delete("/api/articles/12")
          .expect(204)
          .then(() => {
            return request(app)
              .get("/api/articles?limit=1000")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles.length).toEqual(11);
              });
          });
      });
      it("status:404 - not found for request using a non-existent article_id", () => {
        return request(app)
          .delete("/api/articles/6000")
          .expect(404)
          .then(({ body }) => {
            expect(body).toMatchObject({ msg: "Not found" });
          });
      });
      it("status:400 - bad request for request using a non-valid article_id", () => {
        return request(app)
          .delete("/api/articles/anarticle")
          .expect(400)
          .then(({ body }) => {
            expect(body).toMatchObject({ msg: "Bad request" });
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
      describe("QUERY settings for article's comments", () => {
        it("status:200 - can accept LIMIT query, which limits returned comments", () => {
          const limit = 5; // <-- change this value to test different limits
          return request(app)
            .get(`/api/articles/1/comments?sort_by=votes&limit=${limit}`)
            .expect(200)
            .then(({ body }) => {
              expect(body.comments.length).toEqual(5);
              expect(body.comments).toBeSortedBy("votes", {
                descending: true,
                coerce: true,
              });
            });
        });
        it("status:200 - when no LIMIT query is provided, default limit is 10", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments.length).toEqual(10);
              expect(body.comments).toBeSortedBy("votes", {
                descending: true,
                coerce: true,
              });
            });
        });
        it("status:200 - can accept P (page) query, which specifies which page to start results at", () => {
          return request(app)
            .get(
              "/api/articles/1/comments?sort_by=comment_id&limit=3&order=ASC&p=2"
            )
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).toBeSortedBy("comment_id", {
                descending: false,
                coerce: true,
              });
              expect(body.comments.length).toEqual(3);
              expect(body.comments[0].comment_id).toBe(5);
            });
        });
        it("status:200 for valid sort_by query", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).toBeSortedBy("votes", {
                descending: true,
                coerce: true,
              });
            });
        });
        it("status:200 - Can include ORDER query which sorts results either ASC or DESC", () => {
          return request(app)
            .get("/api/articles/5/comments?sort_by=comment_id&order=ASC")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).toBeSortedBy("comment_id", {
                descending: false,
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
        it("status:400 for invalid sort by column", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=potatoes")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad request");
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
      it("status:404 - Not found for an non-existent comment_id", () => {
        return request(app)
          .patch("/api/comments/6970")
          .send({ inc_votes: -3 })
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({ msg: "Cannot find a comment with that id" });
          });
      });
      it("status:400 - bad request for request using a non-valid comment_id", () => {
        return request(app)
          .delete("/api/comments/acomment")
          .expect(400)
          .then(({ body }) => {
            expect(body).toMatchObject({ msg: "Bad request" });
          });
      });
    });
    describe("DELETE", () => {
      it("status:204 - deletes the given comment by comment_id", () => {
        return request(app)
          .delete("/api/comments/16")
          .expect(204)
          .then(() => {
            return request(app)
              .get("/api/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments.length).toEqual(17);
              });
          });
      });
      it("status:404 - Not found for an non-existent comment_id", () => {
        return request(app)
          .delete("/api/comments/6780")
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({ msg: "Cannot find a comment with that id" });
          });
      });
      it("status:400 - bad request for request using a non-valid article_id", () => {
        return request(app)
          .delete("/api/articles/anarticle")
          .expect(400)
          .then(({ body }) => {
            expect(body).toMatchObject({ msg: "Bad request" });
          });
      });
    });
  });
  describe("handle405 tests - Invalid methods", () => {
    describe("DELETE", () => {
      it("status:405 - Invalid method for DELETE user by id", () => {
        return request(app)
          .delete("/api/users/4")
          .expect(405)
          .then(({ body }) => {
            expect(body).toMatchObject({ msg: "Invalid method" });
            return request(app)
              .get("/api/users?limit=1000")
              .expect(200)
              .then(({ body }) => {
                expect(body.users.length).toEqual(4);
              });
          });
      });
      it("status:405 - Invalid method for DELETE all articles", () => {
        return request(app)
          .delete("/api/articles")
          .expect(405)
          .then(({ body }) => {
            expect(body).toMatchObject({ msg: "Invalid method" });
            return request(app)
              .get("/api/articles?limit=1000")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles.length).toEqual(12);
              });
          });
      });
      it("status:405 - Invalid method for DELETE all comments", () => {
        return request(app)
          .delete("/api/comments")
          .expect(405)
          .then(({ body }) => {
            expect(body).toMatchObject({ msg: "Invalid method" });
            return request(app)
              .get("/api/comments?limit=1000")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments.length).toEqual(18);
              });
          });
      });
      it("status:405 - Invalid method for DELETE all topics", () => {
        return request(app)
          .delete("/api/topics")
          .expect(405)
          .then(({ body }) => {
            expect(body).toMatchObject({ msg: "Invalid method" });
            return request(app)
              .get("/api/topics?limit=1000")
              .expect(200)
              .then(({ body }) => {
                expect(body.topics.length).toEqual(3);
              });
          });
      });
    });
  });
});
