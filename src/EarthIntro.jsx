import { useEffect, useRef } from "react";
import "./EarthIntro.css";

export default function EarthIntro() {
  const starsRef = useRef(null);

  useEffect(() => {
    const canvas = starsRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    

    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.2,
      opacity: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1
    }));

    let animationFrame;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        star.opacity += star.speed * star.direction;

        if (star.opacity >= 1) {
          star.opacity = 1;
          star.direction = -1;
        }

        if (star.opacity <= 0.15) {
          star.opacity = 0.15;
          star.direction = 1;
        }

        ctx.beginPath();
        ctx.arc(
          star.x,
          star.y,
          star.radius,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="earthIntro">

      {/* Space background */}
      <div className="spaceGradient"></div>

      {/* Stars */}
      <canvas
        ref={starsRef}
        className="earthStars"
        aria-hidden="true"
      />

      {/* Distant atmospheric glow */}
      <div className="spaceGlow"></div>

      {/* Earth */}
      <div className="earthScene">

        <div className="earthAtmosphere"></div>

        <div className="earth">
          <div className="earthSurface"></div>

          {/* Moving cloud layers */}
          <div className="earthClouds earthCloudsBack"></div>
          <div className="earthClouds earthCloudsFront"></div>

          {/* Day/night shading */}
          <div className="earthNight"></div>
        </div>

        {/* Soft outer glow */}
        <div className="earthOuterGlow"></div>

      </div>

      {/* Very subtle orbital light */}
      <div className="orbitLight"></div>

    </div>
  );
}