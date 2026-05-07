import {
  BLACK,
  WHITE,
  ContrastAlgorithm,
  WcagLevel,
  getAdaptiveColor,
  getApcaContrast,
  getContrastRatio,
  getLuminance,
  isDark,
  isLight,
  meetsWcag,
  wcagMinimumRatio,
} from '../algorithm';

describe('algorithm', () => {
  test('luminance bounds', () => {
    expect(getLuminance(BLACK)).toBeCloseTo(0);
    expect(getLuminance(WHITE)).toBeCloseTo(1);
  });

  test('contrast ratio is symmetric', () => {
    const a = { r: 10, g: 20, b: 30 };
    const b = { r: 200, g: 210, b: 220 };
    expect(getContrastRatio(a, b)).toBeCloseTo(getContrastRatio(b, a));
  });

  test('getAdaptiveColor picks white for dark background', () => {
    const bg = { r: 0, g: 0, b: 0 };
    expect(getAdaptiveColor(bg)).toEqual(WHITE);
  });

  test('getAdaptiveColor picks black for light background', () => {
    const bg = { r: 255, g: 255, b: 255 };
    expect(getAdaptiveColor(bg)).toEqual(BLACK);
  });

  test('meetsWcag is true for black on white', () => {
    expect(meetsWcag(BLACK, WHITE)).toBe(true);
  });

  test('apca returns opposite signs for swapped roles', () => {
    const lc1 = getApcaContrast(BLACK, WHITE);
    const lc2 = getApcaContrast(WHITE, BLACK);
    expect(Math.sign(lc1)).toBe(-Math.sign(lc2));
  });

  test('isLight / isDark partition mid gray correctly', () => {
    expect(isLight(WHITE)).toBe(true);
    expect(isDark(BLACK)).toBe(true);
    expect(isLight(BLACK)).toBe(false);
  });

  test('wcagMinimumRatio thresholds', () => {
    expect(wcagMinimumRatio(WcagLevel.aa)).toBe(4.5);
    expect(wcagMinimumRatio(WcagLevel.aaa)).toBe(7);
  });

  test('WCAG palette: picks highest luminance-ratio candidate', () => {
    const bg = { r: 0, g: 0, b: 0 };
    const red = { r: 230, g: 20, b: 40 };
    const dimBlue = { r: 30, g: 40, b: 80 };
    const picked = getAdaptiveColor(bg, {
      palette: [dimBlue, red],
      algorithm: ContrastAlgorithm.wcag,
    });
    expect(getContrastRatio(picked, bg)).toBeGreaterThanOrEqual(
      getContrastRatio(dimBlue, bg),
    );
    expect(picked).toEqual(red);
  });

  test('empty palette falls back like black-or-white routing', () => {
    expect(getAdaptiveColor(BLACK, { palette: [] })).toEqual(WHITE);
    expect(getAdaptiveColor(WHITE, { palette: [] })).toEqual(BLACK);
  });

  test('APCA palette picks candidate with strongest |Lc|', () => {
    const bg = { r: 20, g: 20, b: 20 };
    const candA = { r: 240, g: 240, b: 240 };
    const candB = { r: 50, g: 50, b: 50 };
    const picked = getAdaptiveColor(bg, {
      palette: [candA, candB],
      algorithm: ContrastAlgorithm.apca,
    });
    const score = (rgb: typeof candA) => Math.abs(getApcaContrast(rgb, bg));
    expect(score(picked)).toBeGreaterThanOrEqual(score(candB));
    expect(score(picked)).toBeGreaterThanOrEqual(score(candA));
  });

  test('explicit algorithm apca monochrome still returns black or white from candidates', () => {
    expect(
      getAdaptiveColor({ r: 0, g: 0, b: 0 }, {
        algorithm: ContrastAlgorithm.apca,
      }),
    ).toEqual(WHITE);
  });
});
