const express = require("express");
const router = express.Router();
const users = require("../data/users");



router
  .route("/:id")
  .get((req, res, next) => {
    const user = users.find((u) => u.id == req.params.id);
    if (user) {
      res.json(user);
    } else {
      next();
    }
  })
  .patch((req, res, next) => {
    const userIndex = users.findIndex((u) => u.id == req.params.id);
    if (userIndex !== -1) {
      const updatedUser = { ...users[userIndex], ...req.body };
      users[userIndex] = updatedUser;
      res.json(updatedUser);
    } else {
      next();
    }
  })
  .delete((req, res, next) => {
    const userIndex = users.findIndex((u) => u.id == req.params.id);
    if (userIndex !== -1) {
      const deletedUser = users.splice(userIndex, 1);
      res.json(deletedUser[0]);
    } else {
      next();
    }
  });

router
  .route("/")
  .get((req, res) => {
    res.json(users);
  })
  .post((req, res) => {
    const { username, email } = req.body;
    if (!username || !email) {
        return res.status(400).json({ error: "Insufficient Data" });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const userExists = users.some((u) => u.username === username);
    if (userExists) {
       return res.status(409).json({ error: "Username Already Taken" });
    }

    const newUser = {
      id: users[users.length - 1]?.id + 1 || 1,
      username,
      email,
    };

    users.push(newUser);
    res.status(201).json(newUser);
  });

module.exports = router;