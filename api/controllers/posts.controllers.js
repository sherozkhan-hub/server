const Post = require("../models/post");
const Users = require("../models/user");
const Comments = require("../models/comment");
// const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//   cloud_name: "ddz55xfrt",
//   api_key: "337776244239766",
//   api_secret: "k2SuFddiyzPtPiR0OIvRcGMa0lY",
// });

const createPost = async (req, res, next) => {
  try {
    const { userId, description, image } = req.body;

    if (!description) {
      return res
        .status(400)
        .json({ success: false, message: "You must provide a description" });
    }

    // const file = req.files.image;

    // Upload the image to Cloudinary

    // const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath);

    // Create a new Post record with the uploaded image URL
    const post = await Post.create({
      userId,
      description,
      image,
      //image: uploadResponse.secure_url, // Use secure_url from Cloudinary's response
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// const createPost = async (req, res, next) => {
//   try {
//     const { userId } = req.body;

//     const { description, image } = req.body;
//     const file = req.files.image;
//     cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
//       console.log(result, "result");
//     });

//     if (!description) {
//       next("You must provide a description");
//       return;
//     }

//     const post = await Post.create({
//       userId,
//       description,
//       image: result.url,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Post created successfully",
//       data: post,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getPosts = async (req, res, next) => {
//   try {
//     const { userId } = req.body;
//     const { search } = req.body;
//     // console.log(req.body.userId);
//     // console.log(userId, "here");

//     const user = await Users.findById(userId);
//     const friends = user.friends?.toString().split(",");
//     friends?.push(userId);

//     const searchPostQuery = {
//       $or: [{ description: { $regex: search, $options: "i" } }],
//     };

//     const posts = await Post.find(search ? searchPostQuery : {})
//       .populate({
//         path: "userId",
//         select: "firstName lastName location profileUrl -password",
//       })
//       .sort({ _id: -1 });

//     const friendsPosts = posts.filter((post) => {
//       return friends?.includes(post.userId._id.toString());
//     });

//     const otherPosts = posts.filter((post) => {
//       return !friends.includes(post.userId._id.toString());
//     });

//     let postsRes = null;

//     if (friendsPosts.length > 0) {
//       postsRes = search ? friendsPosts : [...friendsPosts, ...otherPosts];
//     } else {
//       postsRes = posts;
//     }

//     res.status(200).json({
//       success: true,
//       message: "Posts fetched successfully",
//       data: postsRes,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getPosts = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const { search } = req.body;
    console.log(userId, "here user is");

    const user = await Users.findById(userId);
    console.log(user, "user");
    const friends = user.friends.toString().split(",") || []; // Initialize as an empty array if friends is undefined or null

    const searchPostQuery = {
      $or: [{ description: { $regex: search, $options: "i" } }],
    };

    const posts = await Post.find(search ? searchPostQuery : {})
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .sort({ _id: -1 });

    const friendsPosts = posts.filter((post) => {
      return friends.includes(post?.userId?._id.toString());
    });

    const otherPosts = posts.filter((post) => {
      return !friends.includes(post?.userId?._id.toString());
    });

    let postsRes = null;

    if (friendsPosts.length > 0) {
      postsRes = search ? friendsPosts : [...friendsPosts, ...otherPosts];
    } else {
      // Handle the case where the user has no friends
      postsRes = search ? [] : otherPosts;
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

    // const post = await Post.findById(id).populate({
    //   path: "userId",
    //   select: "firstName lastName location profileUrl -password",
    // });

    const post = await Post.findById(id).populate({
      path: "userId",
      select: "firstName lastName location profileUrl -password",
    });
    console.log(post, "post");

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

    const post = await Post.find({ userId: id })
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .sort({ _id: -1 });

    res.status(200).json({
      success: true,
      message: "User Post fetched successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const postComments = await Comments.find({ postId })
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .populate({
        path: "replies.userId",
        select: "firstName lastName location profileUrl -password",
      })
      .sort({ _id: -1 });

    res.status(200).json({
      success: true,
      message: "Post Comments fetched successfully",
      data: postComments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const likePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body.user;

    const post = await Post.findById(postId);

    const index = post.likes.findIndex((id) => id === String(userId));

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(userId));
    }

    const newPost = await Post.findByIdAndUpdate(postId, post, { new: true });

    res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      data: newPost,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const likePostComment = async (req, res, next) => {
  try {
    const { commentId, replyId } = req.params;
    const { userId } = req.body.user;

    if (replyId === undefined || replyId === null) {
      const comment = await Comments.findById(commentId);

      const index = comment.likes.findIndex((id) => id === String(userId));

      if (index === -1) {
        comment.likes.push(userId);
      } else {
        comment.likes = comment.likes.filter((id) => id !== String(userId));
      }

      const updated = await Comments.findByIdAndUpdate(commentId, comment, {
        new: true,
      });

      res.status(201).json(updated);
    } else {
      const replyComments = await Comments.findOne(
        { _id: id },
        {
          replies: {
            $elemMatch: { _id: replyId },
          },
        }
      );

      const index = replyComments.likes.findIndex(
        (id) => id === String(userId)
      );

      if (index === -1) {
        replyComments.replies[0].likes.push(userId);
      } else {
        replyComments.replies[0].likes = replyComments.likes.filter(
          (id) => id !== String(userId)
        );
      }

      const query = { _id: id, "replies._id": replyId };

      const updated = {
        $set: { "replies.$.likes": replyComments.replies[0].likes },
      };

      const result = await Comments.updateOne(query, updated, { new: true });

      res.status(201).json(result);
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const commentPost = async (req, res, next) => {
  try {
    const { comment, from } = req.body;
    const { userId } = req.body;
    const { id } = req.params;
    // console.log(userId, id, comment, from, "here");

    if (comment === null) {
      return res.status(404).json({ message: "You must provide a comment" });
    }

    const newComment = new Comments({ comment, from, userId, postId: id });
    console.log(newComment, "newComment");

    await newComment.save();

    // updating post with new comment
    const post = await Post.findById(id);

    post.comments.push(newComment._id);

    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const replyPostComment = async (req, res, next) => {
  try {
    const { comment, from, replyAt } = req.body;
    const { userId } = req.body;
    const { id } = req.params;

    if (comment === null) {
      return res.status(404).json({ message: "You must provide a comment" });
    }

    const commentInfo = await Comments.findById(id);

    commentInfo.replies.push({
      comment,
      from,
      userId,
      replyAt,
      created_At: Date.now(),
    });

    commentInfo.save();

    res.status(200).json(commentInfo);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Post.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  getUserPost,
  getComments,
  likePost,
  likePostComment,
  commentPost,
  replyPostComment,
  deletePost,
};
