const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080; // Gunakan PORT dari Railway

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware untuk log request
app.use((req, res, next) => {
    console.log('Request received:', {
        method: req.method,
        path: req.path,
        body: req.body,
        headers: req.headers
    });
    next();
});

// Routes
const userroute = require("./routes/user.js");
app.use("/user", userroute);

const todoroute = require("./routes/todo.js");
app.use("/todo", todoroute);

// Default route
app.get('/', (req, res) => {
    res.send('You Can Only Access this file by user');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
