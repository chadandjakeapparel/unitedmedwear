// Client-side logo preparation for the design studio. Nothing leaves the
// browser: files are decoded into a canvas, optionally cleared of a white
// background, trimmed to their artwork and re-encoded as a data URL.

export type PreparedLogo = {
  name: string;
  src: string;
  aspect: number;
  sourceWidth: number;
  threadColors: number;
  warnings: string[];
};

export const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "image/webp",
];
const MAX_BYTES = 10 * 1024 * 1024;
const WORKING_SIZE = 800;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("unreadable"));
    image.src = src;
  });
}

export async function readLogoFile(file: File) {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error(
      "Preview supports PNG, JPG, SVG or WebP. AI, EPS and PDF files can still be sent with your quote request.",
    );
  }
  if (file.size > MAX_BYTES) {
    throw new Error("That file is over 10 MB. Try a smaller export of your logo.");
  }
  const src = URL.createObjectURL(file);
  try {
    const image = await loadImage(src);
    return { image, isVector: file.type === "image/svg+xml" };
  } catch {
    throw new Error("We couldn't read that image. Try exporting it as a PNG.");
  } finally {
    URL.revokeObjectURL(src);
  }
}

export async function readLogoUrl(src: string) {
  return { image: await loadImage(src), isVector: true };
}

function drawToCanvas(image: HTMLImageElement) {
  // SVGs without intrinsic dimensions report 0; give them a working size.
  const width = image.naturalWidth || WORKING_SIZE;
  const height = image.naturalHeight || WORKING_SIZE;
  const scale = Math.min(1, WORKING_SIZE / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Your browser couldn't prepare the preview.");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return { canvas, context, sourceWidth: width };
}

function hasTransparency(data: Uint8ClampedArray) {
  let clear = 0;
  for (let i = 3; i < data.length; i += 16) {
    if (data[i] < 250) clear += 1;
  }
  return clear / (data.length / 16) > 0.02;
}

// Fades near-white, low-saturation pixels to transparent with a soft edge.
function clearWhite(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const low = Math.min(r, g, b);
    const spread = Math.max(r, g, b) - low;
    if (low > 205 && spread < 28) {
      data[i + 3] = Math.round(data[i + 3] * ((255 - low) / 50));
    }
  }
}

// Rough count of distinct thread colors: bucket opaque pixels into a coarse
// color cube and count buckets holding a meaningful share of the artwork.
function estimateColors(data: Uint8ClampedArray) {
  const buckets = new Map<number, number>();
  let total = 0;
  for (let i = 0; i < data.length; i += 8) {
    if (data[i + 3] < 160) continue;
    const key = ((data[i] >> 6) << 4) | ((data[i + 1] >> 6) << 2) | (data[i + 2] >> 6);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
    total += 1;
  }
  if (!total) return 0;
  let count = 0;
  for (const value of buckets.values()) {
    if (value / total > 0.025) count += 1;
  }
  return count;
}

function trim(canvas: HTMLCanvasElement, data: Uint8ClampedArray) {
  const { width, height } = canvas;
  let top = height;
  let left = width;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] > 24) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }
  if (right < 0) return null;
  const trimmed = document.createElement("canvas");
  trimmed.width = right - left + 1;
  trimmed.height = bottom - top + 1;
  trimmed.getContext("2d")?.drawImage(canvas, -left, -top);
  return trimmed;
}

export function prepareLogo(
  image: HTMLImageElement,
  options: { name: string; isVector: boolean; removeWhite: boolean },
): PreparedLogo {
  const { canvas, context, sourceWidth } = drawToCanvas(image);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  if (options.removeWhite) clearWhite(pixels.data);
  context.putImageData(pixels, 0, 0);

  const trimmed = trim(canvas, pixels.data);
  if (!trimmed) {
    throw new Error(
      "That image looks blank after removing the white background. Turn off background removal and try again.",
    );
  }

  const threadColors = estimateColors(pixels.data);
  const warnings: string[] = [];
  if (!options.isVector && sourceWidth < 300) {
    warnings.push(
      "Low resolution. For production we'll need a vector file (SVG, AI, EPS, PDF) or a PNG at least 1000px wide.",
    );
  }
  if (threadColors > 6) {
    warnings.push(
      `About ${threadColors} colors detected. Embroidery reads best at 3–4 thread colors; we'll simplify it during digitizing, or try the one-color version.`,
    );
  }

  return {
    name: options.name,
    src: trimmed.toDataURL("image/png"),
    aspect: trimmed.width / trimmed.height,
    sourceWidth,
    threadColors,
    warnings,
  };
}

export function imageHasTransparency(image: HTMLImageElement) {
  const { canvas, context } = drawToCanvas(image);
  return hasTransparency(
    context.getImageData(0, 0, canvas.width, canvas.height).data,
  );
}

// A fictional crest so visitors without a file can see the studio working.
export const SAMPLE_LOGO = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="480" viewBox="0 0 600 480">
  <path d="M300 30 L470 90 L470 230 C470 330 395 400 300 450 C205 400 130 330 130 230 L130 90 Z" fill="#1c2f55"/>
  <path d="M300 62 L442 112 L442 230 C442 316 380 374 300 418 C220 374 158 316 158 230 L158 112 Z" fill="none" stroke="#f4f1ea" stroke-width="8"/>
  <rect x="275" y="140" width="50" height="190" rx="6" fill="#c8463f"/>
  <rect x="205" y="210" width="190" height="50" rx="6" fill="#c8463f"/>
  <path d="M190 360 Q300 300 410 360" fill="none" stroke="#f4f1ea" stroke-width="10" stroke-linecap="round"/>
</svg>`,
)}`;
