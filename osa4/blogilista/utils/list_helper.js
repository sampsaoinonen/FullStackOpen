const lod = require('lodash')

const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
      return null
    }
  
    const favorite = blogs.reduce((prev, current) => {
      return (prev.likes > current.likes) ? prev : current
    })
  
    return {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes
    }
  }

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
      }
      
    const blogCountByAuthor = lod.countBy(blogs, 'author')

    const authorBlogCounts = lod.map(blogCountByAuthor, (blogs, author) => {
        return { author, blogs }
      })
    
    const topAuthor = lod.maxBy(authorBlogCounts, 'blogs')

    console.log('blogCountByAuthor:', blogCountByAuthor)
    console.log('authorBlogCounts:', authorBlogCounts)
    console.log('topAuthor:', topAuthor)

    return {
        author: topAuthor.author,
        blogs: topAuthor.blogs
      }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return 0
      }
    
    const groupedAuthor = lod.groupBy(blogs, 'author')

    const likesByAuthor = lod.map(groupedAuthor, (blogs, author) => {
        return {
          author,
          likes: lod.sumBy(blogs, 'likes')
        }
      })
    
    return lod.maxBy(likesByAuthor, 'likes')
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}