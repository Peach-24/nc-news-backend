const {
  formatTimeStamp,
  createArticleRef,
  formatComments,
  formatArticleComments,
  removeBodyProperty,
} = require("../db/utils/data-manipulation.js");

describe("formatTimeStamp", () => {
  it("returns array of objects when passed array of objects", () => {
    const input = [
      {
        created_at: 1542284514171,
      },
    ];
    expect(Array.isArray(formatTimeStamp(input))).toBe(true);
    expect(typeof formatTimeStamp(input)[0]).toBe("object");
  });
  it("should not mutate objects in array", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    formatTimeStamp(input);
    expect(input).toEqual([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ]);
  });
  it("give an object with create_at key with value of unixtimestamp will return object with custom timestamp", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    expect(formatTimeStamp(input)).toEqual([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "11/15/2018 12:21:54 PM",
        votes: 100,
      },
    ]);
  });
});

describe("createArticleRef ", () => {
  test("Returns an object", () => {
    let input = [];
    expect(typeof createArticleRef(input)).toEqual("object");
  });
  test("has a key-value pair for each article in the reference object", () => {
    const inputArr = [
      { article_id: 1, title: "Living in the shadow of a great man" },
      { article_id: 2, title: "Sony Vaio; or, The Laptop" },
    ];
    const expectedOutput = {
      "Living in the shadow of a great man": 1,
      "Sony Vaio; or, The Laptop": 2,
    };
    expect(createArticleRef(inputArr)).toEqual(expectedOutput);
  });
});

describe("formatComments", () => {
  it("return objects have the correct keys, with the appropriate values", () => {
    const articleRef = {
      "They're not exactly dogs, are they?": 9,
      "Living in the shadow of a great man": 1,
    };
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: "11/22/2017 12:36:03 PM",
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: "11/22/2016 12:36:03 PM",
      },
    ];
    const expectedOutput = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        created_at: "11/22/2017 12:36:03 PM",
        article_id: 9,
        author: "butter_bridge",
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        votes: 14,
        created_at: "11/22/2016 12:36:03 PM",
        article_id: 1,
        author: "butter_bridge",
      },
    ];
    expect(formatComments(input, articleRef)).toEqual(expectedOutput);
  });
});

describe("formatArticleComments", () => {
  it("returns an array without a article_id property", () => {
    const originalData = [
      {
        comment_id: 14,
        author: "icellusedkars",
        article_id: 5,
        votes: 16,
        created_at: null,
        body:
          "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
      },
      {
        comment_id: 15,
        author: "butter_bridge",
        article_id: 5,
        votes: 1,
        created_at: null,
        body: "I am 100% sure that we're not completely sure.",
      },
    ];
    const expectedOutput = [
      {
        comment_id: 14,
        author: "icellusedkars",
        votes: 16,
        created_at: null,
        body:
          "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
      },
      {
        comment_id: 15,
        author: "butter_bridge",
        votes: 1,
        created_at: null,
        body: "I am 100% sure that we're not completely sure.",
      },
    ];
    expect(formatArticleComments(originalData)).toEqual(expectedOutput);
  });
  it("does not mutate the original data", () => {
    const originalData = [
      {
        comment_id: 14,
        author: "icellusedkars",
        article_id: 5,
        votes: 16,
        created_at: null,
        body:
          "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
      },
    ];
    formatArticleComments(originalData);
    expect(originalData).toEqual([
      {
        comment_id: 14,
        author: "icellusedkars",
        article_id: 5,
        votes: 16,
        created_at: null,
        body:
          "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
      },
    ]);
  });
});

describe("removeBodyProperty", () => {
  it("does what it says on the tin - removes body prop from return obj of all articles", () => {
    const originalData = [
      {
        article_id: 3,
        title: "Eight pug gifs that remind me of mitch",
        body: "some gifs",
        votes: 0,
        topic: "mitch",
        author: "icellusedkars",
        created_at: "2010-11-17T12:21:54.000Z",
        comment_count: "0",
      },
    ];
    const expectedOutput = [
      {
        article_id: 3,
        title: "Eight pug gifs that remind me of mitch",
        votes: 0,
        topic: "mitch",
        author: "icellusedkars",
        created_at: "2010-11-17T12:21:54.000Z",
        comment_count: "0",
      },
    ];
    expect(removeBodyProperty(originalData)).toEqual(expectedOutput);
  });
});
