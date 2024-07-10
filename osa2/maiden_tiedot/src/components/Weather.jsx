const Weather = ({ weather }) => {
  if (weather < 1) {      
    return (
      <>
      no weather info available
      </>
    )   
  }

  return (
    <ul>
    <li>temperature {weather.main.temp} Celsius</li>          
    <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/>    
    <li>wind {weather.wind.speed} m/s</li>
    </ul>    
  )
  }

export default Weather