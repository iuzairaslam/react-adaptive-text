import type React from 'react';
import type { Rgb } from './algorithm';
import {
  ContrastAlgorithm,
  getAdaptiveColor,
  getApcaContrast,
  getContrastRatio,
  getLuminance,
  isDark,
  isLight,
  meetsWcag,
  type WcagLevel,
} from './algorithm';

function clampByte(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

/** Pack sRGB into `#rrggbb`. */
export function rgbToHex(rgb: Rgb): string {
  const r = clampByte(rgb.r);
  const g = clampByte(rgb.g);
  const b = clampByte(rgb.b);
  return `#${[r, g, b]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('')}`;
}

/** Parse common hex strings (#rgb, #rrggbb, #rrggbbaa); alpha is dropped. */
export function hexToRgb(hex: string): Rgb {
  let h = hex.trim();
  if (h.startsWith('#')) {
    h = h.slice(1);
  }
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (h.length === 8) {
    h = h.slice(0, 6);
  }
  if (h.length !== 6) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: (n >> 16) & 0xff,
    g: (n >> 8) & 0xff,
    b: n & 0xff,
  };
}

function parseRgbLike(input: string): Rgb | null {
  const s = input.trim().toLowerCase();
  const m = s.match(
    /^rgba?\(\s*([+-]?\d*\.?\d+)\s*,\s*([+-]?\d*\.?\d+)\s*,\s*([+-]?\d*\.?\d+)(?:\s*,\s*([+-]?\d*\.?\d+)\s*)?\)$/i,
  );
  if (!m) return null;
  const r = Number(m[1]);
  const g = Number(m[2]);
  const b = Number(m[3]);
  if (![r, g, b].every((n) => Number.isFinite(n))) return null;
  return { r: clampByte(r), g: clampByte(g), b: clampByte(b) };
}

/**
 * Convert a CSS color string into sRGB.
 * Supports hex and rgb()/rgba(). For everything else, it falls back to the browser parser when available.
 */
export function colorValueToRgb(color: string): Rgb {
  const raw = color.trim();
  if (raw.length === 0) {
    throw new Error('Unsupported or invalid color: (empty)');
  }

  if (raw.startsWith('#')) {
    return hexToRgb(raw);
  }

  const rgb = parseRgbLike(raw);
  if (rgb) return rgb;

  if (typeof document !== 'undefined') {
    const el = document.createElement('div');
    el.style.color = '';
    el.style.color = raw;
    if (el.style.color) {
      document.body?.appendChild(el);
      const computed = getComputedStyle(el).color;
      el.remove();
      const parsed = parseRgbLike(computed);
      if (parsed) return parsed;
    }
  }

  throw new Error(`Unsupported or invalid color: ${String(color)}`);
}

/** Best WCAG black/white (or palette) as hex for this background. */
export function adaptiveTextHex(
  background: string,
  options?: {
    palette?: string[] | null;
    algorithm?: (typeof ContrastAlgorithm)[keyof typeof ContrastAlgorithm];
  },
): string {
  const bg = colorValueToRgb(background);
  const pal = options?.palette?.map(colorValueToRgb) ?? undefined;
  const rgb = getAdaptiveColor(bg, {
    palette: pal,
    algorithm: options?.algorithm,
  });
  return rgbToHex(rgb);
}

/** Same resolution as AdaptiveText; returns `#rrggbb`. */
export function adaptiveTextHexFromRgb(
  background: Rgb,
  options?: {
    palette?: Rgb[] | null;
    algorithm?: (typeof ContrastAlgorithm)[keyof typeof ContrastAlgorithm];
  },
): string {
  return rgbToHex(
    getAdaptiveColor(background, {
      palette: options?.palette,
      algorithm: options?.algorithm,
    }),
  );
}

/** Read `color` from a React style object. */
export function getExplicitColorFromStyle(
  style: React.CSSProperties | undefined,
): string | undefined {
  const c = style?.color;
  return typeof c === 'string' ? c : undefined;
}

/**
 * Ergonomic helpers mirroring Flutter’s `AdaptiveColorExtension` (no prototype patch).
 */
export const adaptiveRgb = {
  adaptiveTextColor(bg: Rgb): Rgb {
    return getAdaptiveColor(bg);
  },
  adaptiveTextColorFrom(
    bg: Rgb,
    palette: Rgb[],
    algorithm?: (typeof ContrastAlgorithm)[keyof typeof ContrastAlgorithm],
  ): Rgb {
    return getAdaptiveColor(bg, { palette, algorithm });
  },
  isLight,
  isDark,
  relativeLuminance: getLuminance,
  contrastRatioWith(a: Rgb, b: Rgb): number {
    return getContrastRatio(a, b);
  },
  meetsWcagWith(
    a: Rgb,
    b: Rgb,
    opts?: { level?: WcagLevel },
  ): boolean {
    return meetsWcag(a, b, opts);
  },
  apcaContrastOn(text: Rgb, background: Rgb): number {
    return getApcaContrast(text, background);
  },
};

