"use client";

import { useState } from "react";
import { threadColors } from "@/content/site";

type LetterStyle = "script" | "block";

const callouts = [
  { id: "A", x: 168, y: 92, label: "Notched lapel, pressed flat" },
  { id: "B", x: 258, y: 150, label: "Name & credentials, left chest" },
  { id: "C", x: 142, y: 152, label: "Institution logo, right chest" },
  { id: "D", x: 336, y: 196, label: "Program patch, left sleeve" },
  { id: "E", x: 150, y: 470, label: "Length cut to role" },
];

// Rough fit of a line of embroidery into the detail panel's width.
function fitSize(text: string, max: number, width: number, ratio: number) {
  return Math.min(max, width / Math.max(text.length * ratio, 1));
}

export function CoatStudio() {
  const [name, setName] = useState("Dr. Alexandra Rivera");
  const [title, setTitle] = useState("MD · Cardiology");
  const [thread, setThread] = useState(threadColors[0]);
  const [letterStyle, setLetterStyle] = useState<LetterStyle>("script");

  const fontFamily =
    letterStyle === "script" ? "var(--font-script)" : "var(--font-sans)";
  const nameRatio = letterStyle === "script" ? 0.42 : 0.56;
  const nameSize = fitSize(name, 40, 330, nameRatio);
  const titleSize = fitSize(title, 20, 300, 0.58);

  return (
    <div className="studio">
      <div className="studio-stage">
        <span className="crop crop-tl" />
        <span className="crop crop-tr" />
        <span className="crop crop-bl" />
        <span className="crop crop-br" />
        <p className="studio-sheet-label mono">
          Sheet UM-100 · Physician coat · Front
        </p>

        <svg
          aria-label={`Lab coat preview embroidered with ${name}, ${title}`}
          className="coat"
          role="img"
          viewBox="0 0 400 520"
        >
          <defs>
            <pattern
              height="6"
              id="coat-twill"
              patternTransform="rotate(35)"
              patternUnits="userSpaceOnUse"
              width="6"
            >
              <line stroke="var(--coat-weave)" strokeWidth="1" x1="0" x2="0" y1="0" y2="6" />
            </pattern>
          </defs>

          <g className="coat-draw">
            <path
              className="coat-body"
              pathLength="100"
              d="M170 38 Q200 28 230 38 L305 68 Q345 88 352 150 L360 360 L314 364 L292 196 L296 500 L104 500 L108 196 L86 364 L40 360 L48 150 Q55 88 95 68 Z"
            />
            <path className="coat-body coat-weave" d="M170 38 Q200 28 230 38 L305 68 Q345 88 352 150 L360 360 L314 364 L292 196 L296 500 L104 500 L108 196 L86 364 L40 360 L48 150 Q55 88 95 68 Z" />
            <path pathLength="100" className="coat-line" d="M170 38 L180 62 L160 112 L183 120 L200 210" />
            <path pathLength="100" className="coat-line" d="M230 38 L220 62 L240 112 L217 120 L200 210" />
            <path pathLength="100" className="coat-line" d="M170 38 Q200 50 230 38" />
            <path pathLength="100" className="coat-line" d="M200 210 L200 500" />
            <path className="coat-line coat-seam" d="M108 196 Q104 130 95 68" />
            <path className="coat-line coat-seam" d="M292 196 Q296 130 305 68" />
            <path className="coat-line coat-seam" d="M44 338 L87 341" />
            <path className="coat-line coat-seam" d="M356 338 L313 341" />
            <rect pathLength="100" className="coat-line" height="62" rx="3" width="58" x="124" y="370" />
            <rect pathLength="100" className="coat-line" height="62" rx="3" width="58" x="218" y="370" />
            <rect pathLength="100" className="coat-line" height="40" rx="2" width="44" x="236" y="200" />
            <path className="coat-pen" d="M247 200 L247 184 M253 200 L253 188" />
            <g className="coat-buttons">
              <circle cx="211" cy="240" r="4" />
              <circle cx="211" cy="300" r="4" />
              <circle cx="211" cy="360" r="4" />
              <circle cx="211" cy="420" r="4" />
            </g>
          </g>

          <g fill={thread.value}>
            <text
              fontFamily={fontFamily}
              fontSize={letterStyle === "script" ? 11 : 8}
              fontWeight={letterStyle === "script" ? 500 : 700}
              textAnchor="middle"
              x="258"
              y="178"
            >
              {name.length > 22 ? `${name.slice(0, 21)}…` : name}
            </text>
            <text
              fontFamily="var(--font-sans)"
              fontSize="6"
              fontWeight="600"
              letterSpacing="0.4"
              textAnchor="middle"
              x="258"
              y="190"
            >
              {title}
            </text>
          </g>

          <g className="coat-logo" stroke={thread.value}>
            <circle cx="142" cy="178" fill="none" r="11" strokeWidth="1.4" />
            <path d="M142 171v14M135 178h14" strokeLinecap="round" strokeWidth="2.4" />
          </g>

          <g className="coat-patch">
            <path d="M326 186 L346 184 L348 208 L337 216 L328 209 Z" fill={thread.value} />
            <path d="M337 192v14M330 199h14" stroke="var(--coat)" strokeLinecap="round" strokeWidth="2" />
          </g>

          <g className="coat-callouts">
            {callouts.map((callout) => (
              <g key={callout.id}>
                <circle cx={callout.x} cy={callout.y} r="9" />
                <text textAnchor="middle" x={callout.x} y={callout.y + 3.5}>
                  {callout.id}
                </text>
              </g>
            ))}
          </g>
        </svg>

        <ol className="callout-legend mono">
          {callouts.map((callout) => (
            <li key={callout.id}>
              <span>{callout.id}</span>
              {callout.label}
            </li>
          ))}
        </ol>
      </div>

      <div className="studio-controls">
        <div className="detail">
          <p className="mono detail-label">Detail B · 1:1 · Left chest</p>
          <svg
            aria-hidden="true"
            className="detail-swatch"
            viewBox="0 0 360 140"
          >
            <rect fill="var(--coat)" height="140" width="360" />
            <rect fill="url(#coat-twill)" height="140" width="360" />
            <g fill={thread.value}>
              <text
                className="stitch-text"
                fontFamily={fontFamily}
                fontSize={nameSize}
                fontWeight={letterStyle === "script" ? 600 : 700}
                key={`${name}-${letterStyle}`}
                textAnchor="middle"
                x="180"
                y="70"
              >
                {name}
              </text>
              <text
                fontFamily="var(--font-sans)"
                fontSize={titleSize}
                fontWeight="600"
                letterSpacing="1.2"
                textAnchor="middle"
                x="180"
                y="108"
              >
                {title.toUpperCase()}
              </text>
            </g>
          </svg>
        </div>

        <div className="studio-fields">
          <label className="field">
            <span className="mono">Line 1 · Name</span>
            <input
              maxLength={32}
              onChange={(event) => setName(event.target.value)}
              value={name}
            />
          </label>
          <label className="field">
            <span className="mono">Line 2 · Credentials / department</span>
            <input
              maxLength={34}
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
          </label>

          <fieldset className="field">
            <legend className="mono">Lettering</legend>
            <div className="segmented">
              {(["script", "block"] as const).map((option) => (
                <button
                  aria-pressed={letterStyle === option}
                  key={option}
                  onClick={() => setLetterStyle(option)}
                  type="button"
                >
                  {option === "script" ? "Script" : "Block"}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="field">
            <legend className="mono">Thread · {thread.name}</legend>
            <div className="threads">
              {threadColors.map((color) => (
                <button
                  aria-label={`${color.name} thread`}
                  aria-pressed={thread.name === color.name}
                  key={color.name}
                  onClick={() => setThread(color)}
                  style={{ background: color.value }}
                  type="button"
                />
              ))}
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}
