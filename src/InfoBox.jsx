import { toCity, formatCityTime } from "./timeUtils.js";
import "./InfoBox.css";

// =================================
// HELPERS
// =================================

const DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

function windDirection(deg) {
  if (deg == null || typeof deg !== "number") return "—";

  return DIRS[Math.round(deg / 45) % 8];
}



// =================================
// COMPONENT
// =================================

export default function InfoBox({ data }) {

  // Prevent rendering if data is unavailable
  if (!data) return null;

  const weather = data.weather?.[0] ?? {};

  // =================================
  // SUNRISE / SUNSET
  // =================================

  const sunriseLocal = data.sys?.sunrise != null
    ? toCity(data.sys.sunrise, data.timezone)
    : null;

  const sunsetLocal = data.sys?.sunset != null
    ? toCity(data.sys.sunset, data.timezone)
    : null;

  const sunriseStr = sunriseLocal != null
    ? formatCityTime(sunriseLocal, { hour: "2-digit", minute: "2-digit" })
    : "—";

  const sunsetStr = sunsetLocal != null
    ? formatCityTime(sunsetLocal, { hour: "2-digit", minute: "2-digit" })
    : "—";


  // =================================
  // CALCULATED VALUES
  // =================================

  const visKm = typeof data.visibility === "number"
    ? (data.visibility / 1000).toFixed(1)
    : "—";

  const windDeg = data.wind?.deg ?? 0;

  const dir = windDirection(data.wind?.deg);

  const utcOff = typeof data.timezone === "number"
    ? `UTC ${data.timezone >= 0 ? "+" : ""}${Math.round(data.timezone / 3600)}`
    : "—";

  const tempDisplay = typeof data.main?.temp === "number"
    ? Math.round(data.main.temp)
    : "—";

  const feelsLikeDisplay = typeof data.main?.feels_like === "number"
    ? Math.round(data.main.feels_like)
    : "—";

  const minTempDisplay = typeof data.main?.temp_min === "number"
    ? Math.round(data.main.temp_min)
    : "—";

  const maxTempDisplay = typeof data.main?.temp_max === "number"
    ? Math.round(data.main.temp_max)
    : "—";

  const latDisplay = typeof data.coord?.lat === "number"
    ? `${data.coord.lat.toFixed(3)}°`
    : "—";

  const lonDisplay = typeof data.coord?.lon === "number"
    ? `${data.coord.lon.toFixed(3)}°`
    : "—";

  const cloudCover = data.clouds?.all ?? 0;
  const cloudDisplay = data.clouds?.all != null ? data.clouds.all : "—";
  const windSpeedDisplay = data.wind?.speed ?? "—";
  const countryDisplay = data.sys?.country ?? "";
  const cityNameDisplay = data.name ?? "—";


  // =================================
  // RENDER
  // =================================

  return (
    <div className="InfoBox">

      {/* =================================
          CITY HEADER
          ================================= */}

      <div className="cityHeader">

        <h2>{cityNameDisplay}</h2>

        {countryDisplay && (
          <p>{countryDisplay}</p>
        )}

        <span>
          {weather.main ?? "—"} · {tempDisplay}°C
        </span>

      </div>


      {/* =================================
          MAIN WEATHER CARD
          ================================= */}

      <div className="mainWeatherCard">

        <div className="mainTemperature">
          {tempDisplay}°C
        </div>

        <h3>
          {weather.main ?? "—"}
        </h3>

        <p className="description">
          {weather.description ?? ""}
        </p>

        <p>
          Feels like {feelsLikeDisplay}°C
        </p>

        <div className="minMax">

          <span>
            Min {minTempDisplay}°C
          </span>

          <span>
            Max {maxTempDisplay}°C
          </span>

        </div>

      </div>


      {/* =================================
          SECONDARY WEATHER CARDS
          ================================= */}

      <div className="cardsGrid">


        {/* =================================
            ATMOSPHERE
            ================================= */}

        <div className="weatherCard atmosphereCard">

          <p className="cardLabel">
            ATMOSPHERE
          </p>

          <div className="atmoGrid">


            {/* Humidity */}

            <div className="atmoStat primary">

              <div className="atmoStatValue">

                <span className="valueXL">
                  {data.main?.humidity ?? "—"}
                </span>

                <span className="valueUnit">
                  %
                </span>

              </div>

              <span className="cardSubLabel">
                Humidity
              </span>

            </div>


            {/* Pressure */}

            <div className="atmoStat">

              <div className="atmoStatValue">

                <span className="valueLG">
                  {data.main?.pressure ?? "—"}
                </span>

                <span className="valueUnit">
                  hPa
                </span>

              </div>

              <span className="cardSubLabel">
                Pressure
              </span>

            </div>


            {/* Visibility */}

            <div className="atmoStat">

              <div className="atmoStatValue">

                <span className="valueLG">
                  {visKm}
                </span>

                <span className="valueUnit">
                  km
                </span>

              </div>

              <span className="cardSubLabel">
                Visibility
              </span>

            </div>


            {/* Sea Level */}

            <div className="atmoStat">

              <div className="atmoStatValue">

                <span className="valueLG">
                  {data.main?.sea_level ?? "—"}
                </span>

                {data.main?.sea_level != null && (
                  <span className="valueUnit">
                    hPa
                  </span>
                )}

              </div>

              <span className="cardSubLabel">
                Sea Level
              </span>

            </div>

          </div>

        </div>


        {/* =================================
            LOCATION
            ================================= */}

        <div className="weatherCard locationCard">

          <p className="cardLabel">
            LOCATION
          </p>

          <p className="locationCity">
            {cityNameDisplay}
          </p>

          {countryDisplay && (
            <p className="locationCountry">
              {countryDisplay}
            </p>
          )}


          <div className="coordGrid">

            <div className="coordStat">

              <span className="cardSubLabel">
                LAT
              </span>

              <span className="coordValue">
                {latDisplay}
              </span>

            </div>


            <div className="coordStat">

              <span className="cardSubLabel">
                LON
              </span>

              <span className="coordValue">
                {lonDisplay}
              </span>

            </div>


            <div className="coordStat">

              <span className="cardSubLabel">
                TIMEZONE
              </span>

              <span className="coordValue">
                {utcOff}
              </span>

            </div>


            <div className="coordStat">

              <span className="cardSubLabel">
                CITY ID
              </span>

              <span className="coordValue">
                {data.id ?? "—"}
              </span>

            </div>

          </div>

        </div>


        {/* =================================
            WIND
            ================================= */}

        <div className="weatherCard windCard">

          <p className="cardLabel">
            WIND
          </p>


          <div className="windLayout">

            <div className="windPrimary">

              <span className="valueXL">
                {windSpeedDisplay}
              </span>

              <span className="valueUnit">
                m/s
              </span>

            </div>


            <div
              className="windCompass"
              title={`${windDeg}° — ${dir}`}
              aria-label={`Wind direction: ${dir}, ${windDeg} degrees`}
            >

              <span
                className="compassArrow"
                style={{
                  transform: `rotate(${windDeg}deg)`
                }}
                aria-hidden="true"
              >
                ↑
              </span>

              <span className="compassLabel">
                {dir}
              </span>

            </div>

          </div>


          <div className="windStats">

            {/* Gust */}

            {data.wind?.gust != null && (

              <div className="windStatRow">

                <span className="cardSubLabel">
                  GUST
                </span>

                <span className="cardSubValue">
                  {data.wind.gust} m/s
                </span>

              </div>

            )}


            {/* Bearing */}

            <div className="windStatRow">

              <span className="cardSubLabel">
                BEARING
              </span>

              <span className="cardSubValue">
                {windDeg}°
              </span>

            </div>

          </div>

        </div>


        {/* =================================
            SUN
            ================================= */}

        <div className="weatherCard sunCard">

          <p className="cardLabel">
            SUN
          </p>


          <div className="sunLayout">

            <div className="sunTime">

              <span
                className="sunEmoji"
                aria-hidden="true"
              >
                🌅
              </span>

              <span className="valueMD">
                {sunriseStr}
              </span>

              <span className="cardSubLabel">
                Sunrise
              </span>

            </div>


            <div
              className="sunDivider"
              aria-hidden="true"
            />


            <div className="sunTime">

              <span
                className="sunEmoji"
                aria-hidden="true"
              >
                🌇
              </span>

              <span className="valueMD">
                {sunsetStr}
              </span>

              <span className="cardSubLabel">
                Sunset
              </span>

            </div>

          </div>

        </div>


        {/* =================================
            CLOUDS
            ================================= */}

        <div className="weatherCard cloudsCard">

          <p className="cardLabel">
            CLOUDS
          </p>


          <div className="cloudPrimary">

            <span className="valueXL">
              {cloudDisplay}
            </span>

            <span className="valueUnit">
              %
            </span>

          </div>


          <div
            className="cloudBar"
            role="progressbar"
            aria-valuenow={cloudCover}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Cloud cover: ${cloudCover}%`}
          >

            <div
              className="cloudBarFill"
              style={{
                width: `${cloudCover}%`
              }}
            />

          </div>

        </div>

      </div>

    </div>
  );
}