const Blog = require('../models/blogmodel');
const express = require('express');

const router = express.Router();

router.get('/', async (_req, res) => {
  const blogs = await Blog.find({}).then((blogs) => {
    res.json(blogs);
  });
});

router.post('/', (req, res) => {
  const blog = new Blog(req.body);

  blog.save().then((result) => {
    res.status(201).json(result);
  });
});

module.exports = router;