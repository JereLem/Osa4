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
        expect(blog._id).toBeDefined()
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

  test('if likes field is not provided, default to 0', async () => {
    const newBlog = {
      title: 'Test',
      author: 'Test',
      url: 'http://testurl.com'
    }
  
    const res = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    expect(res.body.likes).toBe(0)
  })
  

  test('blog without title and url returns 400 Bad Request', async () => {
    const newBlog = {
      author: 'Test',
      likes: 5
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
  
  test('blog without title returns 400 Bad Request', async () => {
    const newBlog = {
      author: 'Test',
      url: 'http://testurl.com',
      likes: 5
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
  
  test('blog without url returns 400 Bad Request', async () => {
    const newBlog = {
      title: 'Test',
      author: 'Test',
      likes: 5
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
  

  // Test deleting blog by id
  test('a blog can be deleted', async () => {
    const res = await api.get('/api/blogs')
    const blogsAtStart = res.body


    const blogToDelete = blogsAtStart[0];
  
    await api.delete(`/api/blogs/${blogToDelete._id}`).expect(204);

    const res2 = await api.get('/api/blogs')
    const blogsAtEnd = res2.body;
  
    expect(blogsAtEnd.length).toBe(blogsAtStart.length-1);
  
    const titles = blogsAtEnd.map(b => b.title);
    expect(titles).not.toContain(blogToDelete.title);
  });


  // Test editing blog
  test('a blog can be updated', async () => {
    const res = await api.get('/api/blogs')
    const blogsAtStart = res.body
    const blogToUpdate = blogsAtStart[0];
    console.log(blogToUpdate.id);
    const blog = {
      title: "This title was changed",
      author: "This author was changed",
      url: "This url was changed",
      likes: 20,
    };

    await api
      .put(`/api/blogs/${blogToUpdate._id}`)
      .send(blog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const res2 = await api.get('/api/blogs')
    const blogsAtEnd = res2.body;

    const updatedBlog = blogsAtEnd[0];
    expect(blogsAtEnd.length).toBe(blogsAtStart.length);
    expect(updatedBlog.likes).toBe(20);
  });

  

afterAll(async () => {
  await mongoose.connection.close()
})

