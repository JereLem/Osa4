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

afterAll(async () => {
  await mongoose.connection.close()
})

