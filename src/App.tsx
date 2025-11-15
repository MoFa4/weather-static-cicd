import React, { useState, useEffect, useLayoutEffect } from 'react';
import './App.css';

interface WeatherData {
  name: string;
  main: { temp: number; feels_like: number; humidity: number; pressure: number };
  weather: Array<{ main: string; description: string; icon: string }>;
  wind: { speed: number };
  sys: { country: string };
  dt: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

function App() {
  const [input, setInput] = useState('');
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bgClass, setBgClass] = useState('bg-default-day');

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || '73f5d3b2b1b0f2b3b4b5b6b7b8b9c0d1';

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error('City not found!');
      const json: WeatherData = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
      setData(null);
    }
    setLoading(false);
  };

  const updateBackground = (data: WeatherData) => {
    const currentTime = data.dt;
    const isNight = currentTime < data.sunrise || currentTime > data.sunset;
    const dayNight = isNight ? 'night' : 'day';
    const desc = data.weather[0].description.toLowerCase();

    let bg = 'bg-default-day';

    if (desc.includes('haze') || desc.includes('mist') || desc.includes('smoke') || desc.includes('fog')) {
      bg = `bg-haze-${dayNight}`;
    } else if (desc.includes('clear')) {
      bg = `bg-clear-${dayNight}`;
    } else if (desc.includes('scattered clouds')) {
      bg = `bg-scattered-${dayNight}`;
    } else if (desc.includes('overcast clouds')) {
      bg = `bg-overcast-${dayNight}`;
    } else if (desc.includes('thunderstorm')) {
      bg = `bg-thunder-${dayNight}`;
    } else if (desc.includes('snow')) {
      bg = `bg-snow-${dayNight}`;
    } else if (desc.includes('rain') || desc.includes('drizzle')) {
      bg = `bg-rain-${dayNight}`;
    }

    setBgClass(bg);
  };

  const getISTTime = (data: WeatherData) => {
    const localTime = (data.dt + data.timezone) * 1000; // Local time in ms
    const istTime = localTime + (5.5 * 60 * 60 * 1000); // Convert to IST
    const date = new Date(istTime);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) + ' IST';
  };

  useLayoutEffect(() => {
    if (data) {
      updateBackground(data);
    }
  }, [data]);

  useEffect(() => {
    fetchWeather('Hyderabad');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) fetchWeather(input.trim());
    setInput('');
  };

  return (
    <div className={`app-container ${bgClass}`}>
      <div className="overlay">
        <header className="App-header">
          <h1>MoFa4's Weather App</h1>
          <form onSubmit={handleSearch}>
            <input type="text" placeholder="Enter city..." value={input} onChange={(e) => setInput(e.target.value)} />
            <button type="submit">Search</button>
          </form>

          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}

          {data && (
            <div className="weather-card">
              <h2>{data.name}, {data.sys.country}</h2>
              <p className="local-time">{getISTTime(data)}</p>
              <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`} alt={data.weather[0].description} className="weather-icon" />
              <p className="temp">{Math.round(data.main.temp)}°C</p>
              <p className="description">{data.weather[0].description.toUpperCase()}</p>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Feels Like</span>
                  <span>{Math.round(data.main.feels_like)}°C</span>
                </div>
                <div className="detail-item">
                  <span className="label">Humidity</span>
                  <span>{data.main.humidity}%</span>
                </div>
                <div className="detail-item">
                  <span className="label">Wind Speed</span>
                  <span>{data.wind.speed} m/s</span>
                </div>
                <div className="detail-item">
                  <span className="label">Pressure</span>
                  <span>{data.main.pressure} hPa</span>
                </div>
              </div>
            </div>
          )}
        </header>
      </div>
    </div>
  );
}

export default App;
