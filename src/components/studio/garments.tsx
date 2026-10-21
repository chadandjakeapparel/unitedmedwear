import type { CSSProperties } from "react";

// Garment drawings and embroidery placements for the design studio.
// All garments share a 400 × 520 drawing space; `unitsPerInch` converts real
// embroidery sizes into that space.

export type PlacementId = "right-chest" | "left-chest" | "left-sleeve";

export type Placement = {
  id: PlacementId;
  label: string;
  x: number;
  y: number;
  maxWidthIn: number;
  maxHeightIn: number;
};

export type GarmentId = "lab-coat" | "scrub-top";

export type Garment = {
  id: GarmentId;
  label: string;
  unitsPerInch: number;
  colors: { name: string; value: string }[];
  placements: Placement[];
  // Where the name block sits, and where it moves when a logo shares the chest.
  name: { x: number; y: number; yWithLogo: number };
};

export const garments: Garment[] = [
  {
    id: "lab-coat",
    label: "Lab coat",
    unitsPerInch: 8.6,
    colors: [
      { name: "White", value: "#f6f4ee" },
      { name: "Ivory", value: "#ece4d2" },
    ],
    placements: [
      { id: "right-chest", label: "Right chest", x: 150, y: 176, maxWidthIn: 4.5, maxHeightIn: 3.5 },
      { id: "left-chest", label: "Left chest", x: 258, y: 160, maxWidthIn: 4, maxHeightIn: 3 },
      { id: "left-sleeve", label: "Left sleeve", x: 333, y: 205, maxWidthIn: 3.25, maxHeightIn: 3.5 },
    ],
    name: { x: 258, y: 178, yWithLogo: 186 },
  },
  {
    id: "scrub-top",
    label: "Scrub top",
    unitsPerInch: 8,
    colors: [
      { name: "Navy", value: "#22324f" },
      { name: "Ceil", value: "#9cb6cd" },
      { name: "Royal", value: "#2e4f9c" },
      { name: "Hunter", value: "#2d5245" },
      { name: "Wine", value: "#6a2434" },
      { name: "Pewter", value: "#70757d" },
      { name: "Black", value: "#1d1f23" },
    ],
    placements: [
      { id: "right-chest", label: "Right chest", x: 150, y: 158, maxWidthIn: 4.5, maxHeightIn: 3.5 },
      { id: "left-chest", label: "Left chest", x: 254, y: 150, maxWidthIn: 4, maxHeightIn: 3 },
      { id: "left-sleeve", label: "Left sleeve", x: 334, y: 140, maxWidthIn: 3, maxHeightIn: 3 },
    ],
    name: { x: 254, y: 158, yWithLogo: 166 },
  },
];

const COAT_OUTLINE =
  "M170 38 Q200 28 230 38 L305 68 Q345 88 352 150 L360 360 L314 364 L292 196 L296 500 L104 500 L108 196 L86 364 L40 360 L48 150 Q55 88 95 68 Z";

const SCRUB_OUTLINE =
  "M165 48 Q200 40 235 48 L305 70 Q338 84 362 168 L318 196 L292 152 L294 440 L106 440 L108 152 L82 196 L38 168 Q62 84 95 70 Z";

export function GarmentDrawing({
  garment,
  fill,
  dark,
}: {
  garment: GarmentId;
  fill: string;
  dark: boolean;
}) {
  const detail = dark ? "rgba(255,255,255,0.4)" : "var(--ink)";

  if (garment === "scrub-top") {
    return (
      <g className="garment" style={{ "--detail": detail } as CSSProperties}>
        <path className="garment-body" d={SCRUB_OUTLINE} fill={fill} />
        <path className="garment-body garment-weave" d={SCRUB_OUTLINE} />
        <path className="garment-line" d="M165 48 L200 122 L235 48" />
        <path className="garment-line" d="M176 50 L200 104 L224 50" />
        <path className="garment-line garment-seam" d="M108 152 Q104 110 95 70" />
        <path className="garment-line garment-seam" d="M292 152 Q296 110 305 70" />
        <path className="garment-line garment-seam" d="M48 176 L86 190" />
        <path className="garment-line garment-seam" d="M352 176 L314 190" />
        <rect className="garment-line" height="46" rx="2" width="44" x="232" y="182" />
        <path className="garment-line garment-seam" d="M110 426 L290 426" />
        <path className="garment-line" d="M106 440 L106 410 M294 440 L294 410" />
      </g>
    );
  }

  return (
    <g className="garment" style={{ "--detail": detail } as CSSProperties}>
      <path className="garment-body" d={COAT_OUTLINE} fill={fill} />
      <path className="garment-body garment-weave" d={COAT_OUTLINE} />
      <path className="garment-line" d="M170 38 L180 62 L160 112 L183 120 L200 210" />
      <path className="garment-line" d="M230 38 L220 62 L240 112 L217 120 L200 210" />
      <path className="garment-line" d="M170 38 Q200 50 230 38" />
      <path className="garment-line" d="M200 210 L200 500" />
      <path className="garment-line garment-seam" d="M108 196 Q104 130 95 68" />
      <path className="garment-line garment-seam" d="M292 196 Q296 130 305 68" />
      <path className="garment-line garment-seam" d="M44 338 L87 341" />
      <path className="garment-line garment-seam" d="M356 338 L313 341" />
      <rect className="garment-line" height="62" rx="3" width="58" x="124" y="370" />
      <rect className="garment-line" height="62" rx="3" width="58" x="218" y="370" />
      <rect className="garment-line" height="40" rx="2" width="44" x="236" y="200" />
      <g className="garment-buttons">
        <circle cx="211" cy="240" r="4" />
        <circle cx="211" cy="300" r="4" />
        <circle cx="211" cy="360" r="4" />
        <circle cx="211" cy="420" r="4" />
      </g>
    </g>
  );
}
