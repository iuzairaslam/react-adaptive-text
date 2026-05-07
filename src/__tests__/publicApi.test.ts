/**
 * Ensures the published barrel keeps wiring expected symbols (catches export gaps).
 */
import * as pub from '../index';

describe('public API surface', () => {
  test('components and hooks', () => {
    expect(pub.AdaptiveText).toBeDefined();
    expect(pub.AdaptiveTextTheme).toBeDefined();
    expect(pub.useAdaptiveForegroundColor).toBeDefined();
    expect(pub.useAdaptiveTextTheme).toBeDefined();
  });

  test('color + algorithm helpers', () => {
    expect(pub.adaptiveRgb).toBeDefined();
    expect(pub.adaptiveTextHex).toBeDefined();
    expect(pub.getAdaptiveColor).toBeDefined();
    expect(pub.getContrastRatio).toBeDefined();
    expect(pub.getApcaContrast).toBeDefined();
    expect(pub.ContrastAlgorithm).toEqual({ wcag: 'wcag', apca: 'apca' });
  });
});
