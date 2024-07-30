import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('renders title', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Pekka',
    url: 'http://example.com',
    likes: 5,
    user: {
        username: 'pertti',
        name: 'Pertti Pesonen'
    }
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText(/Component testing is done with react-testing-library/)
  expect(element).toBeDefined()
})

test('after clicking the button url, likes and user are displayed', async () => {
    const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Pekka',
    url: 'http://example.com',
    likes: 5,
    user: {
        username: 'pertti',
        name: 'Pertti Pesonen'
        }
    }
  
    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    
    expect(screen.getByText('http://example.com')).toBeDefined()
    expect(screen.getByText('likes 5')).toBeDefined()
    expect(screen.getByText('Pertti Pesonen')).toBeDefined()
})

test('clicking the button twice calls event handler twice', async () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Pekka',
        url: 'http://example.com',
        likes: 5,
        user: {
            username: 'pertti',
            name: 'Pertti Pesonen'
            }
        }
  
    const mockHandler = vi.fn()
  
    render(
      <Blog blog={blog} likeBlog={mockHandler} />
    )
  
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })