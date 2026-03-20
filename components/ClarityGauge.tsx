"use client";

import React, { useEffect, useState } from "react";

export default function ClarityGauge({ score }: { score: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepTime = Math.abs(Math.floor(duration / steps));
    let current = 0;
    
    const timer = setInterval(() => {
      current += score / steps;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Determine color based on score
  let strokeColor = "var(--error)";
  if (score >= 40) strokeColor = "var(--warning)";
  if (score >= 75) strokeColor = "var(--success)";

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div style={{ position: "relative", width: "160px", height: "160px", margin: "0 auto" }}>
      <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="transparent"
          stroke="var(--glass-border)"
          strokeWidth="12"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="transparent"
          stroke={strokeColor}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.1s ease-out, stroke 0.5s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <span style={{ fontSize: "2.5rem", fontWeight: "700", lineHeight: "1" }}>
          {animatedScore}
        </span>
        <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "4px" }}>
          Clarity
        </span>
      </div>
    </div>
  );
}
