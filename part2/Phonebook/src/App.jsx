import { useState, useEffect } from 'react'
import axios from 'axios'
import phonebookService from './services/phonebook'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const windowButton = document.querySelector("#windowButton");

  useEffect(() => {
    phonebookService
      .getAll()
      .then(personData => setPersons(personData))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const newPerson = {
      name: newName,
      number: newNumber,
    }
    const personExists = persons.some(
      (person) => person.name.toLowerCase() === newPerson.name.toLowerCase()
        && person.number === newPerson.number)

    if (personExists) {
      alert(`entry is already added to phonebook`)
      return
    }

    const nameExists = persons.some(
      (person) => person.name.toLowerCase() === newPerson.name.toLowerCase()
        && person.number !== newPerson.number)

    if (nameExists) {
      if (window.confirm(`${newName} is already added to phonebook,
            replace the old number with new one?`)) {
        const id = persons.find(person =>
          person.name.toLowerCase() === newPerson.name.toLowerCase()).id
        console.log(`matched person id is ${id}`)
        phonebookService
          .update(id, newPerson)
          .then(updatedPerson => {
            setPersons(persons.map(p => p.id === updatedPerson.id ? updatedPerson : p))
            setNewName("")
            setNewNumber("")
          })
        return
      }
      else
        return
    }
    phonebookService
      .create(newPerson)
      .then(createdPerson => {
        setPersons(persons.concat(createdPerson))
        setNewName("")
        setNewNumber("")
      })
  }

  const handleInputChange = (event) => {
    if (event.target.name == 'name')
      setNewName(event.target.value)
    else if (event.target.name == 'number')
      setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const delPerson = ({ id, name }) => {
    if (window.confirm(`Do you want to delete ${name}?`)) {
      console.log(`deleting id ${id} entry`)
      phonebookService
        .remove(id)
        .then(() => { setPersons(persons.filter(p => p.id !== id)) })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with<input value={searchTerm} onChange={handleSearch} />
      </div>
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input name='name' value={newName} onChange={handleInputChange} />
        </div>
        <div>
          number: <input name='number' value={newNumber} onChange={handleInputChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personsToShow.map((person) =>
        <div key={person.id}>{person.name} {person.number}
          <button type='button' id='windowButton' onClick={() => delPerson(person)}>delete</button>
        </div>)}

    </div>
  )
}

export default App