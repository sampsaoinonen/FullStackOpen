const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { listWithOneBlog, listWithSixBlogs } = require('./test_data')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithSixBlogs)
    assert.strictEqual(result, 36)
  })

})

describe('favorite', () => {
  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })
  test('when list has only one blog equals that blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    const expected = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    }
    assert.deepStrictEqual(result, expected)
  })
  test('of a bigger list is the one with most likes', () => {
    const result = listHelper.favoriteBlog(listWithSixBlogs)
    const expected = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    }
    assert.deepStrictEqual(result, expected)
  })
})

describe('most blogs', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })
  test('when list has only one blog equals that author and one blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    const expected = {
      author: 'Edsger W. Dijkstra',
      blogs: 1
    }
    assert.deepStrictEqual(result, expected)
  })
  test('of a bigger list is the one with most likes', () => {
    const result = listHelper.mostBlogs(listWithSixBlogs)
    const expected = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    assert.deepStrictEqual(result, expected)
  })

describe('mostLikes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, 0)
  })
  test('when list has only one blog equals likes of that', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 5
    }
    assert.deepStrictEqual(result, expected)
  })
  test('when a bigger list equals most likes of the author combined', () => {
    const result = listHelper.mostLikes(listWithSixBlogs)
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }
    assert.deepStrictEqual(result, expected)
  })
})
})