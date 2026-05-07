import { render, screen } from '@testing-library/react';

import { AdaptiveText } from '../AdaptiveText';

describe('AdaptiveText', () => {
  test('computes contrasting color from background prop (dark bg → white text)', () => {
    render(
      <AdaptiveText backgroundColor="#000000">Readable</AdaptiveText>,
    );
    expect(screen.getByText('Readable')).toHaveStyle({ color: '#ffffff' });
  });

  test('light background yields dark text', () => {
    render(<AdaptiveText backgroundColor="#FFFFFF">Contrast</AdaptiveText>);
    expect(screen.getByText('Contrast')).toHaveStyle({ color: '#000000' });
  });

  test('explicit style.color wins over adaptive color', () => {
    render(
      <AdaptiveText
        backgroundColor="#000000"
        style={{ color: 'rgb(255, 0, 0)' }}
      >
        forced
      </AdaptiveText>,
    );
    expect(screen.getByText('forced')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });

  test('without background or theme, defaults to black', () => {
    render(<AdaptiveText>fallback</AdaptiveText>);
    expect(screen.getByText('fallback')).toHaveStyle({ color: '#000000' });
  });

  test('as prop changes element type', () => {
    render(
      <AdaptiveText as="h2" backgroundColor="#fff" data-testid="t">
        title
      </AdaptiveText>,
    );
    expect(screen.getByTestId('t').tagName).toBe('H2');
  });
});
