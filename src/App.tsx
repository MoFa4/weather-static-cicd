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
    const main = data.weather[0].main.toLowerCase();
    const desc = data.weather[0].description.toLowerCase();

    if (main === 'haze' || desc.includes('mist') || desc.includes('smoke') || desc.includes('fog')) {
      setBgClass('bg-haze'); // Hazy desert for mist/smoke/fog/haze
    } else if (main === 'clouds') {
      setBgClass('bg-cloudy'); // Cloudy mountains for overcast/broken clouds
    } else if (main === 'clear' || desc.includes('sunny')) {
      setBgClass('bg-sunny'); // Sunny beach for clear sky
    } else if (main === 'rain' || main === 'drizzle' || main === 'thunderstorm') {
      setBgClass('bg-rain'); // Stormy rain
    } else if (main === 'snow' || temp < 5) {
      setBgClass('bg-snow'); // Snowy forest
    } else {
      setBgClass('bg-default'); // Purple fallback
    }
  };

  const updateLocalTime = (data: WeatherData) => {
    // Fix: Use dt (local Unix time) + timezone offset for city's local time
    const localUnix = data.dt + data.timezone;
    const localDate = new Date(localUnix * 1000);
    setLocalTime(localDate.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    }));
  };

  useLayoutEffect(() => {
    if (data) {
      updateBackground(data);
      updateLocalTime(data);
    }
  }, [data]);

  useEffect(() => {
    fetchWeather('Hyderabad'); // Default Hyderabad for IST test
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
}

export default App;
