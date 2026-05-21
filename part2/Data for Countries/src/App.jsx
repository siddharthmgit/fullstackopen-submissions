import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [weather, setWeather] = useState({})
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setAllCountries(response.data)
      })
  }, [])

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCountries([])
      return
    }
    const filteredCountries = allCountries.filter(c =>
      c.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCountries(filteredCountries)
  }, [searchTerm, allCountries])

  useEffect(() => {
    if (filteredCountries.length !== 1) return
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${filteredCountries[0].capital}&appid=${apiKey}&units=metric`)
      .then(response => {
        const weatherObj = {
          id: response.data.weather[0].id,
          temperature: response.data.main.temp,
          iconCode: response.data.weather[0].icon,
          description: response.data.weather[0].description,
          windSpeed: response.data.wind.speed
        }
        setWeather(weatherObj)
      })
  }, [filteredCountries])

  const Button = ({ countryName }) => {
    return (
      <button onClick={() => {
        const selectedCountry = filteredCountries.filter(c => c.name.common == countryName)
        setFilteredCountries(selectedCountry)
      }}>Show</button>)
  }
  return (
    <div>
      find countries
      <input name='find countries' value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} />
      <div>
        {filteredCountries.length > 10 ? (
          <div>Too many matches, specify another filter</div>
        ) : (
          filteredCountries.length == 1 ? (
            <pre style={{ fontFamily: "Times New Roman, serif" }}>
              <h1>{filteredCountries[0].name.common}</h1>

              Capital: {filteredCountries[0].capital}<br />
              Area: {filteredCountries[0].area} sq.km

              <h2>Languages</h2>

              <ul>
                {Object.values(filteredCountries[0].languages).map(lang => (
                  <li key={lang}>{lang}</li>
                ))}
              </ul>

              <img
                src={filteredCountries[0].flags.png}
                alt={filteredCountries[0].flags.alt}
                width="200"
              />

              <h2>Weather in {filteredCountries[0].capital}</h2>

              Temperature: {weather.temperature} Celsius<br />

              <img
                src={`https://openweathermap.org/payload/api/media/file/${weather.iconCode}.png`}
                alt={weather.description}
              /><br />

              Wind: {weather.windSpeed}m/s
            </pre>
          )
            : (filteredCountries.map(country => (
              <span key={country.cca3}>
                {country.name.common} <Button countryName={country.name.common} /><br />
              </span>
            ))
            )
        )}
      </div>
    </div >
  )
}
export default App
