const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    description: { type: String, required: true },
    image: { type: String },
    likes: [{ type: String }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Posts", postSchema);
