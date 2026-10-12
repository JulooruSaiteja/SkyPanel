import { useState, useCallback } from "react";

import SearchBox from "./SearchBox.jsx";
import InfoBox from "./InfoBox.jsx";
import Forecast from "./Forecast.jsx";
import WeatherBackground from "./WeatherBackground.jsx";
import HeaderDecoration from "./HeaderDecoration.jsx";
import EarthIntro from "./EarthIntro.jsx";
import UnitToggle from "./UnitToggle.jsx";

import "./App.css";

function App() {
  const [data, setDataRaw] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchVersion, setSearchVersion] = useState(0);

  const [unit, setUnit] = useState(() => {
    try {
      const saved = localStorage.getItem("skypanel_unit");
      return saved === "F" ? "F" : "C";
    } catch {
      return "C";
    }
  });

  const handleUnitToggle = useCallback((newUnit) => {
    setUnit(newUnit);
    try {
      localStorage.setItem("skypanel_unit", newUnit);
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  const setData = useCallback((newData) => {
    setDataRaw(newData);

    if (newData !== null) {
      setSearchVersion((version) => version + 1);
    }
  }, []);

  return (
    <div className="App">

      {/* =================================
          BACKGROUND
          ================================= */}

      {data ? (
        <WeatherBackground data={data} />
      ) : (
        <EarthIntro />
      )}


      {/* =================================
          HEADER DECORATION & CONTROLS
          ================================= */}

      <UnitToggle unit={unit} onToggle={handleUnitToggle} />

      <HeaderDecoration data={data} />


      {/* =================================
          MAIN CONTENT
          ================================= */}

      <main className="appContent">

        {/* =================================
            SEARCH
            ================================= */}

        <SearchBox
          setData={setData}
          setForecast={setForecast}
          setError={setError}
          error={error}
          setLoading={setLoading}
        />


        {/* =================================
            LOADING
            ================================= */}

        {loading && (
          <div
            className="loadingSpinner"
            aria-live="polite"
            aria-label="Loading weather data"
          >
            <div
              className="spinner"
              role="status"
              aria-hidden="true"
            ></div>

            <p>Fetching weather…</p>
          </div>
        )}


        {/* =================================
            CURRENT WEATHER
            ================================= */}

        {!loading && data && (
          <InfoBox
            key={`info-${searchVersion}`}
            data={data}
            unit={unit}
            onToggleUnit={handleUnitToggle}
          />
        )}


        {/* =================================
            FORECAST
            ================================= */}

        {!loading && forecast && (
          <Forecast
            key={`forecast-${searchVersion}`}
            forecast={forecast}
            timezoneOffset={data?.timezone ?? 0}
            unit={unit}
          />
        )}

      </main>

    </div>
  );
}

export default App;