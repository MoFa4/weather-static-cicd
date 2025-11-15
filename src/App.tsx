import React, { useState, useEffect } from 'react';
import './App.css';

interface WeatherData {
  name: string;
  main: { temp: number; feels_like: number; humidity: number; pressure: number };
  weather: Array<{ description: string; icon: string }>;
  wind: { speed: number };
  sys: { country: string };
}

function App() {
  const [input, setInput] = useState('');
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = '6163fd229f66072ab7704cdf9dcd397f';

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error('City not found');
      const json: WeatherData = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
      setData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather('Hyderabad');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) fetchWeather(input.trim());
    setInput('');
  };

  return (
    <div className="app-container">
      <div className="overlay">
        <header className="App-header">
          <h1>MoFa4's Weather App</h1>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter city..."
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
                <p>Wind: {data.wind.speed} m/s</p>
                <p>Pressure: {data.main.pressure} hPa</p>
              </div>
            </div>
          )}
        </header>
      </div>
    </div>
  );
}

export default App;
