import React, { useState, useEffect } from 'react';
import './App.css';

interface WeatherData {
  name: string;
  main: { temp: number; feels_like: number; humidity: number };
  weather: Array<{ description: string; icon: string }>;
  wind: { speed: number };
  sys: { country: string };
}

const App: React.FC = () => {
  const [city, setCity] = useState('');
  const [input, setInput] = useState('');
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  useEffect(() => {
    fetchWeather('Sydney'); // Default Sydney load
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
            placeholder="Search city (Delhi, Sydney, Kobe...)"
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
            <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`} alt="weather icon" />
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
};

export default App;
