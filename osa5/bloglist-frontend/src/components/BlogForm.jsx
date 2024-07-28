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
        </div>
)
}

export default BlogForm