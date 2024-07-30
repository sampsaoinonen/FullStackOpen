import PropTypes from 'prop-types'

const BlogForm = ({
  addBlog,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  newTitle,
  newAuthor,
  newUrl
  
}) => {
  return (
    <div>
      <form onSubmit={addBlog}>
        <div>
            Title:
          <input
            value={newTitle}
            onChange={handleTitleChange}
            placeholder="Title"
          />
        </div>
        <div>
            Author:
          <input
            value={newAuthor}
            onChange={handleAuthorChange}
            placeholder="Author"
          />
        </div>
        <div>
            url:
          <input
            value={newUrl}
            onChange={handleUrlChange}
            placeholder="URL"
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired,
  handleTitleChange: PropTypes.func.isRequired,
  handleAuthorChange: PropTypes.func.isRequired,
  handleUrlChange: PropTypes.func.isRequired,
  newTitle: PropTypes.string.isRequired,
  newAuthor: PropTypes.string.isRequired,
  newUrl: PropTypes.string.isRequired
}

export default BlogForm