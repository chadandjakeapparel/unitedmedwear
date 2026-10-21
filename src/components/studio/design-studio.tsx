"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { threadColors } from "@/content/site";
import {
  GarmentDrawing,
  garments,
  type GarmentId,
  type PlacementId,
} from "./garments";
import {
  ACCEPTED_TYPES,
  SAMPLE_LOGO,
  imageHasTransparency,
  prepareLogo,
  readLogoFile,
  readLogoUrl,
  type PreparedLogo,
} from "./logo-processing";
import { useStudioDesign } from "./studio-context";

type LetterStyle = "script" | "block" | "serif";
type LogoMode = "full" | "thread";
type View = "full" | "detail";
type LogoSource = { image: HTMLImageElement; isVector: boolean; name: string };

const letterStyles: { id: LetterStyle; label: string; font: string; ratio: number }[] = [
  { id: "script", label: "Script", font: "var(--font-script)", ratio: 0.42 },
  { id: "block", label: "Block", font: "var(--font-sans)", ratio: 0.58 },
  { id: "serif", label: "Serif", font: "var(--font-serif)", ratio: 0.46 },
];

const FULL_VIEW = { x: 0, y: 0, width: 400, height: 520 };
const ASPECT = FULL_VIEW.width / FULL_VIEW.height;

