import { useEffect, useRef, useState } from "react";
import {
  nowUtc,
  getSolarPhase,
  phaseToSkyClass,
  getSunAngle,
  sunArcPosition,
} from "./timeUtils.js";
import "./WeatherBackground.css";


export default function WeatherBackground({ data }) {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const [lightningFlash, setLightningFlash] = useState(false);

  
  // =============================================
  // Derive ALL values at the top, BEFORE any hook
  // Safe defaults used when data is null
  // =============================================
  const condition  = data?.weather?.[0]?.main ? data.weather[0].main.toLowerCase() : "clear";
  const clouds     = data?.clouds?.all ?? 0;
  const windSpeed  = data?.wind?.speed ?? 0;

  const nowUtcTs   = nowUtc();
  const sunriseUtc = data?.sys?.sunrise ?? nowUtcTs - 21600;
  const sunsetUtc  = data?.sys?.sunset  ?? nowUtcTs + 21600;

  // Use timeUtils for consistent solar calculations
  const solarPhase   = getSolarPhase(nowUtcTs, sunriseUtc, sunsetUtc);
  const skyClass     = phaseToSkyClass(solarPhase);          // dawn | day | sunset | night
  const isNight      = skyClass === "night";
  const sunAngle     = getSunAngle(nowUtcTs, sunriseUtc, sunsetUtc);
  const { left: celestialX, top: celestialY } = sunArcPosition(sunAngle);

  const cloudOpacity = Math.min(Math.max(clouds / 100, 0), 1);
  const fogOpacity   = ["mist", "fog", "haze", "smoke"].includes(condition) ? 0.7 : 0;

  // =============================================
  // Canvas Particle Engine — Rain, Snow, Stars
  // =============================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width  = window.innerWidth;
    let height = window.innerHeight;
    canvas.width  = width;
    canvas.height = height;

    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Skip canvas particles entirely if no data yet
    if (!data) return;

    let particles = [];
    const MAX = isReducedMotion ? 80 : 350;

    const initParticles = () => {
      particles = [];

      if (["rain", "drizzle", "thunderstorm"].includes(condition)) {
        const base = condition === "drizzle" ? 120 : condition === "thunderstorm" ? 380 : 260;
        for (let i = 0; i < Math.min(base, MAX); i++) {
          particles.push({
            x:       Math.random() * width,
            y:       Math.random() * height,
            length:  Math.random() * 18 + 10,
            speed:   Math.random() * 10 + 14,
            opacity: Math.random() * 0.45 + 0.2
          });
        }
      } else if (condition === "snow") {
        for (let i = 0; i < Math.min(200, MAX); i++) {
          particles.push({
            x:      Math.random() * width,
            y:      Math.random() * height,
            radius: Math.random() * 3 + 1,
            speedY: Math.random() * 1 + 0.4,
            speedX: Math.random() * 0.8 - 0.4,
            opacity: Math.random() * 0.6 + 0.2,
            angle:  Math.random() * Math.PI * 2
          });
        }
      } else if (isNight || skyClass === "dawn" || skyClass === "sunset") {
        for (let i = 0; i < 150; i++) {
          particles.push({
            x:           Math.random() * width,
            y:           Math.random() * height * 0.72,
            radius:      Math.random() * 1.5 + 0.3,
            opacity:     Math.random(),
            twinkleSpeed: Math.random() * 0.04 + 0.01,
            twinkleDir:  Math.random() > 0.5 ? 1 : -1
          });
        }
        // Shooting star
        particles.push({
          type:   "shooting",
          x:      width + 200,
          y:      -100,
          speed:  14,
          active: false,
          delay:  Math.random() * 600 + 100
        });
      }
    };

    initParticles();

    const windEffect = windSpeed * 0.5;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        if (["rain", "drizzle", "thunderstorm"].includes(condition)) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + windEffect * 2, p.y + p.length);
          ctx.strokeStyle = `rgba(200, 220, 255, ${p.opacity})`;
          ctx.lineWidth = 1.5;
          ctx.lineCap  = "round";
          ctx.stroke();

          if (!isReducedMotion) {
            p.y += p.speed;
            p.x += windEffect * 1.5;
          }
          if (p.y > height)   { p.y = -p.length; p.x = Math.random() * width; }
          if (p.x > width)      p.x = 0;
          if (p.x < 0)          p.x = width;

        } else if (condition === "snow") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.fill();

          if (!isReducedMotion) {
            p.angle += 0.02;
            p.y += p.speedY;
            p.x += p.speedX + Math.sin(p.angle) * 0.5 + windEffect * 0.4;
          }
          if (p.y > height) { p.y = -5; p.x = Math.random() * width; }
          if (p.x > width)    p.x = 0;
          if (p.x < 0)        p.x = width;

        } else if (isNight || skyClass === "dawn" || skyClass === "sunset") {
          if (p.type === "shooting") {
            if (p.delay > 0) {
              p.delay--;
            } else {
              p.active = true;
            }
            if (p.active) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p.x - p.speed * 2.5, p.y + p.speed);
              ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
              ctx.lineWidth = 2;
              ctx.stroke();

              if (!isReducedMotion) {
                p.x -= p.speed * 2.5;
                p.y += p.speed;
              }
              if (p.y > height || p.x < 0) {
                p.active = false;
                p.delay  = Math.random() * 900 + 200;
                p.x      = width + Math.random() * 200;
                p.y      = -Math.random() * 200;
              }
            }
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, p.opacity)})`;
            ctx.fill();

            if (!isReducedMotion) {
              p.opacity += p.twinkleSpeed * p.twinkleDir;
              if (p.opacity > 1)   { p.opacity = 1;   p.twinkleDir = -1; }
              if (p.opacity < 0.1) { p.opacity = 0.1; p.twinkleDir =  1; }
            }
          }
        }
      });

      requestRef.current = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width  = window.innerWidth;
      height = window.innerHeight;
      canvas.width  = width;
      canvas.height = height;
      initParticles();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(requestRef.current);
    };
  }, [condition, skyClass, isNight, windSpeed, data]);

  // =============================================
  // Unpredictable Lightning Engine
  // =============================================
  useEffect(() => {
    if (condition !== "thunderstorm" || !data) return;

    let timeoutId;
    const scheduleLightning = () => {
      const delay = Math.random() * 9000 + 3000;
      timeoutId = setTimeout(() => {
        setLightningFlash(true);
        setTimeout(() => setLightningFlash(false), Math.random() * 180 + 50);

        if (Math.random() > 0.6) {
          setTimeout(() => {
            setLightningFlash(true);
            setTimeout(() => setLightningFlash(false), 90);
          }, 280);
        }

        scheduleLightning();
      }, delay);
    };

    scheduleLightning();
    return () => clearTimeout(timeoutId);
  }, [condition, data]);


  // =============================================
  // RENDER
  // =============================================

  if (!data) {
    return <div className="weatherBackground defaultSky" />;
  }

  return (
    <div className={`weatherBackground ${skyClass} condition-${condition}`}>

      {/* 1. Base Sky Gradient */}
      <div className="skyLayer"></div>

      {/* 2. Sun */}
      {!isNight && sunAngle >= 0 && sunAngle <= 180 && (
        <div
          className="sunGlowLayer"
          style={{ left: `${celestialX}%`, top: `${celestialY}%` }}
        >
          <div className="sunCore"></div>
          <div className="sunRadiance"></div>
        </div>
      )}

      {/* 2b. Moon */}
      {isNight && (
        <div className="moonLayer">
          <div className="moonCore">🌙</div>
          <div className="moonGlow"></div>
        </div>
      )}

      {/* 3. Horizon Haze */}
      <div className="hazeLayer"></div>

      {/* 4. Canvas Particles */}
      <canvas ref={canvasRef} className="particleCanvas"></canvas>

      {/* 5. CSS Cloud System */}
      {clouds > 10 && (
        <div className="cloudSystem" style={{ opacity: cloudOpacity }}>
          <div className="cloudsLayer bgClouds" style={{ animationDuration: `${Math.max(30, 120 - windSpeed * 3)}s` }}></div>
          <div className="cloudsLayer midClouds" style={{ animationDuration: `${Math.max(20, 90 - windSpeed * 3)}s` }}></div>
          <div className="cloudsLayer fgClouds" style={{ animationDuration: `${Math.max(15, 60 - windSpeed * 3)}s` }}></div>
        </div>
      )}

      {/* 6. Fog / Mist */}
      {fogOpacity > 0 && (
        <div className="fogSystem" style={{ opacity: fogOpacity }}>
          <div className="fogLayer fogSlow"></div>
          <div className="fogLayer fogFast"></div>
        </div>
      )}

      {/* 7. Lightning flash overlay */}
      {lightningFlash && <div className="lightningFlash"></div>}

    </div>
  );
}