import type { JSX } from 'react';
import { useMemo, useState } from 'react';

import {
  BLACK,
  WHITE,
  adaptiveRgb,
  hexToRgb,
  rgbToHex,
} from '@iuzairaslam/react-adaptive-text';

import './styles.css';

import { CodeBlock } from './CodeBlock';
import { DemoScreenChrome } from './DemoScreenChrome';

const SWATCHES = [
  '#5C6BC0',
  '#00897B',
  '#6D4C41',
  '#F9A825',
  '#ECEFF1',
  '#37474F',
] as const;

type Props = { onBack: () => void };

export default function ExtensionDemoScreen({
  onBack,
}: Props): JSX.Element {
  const [hex, setHex] = useState<string>(SWATCHES[0]);

  const stats = useMemo(() => {
    const rgb = hexToRgb(hex);
    const lum = adaptiveRgb.relativeLuminance(rgb);
    const cw = adaptiveRgb.contrastRatioWith(rgb, WHITE);
    const cb = adaptiveRgb.contrastRatioWith(rgb, BLACK);
    const text = adaptiveRgb.adaptiveTextColor(rgb);
    const textHex = rgbToHex(text);
    return {
      lum,
      cw,
      cb,
      textHex,
      aaW: adaptiveRgb.meetsWcagWith(WHITE, rgb, { level: 'aa' }),
      aaB: adaptiveRgb.meetsWcagWith(BLACK, rgb, { level: 'aa' }),
      isLight: adaptiveRgb.isLight(rgb),
    };
  }, [hex]);

  const pkg = '@iuzairaslam/react-adaptive-text';

  return (
    <DemoScreenChrome title="adaptiveRgb" onBack={onBack}>
      <div className="demo-detail-body">
        <p className="demo-lead">
          Same math as the widget, exposed as functions on plain RGB objects —
          mirrors Flutter extension-style helpers.
        </p>

        <span className="demo-section-heading">SWATCH</span>
        <div className="demo-swatch-wrap">
          {SWATCHES.map((h) => (
            <button
              key={h}
              type="button"
              className={`demo-swatch${hex === h ? ' demo-swatch--ring' : ''}`}
              style={{ backgroundColor: h }}
              onClick={() => setHex(h)}
              aria-label={`Swatch ${h}`}
            />
          ))}
        </div>

        <div
          className="demo-extension-hero"
          style={{ backgroundColor: hex }}
        >
          <p
            className="demo-extension-hero-title"
            style={{ color: stats.textHex, margin: 0 }}
          >
            Sample headline
          </p>
          <p
            className="demo-extension-hero-sub"
            style={{ color: stats.textHex }}
          >
            Foreground for contrast: {stats.textHex.toUpperCase()}
          </p>
        </div>

        <span className="demo-section-heading">METRICS</span>
        <div className="demo-metric-grid">
          <Metric label="Relative luminance" value={stats.lum.toFixed(4)} />
          <Metric
            label="Contrast vs white"
            value={`${stats.cw.toFixed(2)}:1`}
          />
          <Metric
            label="Contrast vs black"
            value={`${stats.cb.toFixed(2)}:1`}
          />
          <Metric
            label="WCAG AA vs white"
            value={stats.aaW ? 'Yes' : 'No'}
          />
          <Metric
            label="WCAG AA vs black"
            value={stats.aaB ? 'Yes' : 'No'}
          />
          <Metric
            label="isLight(bg)"
            value={stats.isLight ? 'true' : 'false'}
          />
        </div>

        <span className="demo-section-heading">USAGE</span>
        <CodeBlock>{`import { adaptiveRgb, hexToRgb } from '${pkg}';

const rgb = hexToRgb('${hex}');
adaptiveRgb.relativeLuminance(rgb);
adaptiveRgb.contrastRatioWith(rgb, { r: 255, g: 255, b: 255 });
adaptiveRgb.meetsWcagWith(fg, bg, { level: 'aa' });
adaptiveRgb.adaptiveTextColor(rgb);`}</CodeBlock>
        <div style={{ height: 32 }} />
      </div>
    </DemoScreenChrome>
  );
}

function Metric({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="demo-metric">
      <p className="demo-metric-label">{label}</p>
      <p className="demo-metric-value">{value}</p>
    </div>
  );
}
