import React from 'react';
import { useApp } from '../../context/AppContext';
import { Undo2, Redo2, Trash2, Printer } from 'lucide-react';

export default function Header() {
  const { 
    undo, redo, canUndo, canRedo, clearWorkspace, activeLineType, setActiveLineType 
  } = useApp();

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900 z-10 no-print">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-sky-500 rounded text-slate-950 font-black tracking-wider text-xs">2DT</div>
        <div>
          <h1 className="font-bold text-sm leading-none text-slate-100">2DTinker</h1>
          <p className="text-[10px] text-slate-400">Digitales Reißzeug für Schule & Unterricht</p>
        </div>
      </div>

      {/* Linien-Typen Wähler (Didaktischer Standard) */}
      <div className="flex bg-slate-950 rounded p-1 border border-slate-800 space-x-1">
        <button 
          onClick={() => setActiveLineType('body_edge')} 
          className={`px-3 py-1 text-xs font-semibold rounded transition flex items-center space-x-1.5 ${activeLineType === 'body_edge' ? 'bg-slate-100 text-slate-950' : 'text-slate-400 hover:text-white'}`}
        >
          <span className="w-3 h-0.5 bg-current inline-block" />
          <span>Körperkante (breit, schwarz)</span>
        </button>
        <button 
          onClick={() => setActiveLineType('helper_line')} 
          className={`px-3 py-1 text-xs font-semibold rounded transition flex items-center space-x-1.5 ${activeLineType === 'helper_line' ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400 hover:text-white'}`}
          title="Hilfslinie zum Projizieren der Kanten"
        >
          <span className="w-3 h-0.5 bg-current opacity-60 inline-block" />
          <span>Konstruktionslinie (dünn, blau)</span>
        </button>
        <button 
          onClick={() => setActiveLineType('hidden_edge')} 
          className={`px-3 py-1 text-xs font-semibold rounded transition flex items-center space-x-1.5 ${activeLineType === 'hidden_edge' ? 'bg-slate-800 text-slate-300' : 'text-slate-400 hover:text-white'}`}
        >
          <span className="w-3 h-0.5 border-b border-dashed border-current inline-block" />
          <span>Verdeckte Kante (gestrichelt)</span>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <button onClick={undo} disabled={!canUndo} className="p-1.5 rounded hover:bg-slate-800 text-slate-300 disabled:opacity-30 transition" title="Rückgängig (Strg+Z)">
            <Undo2 className="w-4 h-4" />
          </button>
          <button onClick={redo} disabled={!canRedo} className="p-1.5 rounded hover:bg-slate-800 text-slate-300 disabled:opacity-30 transition" title="Wiederholen">
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        <span className="w-px h-6 bg-slate-800" />

        <button onClick={() => window.print()} className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition">
          <Printer className="w-3.5 h-3.5" />
          <span>Zeichnung drucken (Maßstab 1:1)</span>
        </button>

        <button onClick={clearWorkspace} className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-900 border border-red-900/40 text-red-300 rounded text-xs transition">
          <Trash2 className="w-3.5 h-3.5" />
          <span>Zeichenblatt leeren</span>
        </button>
      </div>
    </header>
  );
}
