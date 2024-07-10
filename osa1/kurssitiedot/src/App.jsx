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
  console.log(course)
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const Header = ({name}) => <h1>{name}</h1>

const Content = ({parts}) => {
  
  return (
    <>    
    {parts.map(part => <Part key={part.name} part={part.name} excercises={part.exercises}/>)}
    </>
  ) 
}

const Part = ({part, excercises}) => <p>{part} {excercises}</p>

const Total = ({parts}) => {  
  let summa = 0  
  parts.forEach(part => (summa += part.exercises))
  
  return (
    <>
    <p>Number of exercises {summa}</p>    
    </>
  ) 
}

export default App