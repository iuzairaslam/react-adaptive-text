# react-adaptive-text

**npm package:** `@iuzairaslam/react-adaptive-text`

[![npm](https://img.shields.io/npm/v/@iuzairaslam/react-adaptive-text.svg)](https://www.npmjs.com/package/@iuzairaslam/react-adaptive-text)
[![CI](https://github.com/iuzairaslam/react-adaptive-text/actions/workflows/ci.yml/badge.svg)](https://github.com/iuzairaslam/react-adaptive-text/actions/workflows/ci.yml)

![react-adaptive-text — readable text on any background](./assets/readme-banner.png)

## In plain English

You pick a background color. This library picks a **foreground color** so people can actually read the text—no more guessing “should this be white or black?” It follows accessibility-minded math (WCAG-style contrast, plus optional APCA for a more perceptual take). You get simple React building blocks so you’re not wiring color logic by hand in every screen.

## If you’re shipping UI

- **`AdaptiveText`** — like a text element, but it sets `color` for you from the background (and optional brand palette).
- **`AdaptiveTextTheme`** — set background + algorithm once; children inherit the rules.
- **`useAdaptiveForegroundColor`** — same color resolution for icons, strokes, or anything that isn’t plain text.
- **Pure helpers** — luminance, contrast ratio, APCA, palette picking—useful for tests, design tooling, or custom components.

TypeScript throughout; no native binaries—just React and browser-friendly color parsing.

## Install

```bash
npm install @iuzairaslam/react-adaptive-text
```

## Basic usage

```tsx
import { AdaptiveText } from '@iuzairaslam/react-adaptive-text';

export function Banner() {
  return (
    <div style={{ background: '#1a237e', padding: 12 }}>
      <AdaptiveText backgroundColor="#1a237e" style={{ fontSize: 18 }}>
        Hello
      </AdaptiveText>
    </div>
  );
}
```

### Theme (DRY): one background for a whole block

```tsx
import { AdaptiveTextTheme, AdaptiveText } from '@iuzairaslam/react-adaptive-text';

export function Card() {
  return (
    <AdaptiveTextTheme backgroundColor="#333" algorithm="wcag">
      <AdaptiveText as="h3" style={{ margin: 0, fontWeight: 700 }}>
        Title
      </AdaptiveText>
      <AdaptiveText as="p" style={{ margin: 0 }}>
        Subtitle
      </AdaptiveText>
    </AdaptiveTextTheme>
  );
}
```

### Palette: pick the best brand color for contrast

```tsx
import { AdaptiveText, ContrastAlgorithm } from '@iuzairaslam/react-adaptive-text';

const brand = ['#ff9800', '#eeeeee', '#ffeb3b'];

export function BrandLine() {
  return (
    <AdaptiveText
      backgroundColor="#000000"
      palette={brand}
      algorithm={ContrastAlgorithm.apca}
    >
      Brand text
    </AdaptiveText>
  );
}
```

## Notes

- Pass colors as CSS strings: hex and `rgb()` / `rgba()` work everywhere; in the browser, named colors usually work too.
- By default **`AdaptiveText`** renders a **`span`**. Use `as="p"`, `as="h1"`, etc. when you need semantic headings or paragraphs.
- If you set **`style.color`** yourself, that always wins—useful when you intentionally override the automatic choice.

## Repository

Issues and source: [github.com/iuzairaslam/react-adaptive-text](https://github.com/iuzairaslam/react-adaptive-text).

## Development

```bash
npm install
npm test
npm run build
```

Try the included Vite example (interactive demos):

```bash
npm run dev:example
```
