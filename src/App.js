import { useState } from 'react';
import './App.css';

function App() {
  const [weatherDay, setWeatherDay] = useState(null)
  const [weatherHours, setWeatherHours] = useState(null)
  const [error, setError] = useState(null)
  const [location, setLocation] = useState('London')
  const [currentTab, setCurrentTab] = useState('day') // day, hours

  const getWeather = async function() {
    if (location) {
      setError(null);
      try {
        let result = await (await fetch(`https://api.weatherapi.com/v1/forecast.json?key=f88e7bde4b5e4eb4b4f163032230604&q=${location}&days=1&aqi=no&alerts=no`)).json()
        console.log(result)
        if (result.error) {
          setError(result.error.message)
          setWeatherDay(null)
          setWeatherHours(null)
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
      <div className="p-6 max-w-sm bg-white rounded-xl shadow-lg flex items-center py-1 my-2">
        <img src={data.condition.icon} />
        <div className='ml-6'>
          {data.time ? <>{getTime(data.time)}</> : null}
          <div>{data.condition.text}</div>
          <div>Temp. {data.temp_f || data.avgtemp_f}F</div>
        </div>
      </div>
    )
  }

  const dayTab = () => {
    return weatherDisplay(weatherDay)
  }

  const hoursTab = () => {
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
    let buttonStyles = (tab) => {
      return `${tab !== currentTab ? 'bg-blue-300 p-2 rounded-sm mr-4' : 'bg-gray-200 p-2 rounded-sm mr-4'}`
    }

    return (
      <div className='justify-around'>
        <button className={buttonStyles('day')} disabled={currentTab==='day'} onClick={() => {setCurrentTab('day')}}>Day</button>
        <button className={buttonStyles('hours')} disabled={currentTab==='hours'} onClick={() => {setCurrentTab('hours')}}>Hours</button>
      </div>
    )
  }

  const locationInput = () => {
    return (
      <div className="flex flex-row items-center my-2">
        <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
          Location
        </label>
        <input
            type="text"
            name="location"
            id="location"
            className="block max-w-md rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={location} onChange={(e) => {setLocation(e.target.value)}} placeholder="Enter a location"
          />
        <button className='bg-green-100 p-2 rounded-sm' onClick={getWeather}>Enter</button>
      </div>
    )
  }

  return (
    <div className="flex flex-col max-w-md m-auto">
      <p className="text-3xl font-bold underline my-2">Lantern Weather App</p>
      {locationInput()}
      {error ? <div>{error}</div> : null}
      {weatherDay && weatherHours ?
        <div>
          {tabControls()}
          {currentTab === 'day' ? dayTab() : null}
          {currentTab === 'hours' ? hoursTab() : null}
        </div>
      : null}
    </div>
  );
}

export default App;

/**
 * TODO:
 * Tests
 * 
 * Next steps:
 * toggle f/c
 * expand other weather conditions
 * Debounce on input
 * Semantic HTML
 */