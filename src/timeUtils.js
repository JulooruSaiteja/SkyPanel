/**
 * timeUtils.js
 * Single source of truth for all location-aware time and solar calculations.
 *
 * OpenWeather provides:
 *   data.timezone  — UTC offset in SECONDS (e.g. 19800 for IST = +5:30)
 *   data.sys.sunrise — Unix timestamp (UTC)
 *   data.sys.sunset  — Unix timestamp (UTC)
 *   item.dt          — Unix timestamp (UTC) for each forecast slot
 *
 * All functions accept Unix timestamps (seconds) and a timezone offset
 * (seconds) so they are framework-agnostic and easy to unit-test.
 */

// ============================================================
// BASIC CITY-LOCAL TIME
// ============================================================


/**
 * Returns the current UTC unix timestamp in seconds.
 */
export function nowUtc() {
  return Math.floor(Date.now() / 1000);
}

/**
 * Returns the city-local unix timestamp in seconds for "now".
 * (i.e. current UTC time shifted by the city's UTC offset)
 */
export function nowCity(timezoneOffset) {
  return nowUtc() + (timezoneOffset ?? 0);
}

/**
 * Converts any UTC unix timestamp to the city-local unix timestamp.
 */
export function toCity(utcTimestamp, timezoneOffset) {
  return utcTimestamp + (timezoneOffset ?? 0);
}

/**
 * Formats a city-local unix timestamp as a readable time string.
 * e.g. "9 PM", "12 AM", "NOW"
 *
 * @param {number} cityTimestamp - unix timestamp already shifted to city time
 * @param {object} opts          - Intl.DateTimeFormat time options
 */
export function formatCityTime(cityTimestamp, opts = { hour: "numeric" }) {
  // We construct a Date from the city-local timestamp as if it were UTC
  // so that toLocaleTimeString doesn't apply the browser's local offset again.
  const d = new Date(cityTimestamp * 1000);
  return d.toLocaleTimeString("en-US", { ...opts, timeZone: "UTC" });
}

/**
 * Formats a city-local unix timestamp as a short time "9 PM" or "12 AM".
 */
export function shortTime(cityTimestamp) {
  return formatCityTime(cityTimestamp, { hour: "numeric" });
}

// ============================================================
// SOLAR PHASE CALCULATION
// ============================================================

/**
 * 11-phase solar classification.
 *
 * @param {number} nowUtcTs    - current UTC unix timestamp (seconds)
 * @param {number} sunriseUtc  - city sunrise in UTC unix seconds
 * @param {number} sunsetUtc   - city sunset  in UTC unix seconds
 * @returns {string} one of:
 *   'deep-night' | 'pre-dawn' | 'dawn' | 'sunrise' |
 *   'morning'   | 'midday'  | 'afternoon' | 'golden-hour' |
 *   'sunset'    | 'dusk'    | 'night'
 */
export function getSolarPhase(nowUtcTs, sunriseUtc, sunsetUtc) {
  if (
    nowUtcTs == null ||
    sunriseUtc == null ||
    sunsetUtc == null ||
    isNaN(nowUtcTs)
  ) {
    return "day"; // safe fallback
  }

  const dayLength  = sunsetUtc - sunriseUtc;
  const halfDay    = dayLength / 2;

  // Relative positions in seconds from sunrise / sunset
  const fromSunrise = nowUtcTs - sunriseUtc;
  const fromSunset  = nowUtcTs - sunsetUtc;

  // Night: well after sunset or well before any dawn
  const isDeepNight =
    fromSunset > 3 * 3600 || nowUtcTs < sunriseUtc - 5400;

  if (isDeepNight)                          return "deep-night";
  if (nowUtcTs < sunriseUtc - 3600)        return "pre-dawn";        // 1 h before dawn
  if (nowUtcTs < sunriseUtc - 1200)        return "dawn";            // ~20 min window
  if (nowUtcTs < sunriseUtc + 1800)        return "sunrise";         // ~30 min window
  if (fromSunrise < halfDay * 0.3)         return "morning";
  if (fromSunrise < halfDay * 0.7)         return "midday";
  if (fromSunrise < dayLength - 3600)      return "afternoon";
  if (nowUtcTs < sunsetUtc - 1200)         return "golden-hour";
  if (nowUtcTs < sunsetUtc + 1800)         return "sunset";
  if (nowUtcTs < sunsetUtc + 3600)         return "dusk";
  return "night";
}

/**
 * Convenience boolean — is it daytime right now in the city?
 */
export function isItDay(nowUtcTs, sunriseUtc, sunsetUtc) {
  const phase = getSolarPhase(nowUtcTs, sunriseUtc, sunsetUtc);
  return ![
    "deep-night", "pre-dawn", "dawn", "night", "dusk"
  ].includes(phase);
}

