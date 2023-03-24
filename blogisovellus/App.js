const router = require('./controllers/blogcontroller');
const router2 = require('./controllers/usercontroller');
const router3 = require('./controllers/logincontroller');
const config = require('./utils/config');
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

const app = express();

mongoose.connect(config.MONGODB_URI);
logger.info('connecting to', config.MONGODB_URI)

app.use(cors());
app.use(express.json());

app.use('/api/blogs', router);
app.use('/api/users', router2);
app.use('/api/login', router3);

app.use(middleware.tokenExtractor)
app.use(middleware.errors)
app.use(middleware.tokenValidator)

module.exports = app;
