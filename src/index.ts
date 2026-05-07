// Core math (pure RGB; no DOM import)
export {
  BLACK,
  WHITE,
  ContrastAlgorithm,
  WcagLevel,
  getLuminance,
  getContrastRatio,
  wcagContrastRatioFromLuminance,
  getAdaptiveColor,
  getApcaContrast,
  isLight,
  isDark,
  meetsWcag,
  wcagMinimumRatio,
  type Rgb,
} from './algorithm';

export {
  rgbToHex,
  hexToRgb,
  colorValueToRgb,
  adaptiveTextHex,
  adaptiveTextHexFromRgb,
  getExplicitColorFromStyle,
  adaptiveRgb,
} from './colorUtils';

export {
  AdaptiveTextTheme,
  useAdaptiveTextTheme,
  type AdaptiveTextThemeData,
  type AdaptiveTextThemeProps,
} from './AdaptiveTextTheme';

export { AdaptiveText, type AdaptiveTextProps } from './AdaptiveText';

export {
  useAdaptiveForegroundColor,
  type UseAdaptiveForegroundColorOptions,
} from './useAdaptiveForegroundColor';

