# 🌤️ SkyPanel — Weather Dashboard

SkyPanel is a modern, responsive weather dashboard built with React and Vite. It allows users to search for cities, explore current weather conditions, view upcoming forecasts, and interact with weather data through charts and dynamic visual effects.

---

## 📌 Overview

The application allows users to:

- Search for cities and view current weather conditions
- Explore the upcoming 24-hour weather forecast at three-hour intervals
- Visualize forecast data through interactive charts
- View sunrise and sunset times for the selected location
- Display local time based on the selected city's timezone
- Experience animated weather backgrounds and an interactive 3D Earth introduction

---

## 📌 Features

- 🔍 **City Weather Search** — Search for a city to retrieve its weather information
- 🌡️ **Current Weather Information** — View current temperature and available weather details
- 🕒 **24-Hour Forecast** — Explore upcoming weather conditions at three-hour intervals
- 📊 **Interactive Forecast Charts** — Visualize weather data using Recharts
- 🌅 **Sunrise and Sunset Information** — Display sunrise and sunset times
- 🕰️ **Timezone-Aware Local Time** — Display time information for the selected location
- 🌍 **Interactive 3D Earth Intro** — Create an engaging introduction with Earth-inspired visuals
- 🌦️ **Dynamic Weather Effects** — Weather-inspired backgrounds and animations
- 📱 **Responsive UI** — Glassmorphism-inspired interface designed for different screen sizes

---

## 🛠️ Tech Stack

### Frontend

- React 19
- JavaScript (ES6+)
- CSS3
- Recharts

### Development Tools

- Vite 8
- ESLint
- npm

### API & Services

- OpenWeather API — Current weather and forecast data

---

## 📸 Screenshots

### 🌍 SkyPanel Interface

[SkyPanel Interface](SkyPanel_Images/SkyPanel1.png) ([image](SkyPanel_Images/SkyPanel1.png))

### 🌤️ Weather Dashboard

[Weather Dashboard](SkyPanel_Images/SkyPanel4.png) ([image](SkyPanel_Images/SkyPanel4.png))

### 📊 Forecast Visualization

[Forecast Visualization](SkyPanel_Images/SkyPanel5.png) ([image](SkyPanel_Images/SkyPanel5.png))

### 🌡️ Weather Information

[Weather Information](SkyPanel_Images/SkyPanel3.png) ([image](SkyPanel_Images/SkyPanel3.png))

### ✨ Additional Interface View

[Additional View](SkyPanel_Images/SkyPanel2.png) ([image](SkyPanel_Images/SkyPanel2.png))

---

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/JulooruSaiteja/SkyPanel.git

# Navigate to the project directory
cd SkyPanel

# Install dependencies
npm install

# Configure your OpenWeather API key in the .env file

# Start the development server
npm run dev
```

Open the local URL displayed in your terminal to access the application.

### Production Build

```bash
# Create an optimized production build
npm run build

# Preview the production build locally
npm run preview
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root and add your OpenWeather API key:

```env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
```

Get your API key from [OpenWeather](https://openweathermap.org/api).

**Important:** Keep your `.env` file out of version control. Ensure it is listed in `.gitignore`. Variables prefixed with `VITE_` are exposed to client-side code, so the API key should not be treated as a secret.

---

## 📁 Project Structure

```text
📦 SkyPanel
├── 📁 SkyPanel_Images/          # Project screenshots
│   ├── 📄 SkyPanel1.png
│   ├── 📄 SkyPanel2.png
│   ├── 📄 SkyPanel3.png
│   ├── 📄 SkyPanel4.png
│   └── 📄 SkyPanel5.png
├── 📁 src/                      # React application source
│   ├── 📄 App.jsx                # Main application component
│   ├── 📄 App.css                # Main application styles
│   ├── 📄 EarthIntro.jsx         # 3D Earth introduction
│   ├── 📄 EarthIntro.css
│   ├── 📄 Forecast.jsx           # Forecast visualization
│   ├── 📄 Forecast.css
│   ├── 📄 HeaderDecoration.jsx   # Header decoration component
│   ├── 📄 HeaderDecoration.css
│   ├── 📄 InfoBox.jsx             # Weather information component
│   ├── 📄 InfoBox.css
│   ├── 📄 SearchBox.jsx           # City search component
│   ├── 📄 SearchBox.css
│   ├── 📄 WeatherBackground.jsx  # Dynamic weather backgrounds
│   ├── 📄 WeatherBackground.css
│   ├── 📄 timeUtils.js            # Time-related utilities
│   ├── 📄 index.css               # Global styles
│   └── 📄 main.jsx                # Application entry point
├── 📄 .env.example                # Example environment configuration
├── 📄 .gitignore                  # Git ignored files
├── 📄 eslint.config.js            # ESLint configuration
├── 📄 index.html                  # HTML entry point
├── 📄 package.json                # Dependencies and npm scripts
├── 📄 package-lock.json           # Locked dependency versions
├── 📄 vite.config.js              # Vite configuration
└── 📄 README.md                   # Project documentation
```

---

## 📌 Future Improvements

- 📅 **Five-Day Weather Forecast** — Extend the forecast interface to display weather predictions for the next five days
- 📍 **Geolocation Support** — Automatically retrieve weather for the user's current location
- 🌡️ **Temperature Unit Toggle** — Switch between Celsius and Fahrenheit
- ⭐ **Favorite Cities** — Save and quickly access frequently searched cities
- 🌫️ **Air Quality Index (AQI)** — Display air quality information
- ☀️ **UV Index** — Provide ultraviolet index information

---

## 👤 Author

**Julooru Saiteja**

---