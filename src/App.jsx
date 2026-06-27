import React from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/layout/Header';
import Toolbar from './components/layout/Toolbar';
import Sidebar from './components/layout/Sidebar';
import CanvasContainer from './components/layout/CanvasContainer';

export default function App() {
  return (
    <AppProvider>
      <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 select-none overflow-hidden">
        {/* Navigationsleiste oben */}
        <Header />

        {/* Haupt-CAD-Arbeitsplatz */}
        <div className="flex flex-1 relative overflow-hidden">
          {/* Werkzeugleiste links */}
          <Toolbar />

          {/* Canvas Zeichenbereich in der Mitte */}
          <CanvasContainer />

          {/* Eigenschaften-Sidebar rechts */}
          <Sidebar />
        </div>
      </div>
    </AppProvider>
  );
}
