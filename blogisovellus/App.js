const router = require('./controllers/blogcontroller');
const config = require('./utils/config');
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');

const app = express();

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());

app.use('/api/blogs', router);

module.exports = app;
