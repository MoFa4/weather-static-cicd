  const updateBackground = (data: any) => {
    console.log('BACKGROUND TRIGGERED FOR:', data.name, data.weather[0].description, data.main.temp); // DEBUG - OPEN F12 CONSOLE
    const temp = data.main.temp;
    const desc = data.weather[0].description.toLowerCase();
    let bgUrl = '';

    // HOT INDIA (Delhi/Tiruvallur haze/smoke/dust >28°C)
    if (temp > 28 || desc.includes('haze') || desc.includes('smoke') || desc.includes('dust') || desc.includes('mist')) {
      bgUrl = 'https://images.unsplash.com/photo-1473496169904-0c0d75e7153e?auto=format&fit=crop&q=80'; // Dusty Delhi desert vibe 🏜️🇮🇳
    }
    // CLEAR / WARM (Sydney/Australia sunny)
    else if (temp > 20 || desc.includes('clear') || desc.includes('few clouds')) {
      bgUrl = 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80'; // Sunny beach Sydney 🏖️🇦🇺
    }
    // COLD / SNOW
    else if (temp < 10 || desc.includes('snow')) {
      bgUrl = 'https://images.unsplash.com/photo-1477603566046-945b3c7b3d6c?auto=format&fit=crop&q=80'; // Snowy ❄️
    }
    // RAIN / STORM / DRIZZLE
    else if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('thunder') || desc.includes('storm')) {
      bgUrl = 'https://images.unsplash.com/photo-1534086721723-4d4d5c3a36a6?auto=format&fit=crop&q=80'; // Stormy rain 🌧️
    }
    // CLOUDY DEFAULT
    else {
      bgUrl = 'https://images.unsplash.com/photo-1492011221367-f47e3ccd77a0?auto=format&fit=crop&q=80'; // Cloudy sky ☁️
    }

    document.body.style.backgroundImage = `url(${bgUrl})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.transition = 'all 1.5s ease';
  };
