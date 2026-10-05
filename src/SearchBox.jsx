import { useState, useRef } from "react";

import "./SearchBox.css";

export default function SearchBox({
  setData,
  setForecast,
  setError,
  error,
  setLoading
}) {
  const [city, setCity] = useState("");
  const inputRef = useRef(null);

  const WEATHER_API =
    "https://api.openweathermap.org/data/2.5/weather";

  const FORECAST_API =
    "https://api.openweathermap.org/data/2.5/forecast";

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // =========================================
  // GET WEATHER
  // =========================================

  
  const getWeatherInfo = async () => {
    setLoading(true);

    // Clear previous error
    setError("");

    try {
      // =========================================
      // CURRENT WEATHER
      // =========================================

      const weatherResponse = await fetch(
        `${WEATHER_API}?q=${encodeURIComponent(
          city.trim()
        )}&appid=${API_KEY}&units=metric`
      );

      const weatherData = await weatherResponse.json();

      // =========================================
      // CHECK CITY
      // =========================================

      if (!weatherResponse.ok) {
        setData(null);
        setForecast(null);

        setError(
          "We couldn't find that location. Try another city."
        );

        return;
      }

      // =========================================
      // GET COORDINATES
      // =========================================

      const lat = weatherData.coord.lat;
      const lon = weatherData.coord.lon;

      // =========================================
      // 3-HOUR FORECAST
      // =========================================

      const forecastResponse = await fetch(
        `${FORECAST_API}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      const forecastData = await forecastResponse.json();

      // =========================================
      // CHECK FORECAST
      // =========================================

      if (!forecastResponse.ok) {
        setData(null);
        setForecast(null);

        setError(
          "Unable to fetch forecast data. Please try again."
        );

        return;
      }

      // =========================================
      // SAVE DATA
      // =========================================

      setError("");

      setData(weatherData);
      setForecast(forecastData);

    } catch (err) {
      console.error("Weather error:", err);

      setData(null);
      setForecast(null);

      setError(
        "Unable to fetch weather data. Please check your connection and try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // INPUT CHANGE
  // =========================================

  const handleChange = (evt) => {
    setCity(evt.target.value);

    // Remove error as soon as user starts typing
    if (error) {
      setError("");
    }
  };

  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = (evt) => {
    evt.preventDefault();

    const trimmedCity = city.trim();

    // Empty input
    if (!trimmedCity) {
      setError("Please enter a city name.");
      return;
    }

    getWeatherInfo();

    // Clear input after submitting
    setCity("");
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="SearchBox">

      {/* =====================================
          BRAND
          ===================================== */}

      <div className="searchBrand">
        <h1>SkyPanel</h1>

        <p>
          Explore weather anywhere on Earth
        </p>
      </div>


      {/* =====================================
          SEARCH FORM
          ===================================== */}

      <form
        className="locationSearchForm"
        onSubmit={handleSubmit}
      >

        <div className="locationSearch">

          {/* Globe / Location Icon */}
          <span
            className="locationIcon"
            aria-hidden="true"
          >
            🌐
          </span>


          {/* Input */}
          <input
            ref={inputRef}
            id="city"
            type="text"
            value={city}
            onChange={handleChange}
            placeholder="Search city or location"
            autoComplete="off"
            aria-label="Search city or location"
          />


          {/* Search Button */}
          <button
            type="submit"
            className="locationSearchButton"
            aria-label="Search location"
          >
            <span className="arrowIcon">
              ➜
            </span>
          </button>

        </div>


        {/* =====================================
            ERROR STATE
            ===================================== */}

        {error && (
          <div className="locationError">

            <div className="locationErrorIcon">
              <div className="mapPin">
                <span>×</span>
              </div>
            </div>


            <div className="locationErrorContent">

              <h2>
                Location not found
              </h2>

              <p>
                {error}
              </p>

              <button
                type="button"
                className="tryAgainButton"
                onClick={() => {
                  setError("");
                  inputRef.current?.focus();
                }}
              >
                <span>↻</span>
                Try another location
              </button>

            </div>

          </div>
        )}

      </form>

    </div>
  );
}