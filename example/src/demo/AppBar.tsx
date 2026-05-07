import type { JSX } from 'react';

import './styles.css';

export type AppBarProps = {
  title: string;
  onBack?: () => void;
};

export function AppBar({ title, onBack }: AppBarProps): JSX.Element {
  return (
    <header className="demo-app-bar">
      <div className="demo-app-bar__row">
        {onBack ? (
          <button
            type="button"
            className="demo-app-bar__leading"
            onClick={onBack}
            aria-label="Go back"
          >
            ‹
          </button>
        ) : (
          <span className="demo-app-bar__leading" />
        )}
        <h1 className="demo-app-bar__title">{title}</h1>
        <span className="demo-app-bar__trailing" />
      </div>
    </header>
  );
}
