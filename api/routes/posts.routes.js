const express = require("express");
const postRouter = express.Router();
const { authentication } = require("../middlewares/authentication.middleware");
const { authorization } = require("../middlewares/authorization.middleware");

const {
  createPost,
  getPost,
  getPosts,
  getUserPost,
} = require("../controllers/posts.controllers");
const { getUser } = require("../controllers/users.controllers");
// posts routes
postRouter.post("/create-post", createPost);
postRouter.get("/", getPosts);
postRouter.get("/:id", getPost);

postRouter.get("/get-user-post", getUserPost);

module.exports = {
  postRouter,
};
