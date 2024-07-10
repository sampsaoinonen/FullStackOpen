import DetailedCountry from './DetailedCountry'

const Countries = ({countriesToShow, handleFilterChange}) => {
  
  if (countriesToShow.length === 1) {
    return (
      <DetailedCountry country={countriesToShow[0]} />
    )
  }

  if (countriesToShow.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  }
  else {
    return (
      <ul>
        {countriesToShow.map((c) => (
          <li key={c.cca2}>{c.name.common} <button onClick={handleFilterChange} value={c.name.common}>show</button></li>
          ))}
      </ul>
      )
}}

export default Countries