const express = require("express");
const router = express.Router();
const posts = require("../data/posts");

 // Route to get, update, or delete a specific post by ID
router
  .route("/:id")
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);
    if (post) {
      res.json(post);
    } else {
      next();
    }
  })
  .patch((req, res, next) => {
    const postIndex = posts.findIndex((p) => p.id == req.params.id);
    if (postIndex !== -1) {
      const updatedPost = { ...posts[postIndex], ...req.body };
      posts[postIndex] = updatedPost;
      res.json(updatedPost);
    } else {
      next();
    }
  })
  .delete((req, res, next) => {
    const postIndex = posts.findIndex((p) => p.id == req.params.id);
    if (postIndex !== -1) {
      const deletedPost = posts.splice(postIndex, 1);
      res.json(deletedPost[0]);
    } else {
      next();
    }
  });


  // Route to get all posts or create a new post 
router
  .route("/")
  .get((req, res) => {
    const { userId, title } = req.query;
    let filteredPosts = posts;

    // Filter by userId if provided in query params
    if (userId) {
      filteredPosts = filteredPosts.filter(post => post.userId == userId);
    }

    // Filter by title if provided in query params
    if (title) {
        filteredPosts = filteredPosts.filter(post => post.title.toLowerCase().includes(title.toLowerCase()));
    }

    // Respond with the filtered posts (or all posts if no filter is applied)
    res.json(filteredPosts);
  })
  .post((req, res) => {
    const { userId, title, content } = req.body;
    if (!userId || !title || !content) {
      return res.json({ error: "Insufficient Data" });
    }

    const newPost = {
      id: posts[posts.length - 1]?.id + 1 || 1,
      userId,
      title,
      content,
    };

    posts.push(newPost);
    res.json(newPost);
  });

module.exports = router;