/**
 * Maps a 11-phase name to a simpler 5-bucket CSS class name
 * (used in WeatherBackground for sky gradients).
 *
 * dawn     → "dawn"
 * sunrise  → "dawn"
 * pre-dawn → "dawn"
 * morning  → "day"
 * midday   → "day"
 * afternoon→ "day"
 * golden-hour → "sunset"
 * sunset   → "sunset"
 * dusk     → "night"
 * night    → "night"
 * deep-night → "night"
 */
export function phaseToSkyClass(phase) {
  const map = {
    "pre-dawn":    "dawn",
    "dawn":        "dawn",
    "sunrise":     "dawn",
    "morning":     "day",
    "midday":      "day",
    "afternoon":   "day",
    "golden-hour": "sunset",
    "sunset":      "sunset",
    "dusk":        "night",
    "night":       "night",
    "deep-night":  "night",
  };
  return map[phase] ?? "day";
}

// ============================================================
// SUN POSITION ARC
// ============================================================

/**
 * Returns the sun's angle in degrees along a 180° arc
 * (0° = horizon at sunrise, 90° = zenith at noon, 180° = horizon at sunset).
 * Returns -10 or 190 when the sun is hidden (before/after day).
 *
 * @param {number} nowUtcTs
 * @param {number} sunriseUtc
 * @param {number} sunsetUtc
 */
export function getSunAngle(nowUtcTs, sunriseUtc, sunsetUtc) {
  if (nowUtcTs <= sunriseUtc) return -10;
  if (nowUtcTs >= sunsetUtc)  return 190;
  const progress = (nowUtcTs - sunriseUtc) / (sunsetUtc - sunriseUtc);
  return progress * 180;
}

/**
 * Converts a sun angle to CSS left/top percentages for absolute positioning.
 */
export function sunArcPosition(angle) {
  const left = 50 - Math.cos((angle * Math.PI) / 180) * 45;
  const top  = 100 - Math.sin((angle * Math.PI) / 180) * 80;
  return { left, top };
}

// ============================================================
// SUNRISE / SUNSET HELPERS
// ============================================================

/**
 * Seconds until sunrise (negative if already passed today).
 */
export function secsUntilSunrise(nowUtcTs, sunriseUtc) {
  return sunriseUtc - nowUtcTs;
}

/**
 * Seconds since sunrise (negative if not yet risen).
 */
export function secsSinceSunrise(nowUtcTs, sunriseUtc) {
  return nowUtcTs - sunriseUtc;
}

/**
 * Seconds until sunset (negative if already set).
 */
export function secsUntilSunset(nowUtcTs, sunsetUtc) {
  return sunsetUtc - nowUtcTs;
}

/**
 * Seconds since sunset (negative if not yet set).
 */
export function secsSinceSunset(nowUtcTs, sunsetUtc) {
  return nowUtcTs - sunsetUtc;
}

/**
 * Fraction of daylight elapsed (0 = sunrise, 1 = sunset).
 * Clamped to [0, 1].
 */
export function daylightProgress(nowUtcTs, sunriseUtc, sunsetUtc) {
  const dayLen = sunsetUtc - sunriseUtc;
  if (dayLen <= 0) return 0;
  return Math.min(1, Math.max(0, (nowUtcTs - sunriseUtc) / dayLen));
}

// ============================================================
// HUMAN-READABLE LABELS
// ============================================================

/**
 * Returns a short, readable label for the solar phase.
 * Used in the header decoration.
 */
export function phaseLabel(phase) {
  const labels = {
    "deep-night":  "Deep Night",
    "pre-dawn":    "Pre-Dawn",
    "dawn":        "Dawn",
    "sunrise":     "Sunrise",
    "morning":     "Morning",
    "midday":      "Midday",
    "afternoon":   "Afternoon",
    "golden-hour": "Golden Hour",
    "sunset":      "Sunset",
    "dusk":        "Dusk",
    "night":       "Night",
  };
  return labels[phase] ?? "Daytime";
}

/**
 * Returns the appropriate emoji for the solar phase for header decoration.
 */
export function phaseEmoji(phase) {
  const emojis = {
    "deep-night":  "🌙",
    "pre-dawn":    "🌙",
    "dawn":        "🌅",
    "sunrise":     "🌅",
    "morning":     "☀️",
    "midday":      "☀️",
    "afternoon":   "🌤️",
    "golden-hour": "🌇",
    "sunset":      "🌆",
    "dusk":        "🌙",
    "night":       "🌙",
  };
  return emojis[phase] ?? "☀️";
}
