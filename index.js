require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
const bodyParser = require("body-parser");
const conn = require('./config/db')
conn()

// Middleware to serve static files from public folder
app.use(express.static('public'));

// Middleware to parse incoming requests
app.use(bodyParser.json({ extended: true })); //This middleware is used to parse incoming JSON data.
app.use(bodyParser.urlencoded({ extended: true })); //This middleware is used to parse URL-encoded data (like form submissions).

//Route imports
const users = require("./routes/users");
const posts = require("./routes/posts");
const comments = require("./routes/comments");

// Mount routers
app.use("/users", users); 
app.use("/posts", posts);  
app.use("/comments", comments);


//Logging Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  
// Authentication Middleware
function checkAuth(req, res, next) {
    const authToken = req.headers['x-auth-token'];
    if (!authToken) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }
    next();
  }



// Error handling Middleware
app.use((req, res) => {
    res.status(404);
    res.json({ error: "Resource Not Found" });
  });
  
  // Generic Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

  app.listen(port, () => {
    console.log(`Server listening on port: ${port}.`);
  });
