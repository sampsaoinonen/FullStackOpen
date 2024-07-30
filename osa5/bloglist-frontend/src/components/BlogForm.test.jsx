import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'


test('calls the addBlog function with the right details when a new blog is created', async () => {
  const addBlog = vi.fn()
  const user  = userEvent.setup()
  const handleTitleChange = vi.fn()
  const handleAuthorChange = vi.fn()
  const handleUrlChange = vi.fn()

  const newTitle = 'Uusi blogi'
  const newAuthor = 'Tekijä'
  const newUrl = 'http://blogiurl.com'

  render(
    <BlogForm
      addBlog={addBlog}
      handleTitleChange={handleTitleChange}
      handleAuthorChange={handleAuthorChange}
      handleUrlChange={handleUrlChange}
      newTitle={newTitle}
      newAuthor={newAuthor}
      newUrl={newUrl}
    />
  )

  const titleInput = screen.getByPlaceholderText('Title')
  const authorInput = screen.getByPlaceholderText('Author')
  const urlInput = screen.getByPlaceholderText('URL')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'Uusi blogi')
  await user.type(authorInput, 'Tekijä')
  await user.type(urlInput, 'http://blogiurl.com')
  await user.click(createButton)

  screen.debug()

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].target).toEqual('Uusi blogi')
})