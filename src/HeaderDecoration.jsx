import { useEffect, useState } from "react";
import {
  nowUtc,
  toCity,
  formatCityTime,
  getSolarPhase,
  phaseLabel,
  phaseEmoji,
} from "./timeUtils.js";
import "./HeaderDecoration.css";

export default function HeaderDecoration({ data }) {
  // Tick state updates every minute so the clock stays current
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  
  // ── Derive all values from city data, falling back to local time if no city ──
  const timezoneOffset = data?.timezone ?? null;
  const sunriseUtc     = data?.sys?.sunrise ?? null;
  const sunsetUtc      = data?.sys?.sunset  ?? null;
  const cityName       = data?.name         ?? null;

  const nowUtcTs = nowUtc();

  let phase, label, emoji, cityTimeStr;

  if (timezoneOffset != null && sunriseUtc != null) {
    // We have city data — use location-aware calculations
    const cityNow = toCity(nowUtcTs, timezoneOffset);
    phase       = getSolarPhase(nowUtcTs, sunriseUtc, sunsetUtc);
    label       = phaseLabel(phase);
    emoji       = phaseEmoji(phase);
    cityTimeStr = formatCityTime(cityNow, { hour: "numeric", minute: "2-digit" });
  } else {
    // No city yet — fall back gracefully to local browser time
    const hour  = new Date().getHours();
    const isDay = hour >= 6 && hour < 18;
    phase       = isDay ? "day" : "night";
    label       = isDay ? "Daytime" : "Nighttime";
    emoji       = isDay ? "☀️" : "🌙";
    cityTimeStr = null;
  }

  const isNightPhase = ["deep-night", "pre-dawn", "night", "dusk"].includes(phase);

  return (
    <div className="HeaderDecoration">

      {/* =========================
          TOP RIGHT SOLAR INDICATOR
          ========================= */}
      <div className="timeDecoration">

        <div className="phaseEmoji">
          {emoji}
        </div>

        {cityTimeStr && cityName && (
          <p className="cityTimeLabel">
            {cityName} · {cityTimeStr}
          </p>
        )}

        <p className="phaseText">
          {label}
        </p>

        {isNightPhase && (
          <div className="stars">
            <span>✦</span>
            <span>⋆</span>
            <span>✧</span>
            <span>·</span>
          </div>
        )}

      </div>

    </div>
  );
}