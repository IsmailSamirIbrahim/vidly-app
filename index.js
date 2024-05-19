const mongoose = require('mongoose');
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/vidly')
.then(() => console.log("Connected to mongodb..."))
.catch((err) => console.log(err.message));


const port = 3000;
app.listen(port, () => {console.log(`Connected to the port number:${port}`)});