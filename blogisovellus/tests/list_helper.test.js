const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = [];
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})


// Test for total likes
describe('total likes', () => {

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listHelper.listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has multiple blogs, equals the sum of likes', () => {
    const result = listHelper.totalLikes(listHelper.listWithMultipleBlogs)
    expect(result).toBe(36)
  })

  test('when list has no blogs, equals zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })
})


// Test for favorite blog
describe('favorite blog', () => {
  test('when list has only one blog, equals that blog', () => {
  const result = listHelper.favoriteBlog(listHelper.listWithOneBlog)
  expect(result).toEqual({
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  likes: 5,
  })
  })
  
  test('of a bigger list is calculated right', () => {
  const result = listHelper.favoriteBlog(listHelper.listWithMultipleBlogs)
  expect(result).toEqual({
  title: 'Canonical string reduction',
  author: 'Edsger W. Dijkstra',
  likes: 12,
  })
  })
  
  test('of empty list is null', () => {
  const result = listHelper.favoriteBlog([])
  expect(result).toBeNull()
  })
  })


// Test for mostBlogs
describe('mostBlogs', () => {
  test('when list has only one blog, equals that blog', () => {
  const result = listHelper.mostBlogs(listHelper.listWithOneBlog)
  expect(result).toEqual({
  author: 'Edsger W. Dijkstra',
  blogs: 1,
  })
  })
  
  test('of a bigger list is calculated right', () => {
  const result = listHelper.mostBlogs(listHelper.listWithMultipleBlogs)
  expect(result).toEqual({
    author:"Robert C. Martin",
    blogs: 3,
  })
  })
  
  test('of empty list is null', () => {
  const result = listHelper.mostBlogs([])
  expect(result).toEqual({
    author: "", 
    blogs: 0
  })
  })
  })


  //Test for mostLikes
describe('most likes', () => {
  test('when list has only one blog, equals that blog', () => {
  const result = listHelper.mostLikes(listHelper.listWithOneBlog)
  expect(result).toEqual({
  author: 'Edsger W. Dijkstra',
  likes: 5,
  })
  })
  
  test('of a bigger list is calculated right', () => {
  const result = listHelper.mostLikes(listHelper.listWithMultipleBlogs)
  expect(result).toEqual({
    author: "Edsger W. Dijkstra", 
    likes: 17,
  })
  })
  })