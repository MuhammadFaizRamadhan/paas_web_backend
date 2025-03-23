const express = require('express')
const path = require('path');
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');

const port = 8080
app.use(cors({
  origin: 'http://localhost:3000', // or your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



app.get('/', (req, res) => {
    res.send('You Can Only Access this file by user')
})

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log requests
app.use((req, res, next) => {
    console.log('Request received:', {
      method: req.method,
      path: req.path,
      body: req.body,
      headers: req.headers
    });
    next();
  });

// Importing all the routes
const userroute = require("./routes/user.js")

app.use("/user",userroute)

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})