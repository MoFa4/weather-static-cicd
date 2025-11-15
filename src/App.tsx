import React, { useState, useEffect } from 'react';
import './App.css';

interface WeatherData {
  name: string;
  main: { temp: number; feels_like: number; humidity: number; pressure: number };
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
      updateBackground(json); // TRIGGER BG CHANGE ON SEARCH SUCCESS
    } catch (err: any) {
      setError(err.message);
      setData(null);
    }
    setLoading(false);
  };

 const updateBackground = (data: WeatherData) => {
    const temp = data.main.temp;
    const desc = data.weather[0].description.toLowerCase();
    const timestamp = Date.now(); // CACHE BUSTER

    let bgUrl = 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80'; // default

    if (temp > 28 || desc.includes('haze') || desc.includes('smoke') || desc.includes('dust')) {
      bgUrl = `https://images.unsplash.com/photo-1473496169904-0c0d75e7153e?auto=format&fit=crop&q=80&v=${timestamp}`; // Delhi haze
    } else if (temp > 20 || desc.includes('clear') || desc.includes('few clouds')) {
      bgUrl = `https://images.unsplash.com/photo-1497436072909-60f6e0d4e6a3?auto=format&fit=crop&q=80&v=${timestamp}`; // Sydney sunny
    } else if (temp < 10 || desc.includes('snow')) {
      bgUrl = `https://images.unsplash.com/photo-1477603566046-945b3c7b3d6c?auto=format&fit=crop&q=80&v=${timestamp}`; // snow
    } else if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('storm')) {
      bgUrl = `https://images.unsplash.com/photo-1534086721723-4d4d5c3a36a6?auto=format&fit=crop&q=80&v=${timestamp}`; // rain
    } else {
      bgUrl = `https://images.unsplash.com/photo-1492011221367-f47e3ccd77a0?auto=format&fit=crop&q=80&v=${timestamp}`; // cloudy
    }

    // FORCE DOM UPDATE
    document.body.style.cssText = `
      background: url(${bgUrl}) center/cover no-repeat fixed;
      transition: background 1.5s ease-in-out;
    `;
  };

 useLayoutEffect(() => {
    if (data) updateBackground(data);
  }, [data]);
  
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
            <p>Pressure: {data.main.pressure} hPa</p>
          </div>
        )}
      </header>
    </div>
  );
};

export default App;
