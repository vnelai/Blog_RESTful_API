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
    const { name, username, email } = req.body;
    if (!name || !username || !email) {
      return res.json({ error: "Insufficient Data" });
    }

    const userExists = users.some((u) => u.username === username);
    if (userExists) {
      return res.json({ error: "Username Already Taken" });
    }

    const newUser = {
      id: users[users.length - 1]?.id + 1 || 1,
      name,
      username,
      email,
    };

    users.push(newUser);
    res.json(newUser);
  });

module.exports = router;