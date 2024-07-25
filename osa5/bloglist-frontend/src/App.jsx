import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [message, setMessage] = useState(null) 
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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


  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }
  
    blogService
      .create(blogObject)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        setMessage({ text: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, 
          type: 'success' })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        setMessage({ text: 'failed to add a new blog', type: 'error' })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
    </div>  
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        Title:
        <input
          value={newTitle}
          onChange={handleTitleChange}          
        />
      </div>
      <div>
        Author:
        <input
          value={newAuthor}
          onChange={handleAuthorChange}          
        />
      </div>
      <div>
        url:
        <input
          value={newUrl}
          onChange={handleUrlChange}          
        />
      </div>
      <button type="submit">create</button>
    </form> 
  )

  return (
    <div>
      <Notification message={message} />
      {!user && loginForm()} 
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
        {blogForm()}
       <h2>blogs</h2>
        {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
        )}
      </div>
    } 

      
    </div>
  )
}

export default App