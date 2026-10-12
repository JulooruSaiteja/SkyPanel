import "./UnitToggle.css";

export default function UnitToggle({ unit, onToggle }) {
  return (
    <div
      className="UnitToggle"
      role="group"
      aria-label="Temperature unit selector"
    >
      <div className="toggleTrack">
        <button
          type="button"
          className={`toggleOption ${unit === "C" ? "active" : ""}`}
          onClick={() => onToggle("C")}
          aria-pressed={unit === "C"}
          title="Switch to Celsius (°C)"
        >
          <span className="unitSymbol">°C</span>
        </button>

        <button
          type="button"
          className={`toggleOption ${unit === "F" ? "active" : ""}`}
          onClick={() => onToggle("F")}
          aria-pressed={unit === "F"}
          title="Switch to Fahrenheit (°F)"
        >
          <span className="unitSymbol">°F</span>
        </button>
      </div>
    </div>
  );
}
