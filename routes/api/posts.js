const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { post } = require("request");

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  "/",
  [auth, check("text", "Text is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      res.status(500).send("server error " + err.message);
    }
  }
);

// @route   GET api/posts
// @desc    get all posts from a user
// @access  Private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).sort({ date: -1 }); //倒序

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).send("Server Error " + err.message);
  }
});

// @route   GET api/posts/:id
// @desc    get post by id
// @access  Private

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).send({ msg: "post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Page not found" });
    }
    res.status(500).send("Server Error " + err.message);
  }
});

// @route   DELETE api/posts/:id
// @desc    delete post by id
// @access  Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).send({ msg: "post not found" });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: "User not authorized",
        user_id: post.user,
        request_user_id: req.user.id,
      });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "post deleted" });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Page not found" });
    }
    res.status(500).send("Server Error " + err.message);
  }
});

// @route   PUT api/posts/like/:id
// @desc    like someone's post by post id
// @access  Private: need user token
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).send({ msg: "post not found" });
    }
    // const user=await User.findById(req.user.id);

    //check if already exist
    if (
      post.likes.filter((elem) => {
        return elem.user == req.user.id;
      }).length > 0
    ) {
      // already exist
      return res.status(400).json({ msg: "post already liked" });
    }
    post.likes.unshift({ user: req.user.id });

    await post.save();

    return res.status(200).json(post.likes);
  } catch (err) {
    res.status(500).send("Server Error " + err.message);
  }
});

// @route   PUT api/posts/unlike/:id
// @desc    unlike someone's post by post id
// @access  Private: need user token
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).send({ msg: "post not found" });
    }
    const len = post.likes.length;
    post.likes = post.likes.filter((like) => {
      like.user != req.user.id;
    });
    if (len == post.likes.length) {
      return res.status(400).json({ msg: "Post has not been liked" });
    }

    await post.save();

    return res.status(200).json(post.likes);
  } catch (err) {
    res.status(500).send("Server Error " + err.message);
  }
});

// @route   POST api/posts/comment/:id
// @desc    Create a comment to a post by post id
// @access  Private
router.post(
  "/comment/:id",
  [auth, check("text", "Text is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);
      post.save();
      res.json(post.comments);
    } catch (err) {
      res.status(500).send("server error " + err.message);
    }
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    delete comment given post id and comment id
// @access  Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comments = post.comments.filter(
      (comment) => comment._id != req.params.comment_id
    );
    if (comments.length == post.comments.length) {
      return res.status(404).json({ msg: "Comment not existed" });
    }
    //check user is the post owner
    const comment = post.comments.filter(
      (comment) => comment._id == req.params.comment_id
    )[0];
    if (comment.user != req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    //remove that
    post.comments = comments;
    await post.save();
    return res.status(200).json({ msg: "delete succeed" });
  } catch (err) {
    res.status(500).json("Server Error " + err.message);
  }
});

module.exports = router;
