import React, { useState, useEffect } from 'react';
import './App.css';

const App: React.FC = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || '73f5d3b2b1b0f2b3b4b5b6b7b8b9c0d1';

  const updateBackground = (data: any) => {
    console.log('BG UPDATE TRIGGERED', data); // DEBUG - CHECK CONSOLE
    const temp = data.main.temp;
    const desc = data.weather[0].description.toLowerCase();
    let bg = '';

    if (temp > 30 || desc.includes('hot') || desc.includes('clear') || desc.includes('haze') || desc.includes('smoke')) {
      bg = 'ur[](https://images.unsplash.com/photo-1542382157939-5c5d2d5b5c5f?auto=format&fit=crop&q=80)'; // Delhi hot haze
    } else if (temp > 20) {
      bg = 'ur[](https://images.unsplash.com/photo-1497436072909-60f6e0d4e6a3?auto=format&fit=crop&q=80)'; // Sydney sunny
    } else if (temp < 10 || desc.includes('snow')) {
      bg = 'ur[](https://images.unsplash.com/photo-1477603566046-945b3c7b3d6c?auto=format&fit=crop&q=80)'; // Cold
    } else if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('storm')) {
      bg = 'ur[](https://images.unsplash.com/photo-1534086721723-4d4d5c3a36a6?auto=format&fit=crop&q=80)'; // Rain
    } else {
      bg = 'ur[](https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80)'; // Default
    }

    document.body.style.backgroundImage = bg;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
  };

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
      const data = await res.json();
      if (data.cod === 200) {
        setWeather(data);
        updateBackground(data);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather('Sydney'); // Default load
  }, []);

  return (
    <div className="App">
      <h1>MoFa4 Weather App 🌤️</h1>
      <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
      <button onClick={() => fetchWeather(city)}>Search</button>
      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <p>{Math.round(weather.main.temp)}°C : {weather.weather[0].description}</p>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
        </div>
      )}
    </div>
  );
};

export default App;
