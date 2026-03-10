const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

function normalizeHex(hex: string): string {
  let c = hex?.trim().replace(/^#/, "");
  if (c?.length === 3) {
    // expand #rgb -> #rrggbb
    c = c
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  if (c?.length !== 6) return "000000";
  return c?.toLowerCase();
}

function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  const R = r / 255,
    G = g / 255,
    B = b / 255;
  const max = Math.max(R, G, B),
    min = Math.min(R, G, B);
  const l = (max + min) / 2;
  const d = max - min;

  if (d === 0) return { h: 0, s: 0, l }; // grey

  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  switch (max) {
    case R:
      h = (G - B) / d + (G < B ? 6 : 0);
      break;
    case G:
      h = (B - R) / d + 2;
      break;
    default:
      h = (R - G) / d + 4;
      break;
  }
  h /= 6;
  return { h, s, l };
}

function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  if (s === 0) {
    const v = Math.round(clamp01(l) * 255);
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  return { r, g, b };
}

const toHex = (n: number) => n.toString(16).padStart(2, "0");

export function darken(hex: string, amt = 0.15): string {
  const c = normalizeHex(hex);
  const n = parseInt(c, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;

  const { h, s, l } = rgbToHsl(r, g, b);
  const l2 = clamp01(l - amt);
  const { r: R, g: G, b: B } = hslToRgb(h, s, l2);

  return `#${toHex(R)}${toHex(G)}${toHex(B)}`;
}
