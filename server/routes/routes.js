const express = require("express");
const router = express.Router();
const Users = require("../models/userSchema");
const Contacts = require("../models/contactSchema");
// const Saves = require("../models/saveSchema");
const Post = require("../models/postSchema");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

//import middleware
const authenticate = require("../middleware/middleware");

router.get("/", (req, res) => {
  res.send("In router Get Api");
});

//Register API
router.post("/api/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).send("Cannot be empty");
    }

    const isExist = await Users.findOne({ email });
    if (isExist) {
      res.status(400).send("User Already Exist");
    } else {
      const newUser = Users({
        username,
        email,
      });

      bcryptjs.hash(password, 10, (err, hashPassword) => {
        newUser.set("password", hashPassword);
        newUser.save();
        next();
      });
      return res.status(200).send("Successfully Registered");
    }
  } catch (error) {
    console.log("Error in Creating user", error);
    res.status(500).send("Server Error");
  }
});

//Login API
router.post("/api/login", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email });
  if (!user) {
    res.status(403).send("Email or Password is Invalid");
  } else {
    const validate = await bcryptjs.compare(password, user.password);
    if (!validate) {
      res.status(403).send("Email or Password is Invalid");
    } else {
      const payload = {
        id: user._id,
        username: user.username,
      };
      const JWT_SECRET_KEY = "THIS_IS_SECRET_KEY_OF_JWT";
      jwt.sign(
        payload,
        JWT_SECRET_KEY,
        { expiresIn: 84600 },
        async (err, token) => {
          if (err) {
            res.json({ message: err });
          }
          await Users.updateOne(
            { _id: user._id },
            {
              $set: { token },
            }
          );
          await user.save();
          return res.status(200).json({ user, token });
        }
      );
    }
  }
});

// New Post Api
router.post("/api/new-post", authenticate, async (req, res) => {
  try {
    const { caption, desc, url } = req.body;
    const { user } = req;
    if (!caption || !desc || !url) {
      res.status(400).send("Please fill all the fields");
    }

    const createPost = Post({
      caption,
      description: desc,
      image: url,
      user: user,
    });

    console.log("createPost : ", createPost);
    await createPost.save();
    res.status(200).send("Create Post Successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

//Get Post
router.get("/api/profile", authenticate, async (req, res, next) => {
  try {
    const { user } = req;
    const posts = await Post.find({ user: user._id }).populate(
      "user",
      "_id, username email"
    );
    // console.log("Posts :", posts);
    res.status(200).json({ posts, user });
  } catch (error) {
    res.status(500).send(error);
  }
});

//Get all Post
router.get("/api/posts", authenticate, async (req, res, next) => {
  try {
    const { user } = req;
    const posts = await Post.find()
      .populate("user", "_id username email")
      .sort({ _id: -1 });

    res.status(200).json({ posts, user });
  } catch (error) {
    res.status(500).send(error);
  }
});

//Get peoples profile
router.get("/api/people", authenticate, async (req, res, next) => {
  try {
    const { username } = req.query;
    const { user: follower } = req;
    const [user] = await Users.find({ username });
    const posts = await Post.find({ user: user._id });
    const [isFollowed] = await Contacts.find({
      follower: follower._id,
      followed: user._id,
    });

    const userDetails = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    console.log(posts, userDetails, !!isFollowed);
    res.status(200).json({ posts, userDetails, isFollowed: !!isFollowed });
  } catch (error) {
    res.status(500).send(error);
  }
});

//Api for follow user
router.post("/api/follow", authenticate, async (req, res, next) => {
  try {
    const { id } = req.body;
    const { user } = req;
    if (!id) {
      return res.status(400).send("Id can not be empty");
    }
    const [followedUser] = await Users.find({ _id: id });
    const followUser = Contacts({
      follower: user,
      followed: followedUser,
    });

    await followUser.save();
    res.status(200).json({ isFollowed: true });
  } catch (error) {
    console.log("Error ", error);
    res.status(500).send(error);
  }
});

//Api for unfollow user
router.delete("/api/unfollow", authenticate, async (req, res, next) => {
  try {
    const { id } = req.body;
    const { user } = req;
    if (!id) {
      return res.status(400).send("Id can not be empty");
    }
    await Contacts.deleteOne({ follower: user._id, followed: id });
    res.status(200).json({ isFollowed: false });
  } catch (error) {
    console.log("Error ", error);
    res.status(500).send(error);
  }
});

//Api for Like Post of user
router.put("/api/like", authenticate, async (req, res, next) => {
  try {
    // console.log("In like api");
    const { id } = req.body;
    const { user } = req;
    if (!id) {
      return res.status(400).send("Id can not be empty");
    }

    const updatedPost = await Post.findOneAndUpdate(
      { _id: id },
      {
        $push: { likes: user._id },
      },
      { returnDocument: "after" }
    ).populate("user", "_id, username email");
    res.status(200).json({ updatedPost });
  } catch (error) {
    console.log("Error ", error);
    res.status(500).send(error);
  }
});

//Api for UnLike Post of user
router.put("/api/unlike", authenticate, async (req, res, next) => {
  try {
    // console.log("In like api");
    const { id } = req.body;
    const { user } = req;
    if (!id) {
      return res.status(400).send("Id can not be empty");
    }

    const updatedPost = await Post.findOneAndUpdate(
      { _id: id },
      {
        $pull: { likes: user._id },
      },
      { returnDocument: "after" }
    ).populate("user", "_id, username email");
    // console.log("In like api");
    // await updatedPost.save();
    res.status(200).json({ updatedPost });
  } catch (error) {
    console.log("Error ", error);
    res.status(500).send(error);
  }
});

//Get Users
router.get("/api/users", authenticate, async (req, res, next) => {
  try {
    const { user } = req;
    const users = await Users.find({});

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
