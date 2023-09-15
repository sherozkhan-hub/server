const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Posts",
    },
    replies: [
      {
        rid: { type: Schema.Types.ObjectId },
        userId: { type: Schema.Types.ObjectId, ref: "Users" },
        comment: { type: String },
        likes: [{ type: String }],
        from: { type: String },
        replyAt: { type: String },
        createdAt: { type: Date, default: Date.now() },
        updatedAt: { type: Date, default: Date.now() },
      },
    ],
    likes: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comments", commentSchema);
