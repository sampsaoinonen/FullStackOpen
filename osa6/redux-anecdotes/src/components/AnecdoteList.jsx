import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
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
    const anecdotes = useSelector(state => state)

    return(
        <>
        <h2>Anecdotes</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {anecdotes.map(anecdote =>
                    <Anecdote
                    key={anecdote.id}
                    anecdote={anecdote}
                    handleClick={() => 
                        dispatch(voteAnecdote(anecdote.id))
                      }
                    />                                        
                )}
            </ul>
        </>
    )
}

export default AnecdoteList