const mongoose = require("mongoose");
const { Schema } = mongoose;

const emailVerificationSchema = new mongoose.Schema({
  userId: String,
  token: String,
  createdAt: Date,
  expireAt: Date,
});

module.exports = mongoose.model("Verification", emailVerificationSchema);
