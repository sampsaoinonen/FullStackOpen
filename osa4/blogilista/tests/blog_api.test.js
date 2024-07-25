const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



const Blog = require('../models/blog')
const User = require('../models/user')
const { listWithOneBlog, listWithSixBlogs, blogsInSixBlogs, usersInDb, getToken} = require('./test_data')


beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(listWithSixBlogs)
    await User.deleteMany({})
  
    const passwordHash = await bcrypt.hash('sekret', 10) 
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct number of blogs is returned', async () => {
  const response = await api.get('/api/blogs')  
  assert.strictEqual(response.body.length, listWithSixBlogs.length, 'should return correct number of blogs')
})

test('blogs have field id instead of _id', async () => {
    const response = await api.get('/api/blogs')
    
    const blogs = response.body
    blogs.forEach(blog => {
        assert.strictEqual(typeof blog.id, 'string', 'id should be defined as a string')
        assert.strictEqual(blog._id, undefined, '_id should be undefined')
    })
})

test('a blog can be added ', async () => {
  const newBlog = {
      title: "Oma Blogi",
      author: "Pertti Pesonen",
      url: "https://yle.fi/",
      likes: 2,
      __v: 0    
  }

  const token = await getToken()

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, listWithSixBlogs.length + 1)

  assert(contents.includes('Oma Blogi'))
})

test('if likes is missing it is set to 0 by default', async () => {
  const newBlog = {
    title: 'Uusi Blogi',
    author: 'Minna Pesonen',
    url: 'http://testiurl.fi',
  }

  const token = await getToken()

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const savedBlog = response.body

  assert.strictEqual(savedBlog.likes, 0)
})

test('if title is missing respond with 400 Bad Request', async () => {
  const newBlog = {
    author: 'Minna Pesonen',
    url: 'http://testiurl.fi',
    likes: 5
  }

  const token = await getToken()

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('if url is missing respond with 400 Bad Request', async () => {
  const newBlog = {
    title: 'Uusi Blogi',
    author: 'Minna Pesonen',
    likes: 5
  }

  const token = await getToken()

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('fails with status code 401 Unauthorized if token is not provided', async () => {
  const newBlog = {
    title: "Unauthorized Blog",
    author: "Unauthorized User",
    url: "http://unauthorized.com",
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
}) 

describe('deletion of a blog', () => {
  beforeEach(async () => {
    const user = await User.findOne({ username: 'root' })
    const blogsAtStart = await blogsInSixBlogs()
    const blogToUpdate = blogsAtStart[0]

    await Blog.findByIdAndUpdate(blogToUpdate.id, { user: user._id })
  })

  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await blogsInSixBlogs()
    const blogToDelete = blogsAtStart[0]

    const token = await getToken()

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await blogsInSixBlogs()

    assert.strictEqual(blogsAtEnd.length, listWithSixBlogs.length - 1)

    const urls = blogsAtEnd.map(b => b.url)
    assert(!urls.includes(blogToDelete.url))
  })

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = '12345invalid'
    const token = await getToken()

    await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
  })
})

describe('updating a blog', () => {
  let blogToUpdate
  let updatedBlogData

  beforeEach(async () => {
    const blogsAtStart = await blogsInSixBlogs()
    blogToUpdate = blogsAtStart[0]

    updatedBlogData = {
      title: 'Päivitetty Pesonen',
      author: 'Sirkka Pesonen',
      url: 'http://pesonen.com',
      likes: 42
    }
  })

  test('succeeds with valid id and data', async () => {
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns the updated blog with correct data', async () => {
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updatedBlog = response.body

    assert.deepStrictEqual(updatedBlog, {...updatedBlogData, id: blogToUpdate.id})
  })

  test('database contains the updated blog', async () => {
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInSixBlogs()
    assert.strictEqual(blogsAtEnd.length, listWithSixBlogs.length)

    const updatedBlogInDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    assert.deepStrictEqual(updatedBlogInDb, {...updatedBlogData, id: blogToUpdate.id})
  })
})

after(async () => {
  await mongoose.connection.close()
})