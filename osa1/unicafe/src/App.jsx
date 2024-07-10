import { useState } from 'react'

const StatisticLine = ({ text, value, symbol }) => (
  <tr>
    <td>
      {text}
    </td>
    <td>
      {value} {symbol}
    </td>    
  </tr>
)

const Statistics = ({ good, neutral, bad }) => {
  let all = good+neutral+bad

  if (all === 0) {
    return (
      <>
      No feedback given
      </>
    )
  }
  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good}/>
        <StatisticLine text="neutral" value={neutral}/>
        <StatisticLine text="bad" value={bad}/>
        <StatisticLine text="all" value={all}/>
        <StatisticLine text="average" value={(good-bad)/all}/>
        <StatisticLine text="positive" value={good/all*100} symbol="%"/>
      </tbody>
    </table>   
  )
}

const Button = ({ handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)  

  const handleGoodClick = () => setGood(good + 1)
  const handleNeutralClick = () => setNeutral(neutral + 1) 
  const handleBadClick = () => setBad(bad + 1)  

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodClick} text="good"/>            
      <Button handleClick={handleNeutralClick} text="neutral"/>
      <Button handleClick={handleBadClick} text="bad"/>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>      
    </div>
  )
}

export default App
