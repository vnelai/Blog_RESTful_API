require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require("body-parser");
const conn = require('./config/db')
conn()


//Route imports
const users = require("./routes/users");
const posts = require("./routes/posts");



