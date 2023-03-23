const Blog = require('../models/blogmodel');
const express = require('express');

const router = express.Router();

// Find all blogs
router.get('/', async (_req, res) => {
  const blogs = await Blog.find({}).then((blogs) => {
    res.json(blogs);
  });
});

// Adding blogs
router.post('/', (req, res) => {
  const { title, author, url, likes } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: 'Title or URL missing' });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes !== undefined ? likes : 0
  });

  blog.save().then((result) => {
    res.status(201).json(result);
  });
});

// Removing blogs
router.delete('/:id', async (req, res) =>{
  const id = req.params.id;
  try{
    await Blog.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error){
    res.status(500).send('Blog was not deleted');
  }

})

// Editing blogs
router.put('/:id', async (req, res) => {
  const id = req.params.id;

  console.log('ID:', id);

  const { title, author, url, likes } = req.body;
  const blog = {
    title,
    author,
    url,
    likes
  };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { returnOriginal: false });
    console.log(updatedBlog);
    res.json(updatedBlog);

  } catch (error) {
    res.status(500).send('Failed to update blog');
  }
});



module.exports = router;