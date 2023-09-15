const { Posts } = require("../models/post");
const { Users } = require("../models/user");

const createPost = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { description, image } = req.body;

    if (!description) {
      next("You must provide a description");
      return;
    }

    const post = await postMessage.create({
      userId,
      description,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPosts = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { search } = req.body;

    const user = await Users.findById(userId);
    const friends = user.friends.toString().split(",");
    friends.push(userId);

    const searchPostQuery = {
      $or: [{ description: { $regex: search, $options: "i" } }],
    };

    const posts = await Posts.find(search ? searchPostQuery : {})
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .sort({ _id: -1 });

    const friendsPosts = posts.filter((post) => {
      return friends.includes(post.userId._id.toString());
    });

    const otherPosts = posts.filter((post) => {
      return !friends.includes(post.userId._id.toString());
    });

    let postsRes = null;

    if (friendsPosts.length > 0) {
      postsRes = search ? friendsPosts : [...friendsPosts, ...otherPosts];
    } else {
      postsRes = posts;
    }

    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: postsRes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Posts.findById(id).populate({
      path: "userId",
      select: "firstName lastName location profileUrl -password",
    });

    res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getUserPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Posts.find({ userId: id })
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .sort({ _id: -1 });

    res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  getUserPost,
};
