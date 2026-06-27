import React from 'react';
import { useApp } from '../../context/AppContext';
import { MousePointer, Move, Pencil, RefreshCw, Trash2, ArrowRight } from 'lucide-react';

export default function Toolbar() {
  const { activeTool, setActiveTool } = useApp();

  const tools = [
    { id: 'select', label: 'Auswählen (V)', icon: <MousePointer className="w-5 h-5" /> },
    { id: 'pan', label: 'Leinwand verschieben (H)', icon: <Move className="w-5 h-5" /> },
    { separator: true },
    { id: 'line', label: 'Linien-Werkzeug (L)', icon: <Pencil className="w-5 h-5 text-sky-400" /> },
    { id: 'circle', label: 'Zirkel-Werkzeug (C)', icon: <RefreshCw className="w-5 h-5 text-sky-400 rotate-45" /> },
    { id: 'dimension', label: 'Bemaßung (D)', icon: <ArrowRight className="w-5 h-5 text-emerald-400" /> },
    { id: 'erase', label: 'Radiergummi (E)', icon: <Trash2 className="w-5 h-5 text-red-400" /> }
  ];

  return (
    <aside className="w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-4 space-y-3 z-10 no-print">
      <div className="text-[9px] text-slate-500 font-bold tracking-wider uppercase mb-1">Werkzeug</div>
      
      {tools.map((t, idx) => {
        if (t.separator) return <span key={idx} className="w-10 h-px bg-slate-800 my-1" />;
        
        return (
          <button
            key={t.id}
            onClick={() => setActiveTool(t.id)}
            className={`p-3 rounded-xl transition ${activeTool === t.id ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'}`}
            title={t.label}
          >
            {t.icon}
          </button>
        );
      })}
    </aside>
  );
}
