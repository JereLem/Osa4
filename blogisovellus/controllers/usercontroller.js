const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/usermodel')
const Blog = require('../models/blogmodel')

usersRouter.get('/', async (_req, res) =>
  res.json(await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 }))
);

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (!username || username.length < 3) {
    return res.status(400).json({ error: 'Username must exist and be at least 3 characters long' })
  }

  if (!password || password.length < 3) {
    return res.status(400).json({ error: 'Password must exist and be at least 3 characters long' })
  }

  const existingUser = await User.findOne({username})
  if (existingUser) {
    return res.status(400).json({ error: 'Username must be unique' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username ,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

usersRouter.post('/:userId/blogs', async (req, res, next) => {
    const { title, author, url, likes } = req.body
    const { userId } = req.params
  
    const user = await User.findById(userId)
  
    if (!user) {
      return res.status(400).json({ error: 'Invalid user ID' })
    }
  
    const blog = new Blog({ title, author, url, likes, user: user._id })
    const savedBlog = await blog.save()
  
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
  
    res.status(201).json(savedBlog)
  })

module.exports = usersRouter