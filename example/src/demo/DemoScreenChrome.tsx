import type { JSX, ReactNode } from 'react';

import './styles.css';

import { AppBar } from './AppBar';
import { scaffoldDark } from './colors';

type Props = {
  title: string;
  onBack: () => void;
  children: ReactNode;
};

export function DemoScreenChrome({ title, onBack, children }: Props): JSX.Element {
  return (
    <div className="demo-home" style={{ backgroundColor: scaffoldDark }}>
      <AppBar title={title} onBack={onBack} />
      <div className="demo-chrome__body">{children}</div>
    </div>
  );
}
