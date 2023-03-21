const mongoose = require('mongoose')
const listHelper = require("../utils/list_helper");
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

// Test that blogs are returned
describe('blogs api', () => {
    test('blogs are returned as JSON', async () => {
      const res = await api.get('/api/blogs');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/application\/json/);
    });
  
    test('all blogs are returned', async () => {
      const res = await api.get('/api/blogs');
      expect(res.body.length).toEqual(listHelper.listWithMultipleBlogs.length);
    });
  });


// Test that posted blogs have the correct id
describe('returned blog has an id field', () => {
    test('the id field is defined', async () => {
      const res = await api.get('/api/blogs')
      const blogs = res.body
      blogs.forEach(blog => {
        expect(blog.id).toBeDefined()
      })
    })
  })


// Test that new blog are added correctly
describe('adding a new blog', () => {
    test('Good, valid data!', async () => {
      const newBlog = {
        title: 'Test',
        author: 'Test',
        url: 'http://testurl.com',
        likes: 123
      }

  
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const res = await api.get('/api/blogs')
      const blogs = res.body
  
      expect(blogs).toHaveLength(blogs.length)
  
      const titles = blogs.map(blog => blog.title)
      expect(titles[titles.length-1]).toEqual("Test")
    })
  })
  

afterAll(async () => {
  await mongoose.connection.close()
})

