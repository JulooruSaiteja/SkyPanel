import { useState, useEffect } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { toCity, shortTime } from "./timeUtils.js";
import "./Forecast.css";



// =================================
// CUSTOM TOOLTIP
// =================================

const CustomTooltip = ({ active, payload, label }) => {

  if (active && payload && payload.length) {

    return (
      <div className="chartTooltip">

        <p className="tooltipTime">
          {label}
        </p>

        <p className="tooltipTemp">
          {payload[0].value}°C
        </p>

        <p className="tooltipCondition">
          {payload[0].payload.condition}
        </p>

      </div>
    );
  }

  return null;
};


// =================================
// FORECAST COMPONENT
// =================================

export default function Forecast({
  forecast,
  timezoneOffset = 0
}) {

  const [isMobile, setIsMobile] = useState(false);


  // =================================
  // RESPONSIVE CHECK
  // =================================

  useEffect(() => {

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };

  }, []);


  // =================================
  // SAFETY CHECK
  // =================================

  if (!forecast || !forecast.list) {
    return null;
  }


  // =================================
  // NEXT 24 HOURS
  // =================================

  const next24Hours = forecast.list.slice(0, 8);


  // =================================
  // TEMPERATURE RANGE
  // =================================

  const temps = next24Hours.map((item) =>
    item?.main?.temp != null ? Math.round(item.main.temp) : 0
  );

  const maxTemp = temps.length ? Math.max(...temps) : 0;
  const minTemp = temps.length ? Math.min(...temps) : 0;


  // =================================
  // CITY LOCAL TIME
  // =================================

  const getCityTime = (utcTs, index) => {

    if (index === 0) {
      return "NOW";
    }

    const cityTs = toCity(
      utcTs,
      timezoneOffset
    );

    return shortTime(cityTs);
  };


  // =================================
  // CHART DATA
  // =================================

  const chartData = next24Hours.map(
    (item, index) => ({

      time: getCityTime(
        item.dt,
        index
      ),

      temp: item?.main?.temp != null
        ? Math.round(item.main.temp)
        : 0,

      condition:
        item?.weather?.[0]?.main ?? "Clear"

    })
  );


  // =================================
  // CHART MARGIN
  // =================================

  const chartMargin = isMobile
    ? 62.5
    : 70;


  // =================================
  // RENDER
  // =================================

  return (
    <div className="Forecast">


      {/* =================================
          HEADER
          ================================= */}

      <div className="forecastHeader">

        <div className="headerLeft">

          <h2>
            NEXT 24 HOURS
          </h2>

          <p className="forecastSubtitle">
            Hourly conditions and temperature
          </p>

        </div>


        <div className="headerRight">

          <div className="highLowBadge">

            <span className="highLabel">
              HIGH {maxTemp}°C
            </span>

            <span className="badgeSeparator">
              •
            </span>

            <span className="lowLabel">
              LOW {minTemp}°C
            </span>

          </div>

        </div>

      </div>


      {/* =================================
          SCROLLABLE TIMELINE
          ================================= */}

      <div className="forecastScrollArea">

        <div className="forecastTimeline">


          {/* =================================
              TEMPERATURE CHART
              ================================= */}

          <div className="chartContainer">

            <ResponsiveContainer
              width="100%"
              height={160}
            >

              <LineChart
                data={chartData}
                margin={{
                  top: 20,
                  right: chartMargin,
                  left: chartMargin,
                  bottom: 10
                }}
              >

                <XAxis
                  dataKey="time"
                  hide={true}
                />

                <YAxis
                  domain={[
                    "dataMin - 2",
                    "dataMax + 2"
                  ]}
                  hide={true}
                />

                <Tooltip
                  content={
                    <CustomTooltip />
                  }
                  cursor={{
                    stroke:
                      "rgba(255,255,255,0.1)",
                    strokeWidth: 40
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="temp"

                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth={3}

                  dot={{
                    r: 4,
                    fill:
                      "rgba(255,255,255,0.9)",
                    stroke: "none"
                  }}

                  activeDot={{
                    r: 6,
                    fill: "#fff",
                    stroke:
                      "rgba(255,255,255,0.4)",
                    strokeWidth: 6
                  }}

                  isAnimationActive={true}
                  animationDuration={1500}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>


          {/* =================================
              FORECAST CARDS
              ================================= */}

          <div className="forecastCardsRow">

            {next24Hours.map(
              (item, index) => {

                const time =
                  getCityTime(
                    item.dt,
                    index
                  );


                const temperature =
                  item?.main?.temp != null
                    ? Math.round(item.main.temp)
                    : 0;


                const weather =
                  item?.weather?.[0] ?? {};


                const icon =
                  weather.icon
                    ? `https://openweathermap.org/img/wn/${weather.icon}@4x.png`
                    : "";


                const rainProbability =
                  item?.pop != null
                    ? Math.round(item.pop * 100)
                    : 0;


                const conditionClass =
                  weather.main
                    ? `condition-${weather.main.toLowerCase()}`
                    : "";


                return (
                  <div
                    className={
                      `forecastCard ${
                        index === 0
                          ? "current"
                          : ""
                      } ${conditionClass}`
                    }

                    /*
                     * Use the forecast timestamp
                     * instead of the array index.
                     * This helps React correctly
                     * identify cards when the
                     * searched city changes.
                     */
                    key={item.dt}
                  >

                    <p className="forecastTime">
                      {time}
                    </p>


                    <img
                      src={icon}
                      alt={weather.description}
                      className="forecastIcon"
                    />


                    <h3>
                      {temperature}°C
                    </h3>


                    {rainProbability > 0 && (

                      <p className="forecastRain">
                        💧 {rainProbability}%
                      </p>

                    )}

                  </div>
                );
              }
            )}

          </div>

        </div>

      </div>

    </div>
  );
}