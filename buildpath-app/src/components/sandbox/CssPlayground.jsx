// src/components/sandbox/CssPlayground.jsx
import React, { useState } from "react";
import "./sandbox.css";

export default function CssPlayground() {
  const [borderRadius, setBorderRadius] = useState(20);
  const [hue, setHue] = useState(160);
  const [blur, setBlur] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(1);

  const boxStyle = {
    width: 180,
    height: 180,
    borderRadius: `${borderRadius}px`,
    background: `hsl(${hue}, 80%, 55%)`,
    filter: `blur(${blur}px)`,
    transform: `rotate(${rotate}deg) scale(${scale})`,
    transition: "all 0.15s ease",
    boxShadow: `0 20px 50px -10px hsla(${hue},80%,55%,0.5)`,
  };

  const cssOutput = `.box {
  border-radius: ${borderRadius}px;
  background: hsl(${hue}, 80%, 55%);
  filter: blur(${blur}px);
  transform: rotate(${rotate}deg) scale(${scale});
}`;

  return (
    <div className="css-pg-wrap">
      <div className="css-pg-canvas">
        <div style={boxStyle}></div>
      </div>
      <div className="css-pg-controls">
        <Slider label="Border Radius" value={borderRadius} min={0} max={90} onChange={setBorderRadius} />
        <Slider label="Hue" value={hue} min={0} max={360} onChange={setHue} />
        <Slider label="Blur" value={blur} min={0} max={20} onChange={setBlur} />
        <Slider label="Rotate" value={rotate} min={0} max={360} onChange={setRotate} />
        <Slider label="Scale" value={scale} min={0.5} max={1.5} step={0.05} onChange={setScale} />
        <pre className="css-output">{cssOutput}</pre>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step = 1, onChange }) {
  return (
    <label className="css-pg-slider">
      <span>{label}: <b>{value}</b></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}
