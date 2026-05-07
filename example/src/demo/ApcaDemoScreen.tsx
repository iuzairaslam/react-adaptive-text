import type { JSX } from 'react';
import { useMemo, useState } from 'react';

import {
  AdaptiveText,
  getApcaContrast,
  getContrastRatio,
  hexToRgb,
} from '@iuzairaslam/react-adaptive-text';

import './styles.css';

import { CodeBlock } from './CodeBlock';
import { DemoScreenChrome } from './DemoScreenChrome';

/** Pairs tuned so WCAG ratio and APCA Lc can disagree (like the Flutter demo). */
const PAIRS = [
  { label: 'Yellow / purple', fg: '#FFEB3B', bg: '#4A148C' },
  { label: 'Orange / blue', fg: '#FF9800', bg: '#0D47A1' },
  { label: 'White / mid gray', fg: '#FFFFFF', bg: '#757575' },
] as const;

type Props = { onBack: () => void };

export default function ApcaDemoScreen({ onBack }: Props): JSX.Element {
  const [idx, setIdx] = useState(0);
  const { fg, bg, label } = PAIRS[idx];

  const wcag = useMemo(() => {
    const a = hexToRgb(fg);
    const b = hexToRgb(bg);
    return getContrastRatio(a, b);
  }, [fg, bg]);

  const apca = useMemo(() => {
    const a = hexToRgb(fg);
    const b = hexToRgb(bg);
    return getApcaContrast(a, b);
  }, [fg, bg]);

  const pkg = '@iuzairaslam/react-adaptive-text';

  return (
    <DemoScreenChrome title="WCAG vs APCA" onBack={onBack}>
      <div className="demo-detail-body">
        <p className="demo-lead">
          WCAG 2.x uses relative luminance ratios. APCA (WCAG 3 direction) uses
          perceptual Lc — they can rank the same pair differently.
        </p>

        <span className="demo-section-heading demo-section-heading--tight-top">
          PRESETS
        </span>
        <div className="demo-preset-row">
          {PAIRS.map((p, i) => (
            <button
              key={p.label}
              type="button"
              className={`demo-preset${idx === i ? ' demo-preset--on' : ''}`}
              onClick={() => setIdx(i)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="demo-live-card" style={{ backgroundColor: bg }}>
          <AdaptiveText
            backgroundColor={bg}
            className="demo-apca-preview-title"
            style={{ margin: 0 }}
          >
            {label}
          </AdaptiveText>
          <AdaptiveText
            backgroundColor={bg}
            className="demo-apca-preview-small"
            style={{ margin: 0, color: fg }}
          >
            Foreground (fixed): {fg.toUpperCase()}
          </AdaptiveText>
        </div>

        <div className="demo-row-2">
          <div className="demo-metric-card">
            <p className="demo-metric-card__kicker">WCAG 2.1</p>
            <p className="demo-metric-card__big">{wcag.toFixed(2)}:1</p>
            <p className="demo-metric-card__foot">getContrastRatio(fg, bg)</p>
          </div>
          <div className="demo-metric-card">
            <p className="demo-metric-card__kicker">APCA Lc</p>
            <p className="demo-metric-card__big">
              {apca >= 0 ? '+' : ''}
              {apca.toFixed(1)}
            </p>
            <p className="demo-metric-card__foot">getApcaContrast(fg, bg)</p>
          </div>
        </div>

        <div className="demo-note">
          Same colors, two models. Use WCAG for regulatory AA/AAA checks; use
          APCA when you want a perceptual read on readability.
        </div>

        <span className="demo-section-heading">USAGE</span>
        <CodeBlock>{`import { getContrastRatio, getApcaContrast, hexToRgb } from '${pkg}';

const fg = hexToRgb('${fg}');
const bg = hexToRgb('${bg}');
getContrastRatio(fg, bg);   // ${wcag.toFixed(2)}:1
getApcaContrast(fg, bg);    // ${apca.toFixed(1)}`}</CodeBlock>
        <div style={{ height: 32 }} />
      </div>
    </DemoScreenChrome>
  );
}
