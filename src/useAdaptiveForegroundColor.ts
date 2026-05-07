import { useMemo } from 'react';
import type { ContrastAlgorithm } from './algorithm';
import { adaptiveTextHex } from './colorUtils';
import { useAdaptiveTextTheme } from './AdaptiveTextTheme';

export interface UseAdaptiveForegroundColorOptions {
  backgroundColor?: string;
  palette?: string[] | null;
  algorithm?: ContrastAlgorithm;
}

/**
 * Resolves a foreground hex the same way AdaptiveText does (theme + overrides).
 */
export function useAdaptiveForegroundColor(
  options?: UseAdaptiveForegroundColorOptions,
): string {
  const theme = useAdaptiveTextTheme();
  return useMemo(() => {
    const bg = options?.backgroundColor ?? theme?.backgroundColor;
    if (bg == null) {
      return '#000000';
    }
    const pal = options?.palette ?? theme?.palette;
    const algo = options?.algorithm ?? theme?.algorithm ?? 'wcag';
    return adaptiveTextHex(bg, { palette: pal, algorithm: algo });
  }, [
    options?.backgroundColor,
    options?.palette,
    options?.algorithm,
    theme?.backgroundColor,
    theme?.palette,
    theme?.algorithm,
  ]);
}

