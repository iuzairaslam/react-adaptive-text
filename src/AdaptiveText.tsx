import React, { useMemo } from 'react';
import type { ContrastAlgorithm } from './algorithm';
import { adaptiveTextHex, getExplicitColorFromStyle } from './colorUtils';
import { useAdaptiveTextTheme } from './AdaptiveTextTheme';

type ElementType = React.ElementType;

export type AdaptiveTextProps<TAs extends ElementType = 'span'> =
  React.ComponentPropsWithoutRef<TAs> & {
    /** When omitted, uses the nearest AdaptiveTextTheme. */
    backgroundColor?: string;
    palette?: string[] | null;
    algorithm?: ContrastAlgorithm;
    /** Which HTML element to render. Defaults to `span`. */
    as?: TAs;
  };

/**
 * Drop-in text-ish element that picks a legible color from the background (and optional palette).
 * An explicit `style.color` wins, same as flutter_adaptive_text.
 */
export function AdaptiveText<TAs extends ElementType = 'span'>({
  backgroundColor,
  palette,
  algorithm,
  style,
  as,
  children,
  ...rest
}: AdaptiveTextProps<TAs>): React.ReactElement {
  const theme = useAdaptiveTextTheme();

  const resolvedBg = backgroundColor ?? theme?.backgroundColor;
  const resolvedPalette = palette ?? theme?.palette;
  const resolvedAlgorithm = algorithm ?? theme?.algorithm ?? 'wcag';

  const adaptiveHex = useMemo(() => {
    if (resolvedBg == null) {
      return '#000000';
    }
    return adaptiveTextHex(resolvedBg, {
      palette: resolvedPalette,
      algorithm: resolvedAlgorithm,
    });
  }, [resolvedBg, resolvedPalette, resolvedAlgorithm]);

  const mergedStyle = useMemo((): React.CSSProperties | undefined => {
    const explicit = getExplicitColorFromStyle(style as React.CSSProperties);
    const color = explicit ?? adaptiveHex;
    return { ...(style as React.CSSProperties | undefined), color };
  }, [style, adaptiveHex]);

  const Component = (as ?? 'span') as ElementType;

  return (
    <Component
      style={mergedStyle}
      {...(rest as React.ComponentPropsWithoutRef<TAs>)}
    >
      {children}
    </Component>
  );
}

