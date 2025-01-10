const express = require("express");
const router = express.Router();
const comments = require("../data/comments");

// Route to get, update, or delete a specific comment by ID
router
  .route("/:id")
  .get((req, res, next) => {
    const comment = comments.find((c) => c.id == req.params.id);
    if (comment) {
      res.json(comment);
    } else {
      next(); // Pass control to error handling middleware
    }
  })
  .patch((req, res, next) => {
    const commentIndex = comments.findIndex((c) => c.id == req.params.id);
    if (commentIndex !== -1) {
      const updatedComment = { ...comments[commentIndex], ...req.body };
      comments[commentIndex] = updatedComment;
      res.json(updatedComment);
    } else {
      next(); 
    }
  })
  .delete((req, res, next) => {
    const commentIndex = comments.findIndex((c) => c.id == req.params.id);
    if (commentIndex !== -1) {
      const deletedComment = comments.splice(commentIndex, 1);
      res.json(deletedComment[0]);
    } else {
      next(); 
    }
  });

// Route to get all comments or create a new comment
router
  .route("/")
  .get((req, res) => {
    res.json(comments);
  })
  .post((req, res) => {
    const { userId, postId, content } = req.body;
    if (!userId || !postId || !content) {
      return res.json({ error: "Insufficient Data" });
    }

    const newComment = {
      id: comments[comments.length - 1]?.id + 1 || 1,
      userId,
      postId,
      content,
    };

    comments.push(newComment);
    res.json(newComment);
  });


  
module.exports = router;