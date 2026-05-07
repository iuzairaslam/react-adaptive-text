# react-adaptive-text

[![npm](https://img.shields.io/npm/v/react-adaptive-text.svg)](https://www.npmjs.com/package/react-adaptive-text)
[![CI](https://github.com/iuzairaslam/react-adaptive-text/actions/workflows/ci.yml/badge.svg)](https://github.com/iuzairaslam/react-adaptive-text/actions/workflows/ci.yml)

Ever put text on a colored card and realize it’s hard to read? **react-adaptive-text** picks a readable **foreground** color from a **background** (WCAG 2.1 luminance, optional APCA), and gives you:

- **`AdaptiveText`**: a drop-in text-ish element that sets `style.color` automatically
- **`AdaptiveTextTheme`**: provide background/palette/algorithm once for a subtree
- **`useAdaptiveForegroundColor`**: use the same color resolution for icons/custom UI
- **Pure helpers**: luminance, contrast ratio, APCA, palette selection

## Install

```bash
npm install react-adaptive-text
```

## Basic usage

```tsx
import { AdaptiveText } from 'react-adaptive-text';

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

### Theme

```tsx
import { AdaptiveTextTheme, AdaptiveText } from 'react-adaptive-text';

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

### Palette (brand colors)

```tsx
import { AdaptiveText, ContrastAlgorithm } from 'react-adaptive-text';

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

- Colors are accepted as CSS color strings. Hex and `rgb()/rgba()` are supported in all environments; in the browser, most named colors also work.
- `AdaptiveText` defaults to rendering a `span`. Use `as="p" | "h1" | ...` when needed.

## Repository

Source and issue tracker: [github.com/iuzairaslam/react-adaptive-text](https://github.com/iuzairaslam/react-adaptive-text).

## Development

```bash
npm install
npm test
npm run build
```

Run the interactive example app (Vite):

```bash
npm run dev:example
```

## Publishing (maintainers)

1. Bump the version in `package.json`, commit, and tag: `git tag v1.0.x && git push origin v1.0.x`.
2. **From npm:** log in with `npm login`, run `npm run test:all`, then `npm publish` (or `npm run publish:npm`).
3. **CI:** add an `NPM_TOKEN` [repository secret](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions). Pushing a tag matching `v*` runs `.github/workflows/publish.yml` and publishes to the public npm registry.

GitHub Packages (`npm run publish:github`) normally requires a [scoped](https://docs.npmjs.com/about-scopes-and-packages) package name; this package is unscoped, so publishing to npmjs is the default path.

