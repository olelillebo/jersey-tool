const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
};

function text(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      ...CORS_HEADERS,
      "content-type": "image/svg+xml; charset=utf-8",
      ...extraHeaders,
    },
    body,
  };
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      ...CORS_HEADERS,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

function escapeStyleCss(css) {
  return css.replace(/<\/style>/gi, "<\\/style>");
}

function toBase64(buffer) {
  return Buffer.from(buffer).toString("base64");
}

function familyToGoogle(family) {
  return String(family || "")
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\s+/g, "+");
}

function decodeHtmlEntities(value) {
  return String(value || "")
    .replace(/&quot;/gi, '"')
    .replace(/&#34;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&#39;/gi, "'");
}

function extractFontFamilies(svg) {
  const families = new Set();

  const attrMatches = svg.matchAll(/font-family="([^"]+)"/gi);
  for (const match of attrMatches) {
    const value = decodeHtmlEntities(match[1] || "");
    value
      .split(",")
      .map((f) => f.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean)
      .forEach((f) => {
        if (!["sans-serif", "serif", "monospace"].includes(f)) families.add(f);
      });
  }

  const styleMatches = svg.matchAll(/font-family:\s*([^;"]+)/gi);
  for (const match of styleMatches) {
    const value = decodeHtmlEntities(match[1] || "");
    value
      .split(",")
      .map((f) => f.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean)
      .forEach((f) => {
        if (!["sans-serif", "serif", "monospace"].includes(f)) families.add(f);
      });
  }

  return [...families];
}

function injectStyle(svg, cssText) {
  if (!cssText.trim()) return svg;

  const styleBlock = `<style type="text/css">${escapeStyleCss(cssText)}</style>`;

  if (/<defs[\s>]/i.test(svg)) {
    return svg.replace(/<\/defs>/i, `${styleBlock}</defs>`);
  }

  return svg.replace(/<svg([^>]*)>/i, `<svg$1><defs>${styleBlock}</defs>`);
}

function parseAttributes(attrText) {
  const out = {};
  for (const match of attrText.matchAll(/([:@\w-]+)\s*=\s*"([^"]*)"/g)) {
    out[match[1]] = decodeHtmlEntities(match[2]);
  }
  return out;
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function parseNumber(value, fallback = 0) {
  const n = Number.parseFloat(String(value ?? ""));
  return Number.isFinite(n) ? n : fallback;
}

function normalizeHexColor(value, fallback = "#000000") {
  const raw = String(value ?? "").trim();
  if (!raw) return fallback;
  const withHash = raw.startsWith("#") ? raw : `#${raw}`;
  const upper = withHash.toUpperCase();
  if (/^#[0-9A-F]{6}$/.test(upper)) return upper;
  if (/^#[0-9A-F]{8}$/.test(upper)) return upper.slice(0, 7);
  if (/^#[0-9A-F]{3}$/.test(upper)) {
    return `#${upper[1]}${upper[1]}${upper[2]}${upper[2]}${upper[3]}${upper[3]}`;
  }
  return fallback;
}

function extractQuadraticPath(d) {
  if (!d) return null;
  const m = d
    .replace(/,/g, " ")
    .match(
      /^\s*M\s*(-?\d*\.?\d+)\s+(-?\d*\.?\d+)\s+Q\s*(-?\d*\.?\d+)\s+(-?\d*\.?\d+)\s+(-?\d*\.?\d+)\s+(-?\d*\.?\d+)\s*$/i,
    );
  if (!m) return null;
  return {
    x0: Number(m[1]),
    y0: Number(m[2]),
    cx: Number(m[3]),
    cy: Number(m[4]),
    x1: Number(m[5]),
    y1: Number(m[6]),
  };
}

function quadPoint(curve, t) {
  const mt = 1 - t;
  return {
    x: mt * mt * curve.x0 + 2 * mt * t * curve.cx + t * t * curve.x1,
    y: mt * mt * curve.y0 + 2 * mt * t * curve.cy + t * t * curve.y1,
  };
}

function quadTangent(curve, t) {
  return {
    x: 2 * (1 - t) * (curve.cx - curve.x0) + 2 * t * (curve.x1 - curve.cx),
    y: 2 * (1 - t) * (curve.cy - curve.y0) + 2 * t * (curve.y1 - curve.cy),
  };
}

function buildCurveLut(curve, segments = 220) {
  const lut = [{ t: 0, len: 0, ...quadPoint(curve, 0) }];
  let total = 0;
  for (let i = 1; i <= segments; i += 1) {
    const t = i / segments;
    const p = quadPoint(curve, t);
    const prev = lut[lut.length - 1];
    total += Math.hypot(p.x - prev.x, p.y - prev.y);
    lut.push({ t, len: total, ...p });
  }
  return { lut, total };
}

function curveTAtLength(curveLut, len) {
  const { lut, total } = curveLut;
  const clamped = Math.max(0, Math.min(total, len));
  for (let i = 1; i < lut.length; i += 1) {
    const a = lut[i - 1];
    const b = lut[i];
    if (clamped <= b.len) {
      const span = b.len - a.len || 1;
      const ratio = (clamped - a.len) / span;
      return a.t + (b.t - a.t) * ratio;
    }
  }
  return 1;
}

function parseStartOffset(value, curveLength) {
  const text = String(value ?? "").trim();
  if (!text) return 0;
  if (text.endsWith("%")) {
    const p = Number.parseFloat(text.slice(0, -1));
    if (Number.isFinite(p)) return (curveLength * p) / 100;
    return 0;
  }
  const n = Number.parseFloat(text);
  return Number.isFinite(n) ? n : 0;
}

function extractFontWeight(attrs) {
  if (attrs["font-weight"]) {
    const w = parseInt(attrs["font-weight"], 10);
    if (Number.isFinite(w)) return w;
  }
  if (attrs.style) {
    const m = attrs.style.match(/font-weight:\s*([0-9]+)/i);
    if (m) {
      const w = parseInt(m[1], 10);
      if (Number.isFinite(w)) return w;
    }
  }
  return 700;
}

function extractFontFamily(attrs) {
  const direct = decodeHtmlEntities(attrs["font-family"] || "");
  if (direct.trim()) return direct.split(",")[0].trim().replace(/^['"]|['"]$/g, "");
  if (attrs.style) {
    const m = decodeHtmlEntities(attrs.style).match(/font-family:\s*([^;]+)/i);
    if (m) {
      return m[1].split(",")[0].trim().replace(/^['"]|['"]$/g, "");
    }
  }
  return "Barlow Condensed";
}

function extractLetterSpacing(attrs) {
  if (attrs["letter-spacing"]) return parseNumber(attrs["letter-spacing"], 0);
  if (attrs.style) {
    const m = attrs.style.match(/letter-spacing:\s*([-0-9.]+)/i);
    if (m) return parseNumber(m[1], 0);
  }
  return 0;
}

function extractDominantBaseline(attrs) {
  const direct = String(attrs["dominant-baseline"] || "").trim().toLowerCase();
  if (direct) return direct;
  if (attrs.style) {
    const m = String(attrs.style).match(/dominant-baseline:\s*([^;]+)/i);
    if (m) return String(m[1]).trim().toLowerCase();
  }
  return "";
}

function baselineShiftForDominantBaseline(font, fontSize, dominantBaseline) {
  if (dominantBaseline !== "middle" && dominantBaseline !== "central") return 0;
  const scale = fontSize / font.unitsPerEm;
  const asc = font.ascender * scale;
  const desc = Math.abs(font.descender * scale);
  // A full geometric-center shift over-corrects for typical sports numeral fonts.
  // Use a tuned factor to better match browser rendering of dominant-baseline="middle".
  return (asc - desc) * 0.35;
}

async function loadFontForFamilyAndWeight(family, weight, fontCache) {
  const cacheKey = `${family}|${weight}`;
  if (fontCache.has(cacheKey)) return fontCache.get(cacheKey);

  const { default: opentype } = await import("opentype.js");
  const cssUrl = `https://fonts.googleapis.com/css2?family=${familyToGoogle(family)}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
  const cssResp = await fetch(cssUrl);
  if (!cssResp.ok) return null;
  const cssText = await cssResp.text();

  const faces = [];
  for (const m of cssText.matchAll(/@font-face\s*{([\s\S]*?)}/g)) {
    const block = m[1] || "";
    const weightMatch = block.match(/font-weight:\s*([0-9]+)/i);
    const urlMatch = block.match(/url\((https:[^)]+)\)/i);
    if (!urlMatch) continue;
    faces.push({
      weight: weightMatch ? parseInt(weightMatch[1], 10) : 400,
      url: urlMatch[1],
    });
  }
  if (!faces.length) return null;
  faces.sort((a, b) => Math.abs(a.weight - weight) - Math.abs(b.weight - weight));
  const target = faces[0];

  const fontResp = await fetch(target.url);
  if (!fontResp.ok) return null;
  const fontBuf = await fontResp.arrayBuffer();
  const font = opentype.parse(fontBuf);
  fontCache.set(cacheKey, font);
  return font;
}

function buildGlyphMetrics(font, text, fontSize, letterSpacing) {
  const glyphs = font.stringToGlyphs(text);
  const scale = fontSize / font.unitsPerEm;
  const advances = [];
  let width = 0;
  for (let i = 0; i < glyphs.length; i += 1) {
    const g = glyphs[i];
    const k =
      i < glyphs.length - 1 ? font.getKerningValue(g, glyphs[i + 1]) * scale : 0;
    const adv = g.advanceWidth * scale + k + (i < glyphs.length - 1 ? letterSpacing : 0);
    advances.push(adv);
    width += adv;
  }
  return { glyphs, advances, width, scale };
}

function textAttrsToPaint(attrs, fillDefault = "#000000") {
  const fill = normalizeHexColor(attrs.fill || "", fillDefault);
  const strokeRaw = attrs.stroke || "";
  const stroke =
    strokeRaw && strokeRaw !== "none"
      ? normalizeHexColor(strokeRaw, "#000000")
      : "none";
  const strokeWidth =
    stroke !== "none" ? parseNumber(attrs["stroke-width"] || "0", 0) : 0;
  const strokeLinejoin = attrs["stroke-linejoin"] || "round";
  const strokeLinecap = attrs["stroke-linecap"] || "round";
  const paintOrder = attrs["paint-order"] || "stroke fill";
  return {
    fill,
    stroke,
    strokeWidth,
    strokeLinejoin,
    strokeLinecap,
    paintOrder,
  };
}

function glyphPathElement(pathData, transform, paint) {
  const parts = [
    `<path d="${escapeAttr(pathData)}"`,
    ` transform="${escapeAttr(transform)}"`,
    ` fill="${escapeAttr(paint.fill)}"`,
  ];
  if (paint.stroke !== "none" && paint.strokeWidth > 0) {
    parts.push(` stroke="${escapeAttr(paint.stroke)}"`);
    parts.push(` stroke-width="${escapeAttr(String(paint.strokeWidth))}"`);
    parts.push(` stroke-linejoin="${escapeAttr(paint.strokeLinejoin)}"`);
    parts.push(` stroke-linecap="${escapeAttr(paint.strokeLinecap)}"`);
  }
  parts.push(` paint-order="${escapeAttr(paint.paintOrder)}"`);
  parts.push(" />");
  return parts.join("");
}

function applyTextLengthAdjust(metrics, targetLength, lengthAdjust) {
  const adjusted = {
    glyphs: metrics.glyphs,
    advances: [...metrics.advances],
    width: metrics.width,
    scaleX: 1,
  };

  if (!Number.isFinite(targetLength) || targetLength <= 0 || metrics.width <= 0) {
    return adjusted;
  }

  const mode = String(lengthAdjust || "spacing").trim();
  if (mode === "spacingAndGlyphs") {
    const sx = targetLength / metrics.width;
    adjusted.scaleX = sx;
    adjusted.advances = adjusted.advances.map((adv) => adv * sx);
    adjusted.width = targetLength;
    return adjusted;
  }

  if (adjusted.advances.length > 1) {
    const extra = (targetLength - metrics.width) / (adjusted.advances.length - 1);
    adjusted.advances = adjusted.advances.map((adv, i) =>
      i < adjusted.advances.length - 1 ? adv + extra : adv,
    );
    adjusted.width = adjusted.advances.reduce((sum, v) => sum + v, 0);
  }

  return adjusted;
}

async function convertTextToPaths(svg) {
  const pathById = new Map();
  for (const m of svg.matchAll(/<path\b([^>]*?)\/?>/gi)) {
    const attrs = parseAttributes(m[1] || "");
    if (attrs.id && attrs.d) pathById.set(attrs.id, attrs.d);
  }

  const fontCache = new Map();
  const textMatches = [...svg.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/gi)];
  if (!textMatches.length) return svg;

  let cursor = 0;
  let out = "";
  for (const match of textMatches) {
    const full = match[0];
    const idx = match.index ?? 0;
    out += svg.slice(cursor, idx);
    cursor = idx + full.length;

    const textAttrs = parseAttributes(match[1] || "");
    const inner = match[2] || "";
    const family = extractFontFamily(textAttrs);
    const weight = extractFontWeight(textAttrs);
    const fontSize = parseNumber(textAttrs["font-size"], 4);
    const dominantBaseline = extractDominantBaseline(textAttrs);
    const letterSpacing = extractLetterSpacing(textAttrs);
    const paint = textAttrsToPaint(textAttrs);
    const anchor = textAttrs["text-anchor"] || "start";

    const textPathMatch = inner.match(/<textPath\b([^>]*)>([\s\S]*?)<\/textPath>/i);
    const textValueRaw = textPathMatch
      ? textPathMatch[2]
      : inner.replace(/<[^>]+>/g, "");
    const textValue = String(textValueRaw || "").replace(/\s+/g, " ").trim();
    if (!textValue) {
      out += full;
      continue;
    }

    const font = await loadFontForFamilyAndWeight(family, weight, fontCache);
    if (!font) {
      out += full;
      continue;
    }

    const metrics = buildGlyphMetrics(font, textValue, fontSize, letterSpacing);
    const textPathAttrs = textPathMatch
      ? parseAttributes(textPathMatch[1] || "")
      : {};
    const textLengthRaw = textPathMatch
      ? textPathAttrs.textLength || textAttrs.textLength || ""
      : textAttrs.textLength || "";
    const targetTextLength = parseNumber(textLengthRaw, NaN);
    const lengthAdjust = textPathMatch
      ? textPathAttrs.lengthAdjust || textAttrs.lengthAdjust || "spacing"
      : textAttrs.lengthAdjust || "spacing";
    const adjusted = applyTextLengthAdjust(
      metrics,
      targetTextLength,
      lengthAdjust,
    );
    const glyphPieces = [];

    if (textPathMatch) {
      const tpAttrs = textPathAttrs;
      const hrefRaw = tpAttrs.href || tpAttrs["xlink:href"] || "";
      const id = hrefRaw.replace(/^#/, "");
      const d = pathById.get(id);
      const curve = extractQuadraticPath(d || "");
      if (!curve) {
        out += full;
        continue;
      }
      const curveLut = buildCurveLut(curve);
      const pathLen = curveLut.total;
      const offset = parseStartOffset(tpAttrs.startOffset, pathLen);
      const startX =
        anchor === "middle" ? offset - adjusted.width / 2 : offset;

      let advance = 0;
      for (let i = 0; i < adjusted.glyphs.length; i += 1) {
        const glyph = adjusted.glyphs[i];
        const adv = adjusted.advances[i] ?? 0;
        const s = startX + advance;
        const center = s + adv / 2;
        const t = curveTAtLength(curveLut, center);
        const p = quadPoint(curve, t);
        const tan = quadTangent(curve, t);
        const angle = (Math.atan2(tan.y, tan.x) * 180) / Math.PI;
        const pathData = glyph.getPath(0, 0, fontSize).toPathData(3);
        const sx = adjusted.scaleX;
        const transform =
          `translate(${p.x.toFixed(3)} ${p.y.toFixed(3)}) ` +
          `rotate(${angle.toFixed(3)}) ` +
          `translate(${(-adv / 2).toFixed(3)} 0)` +
          (sx !== 1 ? ` scale(${sx.toFixed(6)} 1)` : "");
        glyphPieces.push(glyphPathElement(pathData, transform, paint));
        advance += adv;
      }
    } else {
      const x = parseNumber(textAttrs.x, 0);
      const y =
        parseNumber(textAttrs.y, 0) +
        baselineShiftForDominantBaseline(font, fontSize, dominantBaseline);
      const startX = anchor === "middle" ? x - adjusted.width / 2 : x;
      let advance = 0;
      for (let i = 0; i < adjusted.glyphs.length; i += 1) {
        const glyph = adjusted.glyphs[i];
        const gx = startX + advance;
        const pathData = glyph.getPath(0, 0, fontSize).toPathData(3);
        const sx = adjusted.scaleX;
        glyphPieces.push(
          `<path d="${escapeAttr(pathData)}" transform="translate(${escapeAttr(
            gx.toFixed(3),
          )} ${escapeAttr(y.toFixed(3))})${
            sx !== 1 ? escapeAttr(` scale(${sx.toFixed(6)} 1)`) : ""
          }" fill="${escapeAttr(paint.fill)}" paint-order="${escapeAttr(
            paint.paintOrder,
          )}"${
            paint.stroke !== "none" && paint.strokeWidth > 0
              ? ` stroke="${escapeAttr(paint.stroke)}" stroke-width="${escapeAttr(
                  String(paint.strokeWidth),
                )}" stroke-linejoin="${escapeAttr(
                  paint.strokeLinejoin,
                )}" stroke-linecap="${escapeAttr(paint.strokeLinecap)}"`
              : ""
          } />`,
        );
        advance += adjusted.advances[i] ?? 0;
      }
    }

    out += glyphPieces.join("");
  }

  out += svg.slice(cursor);
  return out;
}

async function inlineGoogleFonts(svg) {
  const families = extractFontFamilies(svg);
  if (!families.length) return svg;

  const cssBlocks = [];

  for (const family of families) {
    try {
      const cssUrl = `https://fonts.googleapis.com/css2?family=${familyToGoogle(family)}:wght@400;500;600;700;800;900&display=swap`;
      const cssResp = await fetch(cssUrl);
      if (!cssResp.ok) continue;

      let cssText = await cssResp.text();
      const urls = Array.from(cssText.matchAll(/url\((https:[^)]+)\)/g)).map(
        (m) => m[1],
      );

      for (const fontUrl of urls) {
        try {
          const fontResp = await fetch(fontUrl);
          if (!fontResp.ok) continue;
          const buf = await fontResp.arrayBuffer();
          const b64 = toBase64(buf);
          cssText = cssText.replace(fontUrl, `data:font/woff2;base64,${b64}`);
        } catch {
          // Skip one failed font URL and continue
        }
      }

      cssBlocks.push(cssText);
    } catch {
      // Skip one failed family and continue
    }
  }

  if (!cssBlocks.length) return svg;
  return injectStyle(svg, cssBlocks.join("\n"));
}

function ensureNamespaces(svg) {
  let out = svg;
  if (!/xmlns=/.test(out)) {
    out = out.replace(
      /<svg\b/i,
      '<svg xmlns="http://www.w3.org/2000/svg"',
    );
  }
  if (!/xmlns:xlink=/.test(out)) {
    out = out.replace(
      /<svg\b/i,
      '<svg xmlns:xlink="http://www.w3.org/1999/xlink"',
    );
  }
  return out;
}

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return text(204, "");
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const svg = String(body.svg || "");
    if (!svg.trim().startsWith("<svg")) {
      return json(400, { error: "Invalid SVG payload" });
    }
    if (svg.length > 2_000_000) {
      return json(413, { error: "SVG payload too large" });
    }

    const withNs = ensureNamespaces(svg);
    let processed = withNs;

    try {
      processed = await convertTextToPaths(processed);
    } catch {
      // If path conversion fails, still return portable SVG with embedded fonts.
    }
    const withFonts = await inlineGoogleFonts(processed);

    return text(200, withFonts, {
      "cache-control": "no-store",
    });
  } catch (error) {
    return json(500, {
      error: error instanceof Error ? error.message : "Unknown server error",
    });
  }
};
