import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)

    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage({ text: `${user.name} logged in`, type: 'success' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage({ text: 'wrong username or password', type: 'error' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }


  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    try {
      const returnedBlog = await blogService.create(blogObject)
      console.log('returnedBlog' ,returnedBlog)
      setBlogs(blogs.concat(returnedBlog))
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      setMessage({
        text: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        type: 'success'
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      setMessage({ text: 'failed to add a new blog', type: 'error' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const likeBlog = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(prevBlogs => {
        const updatedBlogs = prevBlogs.map(b => b.id === blog.id ? returnedBlog : b)
        return updatedBlogs.sort((a, b) => b.likes - a.likes)
      })
    } catch (error) {
      setMessage({ text: `failed to like the blog ${blog.title}`, type: 'error' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const removeBlog = async (id) => {
    try {
      const blogToRemove = blogs.find(b => b.id === id)
      await blogService.remove(id)
      console.log('removedblog', removeBlog)
      setBlogs(blogs.filter(b => b.id !== id))
      setMessage({
        text: `Blog ${blogToRemove.title} by ${blogToRemove.author} removed successfully`,
        type: 'success'
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      setMessage({ text: 'failed to remove the blog', type: 'error' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <Notification message={message} />
      {!user &&
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleLogin={handleLogin}
      />
      }
      {user &&
      <div>
        <p>{user.name} logged in
          <button onClick={() => {
            window.localStorage.removeItem('loggedBlogappUser')
            setUser(null)
            setMessage({ text: `${user.name} logged out`, type: 'success' })
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          }}>
            Logout
          </button>
        </p>
        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm
            addBlog={addBlog}
            handleTitleChange={({ target }) => setNewTitle(target.value)}
            handleAuthorChange={({ target }) => setNewAuthor(target.value)}
            handleUrlChange={({ target }) => setNewUrl(target.value)}
            newTitle={newTitle}
            newAuthor={newAuthor}
            newUrl={newUrl}
          />
        </Togglable>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            likeBlog={likeBlog}
            removeBlog={removeBlog}
          />
        )}
      </div>
      }
    </div>
  )
}

export default App