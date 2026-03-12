# 🌤️ MoFa WeatherBoss

A clean, fast, and modern **weather dashboard** that shows current weather conditions for any city worldwide. Built with a focus on simplicity, performance, and automated deployment.

**Live Demo**: [https://weather-static-cicd.vercel.app/](https://weather-static-cicd.vercel.app/)

![Weather App Screenshot](https://via.placeholder.com/800x450/0ea5e9/ffffff?text=WeatherBoss+Screenshot)  
*(Replace this placeholder with a real screenshot after uploading one to the repo — e.g. screenshots/home.png)*

## ✨ Features

- Real-time current weather data for any city
- Displays: temperature (°C), weather condition, humidity, wind speed, feels-like temperature
- Clean card-based UI with weather icons
- Responsive design — works great on mobile & desktop
- Instant search with Enter key or button click
- Error handling for invalid cities or API issues
- Static site generation + automatic CI/CD deployment

## 🛠 Tech Stack

| Layer              | Technology              | Purpose                                      |
|---------------------|-------------------------|----------------------------------------------|
| Frontend           | React / Next.js         | UI framework & static site generation        |
| Styling            | Tailwind CSS            | Utility-first, responsive styling            |
| Weather Data       | OpenWeatherMap API      | Real-time weather information                |
| Deployment         | Vercel                  | Zero-config hosting, automatic previews      |
| CI/CD              | GitHub + Vercel         | Auto-build & deploy on every push            |
| Icons              | Likely Lucide / Heroicons | Clean SVG weather & UI icons                 |

## 🚀 How It Works (CI/CD Flow)

1. Code push / pull request to `main`  
2. Vercel automatically detects Next.js project  
3. Builds static site (SSG) + runs any API routes  
4. Deploys to production URL  
→ Zero manual steps — changes go live in seconds

## 🏗 Local Development

```bash
# Clone the repo
git clone https://github.com/MoFa4/weather-static-cicd.git
cd weather-static-cicd

# Install dependencies
npm install

# Run development server
npm run dev
