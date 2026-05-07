import { ContrastAlgorithm } from '../algorithm';
import {
  adaptiveRgb,
  adaptiveTextHex,
  adaptiveTextHexFromRgb,
  colorValueToRgb,
  getExplicitColorFromStyle,
  hexToRgb as hexToRgbUtil,
  rgbToHex,
} from '../colorUtils';

describe('colorUtils', () => {
  test('hexToRgb supports #rgb', () => {
    expect(hexToRgbUtil('#0f0')).toEqual({ r: 0, g: 255, b: 0 });
  });

  test('rgbToHex clamps', () => {
    expect(rgbToHex({ r: 999, g: -10, b: 128.1 })).toBe('#ff0080');
  });

  test('invalid hex throws', () => {
    expect(() => hexToRgbUtil('#zzz')).toThrow(/Invalid hex/);
  });

  test('colorValueToRgb supports rgb()', () => {
    expect(colorValueToRgb('rgb(1, 2, 3)')).toEqual({ r: 1, g: 2, b: 3 });
  });

  test('colorValueToRgb supports rgba() (alpha ignored)', () => {
    expect(colorValueToRgb('rgba(10, 20, 30, 0.5)')).toEqual({
      r: 10,
      g: 20,
      b: 30,
    });
  });

  test('colorValueToRgb rejects empty string', () => {
    expect(() => colorValueToRgb('')).toThrow(/empty/);
  });

  test('adaptiveTextHex on black returns white-ish hex', () => {
    expect(adaptiveTextHex('#000')).toBe('#ffffff');
  });

  test('adaptiveTextHex respects WCAG palette', () => {
    const fg = adaptiveTextHex('#000000', {
      palette: ['#1565c0', '#eeeeee'],
      algorithm: ContrastAlgorithm.wcag,
    });
    expect(fg).toMatch(/^#[0-9a-f]{6}$/i);
  });

  test('adaptiveTextHexFromRgb matches adaptiveTextHex for same inputs', () => {
    const bg = hexToRgbUtil('#1a237e');
    expect(
      adaptiveTextHexFromRgb(bg, { algorithm: ContrastAlgorithm.wcag }),
    ).toBe(adaptiveTextHex('#1a237e'));
  });

  test('getExplicitColorFromStyle', () => {
    expect(getExplicitColorFromStyle({ color: 'red' })).toBe('red');
    expect(getExplicitColorFromStyle(undefined)).toBeUndefined();
    expect(getExplicitColorFromStyle({ color: undefined })).toBeUndefined();
  });

  describe('adaptiveRgb', () => {
    test('adaptiveTextColor matches getAdaptiveColor default', () => {
      expect(adaptiveRgb.adaptiveTextColor(hexToRgbUtil('#fff'))).toEqual(
        hexToRgbUtil('#000'),
      );
    });

    test('meetsWcagWith symmetry with meetsWcag import path', () => {
      expect(
        adaptiveRgb.meetsWcagWith(hexToRgbUtil('#000'), hexToRgbUtil('#fff'), {
          level: 'aa',
        }),
      ).toBe(true);
    });

    test('contrastRatioWith mirrors getContrastRatio', () => {
      const a = hexToRgbUtil('#000');
      const b = hexToRgbUtil('#fff');
      expect(adaptiveRgb.contrastRatioWith(a, b)).toBeCloseTo(21, 5);
    });

    test('apcaContrastOn forwards getApcaContrast', () => {
      expect(
        typeof adaptiveRgb.apcaContrastOn(
          hexToRgbUtil('#000'),
          hexToRgbUtil('#fff'),
        ),
      ).toBe('number');
    });
  });

});

