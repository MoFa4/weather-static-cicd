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
}

function App() {
  const [input, setInput] = useState('');
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bgClass, setBgClass] = useState('bg-default');
  const [localTime, setLocalTime] = useState('');

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
    const temp = data.main.temp;
    const desc = data.weather[0].main.toLowerCase(); // Use 'main' for broader conditions

    if (temp > 30 || desc === 'haze' || desc === 'smoke') {
      setBgClass('bg-hot'); // Hazy hot desert
    } else if (temp > 20 || desc === 'clear') {
      setBgClass('bg-sunny'); // Sunny landscape
    } else if (desc === 'clouds') {
      setBgClass('bg-cloudy'); // Cloudy mountains
    } else if (desc === 'rain' || desc === 'drizzle' || desc === 'thunderstorm') {
      setBgClass('bg-rain'); // Rainy landscape
    } else if (temp < 10 || desc === 'snow') {
      setBgClass('bg-snow'); // Snowy forest
    } else {
      setBgClass('bg-default'); // Purple gradient fallback
    }
  };

  const updateLocalTime = (data: WeatherData) => {
    const utcTime = data.dt * 1000; // Unix to ms
    const offset = data.timezone * 1000; // Offset to ms
    const localDate = new Date(utcTime + offset);
    setLocalTime(localDate.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' }));
  };

  useLayoutEffect(() => {
    if (data) {
      updateBackground(data);
      updateLocalTime(data);
    }
  }, [data]);

  useEffect(() => {
    fetchWeather('Sydney');
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
          <h1>🌤️ MoFa4's Weather App</h1>
          <form onSubmit={handleSearch}>
            <input type="text" placeholder="Enter city..." value={input} onChange={(e) => setInput(e.target.value)} />
            <button type="submit">Search</button>
          </form>

          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}

          {data && (
            <div className="weather-card">
              <h2>{data.name}, {data.sys.country}</h2>
              <p className="local-time">{localTime}</p>
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
};

export default App;
