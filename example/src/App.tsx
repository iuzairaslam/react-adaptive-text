import type { JSX } from 'react';
import { useState } from 'react';

import ApcaDemoScreen from './demo/ApcaDemoScreen';
import ExtensionDemoScreen from './demo/ExtensionDemoScreen';
import HomeScreen from './demo/HomeScreen';
import PaletteDemoScreen from './demo/PaletteDemoScreen';
import './demo/styles.css';
import type { DemoRoute } from './demo/types';
import WidgetDemoScreen from './demo/WidgetDemoScreen';

import './index.css';

export default function App(): JSX.Element {
  const [route, setRoute] = useState<DemoRoute>('home');

  return (
    <div className="demo-shell">
      {route === 'home' && <HomeScreen onNavigate={(r) => setRoute(r)} />}
      {route === 'widget' && (
        <WidgetDemoScreen onBack={() => setRoute('home')} />
      )}
      {route === 'palette' && (
        <PaletteDemoScreen onBack={() => setRoute('home')} />
      )}
      {route === 'extension' && (
        <ExtensionDemoScreen onBack={() => setRoute('home')} />
      )}
      {route === 'apca' && <ApcaDemoScreen onBack={() => setRoute('home')} />}
    </div>
  );
}
