/**
 * Temperature conversion and formatting utilities for SkyPanel
 */

/**
 * Converts Celsius temperature to the requested unit ('C' or 'F').
 * OpenWeather metric API returns temperature in Celsius.
 *
 * @param {number|null|undefined} tempC - Temperature in Celsius
 * @param {'C'|'F'} unit - Target unit ('C' or 'F')
 * @returns {number|null} Converted rounded temperature or null if input is invalid
 */
export function convertTemp(tempC, unit = "C") {
  if (tempC == null || typeof tempC !== "number" || Number.isNaN(tempC)) {
    return null;
  }

  if (unit === "F") {
    return Math.round((tempC * 9) / 5 + 32);
  }

  return Math.round(tempC);
}

/**
 * Formats a temperature value with the degree symbol and unit letter.
 *
 * @param {number|null|undefined} tempC - Temperature in Celsius
 * @param {'C'|'F'} unit - Target unit ('C' or 'F')
 * @param {string} fallback - Fallback string if temp is null
 * @returns {string} Formatted string like "24°C" or "75°F"
 */
export function formatTemp(tempC, unit = "C", fallback = "—") {
  const converted = convertTemp(tempC, unit);
  if (converted == null) return fallback;
  return `${converted}°${unit}`;
}
