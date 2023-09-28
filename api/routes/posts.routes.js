const express = require("express");
const postRouter = express.Router();
const { authentication } = require("../middlewares/authentication.middleware");
const { authorization } = require("../middlewares/authorization.middleware");

const {
  createPost,
  getPost,
  getPosts,
  getUserPost,
  getComments,
  likePost,
  likePostComment,
  commentPost,
  replyPostComment,
  deletePost,
} = require("../controllers/posts.controllers");

// posts routes
postRouter.post("/create-post", authentication, createPost);
postRouter.get("/", authentication, getPosts);
postRouter.post("/", authentication, getPosts);
postRouter.get("/:id", authentication, getPost);

postRouter.get("/get-user-post/:id", authentication, getUserPost);

// get comments
postRouter.get("/comments/:postId", authentication, getComments);

// like post
postRouter.post("/like/:postid", authentication, likePost);

// like post comment
postRouter.post(
  "/like-comment/:commentId/:replyId?",
  authentication,
  likePostComment
);
postRouter.post("/comment/:id", authentication, commentPost);
postRouter.post("/reply-comment/:id", authentication, replyPostComment);

postRouter.delete("/:id", authentication, deletePost);

module.exports = {
  postRouter,
};
