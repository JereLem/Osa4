const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('../utils/list_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blogmodel')
const User = require('../models/usermodel')


beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('salainen', 10)
  const user = new User({ username: 'Erkki', name:'Erkki Esimerkki', passwordHash })
  await user.save()

  await Blog.deleteMany({})
  const blogObjects = helper.listWithMultipleBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('GET', () => {
  let headers

  beforeEach(async () => {
    await User.deleteMany({})
    const newUser = {
      username: 'Erkki',
      name: 'Erkki Esimerkki',
      password: 'salainen',
    }

    await api.post('/api/users').send(newUser)

    const result = await api.post('/api/login').send(newUser)

    headers = {'Authorization': `Bearer ${result.body.token}`}
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .set(headers)
      .expect('Content-Type', /application\/json/)
  })

  test('Are  there multiple blogs?', async () => {
    const res = await api.get('/api/blogs').set(headers)
    expect(res.body).toHaveLength(helper.listWithMultipleBlogs.length)
  })

  test('Blogs have id field?', async () => {
    const blogs = await Blog.find({})
    expect(blogs[0]._id).toBeDefined()
  })
})

describe('POST', () => {
  let headers

  beforeEach(async () => {
    const newUser = {
      username: 'Erkki',
      name: 'Erkki Esimerkki',
      password: 'salainen',
    }

    await api.post('/api/users').send(newUser)

    const result = await api
      .post('/api/login')
      .send(newUser)

    headers = {
      'Authorization': `Bearer ${result.body.token}`
    }
  })

  test('Can a valid blog be added?', async () => {
    const newBlog = {
      title:"Test valid",
      author:"Test valid",
      url:"test valid",
      likes:123
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .set(headers)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.listWithMultipleBlogs.length + 1)
  })

  test('If title and url are missing, respond with 400 bad request', async () => {
    const newBlog = {
      author:"Test with no title or url",
      likes:12
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.listWithMultipleBlogs.length)
  })

  test('If the likes property is missing, it will default to 0', async () => {
    const newBlog = {
      title:"This blog tests if likes are defined to 0",
      author:"Test",
      url:"Test",
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = await blogsAtEnd.find(blog => blog.title === "This blog tests if likes are defined to 0")
    expect(addedBlog.likes).toBe(0)
  })

  test('fail if no auth token', async () =>{
    const newBlog = {
      title:"This blog tests if likes are defined to 0",
      author:"Test",
      url:"Test",
    }
    await api.post('/api/blogs').send(newBlog).expect(401)
    .expect('Content-Type', /application\/json/);
})
})

describe('PUT', () => {
  let headers

  beforeEach(async () => {
    const newUser = {
      username: 'Erkki',
      name: 'Erkki Esimerkki',
      password: 'salainen',
    }

    await api.post('/api/users').send(newUser)

    const result = await api
      .post('/api/login')
      .send(newUser)

    headers = {
      'Authorization': `Bearer ${result.body.token}`
    }
    
  })

 test('Blog updated?', async () => {

    const newBlog = {
      title:"This blog was updated",
      author:"Author was updated",
      url:"Url was updated",
      likes:123
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(201)

    const allBlogs = await helper.blogsInDb()
    const blogToUpdate = allBlogs.find(blog => blog.title === newBlog.title)

    const updatedBlog = {
      ...blogToUpdate,
      likes: 20
    } 

    await api
      .put(`/api/blogs/${blogToUpdate._id}`)
      .send(updatedBlog)
      .set(headers)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.listWithMultipleBlogs.length + 1)
    const foundBlog = blogs.find(blog => blog.likes === 20)
    expect(foundBlog.likes).toBe(20)
  })
})

describe('DELETE', () => {
  let headers

  beforeEach(async () => {
    const newUser = {
      username: 'Erkki',
      name: 'Erkki Esimerkki',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)

    const result = await api
      .post('/api/login')
      .send(newUser)

    headers = {'Authorization': `Bearer ${result.body.token}`}

  })

  test('Is id valid and delete?', async () => {
    const newBlog = {
      title:"Is the id correct?",
      author:"Test",
      url:"Test",
      likes:123,
      user: User._id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(201)

    const allBlogs = await helper.blogsInDb()
    const blogToDelete = allBlogs.find(blog => blog.title === newBlog.title)

    await api
      .delete(`/api/blogs/${blogToDelete._id}`)
      .set(headers)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.listWithMultipleBlogs.length)

    const contents = blogsAtEnd.map(r => r.title)

    expect(contents).not.toContain(blogToDelete.title)
  })
})

afterAll(() => {
  mongoose.connection.close()
});