const mongoose = require("mongoose");
const { ObjectId } = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    userProfilePhotoPath: {
      type: String,
    },
    age: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 characters long"],
      select: true,
    },
    location: {
      type: String,
    },
    profileUrl: {
      type: String,
    },
    profession: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    views: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);
