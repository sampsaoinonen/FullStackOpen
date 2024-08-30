import { createSlice } from '@reduxjs/toolkit'
import { setNotification } from './notificationReducer'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload);
    },
    voteAnecdote(state, action) {
      const id = action.payload;
      const anecdoteToVote = state.find(anecdote => anecdote.id === id);
      if (anecdoteToVote) {
        anecdoteToVote.votes += 1;
      }
      return state.sort((a, b) => b.votes - a.votes);
    }
  },
})

export const { createAnecdote, voteAnecdote } = anecdoteSlice.actions

export const addAnecdote = (content) => {
  return (dispatch) => {
    dispatch(createAnecdote({ content, id: getId(), votes: 0 }))
    dispatch(setNotification(`You added: "${content}"`, 5))
  }
}

export const voteForAnecdote = (id) => {
  return (dispatch, getState) => {
    const anecdote = getState().anecdotes.find(anecdote => anecdote.id === id);
    dispatch(voteAnecdote(id));
    dispatch(setNotification(`You voted for: "${anecdote.content}"`, 5))
  }
}

export default anecdoteSlice.reducer