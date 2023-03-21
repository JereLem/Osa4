const Blog = require('../models/blogmodel');
const express = require('express');

const router = express.Router();

router.get('/', async (_req, res) => {
  const blogs = await Blog.find({}).then((blogs) => {
    res.json(blogs);
  });
});

router.post('/', (req, res) => {
  const { title, author, url, likes } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: 'Title or URL missing' });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes !== undefined ? likes : 0 // set likes to 0 if it's not provided
  });

  blog.save().then((result) => {
    res.status(201).json(result);
  });
});


module.exports = router;