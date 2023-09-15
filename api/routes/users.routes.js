const express = require("express");
const userRouter = express.Router();
const { authentication } = require("../middlewares/authentication.middleware");
const { authorization } = require("../middlewares/authorization.middleware");
const { generateId } = require("../middlewares/generateId.middleware.js");
const uploadProfile = require("../middlewares/uploadProfile.middleware.js");
const { validateInput } = require("../middlewares/validateInput.middleware.js");

const { addUserSchema } = require("../validators/user.validator");

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
// user routes
userRouter.post("/get-user/:id?", getUser);
userRouter.patch("/update-user/:userId", updateUser);

// friend request routes
userRouter.post("friend-request", friendRequest);
userRouter.post("/get-friend-request", getFriendRequest);

userRouter.post("/accept-request", acceptRequest);

// view profiles
userRouter.get("/profile-view/:userId", profileView);

// suggested friends
userRouter.get("/suggested-friends", suggestedFriends);

userRouter.get("/login", loginUser);

userRouter.get("/list", authentication, authorization, listUsers);

userRouter.get("/getUserById/:userId", authentication, authorization);

module.exports = {
  userRouter,
};
