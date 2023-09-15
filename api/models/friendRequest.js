const mongoose = require("mongoose");
const { Schema } = mongoose;

const emailVerificationSchema = new mongoose.Schema(
  {
    requestTo: { type: Schema.Types.ObjectId, ref: "Users" },
    requestFrom: { type: Schema.Types.ObjectId, ref: "Users" },
    requestStatus: { type: String, default: "Pending" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FriendRequest", requestSchema);
