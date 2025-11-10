import React, { useState, useEffect } from 'react';
import './App.css';

interface WeatherData {
  name: string;
  main: { temp: number; feels_like: number; humidity: number };
  weather: Array<{ main: string; description: string; icon: string }>;
  wind: { speed: number };
  sys: { country: string };
}

function	App() {
  const [city, setCity] = useState('Sydney');
  const [input, setInput] = useState('');
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

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
      setCity(cityName);
      updateBackground(json);
    } catch (err: any) {
      setError(err.message);
      setData(null);
    }
    setLoading(false);
  };

  const updateBackground = (data: WeatherData) => {
    const temp = data.main.temp;
    const desc = data.weather[0].description.toLowerCase();
    let bgUrl = '';

    if (temp > 35 || desc.includes('hot')) {
      bgUrl = 'https://images.unsplash.com/photo-1542382157939-5c5d2d5b5c5f?ixlib=rb-4.0.3&auto=format&fit=crop&q=80'; // Extreme hot
    } else if (temp > 28 || desc.includes('clear') || desc.includes('haze') || desc.includes('smoke') || desc.includes('dust')) {
      bgUrl = 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&q=80'; // Hot/haze Delhi style
    } else if (temp > 20) {
      bgUrl = 'https://images.unsplash.com/photo-1497436072909-60f6e0d4e6a3?ixlib=rb-4.0.3&auto=format&fit=crop&q=80'; // Warm sunny Sydney
    } else if (temp < 10 || desc.includes('snow')) {
      bgUrl = 'https://images.unsplash.com/photo-1477603566046-945b3c7b3d6c?ixlib=rb-4.0.3&auto=format&fit=crop&q=80'; // Cold snow
    } else if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('thunder') || desc.includes('storm')) {
      bgUrl = 'https://images.unsplash.com/photo-1534086721723-4d4d5c3a36a6?ixlib=rb-4.0.3&auto=format&fit=crop&q=80'; // Rain storm
    } else if (desc.includes('cloud')) {
      bgUrl = 'https://images.unsplash.com/photo-1492011221367-f47e3ccd77a0?ixlib=rb-4.0.3&auto=format&fit=crop&q=80'; // Cloudy
    } else {
      bgUrl = 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&q=80'; // Default
    }

    document.body.style.backgroundImage = `url(${bgUrl})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.transition = 'background 1.5s ease';
  };

  useEffect(() => {
    fetchWeather('Sydney');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) fetchWeather(input.trim());
    setInput('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🌤️ MoFa4's Global Weather</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search city (Delhi, Sydney, Tokyo...)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {data && (
          <div className="weather-card">
            <h2>{data.name}, {data.sys.country}</h2>
            <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`} alt="icon" />
            <p className="temp">{Math.round(data.main.temp)}°C</p>
            <p>{data.weather[0].description.toUpperCase()}</p>
            <p>Feels: {Math.round(data.main.feels_like)}°C</p>
            <p>Humidity: {data.main.humidity}%</p>
            <p>Wind: {data.wind.speed} m/s</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
