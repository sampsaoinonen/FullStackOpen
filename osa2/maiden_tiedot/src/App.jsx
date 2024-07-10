import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'


const App = () => {
  const [newFilter, setNewFilter] = useState('')
  const [countryList, setCountryList] = useState([])

  const handleFilterChange = (event) => setNewFilter(event.target.value)
  
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountryList(response.data)
      })
      .catch((error) => {
        console.error('Error fetching country data:', error);
      })
    }, [])

  const countriesToShow = countryList.filter((c) =>
    c.name.common.toLowerCase().includes(newFilter.toLowerCase())
  )

  return (
    <div>
      <form>
        find countries
        <input value={newFilter} onChange={handleFilterChange}/>

      </form>
      <Countries countriesToShow={countriesToShow} handleFilterChange={handleFilterChange}/>
    </div>
  )
}

export default App
