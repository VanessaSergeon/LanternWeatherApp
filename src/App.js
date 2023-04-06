import { useState } from 'react';
import './App.css';

function App() {
  const [weatherDay, setWeatherDay] = useState(null)
  const [weatherHours, setWeatherHours] = useState(null)
  const [error, setError] = useState(null)
  const [location, setLocation] = useState('London')
  const [currentTab, setCurrentTab] = useState('day') // day, hour

  const getWeather = async function() {
    if (location) {
      setError(null);
      try {
        let result = await (await fetch(`http://api.weatherapi.com/v1/forecast.json?key=f88e7bde4b5e4eb4b4f163032230604&q=${location}&days=1&aqi=no&alerts=no`)).json()
        console.log(result)
        if (result.error) {
          setError(result.error.message)
        } else {
          setWeatherDay(result.forecast.forecastday[0].day)
          setWeatherHours(result.forecast.forecastday[0].hour)
        }
      } catch(error) {
        setError(error);
      }
    }
  }

  const weatherDisplay = (data) => {
    const getTime = (time) => {
      const t = new Date(time)
      return t.getUTCHours()
    }

    return (
      <div>
        {data.time ? <>{getTime(data.time)}</> : null}
        <div>{data.condition.text}</div>
        <img src={data.condition.icon} />
        <div>{data.avgtemp_f}</div>
      </div>
    )
  }

  const dayDisplay = () => {
    return weatherDisplay(weatherDay)
  }

  const hoursDisplay = () => {
    return (
      <>
        {weatherHours.map((hour) => {
          return (
            weatherDisplay(hour)
          );
        })}
      </>
    )
  }

  const tabControls = () => {
    return (
      <>
        <button disabled={currentTab==='day'} onClick={() => {setCurrentTab('day')}}>Day</button>
        <button disabled={currentTab==='hours'} onClick={() => {setCurrentTab('hours')}}>Hours</button>
      </>
    )
  }

  return (
    <div className="App">
      <p>Weather App</p>
      <div>
        <input value={location} onChange={(e) => {setLocation(e.target.value)}} placeholder="Enter a location"/>
        <button onClick={getWeather}>enter</button>
      </div>
      {error ? <div>{error}</div> : null}
      {weatherDay && weatherHours ?
        <div>
          {tabControls()}
          {currentTab === 'day' ? dayDisplay() : null}
          {currentTab === 'hours' ? hoursDisplay() : null}
        </div>
      : null}
    </div>
  );
}

export default App;

/**
 * TODO:
 * 
 * Tabs for each data type
 * Tests
 * Styles
 * Semantic HTML
 * 
 * Nice to haves:
 * toggle f/c
 * expand other weather conditions
 * Debounce on input
 */