function luminance(hex: string) {
  const channel = (start: number) => {
    const value = parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

function contrast(a: string, b: string) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

type Box = { x: number; y: number; width: number; height: number };

// Frames the embroidered areas at the garment's aspect ratio.
function detailView(boxes: Box[]) {
  if (!boxes.length) return FULL_VIEW;
  const left = Math.min(...boxes.map((b) => b.x)) - 24;
  const top = Math.min(...boxes.map((b) => b.y)) - 24;
  const right = Math.max(...boxes.map((b) => b.x + b.width)) + 24;
  const bottom = Math.max(...boxes.map((b) => b.y + b.height)) + 24;
  let width = Math.max(right - left, 130);
  let height = bottom - top;
  if (width / height > ASPECT) height = width / ASPECT;
  else width = height * ASPECT;
  const cx = (left + right) / 2;
  const cy = (top + bottom) / 2;
  return {
    x: clamp(cx - width / 2, 0, FULL_VIEW.width - width),
    y: clamp(cy - height / 2, 0, FULL_VIEW.height - height),
    width,
    height,
  };
}

export function DesignStudio() {
  const { setDesign } = useStudioDesign();
  const fileInput = useRef<HTMLInputElement>(null);

  const [garmentId, setGarmentId] = useState<GarmentId>("lab-coat");
  const [colorName, setColorName] = useState("White");
  const [view, setView] = useState<View>("full");

  const [source, setSource] = useState<LogoSource | null>(null);
  const [logo, setLogo] = useState<PreparedLogo | null>(null);
  const [removeWhite, setRemoveWhite] = useState(true);
  const [logoMode, setLogoMode] = useState<LogoMode>("full");
  const [placementId, setPlacementId] = useState<PlacementId>("right-chest");
  const [widthIn, setWidthIn] = useState(3);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const [lines, setLines] = useState(["Dr. Alexandra Rivera", "MD", "Cardiology"]);
  const [letterStyle, setLetterStyle] = useState<LetterStyle>("script");
  const [thread, setThread] = useState(threadColors[0]);
  const [added, setAdded] = useState(false);

  const garment = garments.find((g) => g.id === garmentId) ?? garments[0];
  const color = garment.colors.find((c) => c.name === colorName) ?? garment.colors[0];
  const dark = luminance(color.value) < 0.18;
  const placement =
    garment.placements.find((p) => p.id === placementId) ?? garment.placements[0];
  const upi = garment.unitsPerInch;
  const style = letterStyles.find((s) => s.id === letterStyle) ?? letterStyles[0];
  const nameLines = lines.map((line) => line.trim()).filter(Boolean);
  const sharesChest = Boolean(logo) && placement.id === "left-chest" && nameLines.length > 0;

  const nameY = sharesChest ? garment.name.yWithLogo : garment.name.y;
  const nameSize = Math.min(
    letterStyle === "block" ? 7.5 : 10,
    62 / Math.max((nameLines[0]?.length ?? 1) * style.ratio, 1),
  );

  // Logo box in garment units, honoring the placement's size limits.
  let logoBox: Box | null = null;
  let logoInches = { width: 0, height: 0 };
  if (logo) {
    const maxHeightIn = sharesChest ? 1.75 : placement.maxHeightIn;
    let width = Math.min(widthIn, placement.maxWidthIn);
    let height = width / logo.aspect;
    if (height > maxHeightIn) {
      height = maxHeightIn;
      width = height * logo.aspect;
    }
    logoInches = { width, height };
    // Sharing the left chest, the logo sits just above the name.
    const centerY = sharesChest
      ? nameY - nameSize - 4 - (height * upi) / 2
      : placement.y;
    logoBox = {
      x: placement.x - (width * upi) / 2,
      y: centerY - (height * upi) / 2,
      width: width * upi,
      height: height * upi,
    };
  }

  const nameBox: Box | null = nameLines.length
    ? { x: garment.name.x - 34, y: nameY - nameSize, width: 68, height: nameSize + nameLines.length * 8 }
    : null;

  const viewBox =
    view === "detail"
      ? detailView([logoBox, nameBox].filter((b): b is Box => Boolean(b)))
      : FULL_VIEW;

  const threadContrast = contrast(thread.value, color.value);

  function process(next: LogoSource, clearWhite: boolean) {
    try {
      setLogo(prepareLogo(next.image, { ...next, removeWhite: clearWhite }));
      setError("");
      setView("detail");
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "Something went wrong.");
    }
  }

  async function loadFile(file: File) {
    setError("");
    try {
      const { image, isVector } = await readLogoFile(file);
      const next = { image, isVector, name: file.name };
      const clearWhite = !imageHasTransparency(image);
      setSource(next);
      setRemoveWhite(clearWhite);
      process(next, clearWhite);
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "Something went wrong.");
    }
  }

  async function loadSample() {
    const { image, isVector } = await readLogoUrl(SAMPLE_LOGO);
    const next = { image, isVector, name: "Sample crest" };
    setSource(next);
    setRemoveWhite(false);
    process(next, false);
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void loadFile(file);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void loadFile(file);
  }

  function removeLogo() {
    setSource(null);
    setLogo(null);
    setError("");
  }

  function chooseGarment(id: GarmentId) {
    const next = garments.find((g) => g.id === id) ?? garments[0];
    setGarmentId(id);
    setColorName(next.colors[0].name);
    if (next.id === "scrub-top" && thread.name === "Navy") {
      setThread(threadColors.find((t) => t.name === "White") ?? thread);
    }
  }

  function updateLine(index: number, value: string) {
    setLines((current) => current.map((line, i) => (i === index ? value : line)));
  }

  const summary = [
    `Garment: ${garment.label}, ${color.name}`,
    logo
      ? `Logo: ${logo.name}, ${placement.label.toLowerCase()}, ${logoInches.width.toFixed(2)} × ${logoInches.height.toFixed(2)} in, ${
          logoMode === "thread"
            ? `one color (${thread.name} thread)`
            : `full color (about ${logo.threadColors} thread colors)`
        }`
      : "Logo: none",
    nameLines.length
      ? `Name: ${nameLines.join(" / ")}, ${style.label.toLowerCase()} lettering, ${thread.name} thread, left chest`
      : "Name: none",
  ].join("\n");

  function addToQuote() {
    setDesign({ summary, hasLogo: Boolean(logo) });
    setAdded(true);
    document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
  }

  function printProof() {
    document.body.classList.add("printing-studio");
    const done = () => {
      document.body.classList.remove("printing-studio");
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    window.print();
  }

  const logoFilter = logoMode === "thread" ? "url(#ums-mono)" : "url(#ums-stitch)";
  const dim = viewBox.width / 150;

  return (
    <div className="ds">
      <div className="ds-stage">
        <div className="ds-toolbar">
          <p className="mono">
            Proof · {garment.label} · {color.name}
          </p>
          <div className="segmented segmented-small" role="group" aria-label="View">
            {(["full", "detail"] as const).map((option) => (
              <button
                aria-pressed={view === option}
                key={option}
                onClick={() => setView(option)}
                type="button"
              >
                {option === "full" ? "Full garment" : "Close-up"}
              </button>
            ))}
          </div>
        </div>

        <svg
          aria-label={`Preview of a ${color.name.toLowerCase()} ${garment.label.toLowerCase()}${logo ? " with your logo" : ""}${nameLines.length ? ` embroidered with ${nameLines.join(", ")}` : ""}`}
          className="ds-canvas"
          role="img"
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        >
          <defs>
            <pattern
              height="5"
              id="ums-twill"
              patternTransform="rotate(35)"
              patternUnits="userSpaceOnUse"
              width="5"
            >
              <line stroke={dark ? "rgba(255,255,255,0.06)" : "rgba(15,29,46,0.05)"} strokeWidth="1" x1="0" x2="0" y1="0" y2="5" />
            </pattern>
            <filter colorInterpolationFilters="sRGB" height="130%" id="ums-stitch" width="130%" x="-15%" y="-15%">
              <feTurbulence baseFrequency="1.4 0.35" numOctaves="2" result="grain" seed="4" type="fractalNoise" />
              <feColorMatrix in="grain" result="sheen" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 -0.18" />
              <feComposite in="sheen" in2="SourceGraphic" operator="in" result="sheenIn" />
              <feBlend in="sheenIn" in2="SourceGraphic" mode="screen" result="lit" />
              <feDropShadow dx="0" dy="0.35" floodOpacity="0.4" in="lit" stdDeviation="0.3" />
            </filter>
            <filter colorInterpolationFilters="sRGB" height="130%" id="ums-mono" width="130%" x="-15%" y="-15%">
              <feFlood floodColor={thread.value} />
              <feComposite in2="SourceAlpha" operator="in" result="base" />
              <feTurbulence baseFrequency="1.4 0.35" numOctaves="2" result="grain" seed="4" type="fractalNoise" />
              <feColorMatrix in="grain" result="sheen" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 -0.18" />
              <feComposite in="sheen" in2="base" operator="in" result="sheenIn" />
              <feBlend in="sheenIn" in2="base" mode="screen" result="lit" />
              <feDropShadow dx="0" dy="0.35" floodOpacity="0.4" in="lit" stdDeviation="0.3" />
            </filter>
          </defs>

          <GarmentDrawing dark={dark} fill={color.value} garment={garment.id} />

          {logo && logoBox ? (
            <image
              filter={logoFilter}
              height={logoBox.height}
              href={logo.src}
              preserveAspectRatio="xMidYMid meet"
              width={logoBox.width}
              x={logoBox.x}
              y={logoBox.y}
            />
          ) : null}

          {nameLines.length ? (
            <g fill={thread.value} filter="url(#ums-stitch)" textAnchor="middle">
              <text
                fontFamily={style.font}
                fontSize={nameSize}
                fontWeight={letterStyle === "block" ? 700 : 600}
                x={garment.name.x}
                y={nameY}
              >
                {nameLines[0]}
              </text>
              {nameLines.slice(1).map((line, index) => (
                <text
                  fontFamily="var(--font-sans)"
                  fontSize={index === 0 ? 5.4 : 4.6}
                  fontWeight="600"
                  key={index}
                  letterSpacing="0.3"
                  x={garment.name.x}
                  y={nameY + 8 + index * 7}
                >
                  {line.toUpperCase()}
                </text>
              ))}
            </g>
          ) : null}

          {view === "detail" && logoBox ? (
            <g className="ds-dimension" fontSize={4.2 * dim} strokeWidth={0.5 * dim}>
              <path
                d={`M${logoBox.x} ${logoBox.y - 6 * dim} H${logoBox.x + logoBox.width} M${logoBox.x} ${logoBox.y - 8 * dim} V${logoBox.y - 4 * dim} M${logoBox.x + logoBox.width} ${logoBox.y - 8 * dim} V${logoBox.y - 4 * dim}`}
              />
              <text textAnchor="middle" x={logoBox.x + logoBox.width / 2} y={logoBox.y - 8.5 * dim}>
                {logoInches.width.toFixed(2)} in
              </text>
              <path
                d={`M${logoBox.x - 6 * dim} ${logoBox.y} V${logoBox.y + logoBox.height} M${logoBox.x - 8 * dim} ${logoBox.y} H${logoBox.x - 4 * dim} M${logoBox.x - 8 * dim} ${logoBox.y + logoBox.height} H${logoBox.x - 4 * dim}`}
              />
              <text
                textAnchor="middle"
                transform={`rotate(-90 ${logoBox.x - 8.5 * dim} ${logoBox.y + logoBox.height / 2})`}
                x={logoBox.x - 8.5 * dim}
                y={logoBox.y + logoBox.height / 2}
              >
                {logoInches.height.toFixed(2)} in
              </text>
            </g>
          ) : null}
        </svg>

        <pre className="ds-spec mono">{summary}</pre>
      </div>

      <div className="ds-panel">
        <fieldset className="ds-group">
          <legend>
            <span className="mono">01</span> Garment
          </legend>
          <div className="segmented">
            {garments.map((option) => (
              <button
                aria-pressed={garment.id === option.id}
                key={option.id}
                onClick={() => chooseGarment(option.id)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="swatches" role="group" aria-label="Fabric color">
            {garment.colors.map((option) => (
              <button
                aria-label={`${option.name} fabric`}
                aria-pressed={color.name === option.name}
                key={option.name}
                onClick={() => setColorName(option.name)}
                style={{ background: option.value }}
                title={option.name}
                type="button"
              />
            ))}
            <span className="swatch-name">{color.name}</span>
          </div>
        </fieldset>

        <fieldset className="ds-group">
          <legend>
            <span className="mono">02</span> Logo
          </legend>

          {logo && source ? (
            <div className="logo-chip">
              {/* eslint-disable-next-line @next/next/no-img-element -- local data URL preview */}
              <img alt="" src={logo.src} />
              <div>
                <strong>{source.name}</strong>
                <span className="mono">
                  {logoInches.width.toFixed(2)} × {logoInches.height.toFixed(2)} in
                </span>
              </div>
              <button className="text-button" onClick={() => fileInput.current?.click()} type="button">
                Replace
              </button>
              <button className="text-button" onClick={removeLogo} type="button">
                Remove
              </button>
            </div>
          ) : (
            <label
              className={`dropzone${dragging ? " is-dragging" : ""}`}
              onDragLeave={() => setDragging(false)}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDrop={handleDrop}
            >
              <span className="dropzone-title">Drop your logo here, or browse</span>
              <span className="mono">PNG · JPG · SVG · WebP · up to 10 MB</span>
              <input
                accept={ACCEPTED_TYPES.join(",")}
                className="visually-hidden"
                onChange={handleFile}
                type="file"
              />
            </label>
          )}
          <input
            accept={ACCEPTED_TYPES.join(",")}
            aria-hidden="true"
            className="visually-hidden"
            onChange={handleFile}
            ref={fileInput}
            tabIndex={-1}
            type="file"
          />

          {!logo ? (
            <button className="text-button" onClick={() => void loadSample()} type="button">
              No file handy? Try a sample crest
            </button>
          ) : null}

          {error ? <p className="ds-error" role="alert">{error}</p> : null}

          {logo ? (
            <>
              <div className="ds-row">
                <span className="mono ds-label">Placement</span>
                <div className="segmented segmented-small">
                  {garment.placements.map((option) => (
                    <button
                      aria-pressed={placement.id === option.id}
                      key={option.id}
                      onClick={() => setPlacementId(option.id)}
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="ds-row">
                <span className="mono ds-label">
                  Width · {logoInches.width.toFixed(2)} in
                </span>
                <input
                  className="range"
                  max={placement.maxWidthIn}
                  min={1.5}
                  onChange={(event) => setWidthIn(Number(event.target.value))}
                  step={0.25}
                  type="range"
                  value={Math.min(widthIn, placement.maxWidthIn)}
                />
              </label>

              <div className="ds-row">
                <span className="mono ds-label">Stitched as</span>
                <div className="segmented segmented-small">
                  {(["full", "thread"] as const).map((option) => (
                    <button
                      aria-pressed={logoMode === option}
                      key={option}
                      onClick={() => setLogoMode(option)}
                      type="button"
                    >
                      {option === "full" ? "Full color" : "One thread color"}
                    </button>
                  ))}
                </div>
              </div>

              <label className="check">
                <input
                  checked={removeWhite}
                  onChange={(event) => {
                    setRemoveWhite(event.target.checked);
                    if (source) process(source, event.target.checked);
                  }}
                  type="checkbox"
                />
                <span>Remove white background</span>
              </label>

              {logo.warnings.length ? (
                <ul className="ds-notes">
                  {logo.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              ) : null}
            </>
          ) : null}

          <p className="ds-privacy">
            Your file stays on this device. Nothing is uploaded until you choose
            to send it to us.
          </p>
        </fieldset>

        <fieldset className="ds-group">
          <legend>
            <span className="mono">03</span> Name embroidery
          </legend>
          {["Name", "Credentials", "Department"].map((label, index) => (
            <label className="field" key={label}>
              <span className="mono">{label}</span>
              <input
                maxLength={index === 0 ? 30 : 34}
                onChange={(event) => updateLine(index, event.target.value)}
                placeholder={index === 0 ? "Leave blank for logo only" : "Optional"}
                value={lines[index]}
              />
            </label>
          ))}
          <div className="ds-row">
            <span className="mono ds-label">Lettering</span>
            <div className="segmented segmented-small">
              {letterStyles.map((option) => (
                <button
                  aria-pressed={letterStyle === option.id}
                  key={option.id}
                  onClick={() => setLetterStyle(option.id)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </fieldset>

        <fieldset className="ds-group">
          <legend>
            <span className="mono">04</span> Thread · {thread.name}
          </legend>
          <div className="threads">
            {threadColors.map((option) => (
              <button
                aria-label={`${option.name} thread`}
                aria-pressed={thread.name === option.name}
                key={option.name}
                onClick={() => setThread(option)}
                style={{ background: option.value }}
                title={option.name}
                type="button"
              />
            ))}
          </div>
          {threadContrast < 1.8 ? (
            <p className="ds-notes">
              {thread.name} thread will be hard to read on {color.name.toLowerCase()} fabric.
              That works for a subtle tone-on-tone look; pick a contrasting
              thread for legibility.
            </p>
          ) : null}
        </fieldset>

        <div className="ds-actions">
          <button className="button button-primary" onClick={addToQuote} type="button">
            Add this design to my quote
          </button>
          <button className="button button-ghost" onClick={printProof} type="button">
            Print or save proof
          </button>
          {added ? (
            <p className="mono ds-added" role="status">
              Added to your quote request below
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
