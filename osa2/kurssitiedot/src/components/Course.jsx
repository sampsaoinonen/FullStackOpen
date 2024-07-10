const Course = ({course}) => {
    console.log(course)
    return (
      <div>      
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )  
  }
  
const Header = ({name}) => <h2>{name}</h2>
  
const Content = ({parts}) => {    
    return (
      <>    
      {parts.map(part => <Part key={part.name} part={part.name} excercises={part.exercises}/>)}
      </>
    ) 
  }
  
const Part = ({part, excercises}) => <p>{part} {excercises}</p>
  
const Total = ({parts}) => {  
    const summa1 = parts.reduce((s, p) => {
      console.log('what is happening', s, p)
      return s + p.exercises}, 0)
    
    return (
      <>
      <p>total of {summa1} exercises</p>    
      </>
    ) 
  }

export default Course