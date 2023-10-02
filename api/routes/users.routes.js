const express = require("express");
const userRouter = express.Router();
const { authentication } = require("../middlewares/authentication.middleware");

const {
  addUser,
  loginUser,
  listUsers,
  getUser,
  updateUser,
  friendRequest,
  getFriendRequest,
  acceptRequest,
  profileView,
  suggestedFriends,
} = require("../controllers/users.controllers");

// authentication
userRouter.post("/register", addUser);
userRouter.post("/login", loginUser);
// user routes
userRouter.get("/get-user/:id?", authentication, getUser);
userRouter.put("/update-user", authentication, updateUser);

// friend request routes
userRouter.post("/friend-request", authentication, friendRequest);
userRouter.get("/get-friend-request", authentication, getFriendRequest);

userRouter.post("/accept-request", authentication, acceptRequest);

// view profiles
userRouter.get("/profile-view/:userId", authentication, profileView);

// suggested friends
userRouter.post("/suggested-friends", authentication, suggestedFriends);

userRouter.get("/login", loginUser);

userRouter.get("/list", authentication, listUsers);

userRouter.get("/getUserById/:userId", authentication);

module.exports = {
  userRouter,
};
