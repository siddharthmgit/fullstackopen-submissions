const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course} />
      <Content parts={course} />
      <Total exercises={course} />
    </div>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.part} {props.exercises}
    </p>
  )
}
const Header = (props) => {
  return (
    <div>
      <h1>{props.course.name}</h1>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
      <strong> The respective part and the number of exercises are: </strong>
      <Part part={props.parts.parts[0].name} exercises={props.parts.parts[0].exercises} />
      <Part part={props.parts.parts[1].name} exercises={props.parts.parts[1].exercises} />
      <Part part={props.parts.parts[2].name} exercises={props.parts.parts[2].exercises} />
    </div>
  )
}

const Total = (props) => {
  return (
    <p>
      Total Number of exercises are {props.exercises.parts[0].exercises + props.exercises.parts[1].exercises + props.exercises.parts[2].exercises}
    </p>
  )
}
export default App
