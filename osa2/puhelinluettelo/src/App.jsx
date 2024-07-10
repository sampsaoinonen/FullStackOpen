import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const Filter = ({newFilter, handleFilterChange}) => (
  <div>
    filter shown with
    <input
      value={newFilter}
      onChange={handleFilterChange}          
    />
  </div>
)

const PersonForm = ({addPerson, newName, handleNameChange, newNumber, handleNumberChange}) => (
  <form onSubmit={addPerson}>
    <div>
      name: 
      <input 
        value={newName}
        onChange={handleNameChange}
        />
    </div>
    <div>
      number: 
      <input
        value={newNumber}
        onChange={handleNumberChange}      
      /></div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({persons, newFilter, deletePerson}) => (
  <ul>
    {persons
    .filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
    .map(person => 
      <li key={person.name}> 
        {person.name} {person.number} 
        <button onClick={() => deletePerson(person)}>delete</button>
      </li>
    )}
  </ul>
)

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [color, setColor] = useState ('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))          
  }, [])

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name : newName,
      number : newNumber,
    }
    if (persons.map(person => person.name).includes(newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personUpdateId = persons.find(person => person.name === personObject.name).id
        
        personService
          .update(personUpdateId, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== personUpdateId ? person : returnedPerson))
            setColor('green')
            setMessage(`Updated ${personObject.name}`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setColor('red')
            setMessage(`Information of ${personObject.name} has already been removed from the server`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            setPersons(persons.filter(p => p.name !== personObject.name))
          })        
      
    }}
                
    else {      
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))          
          setColor('green')         
          setMessage(`Added ${personObject.name}`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          setNewName('')
          setNewNumber('')
        })
    }
      
  }

  const deletePerson = person => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
      .erase(person.id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== person.id))
        setColor('green')
        setMessage(`Deleted ${person.name}`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
    })
  }}

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} clr={color}/>
      <Filter handleFilterChange={handleFilterChange} newFilter={newFilter}/>
      
      <h2>add a new</h2>
      
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange}
       newNumber={newNumber} handleNumberChange={handleNumberChange}/>

      <h2>Numbers</h2>

      <Persons persons={persons} newFilter={newFilter} deletePerson={deletePerson}/>
           
    </div>
  )

}

export default App