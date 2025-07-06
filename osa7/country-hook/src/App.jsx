import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (name && name.trim()) {
      setLoading(true)
      axios
        .get(`https://restcountries.com/v3.1/name/${encodeURIComponent(name.trim())}`)
        .then(response => {
          if (response.data && response.data.length > 0) {
            setCountry({ found: true, data: response.data[0] })
          } else {
            setCountry({ found: false, error: 'No countries found with that name' })
          }
        })
        .catch(error => {
          console.error('Error fetching country:', error)
          if (error.response && error.response.status === 404) {
            setCountry({ found: false, error: 'Country not found' })
          } else {
            setCountry({ found: false, error: 'Error fetching country data' })
          }
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setCountry(null)
      setLoading(false)
    }
  }, [name])

  return { country, loading }
}

const Country = ({ country, loading }) => {
  if (loading) {
    return <div>Loading...</div>
  }

  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        {country.error || 'not found...'}
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name.common} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population.toLocaleString()}</div> 
      <img src={country.data.flags.png} height='100' alt={`flag of ${country.data.name.common}`}/>
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const { country, loading } = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    if (nameInput.value.trim()) {
      setName(nameInput.value)
    }
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} placeholder="Enter country name..." />
        <button type="submit" disabled={loading}>find</button>
      </form>

      <Country country={country} loading={loading} />
    </div>
  )
}

export default App