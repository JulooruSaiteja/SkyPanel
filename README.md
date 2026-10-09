# 🌤️ SkyPanel — Weather Dashboard

An interactive, responsive weather dashboard built with **React 19, Vite, and Recharts**. SkyPanel provides real-time weather information, animated atmospheric backgrounds, timezone-aware local times, and interactive temperature forecast charts powered by the OpenWeather API.

---

## 🚀 Features

- 🌍 **Interactive 3D Earth Intro** — Animated rotating globe with atmospheric particle effects.
- 🔍 **City Weather Search** — Retrieve current weather conditions for cities worldwide.
- 📊 **Interactive Forecast Charts** — Visualize temperature trends with responsive line charts.
- ⏱️ **Weather Timeline** — Explore forecast intervals, temperatures, weather icons, and rain probabilities.
- 🎨 **Dynamic Weather Effects** — Animated backgrounds that adapt to weather conditions.
- ⏰ **Timezone-Aware Times** — Display local time, sunrise, and sunset.
- 📱 **Responsive UI** — Glassmorphism design, smooth transitions, and mobile-friendly layouts.

---

## 🛠️ Tech Stack

**Frontend**
- React 19
- JavaScript (ES6+)
- CSS3

**Build Tools**
- Vite 8
- ESLint

**Data Visualization**
- Recharts

**API**
- [OpenWeather API](https://openweathermap.org/api)

---

## 📂 Project Structure

```text
SkyPanel/
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── EarthIntro.jsx
│   ├── EarthIntro.css
│   ├── Forecast.jsx
│   ├── Forecast.css
│   ├── HeaderDecoration.jsx
│   ├── HeaderDecoration.css
│   ├── InfoBox.jsx
│   ├── InfoBox.css
│   ├── SearchBox.jsx
│   ├── SearchBox.css
│   ├── WeatherBackground.jsx
│   ├── WeatherBackground.css
│   ├── timeUtils.js
│   ├── index.css
│   └── main.jsx
├── .env.example
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm
- An [OpenWeather API key](https://home.openweathermap.org/users/sign_up)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/SkyPanel.git
cd SkyPanel
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the project root and add your API key:

```env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
```

**4. Start the development server**

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🔌 API Endpoints

SkyPanel uses the OpenWeather REST API to retrieve current weather and forecast data.

| Endpoint | Purpose |
|---|---|
| [`/data/2.5/weather`](https://api.openweathermap.org/data/2.5/weather) | Current weather conditions |
| [`/data/2.5/forecast`](https://api.openweathermap.org/data/2.5/forecast) | Five-day forecast at three-hour intervals |

**Parameters:** `q` (city), `appid` (API key), `units` (measurement system).

Temperature values use metric units (°C).

---

## 🔮 Future Improvements

- [ ] Automatic weather detection using geolocation
- [ ] Temperature unit toggle (°C / °F)
- [ ] Favorite cities using local storage
- [ ] UV Index and Air Quality Index integration

---

## 👨‍💻 Author

**Julooru Saiteja**

- GitHub: [JulooruSaiteja](https://github.com/JulooruSaiteja)

---
