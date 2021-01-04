const app = require("../../app");
const supertest = require("supertest");
const { post } = require("../../app");
const request = supertest(app);
//const assert = require("assert"); // not sure what this is used for?

const somePostObject = expect.objectContaining({
  id: expect.any(Number),
  user_id: expect.any(Number),
  text: expect.any(String),
  image: expect.any(String),
  video: expect.any(String),
  audio: expect.any(String),
  date: expect.any(String),
  favorite: expect.any(Boolean),
});

const someArrayOfPostObjects = expect.arrayContaining([somePostObject]);

// TEST GET ALL POSTS

describe("GET /", () => {
  it("should return all posts", async (done) => {
    const response = await request.get("/posts");
    //console.log(response.body.payload[0] + "equals" + somePostObject);
    expect(response.body.payload).toStrictEqual(someArrayOfPostObjects);
    expect(response.status).toBe(200);
    done();
  });
});

// TEST GET POST BY ID

describe("GET /:postId", () => {
  it("should return a Post object", async (done) => {
    const response = await request.get("/posts/1");
    //console.log(response.body.payload[0] + "equals" + somePostObject);
    expect(response.body.payload[0]).toEqual(somePostObject);
    expect(response.status).toBe(200);
    done();
  });
});

// TEST CREATING NEW POST
// NEEDS SOME WORK

describe("POST /posts", () => {
  it("should return the newly created Post object", async (done) => {
    const newPost = {
      user_id: 1,
      text: "I love the course",
      image: "pic",
      video: "vid",
      audio: "recording",
      date: new Date().toDateString(),
      favorite: true,
    };
    const getAllPostsResponse = await request.get("/posts");
    const numOfPosts = getAllPostsResponse.body.payload.length;

    const postResponse = await request.post("/posts").send(newPost);

    const newGetAllPostsResponse = await request.get("/posts");
    const newNumOfPosts = newGetAllPostsResponse.body.payload.length;

    expect(newNumOfPosts).toBe(numOfPosts + 1);
    expect(getAllPostsResponse.status).toBe(200);
    expect(postResponse.status).toBe(200);
    expect(newGetAllPostsResponse.status).toBe(200);
    done();
  });
});

// TEST UPDATING A POST

describe("PATCH /posts/:postId", () => {
  it("should check that patch is updating specific Post info", async (done) => {
    const postId = 1;
    const updatedPost = {
      image: "Some Image Link",
      video: "Some Video Link",
    };
    const response = await request.patch(`/posts/${postId}`).send(updatedPost);
    expect(response.body.payload[0]).toMatchObject({
      id: expect.any(Number),
      user_id: expect.any(Number),
      image: "Some Image Link",
      video: "Some Video Link",
      date: expect.any(String),
      favorite: expect.any(Boolean),
    });
    expect(response.status).toBe(200);
    done();
  });
});

// TEST DELETING A POST

describe("DELETE /Posts/:postId", () => {
  it("should delete Post by id", async (done) => {
    const newPostToBeDeleted = {
      user_id: 1,
      name: "Alice",
      email: "alice@alice.com",
      password: "password",
      personality: "INFP",
      start_date: "2020-09-20",
      points: 0,
    };

    const postResponse = await request.post("/Posts").send(newPostToBeDeleted);
    const postIdToBeDeleted = postResponse.body.payload[0].id;
    await request.delete(`/Posts/${postIdToBeDeleted}`);
    const getResponse = await request.get(`/Posts/${postIdToBeDeleted}`);

    expect(getResponse.body.payload.length).toBe(0);
    expect(postResponse.status).toBe(200);
    expect(getResponse.status).toBe(200);
    done();
  });
});