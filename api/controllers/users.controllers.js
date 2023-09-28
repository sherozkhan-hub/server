const UserModel = require("../models/user.js");
const FriendRequest = require("../models/friendRequest.js");
// const PasswordReset = require("../models/passwordReset.models");
const bcrypt = require("bcryptjs");
const { signToken } = require("../helpers/signToken");

const addUser = async (req, res, next) => {
  try {
    const { password } = req.body;

    // Generating salt and hashing the password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(password, salt);
    console.log(req.body.age);
    const savedUser = new UserModel({ ...req.body });

    savedUser.save();

    if (savedUser) {
      return res.status(201).json({
        success: true,
        message: "User Created Successfully",
        user: savedUser,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "SORRY: Something went wrong",
    });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!(email || password)) {
      next("Please Provide User Credentials");
      return;
    }
    console.log("email and password found");

    const userFound = await UserModel.findOne({ email }).populate({
      path: "friends",
      select: "firstName lastName location profileUrl -password",
    });

    if (!userFound) {
      return res.status(404).json({
        message: "INVALID USER",
      });
    }
    console.log(userFound.password);
    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) {
      next("Invalid Email or Password");
      return;
    }
    console.log("password matched");
    console.log(userFound);
    const token = await signToken(userFound._id);
    console.log(token);
    return res.status(201).json({
      success: true,
      message: "Login Successful",
      userFound,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "SORRY: Something went wrong",
    });
  }
};

const listUsers = async (req, res, next) => {
  try {
    const users = await UserModel.getAllUsers();

    if (users.status === "SUCCESS") {
      return res.status(200).json({
        message: users.status,
        data: users.data,
      });
    } else if (users.status === "FAILED") {
      return res.status(400).json({
        message: users.status,
        description: "No user found",
      });
    } else {
      return res.status(400).json({
        message: users.status,
        error: users.error,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "SORRY: Something went wrong",
    });
  }
};

const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { id } = req.params;

    const user = await UserModel.findById(id || userId).populate({
      path: "friends",
      select: "-password",
    });

    if (!user) {
      return res.status(200).json({
        message: "User not found",
        data: user,
      });
    }
    user.password = undefined;

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "SORRY: Something went wrong",
    });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    // const userId = extractUserIdFromToken(req);
    const { firstName, lastName, location, profileUrl } = req.body;

    console.log(userId, "whereeee");
    if (!(firstName || lastName || location || profileUrl)) {
      next("Please Provide User Credentials");
      return;
    }

    const updateUser = {
      firstName,
      lastName,
      location,
      profileUrl,
      _id: userId,
    };
    console.log(updateUser, "hhyyy");

    const user = await UserModel.findByIdAndUpdate(userId, updateUser, {
      new: true,
    });

    await user.populate({ path: "friends", select: "-password" });

    const token = signToken(user._id);

    if (user) {
      return res.status(200).json({
        success: true,
        message: "User Updated Successfully",
        user,
        token,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

const friendRequest = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const { requestTo } = req.body;

    const requestExist = await FriendRequest.findOne({
      requestFrom: userId,
      requestTo,
    });

    if (requestExist) {
      return res.status(201).json({ message: "Request already sent" });
    }

    const accountExist = await FriendRequest.findOne({
      requestFrom: requestTo,
      requestTo: userId,
    });

    if (accountExist) {
      // next("Request already sent");
      console.log("Request already sent");
      return res.status(201).json({ message: "Request already sent" });
    }

    const newRes = await FriendRequest.create({
      requestTo,
      requestFrom: userId,
    });

    res.status(201).json({
      success: true,
      message: "Request sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

const getFriendRequest = async (req, res, next) => {
  try {
    const { userId } = req.body;
    console.log(userId, "reqqqq");
    const request = await FriendRequest.find({
      requestTo: userId,
      requestStatus: "Pending",
    })
      .populate({
        path: "requestFrom",
        select: "firstName lastName location profileUrl -password",
      })
      .limit(10)
      .sort({ _id: -1 });

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

const acceptRequest = async (req, res, next) => {
  try {
    const id = req.body.userId;

    const { rid, status } = req.body;

    const requestExist = await FriendRequest.findById(rid);

    if (!requestExist) {
      next("Friend Request not found");
      return;
    }
    const newRes = await FriendRequest.findByIdAndUpdate(
      { _id: rid },
      { requestStatus: status }
    );

    if (status === "Accepted") {
      const user = await UserModel.findById(id);

      user.friends.push(newRes?.requestFrom);

      await user.save();

      const friend = await UserModel.findById(newRes?.requestFrom);

      friend.friends.push(newRes?.requestTo);

      await friend.save();

      res.status(201).json({
        success: true,
        message: "Friend Request" + status,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

const profileView = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const { id } = req.body;

    const user = await UserModel.findById(id);

    user.views.push(userId);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Profile Viewed",
    });
  } catch (error) {
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

// const suggestedFriends = async (req, res, next) => {
//   try {
//     const { userId } = req.body;

//     let query = {};

//     query._id = { $ne: userId };
//     query.friends = { $nin: userId };

//     let queryResult = UserModel.find(query)
//       .limit(15)
//       .select("firstName lastName location profileUrl -password");

//     const suggestedFriends = await queryResult;

//     res.status(200).json({
//       success: true,
//       data: suggestedFriends,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "auth error",
//       success: false,
//       error: error.message,
//     });
//   }
// };

const suggestedFriends = async (req, res, next) => {
  try {
    const { userId } = req.body;
    console.log(userId, "whereeee sugg");
    const suggestedFriends = await UserModel.find({
      _id: { $ne: userId }, // Exclude the user with the specified userId
      friends: { $nin: userId },
    })
      .limit(15)
      .select("firstName lastName location profileUrl -password");

    res.status(200).json({
      success: true,
      data: suggestedFriends,
    });
  } catch (error) {
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "No user found",
        status: "Failed",
      });
    }

    const existingRequest = await PasswordReset.findOne({ email });

    if (existingRequest) {
      if (existingRequest.expiresAt > Date.now()) {
        return res.status(201).json({
          message: "A reset password has already sent",
          status: "Pending",
        });
      }
      await PasswordReset.findOneAndDelete({ email });
    }
    // await resetPasswordLink(user, res);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
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
};
