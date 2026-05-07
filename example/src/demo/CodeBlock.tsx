import type { JSX } from 'react';

import './styles.css';

type Props = { children: string };

export function CodeBlock({ children }: Props): JSX.Element {
  return (
    <pre className="demo-code-block">
      {children}
    </pre>
  );
}
