const Blog = require('../models/blogmodel');
const User = require('../models/usermodel');
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')
const express = require('express')
const router = express.Router();


// Find all blogs
router.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs)
});

// Adding blogs
router.post('/', middleware.tokenValidator , middleware.tokenExtractor, async (req, res) => {
  const { title, author, url, likes } = req.body;

  const token = req.token

  const decoded = jwt.verify(token, process.env.SECRET)
  const user = await User.findById(decoded.id)

  if (!title || !url) {
    return res.status(400).json({ error: 'Title or URL missing' });
  }

try{
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes && likes > 0 ? likes: 0,
    user: user._id
  });

  await blog.save().then((result) => {
    res.status(201).json(result);
  });
}catch(error){console.log(error)}
});

// Removing blogs
router.delete('/:id', middleware.tokenExtractor, middleware.tokenValidator ,async (req, res) =>{
  const id = req.params.id;
  const token = req.token

  const decoded = jwt.verify(token, process.env.SECRET)
  const user = await User.findById(decoded.id)
  const blogToDelete = await Blog.findById(req.params.id)

  if (blogToDelete.user.toString() === user._id.toString()){
  try{
    await Blog.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error){
    res.status(500).send('Blog was not deleted');
  }
}else{return res.status(401).send('No access')}

})

// Editing blogs
router.put('/:id', middleware.tokenValidator, middleware.tokenExtractor, async (req, res) => {
  const id = req.params.id;
  const { title, author, url, likes } = req.body

  const token = req.token

  const decoded = jwt.verify(token, process.env.SECRET)
  const user = await User.findById(decoded.id)

  const blogToUpdate = await Blog.findById(req.params.id)

  if ( blogToUpdate.user.toString() === user._id.toString() ) {
      const blog = {
          title,
          author,
          url,
          likes: likes !== undefined ? likes : 0,
      }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { returnOriginal: false });
    res.json(updatedBlog);

  } catch (error) {
    res.status(500).send('Failed to update blog');
  }
}
});



module.exports = router;
