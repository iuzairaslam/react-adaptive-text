import type { JSX } from 'react';
import { useMemo, useState } from 'react';

import {
  AdaptiveText,
  AdaptiveTextTheme,
  BLACK,
  WHITE,
  adaptiveRgb,
  ContrastAlgorithm,
  getAdaptiveColor,
  getApcaContrast,
  getContrastRatio,
  hexToRgb,
  meetsWcag,
  rgbToHex,
  useAdaptiveForegroundColor,
} from 'react-adaptive-text';

import './styles.css';

import { CodeBlock } from './CodeBlock';
import { DemoScreenChrome } from './DemoScreenChrome';

const BG_SWATCHES = [
  '#1A237E',
  '#4A148C',
  '#004D40',
  '#E65100',
  '#263238',
  '#F5F5F5',
  '#FFFDE7',
  '#E3F2FD',
] as const;

const THEME_PALETTE = ['#1565C0', '#C62828', '#2E7D32'] as const;

function ThemedGlyph(): JSX.Element {
  const hex = useAdaptiveForegroundColor();
  return (
    <span className="demo-glyph" style={{ color: hex }} aria-hidden>
      ★
    </span>
  );
}

type Props = { onBack: () => void };

export default function WidgetDemoScreen({ onBack }: Props): JSX.Element {
  const [bg, setBg] = useState<string>(BG_SWATCHES[0]);
  const [algo, setAlgo] = useState<'wcag' | 'apca'>('wcag');
  const resolvedAlgo =
    algo === 'apca' ? ContrastAlgorithm.apca : ContrastAlgorithm.wcag;

  const metrics = useMemo(() => {
    const bgRgb = hexToRgb(bg);
    const fgRgb = getAdaptiveColor(bgRgb, { algorithm: resolvedAlgo });
    const ratio = getContrastRatio(fgRgb, bgRgb);
    const apcaLc = getApcaContrast(fgRgb, bgRgb);
    const label =
      fgRgb.r === WHITE.r && fgRgb.g === WHITE.g && fgRgb.b === WHITE.b
        ? 'White'
        : fgRgb.r === BLACK.r && fgRgb.g === BLACK.g && fgRgb.b === BLACK.b
          ? 'Black'
          : 'Swatch';
    return {
      fgRgb,
      ratio,
      apcaLc,
      label,
      aa: meetsWcag(fgRgb, bgRgb, { level: 'aa' }),
      aaa: meetsWcag(fgRgb, bgRgb, { level: 'aaa' }),
      isLightBg: adaptiveRgb.isLight(bgRgb),
    };
  }, [bg, resolvedAlgo]);

  const badgeMutedStyle = useMemo(
    () => ({
      color: adaptiveRgb.isLight(metrics.fgRgb)
        ? 'rgba(255, 255, 255, 0.45)'
        : 'rgba(0, 0, 0, 0.5)',
    }),
    [metrics.fgRgb],
  );

  const pkg = 'react-adaptive-text';

  return (
    <DemoScreenChrome title="AdaptiveText" onBack={onBack}>
      <div className="demo-detail-body">
        <p className="demo-lead" style={{ marginBottom: 20 }}>
          Pick a background and a contrast model. Foreground is black, white,
          or the best palette match — WCAG uses luminance ratio; APCA maximizes
          perceptual Lc.
        </p>

        <span className="demo-section-heading">CONTRAST MODEL</span>
        <div className="demo-algo-row">
          {(['wcag', 'apca'] as const).map((key) => (
            <button
              key={key}
              type="button"
              className={`demo-algo-chip${algo === key ? ' demo-algo-chip--on' : ''}`}
              onClick={() => setAlgo(key)}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>

        <span className="demo-section-heading">BACKGROUND</span>
        <div className="demo-swatch-wrap">
          {BG_SWATCHES.map((hex) => (
            <button
              key={hex}
              type="button"
              className={`demo-swatch${bg === hex ? ' demo-swatch--ring' : ''}`}
              style={{ backgroundColor: hex }}
              onClick={() => setBg(hex)}
              aria-label={`Background ${hex}`}
            />
          ))}
        </div>

        <div className="demo-hero-card" style={{ backgroundColor: bg }}>
          <AdaptiveText
            backgroundColor={bg}
            algorithm={resolvedAlgo}
            className="demo-hero-headline"
          >
            Readable at a glance
          </AdaptiveText>
          <AdaptiveText
            backgroundColor={bg}
            algorithm={resolvedAlgo}
            className="demo-hero-sub"
          >
            Same component, any surface — no guessing text color.
          </AdaptiveText>

          <div className="demo-badge-row">
            <div className="demo-badge">
              <span className="demo-badge-muted" style={badgeMutedStyle}>
                WCAG
              </span>
              <div className="demo-badge-value-wrap">
                <AdaptiveText
                  backgroundColor={bg}
                  algorithm={resolvedAlgo}
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {metrics.ratio.toFixed(2)}:1
                </AdaptiveText>
              </div>
            </div>
            <div className="demo-badge">
              <span className="demo-badge-muted" style={badgeMutedStyle}>
                APCA Lc
              </span>
              <div className="demo-badge-value-wrap">
                <AdaptiveText
                  backgroundColor={bg}
                  algorithm={resolvedAlgo}
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {metrics.apcaLc >= 0 ? '+' : ''}
                  {metrics.apcaLc.toFixed(1)}
                </AdaptiveText>
              </div>
            </div>
            <div className="demo-badge">
              <span className="demo-badge-muted" style={badgeMutedStyle}>
                AA
              </span>
              <div className="demo-badge-value-wrap">
                <AdaptiveText
                  backgroundColor={bg}
                  algorithm={resolvedAlgo}
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {metrics.aa ? 'Pass' : 'Fail'}
                </AdaptiveText>
              </div>
            </div>
            <div className="demo-badge">
              <span className="demo-badge-muted" style={badgeMutedStyle}>
                AAA
              </span>
              <div className="demo-badge-value-wrap">
                <AdaptiveText
                  backgroundColor={bg}
                  algorithm={resolvedAlgo}
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {metrics.aaa ? 'Pass' : 'Fail'}
                </AdaptiveText>
              </div>
            </div>
            <div className="demo-badge">
              <span className="demo-badge-muted" style={badgeMutedStyle}>
                BG
              </span>
              <div className="demo-badge-value-wrap">
                <AdaptiveText
                  backgroundColor={bg}
                  algorithm={resolvedAlgo}
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {metrics.isLightBg ? 'Light' : 'Dark'}
                </AdaptiveText>
              </div>
            </div>
          </div>

          <p
            className="demo-fg-hint"
            style={{ color: rgbToHex(metrics.fgRgb), marginBottom: 0 }}
          >
            Foreground ({algo.toUpperCase()}): {metrics.label} (
            {rgbToHex(metrics.fgRgb).toUpperCase()})
          </p>
        </div>

        <span className="demo-section-heading">SIZES</span>
        <p className="demo-para demo-para--compact">
          Sample lines are drawn on the selected background so the adaptive
          color matches what you see.
        </p>
        <div
          className="demo-sizes-strip"
          style={{
            backgroundColor: bg,
            borderRadius: 16,
            padding: '14px 16px',
          }}
        >
          {[12, 16, 20, 28].map((size) => (
            <AdaptiveText
              key={size}
              backgroundColor={bg}
              algorithm={resolvedAlgo}
              className="demo-size-line"
              style={{ fontSize: size }}
            >
              AdaptiveText — {size}px
            </AdaptiveText>
          ))}
        </div>

        <span className="demo-section-heading">AdaptiveTextTheme</span>
        <p className="demo-para">
          Children inherit background, optional palette, and algorithm from
          theme — pass them only once.
        </p>
        <AdaptiveTextTheme backgroundColor={bg} algorithm={resolvedAlgo}>
          <div
            className="demo-theme-card"
            style={{ backgroundColor: bg }}
          >
            <AdaptiveText className="demo-theme-line" style={{ margin: 0 }}>
              Themed line (no explicit backgroundColor)
            </AdaptiveText>
          </div>
        </AdaptiveTextTheme>

        <span className="demo-section-heading">Theme + palette + hook</span>
        <AdaptiveTextTheme
          backgroundColor={bg}
          palette={[...THEME_PALETTE]}
          algorithm={resolvedAlgo}
        >
          <div
            className="demo-theme-card"
            style={{ backgroundColor: bg }}
          >
            <div className="demo-icon-row">
              <ThemedGlyph />
              <AdaptiveText className="demo-theme-line" style={{ margin: 0 }}>
                Palette-aware + useAdaptiveForegroundColor()
              </AdaptiveText>
            </div>
          </div>
        </AdaptiveTextTheme>

        <span className="demo-section-heading">USAGE</span>
        <CodeBlock>{`import { AdaptiveText, ContrastAlgorithm } from '${pkg}';

<AdaptiveText
  backgroundColor="${bg}"
  algorithm={ContrastAlgorithm.${algo}}
>
  Your copy
</AdaptiveText>`}</CodeBlock>
        <div style={{ height: 32 }} />
      </div>
    </DemoScreenChrome>
  );
}
