import type { JSX } from 'react';
import { render, screen } from '@testing-library/react';

import { AdaptiveText } from '../AdaptiveText';
import { AdaptiveTextTheme } from '../AdaptiveTextTheme';
import { ContrastAlgorithm } from '../algorithm';
import { useAdaptiveForegroundColor } from '../useAdaptiveForegroundColor';

function HookProbe({
  options,
}: {
  options?: Parameters<typeof useAdaptiveForegroundColor>[0];
}): JSX.Element {
  const color = useAdaptiveForegroundColor(options);
  return (
    <span data-testid="hook-color" style={{ color }}>
      probe
    </span>
  );
}

describe('AdaptiveTextTheme + useAdaptiveForegroundColor', () => {
  test('theme supplies background to nested AdaptiveText', () => {
    render(
      <AdaptiveTextTheme backgroundColor="#ffffff">
        <AdaptiveText>themed</AdaptiveText>
      </AdaptiveTextTheme>,
    );
    expect(screen.getByText('themed')).toHaveStyle({ color: '#000000' });
  });

  test('prop overrides theme background', () => {
    render(
      <AdaptiveTextTheme backgroundColor="#ffffff">
        <AdaptiveText backgroundColor="#000000">override</AdaptiveText>
      </AdaptiveTextTheme>,
    );
    expect(screen.getByText('override')).toHaveStyle({ color: '#ffffff' });
  });

  test('useAdaptiveForegroundColor reads theme', () => {
    render(
      <AdaptiveTextTheme backgroundColor="#1a237e">
        <HookProbe />
      </AdaptiveTextTheme>,
    );
    const probe = screen.getByTestId('hook-color');
    expect(probe.style.color).toMatch(
      /^(#[0-9a-f]{6}|rgb\(\s*\d+,\s*\d+,\s*\d+\s*\))$/i,
    );
  });

  test('hook options override theme backgroundColor', () => {
    render(
      <AdaptiveTextTheme backgroundColor="#000000">
        <HookProbe options={{ backgroundColor: '#ffffff' }} />
      </AdaptiveTextTheme>,
    );
    expect(screen.getByTestId('hook-color')).toHaveStyle({
      color: '#000000',
    });
  });

  test('hook inherits palette and algorithm from theme', () => {
    render(
      <AdaptiveTextTheme
        backgroundColor="#000000"
        palette={['#ff9800']}
        algorithm={ContrastAlgorithm.wcag}
      >
        <HookProbe />
      </AdaptiveTextTheme>,
    );
    expect(screen.getByTestId('hook-color')).toHaveStyle({
      color: '#ff9800',
    });
  });

  test('theme algorithm apca resolves to a hex foreground', () => {
    render(
      <AdaptiveTextTheme backgroundColor="#757575" algorithm="apca">
        <AdaptiveText data-testid="apca-line">line</AdaptiveText>
      </AdaptiveTextTheme>,
    );
    const el = screen.getByTestId('apca-line');
    expect(el.style.color).toMatch(
      /^(#[0-9a-f]{6}|rgb\(\s*\d+,\s*\d+,\s*\d+\s*\))$/i,
    );
  });
});
