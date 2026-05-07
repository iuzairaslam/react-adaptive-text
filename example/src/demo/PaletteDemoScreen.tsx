import type { JSX } from 'react';
import { useEffect, useMemo, useState } from 'react';

import {
  AdaptiveText,
  ContrastAlgorithm,
  adaptiveRgb,
  getAdaptiveColor,
  getContrastRatio,
  hexToRgb,
  rgbToHex,
} from 'react-adaptive-text';

import './styles.css';

import { CodeBlock } from './CodeBlock';
import { DemoScreenChrome } from './DemoScreenChrome';

const PALETTES = {
  brand: ['#1565C0', '#C62828', '#2E7D32', '#6A1B9A', '#E65100'] as const,
  pastel: ['#90CAF9', '#F48FB1', '#A5D6A7', '#CE93D8', '#FFCC80'] as const,
  material: ['#2196F3', '#F44336', '#4CAF50', '#9C27B0', '#FF9800'] as const,
};

type TabKey = keyof typeof PALETTES;

const PREVIEW_BGS = [
  '#FFFFFF',
  '#121212',
  '#E8EAF6',
  '#1B5E20',
  '#4A148C',
  '#263238',
] as const;

type Props = { onBack: () => void };

export default function PaletteDemoScreen({ onBack }: Props): JSX.Element {
  const [tab, setTab] = useState<TabKey>('brand');
  const palette = PALETTES[tab];
  const [chosen, setChosen] = useState<string>(palette[0]);
  const [previewBg, setPreviewBg] = useState<string>(PREVIEW_BGS[1]);

  useEffect(() => {
    setChosen(PALETTES[tab][0]);
  }, [tab]);

  const chosenRgb = useMemo(() => hexToRgb(chosen), [chosen]);
  const previewRgb = useMemo(() => hexToRgb(previewBg), [previewBg]);

  const fgRgb = useMemo(
    () =>
      getAdaptiveColor(previewRgb, {
        palette: [...palette].map(hexToRgb),
        algorithm: ContrastAlgorithm.wcag,
      }),
    [previewRgb, palette],
  );

  const ratio = useMemo(
    () => getContrastRatio(fgRgb, previewRgb),
    [fgRgb, previewRgb],
  );

  const pkg = 'react-adaptive-text';

  return (
    <DemoScreenChrome title="Palette-aware" onBack={onBack}>
      <div className="demo-detail-body">
        <p className="demo-lead">
          Supply a small palette; the library picks the channel with the best
          WCAG contrast against the background.
        </p>

        <div className="demo-tab-row">
          {(Object.keys(PALETTES) as TabKey[]).map((k) => (
            <button
              key={k}
              type="button"
              className={`demo-tab${tab === k ? ' demo-tab--on' : ''}`}
              onClick={() => setTab(k)}
            >
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </button>
          ))}
        </div>

        <div className="demo-hero-palette">
          <div
            className="demo-hero-swatch"
            style={{ backgroundColor: chosen }}
          />
          <p className="demo-hero-hex">{chosen.toUpperCase()}</p>
          <p className="demo-hero-caption">Selected palette color</p>
          <div className="demo-chip-row">
            <div className="demo-chip">
              <span className="demo-chip-label">On preview bg</span>
              <div className="demo-chip-value">{ratio.toFixed(2)}:1</div>
            </div>
            <div className="demo-chip">
              <span className="demo-chip-label">Picked</span>
              <div className="demo-chip-value">
                {rgbToHex(fgRgb).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <span className="demo-section-heading">PALETTE</span>
        <div className="demo-palette-row">
          {palette.map((hex) => (
            <button
              key={hex}
              type="button"
              className={`demo-p-chip${
                chosen === hex ? ' demo-p-chip--ring' : ''
              }`}
              style={{ backgroundColor: hex }}
              onClick={() => setChosen(hex)}
              aria-label={`Palette ${hex}`}
            />
          ))}
        </div>

        <span className="demo-section-heading">PREVIEW BACKGROUND</span>
        <div className="demo-swatch-wrap">
          {PREVIEW_BGS.map((hex) => (
            <button
              key={hex}
              type="button"
              className={`demo-swatch${
                previewBg === hex ? ' demo-swatch--ring' : ''
              }`}
              style={{ backgroundColor: hex }}
              onClick={() => setPreviewBg(hex)}
              aria-label={`Preview background ${hex}`}
            />
          ))}
        </div>

        <div
          className="demo-live-card"
          style={{ backgroundColor: previewBg }}
        >
          <AdaptiveText
            backgroundColor={previewBg}
            palette={[...palette]}
            algorithm={ContrastAlgorithm.wcag}
            className="demo-live-title"
            style={{ margin: 0 }}
          >
            Live AdaptiveText
          </AdaptiveText>
          <AdaptiveText
            backgroundColor={previewBg}
            palette={[...palette]}
            algorithm={ContrastAlgorithm.wcag}
            className="demo-live-sub"
            style={{ margin: 0 }}
          >
            Foreground is the best palette match for this surface (WCAG
            luminance).
          </AdaptiveText>
        </div>

        <span className="demo-section-heading">LUMINANCE (chosen)</span>
        <div className="demo-theme-card demo-mono-card">
          L = {adaptiveRgb.relativeLuminance(chosenRgb).toFixed(4)}
        </div>

        <span className="demo-section-heading">USAGE</span>
        <CodeBlock>{`import { AdaptiveText, ContrastAlgorithm } from '${pkg}';

<AdaptiveText
  backgroundColor="${previewBg}"
  palette={${JSON.stringify([...palette])}}
  algorithm={ContrastAlgorithm.wcag}
>
  Brand copy
</AdaptiveText>`}</CodeBlock>
        <div style={{ height: 32 }} />
      </div>
    </DemoScreenChrome>
  );
}
