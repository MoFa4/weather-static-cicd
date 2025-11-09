import React, { useState, useEffect } from 'react';
import './App.css';

interface WeatherData {
  name: string;
  main: { temp: number; feels_like: number; humidity: number; pressure: number };
  weather: Array<{ main: string; description: string; icon: string }>;
  wind: { speed: number };
  sys: { country: string };
}

function App() {
  const [city, setCity] = useState('Mumbai');
  const [input, setInput] = useState('');
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  const fetchWeather = async (cityName: string) => {
    if (!API_KEY) {
      setError('API Key missing! Add to .env');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error('City not found or API limit reached!');
      const json: WeatherData = await res.json();
      setData(json);
      setCity(cityName);
      setInput('');
    } catch (err: any) {
      setError(err.message);
      setData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather('Mumbai');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) fetchWeather(input.trim());
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🌤️ MoFa's Weather Dashboard</h1>
        <p className="tagline">Your Long day Starts with Perfect Weather forecast☀️</p>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search any city (e.g., Delhi, Tokyo, New York)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">⚡ Get Weather</button>
        </form>

        {loading && <p className="loading">Fetching weather...</p>}
        {error && <p className="error">{error}</p>}

        {data && (
          <div className="weather-card">
            <h2>{data.name}, {data.sys.country}</h2>
            <img
              src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
              alt={data.weather[0].description}
              className="weather-icon"
            />
            <p className="temp">{Math.round(data.main.temp)}°C</p>
            <p className="description">{data.weather[0].description.toUpperCase()}</p>
            <div className="details">
              <p>Feels Like: {Math.round(data.main.feels_like)}°C</p>
              <p>Humidity: {data.main.humidity}%</p>
              <p>Pressure: {data.main.pressure} hPa</p>
              <p>Wind Speed: {data.wind.speed} m/s</p>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
