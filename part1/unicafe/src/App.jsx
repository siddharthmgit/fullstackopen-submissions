import { useState } from 'react'

const handleGood = (good, setGood) => {
  setGood(good + 1)
  console.log('good is pressed', good + 1, 'times')
}

const handleNeutral = (neutral, setNeutral) => {
  setNeutral(neutral + 1)
  console.log('neutral is pressed', neutral + 1, 'times')
}

const handleBad = (bad, setBad) => {
  setBad(bad + 1)
  console.log('bad is pressed', bad + 1, 'times')
}

const Button = (props) => <button onClick={props.onClick}>{props.text}</button>

const StatisticLine = ({ text, value, children }) => (
  <tr>
    <td>{text}</td>
    <td>{value} {children}</td>
  </tr>
)

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad
  const average = total === 0 ? 0 : (good - bad) / total
  const positive = total === 0 ? 0 : (good / total) * 100

  if (total === 0) {
    return <p>No feedback given</p>
  }

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="total" value={total} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={positive}>%</StatisticLine>
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => handleGood(good, setGood)} text='good' />
      <Button onClick={() => handleNeutral(neutral, setNeutral)} text='neutral' />
      <Button onClick={() => handleBad(bad, setBad)} text='bad' />

      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />

    </div>
  )
}

export default App