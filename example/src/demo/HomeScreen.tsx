import type { JSX } from 'react';

import {
  AdaptiveText,
  adaptiveRgb,
  hexToRgb,
  rgbToHex,
} from '@iuzairaslam/react-adaptive-text';

import './styles.css';

import { AppBar } from './AppBar';
import { heroPillText, previewDarkRow, previewLightRow, scaffoldDark } from './colors';
import type { DemoRoute } from './types';

const DEMOS = [
  {
    title: 'AdaptiveText Widget',
    subtitle:
      'Drop-in Text replacement. Auto black or white on any background.',
    icon: '¶',
    accent: '#1A237E' as const,
    route: 'widget' as const,
  },
  {
    title: 'Palette-Aware',
    subtitle:
      'Pick the highest-contrast color from your design system palette.',
    icon: '🎨',
    accent: '#1B5E20' as const,
    route: 'palette' as const,
  },
  {
    title: 'Color Extension',
    subtitle: 'Call adaptiveRgb helpers on any RGB object.',
    icon: '⟨⟩',
    accent: '#4A148C' as const,
    route: 'extension' as const,
  },
  {
    title: 'APCA Algorithm',
    subtitle: 'Perceptual contrast — WCAG 3.0 style with Lc values.',
    icon: 'α',
    accent: '#263238' as const,
    route: 'apca' as const,
  },
] as const;

function Pill({ label }: { label: string }): JSX.Element {
  return <span className="demo-pill">{label}</span>;
}

function SectionLabel({ label }: { label: string }): JSX.Element {
  return <p className="demo-section-label">{label}</p>;
}

type Props = { onNavigate: (route: Exclude<DemoRoute, 'home'>) => void };

export default function HomeScreen({ onNavigate }: Props): JSX.Element {
  return (
    <div className="demo-home" style={{ backgroundColor: scaffoldDark }}>
      <AppBar title="Examples" />
      <div className="demo-scroll">
        <div className="demo-hero-pill" style={{ color: heroPillText }}>
          REACT PACKAGE
        </div>
        <h1 className="demo-hero-title">@iuzairaslam/react-adaptive-text</h1>
        <p className="demo-hero-subtitle">
          Smart text color that stays readable — WCAG 2.1 and APCA, DOM-friendly
          (pure TypeScript helpers + components).
        </p>
        <div className="demo-pill-row">
          <Pill label="WCAG 2.1" />
          <Pill label="APCA" />
          <Pill label="Pure TS" />
        </div>

        <div className="demo-block-spacer" />
        <SectionLabel label="ADAPTS TO ANY BACKGROUND" />
        <div style={{ height: 14 }} />
        <div className="demo-tile-row">
          {previewDarkRow.map((hex) => (
            <div key={hex} className="demo-tile" style={{ background: hex }}>
              <AdaptiveText
                backgroundColor={hex}
                className="demo-tile-aa"
                style={{ margin: 0 }}
              >
                Aa
              </AdaptiveText>
            </div>
          ))}
        </div>
        <div style={{ height: 8 }} />
        <div className="demo-tile-row">
          {previewLightRow.map((hex) => (
            <div key={hex} className="demo-tile" style={{ background: hex }}>
              <AdaptiveText
                backgroundColor={hex}
                className="demo-tile-aa"
                style={{ margin: 0 }}
              >
                Aa
              </AdaptiveText>
            </div>
          ))}
        </div>
        <p className="demo-preview-caption">
          Black or white chosen automatically based on WCAG luminance.
        </p>

        <div className="demo-block-spacer" />
        <SectionLabel label="DEMOS" />
        <div style={{ height: 14 }} />
        {DEMOS.map((d) => {
          const accentRgb = hexToRgb(d.accent);
          const iconColor = rgbToHex(adaptiveRgb.adaptiveTextColor(accentRgb));
          return (
            <div key={d.route} className="demo-card">
              <button
                type="button"
                className="demo-card-row"
                onClick={() => onNavigate(d.route)}
              >
                <div
                  className="demo-icon-wrap"
                  style={{ backgroundColor: d.accent }}
                >
                  <span
                    className="demo-icon-glyph"
                    style={{ color: iconColor }}
                    aria-hidden
                  >
                    {d.icon}
                  </span>
                </div>
                <div className="demo-text-col">
                  <p className="demo-title">{d.title}</p>
                  <p className="demo-subtitle">{d.subtitle}</p>
                </div>
                <span className="demo-chevron" aria-hidden>
                  ›
                </span>
              </button>
            </div>
          );
        })}
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}
