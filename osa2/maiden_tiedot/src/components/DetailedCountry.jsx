import { useState, useEffect } from 'react'
import axios from 'axios'
import Weather from './Weather'

const DetailedCountry = ({country}) => {
  const [weather, setWeather] = useState([])

  const api_key = import.meta.env.VITE_SOME_KEY
  const lat = country.capitalInfo.latlng[0]
  const lon = country.capitalInfo.latlng[1]  

  useEffect(() => {
    console.log('weather')
    axios              
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
      .then(response => {        
        setWeather(response.data)
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      })
  }, []) 

    return (
    <>
      <h2>{country.name.common}</h2>
      <ul>
        <li> Capital: {country.capital} </li>
        <li> Area: {country.area} </li>
      </ul>

      <h3>languages</h3>
      <ul>
        {Object.values(country.languages).map((lang) => (
          <li key={lang}> {lang} </li>
        ))}
      </ul>
        
      <img src={country.flags.png} alt="flag"></img>
        
      <h3>Weather in {country.capital}</h3>
      <Weather weather={weather} />
    </>
  )}

  export default DetailedCountry
