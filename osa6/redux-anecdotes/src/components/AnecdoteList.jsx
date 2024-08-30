import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { handleNotification } from '../reducers/notificationReducer';
import PropTypes from 'prop-types'


const Anecdote = ({ anecdote, handleClick }) => {
    return(
      <li>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </li>
    )
  }

  Anecdote.propTypes = {
    anecdote: PropTypes.object.isRequired,
    handleClick: PropTypes.func.isRequired
  }

const AnecdoteList = () => {
    const dispatch = useDispatch()    
    const anecdotes = useSelector(state => {
      console.log("state.filter", state.filter)
      if (state.filter === 'ALL') return state.anecdotes
      
      return state.anecdotes.filter(a => a.content.toLowerCase().includes(state.filter.toLowerCase()))
    })

    const handleVote = (anecdote) => {
      dispatch(voteAnecdote(anecdote.id))
      dispatch(handleNotification(`You voted for: "${anecdote.content}"`, 5))
    }

    return(
        <>
        <h2>Anecdotes</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {anecdotes.map(anecdote =>
                    <Anecdote
                    key={anecdote.id}
                    anecdote={anecdote}
                    handleClick={() => handleVote(anecdote)}                        
                    />                                        
                )}
            </ul>
        </>
    )
}

export default AnecdoteList