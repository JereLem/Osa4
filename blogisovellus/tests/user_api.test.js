const bcrypt = require('bcrypt')
const User = require('../models/usermodel')
const helper = require('../utils/list_helper');
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)



beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('salainen', 10)
    const user = new User({ username: 'Erkki', passwordHash })
    await user.save()
});
  
describe('User creation', () => {
  test('Fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Erkki2',
      name: 'Erkki Esimerkillinen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
  test('Invalid username', async () => {
  
    const newUser = {
        username: 'Er',
        name: 'Erkki Esimerkki',
        password: 'salasana',
    }
  
    await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
  })

  test('Invalid password', async () => {
  
    const newUser = {
        username: 'Erkki',
        name: 'Erkki Esimerkki',
        password: 'sa',
    }
  
    await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
  })

  test('Duplicate username', async () => {
  
    const newUser = {
        username: 'Erkki',
        name: 'Erkki Esim',
        password: 'salainen',
    }

    const countAtStart = await User.countDocuments();
  
    const res = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    const countAtEnd = await User.countDocuments();
  
  expect(res.body.error).toContain('Username must be unique');
  expect(countAtStart).toEqual(countAtEnd);
})
})