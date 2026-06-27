import React from 'react';
import { useApp } from '../../context/AppContext';
import { HelpCircle } from 'lucide-react';

export default function Sidebar() {
  const { 
    elements, setElements, selectedId, setSelectedId, snapToGrid, setSnapToGrid, 
    snapToObjects, setSnapToObjects, gridSize, setGridSize 
  } = useApp();

  const selectedElement = elements.find(el => el.id === selectedId);

  const updateSelected = (key, value) => {
    const updated = elements.map(el => el.id === selectedId ? { ...el, [key]: value } : el);
    setElements(updated);
  };

  const deleteSelected = () => {
    setElements(elements.filter(el => el.id !== selectedId));
    setSelectedId(null);
  };

  return (
    <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col justify-between p-6 overflow-y-auto z-10 no-print">
      <div className="space-y-6">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reißzeug-Inspektor</h2>

        {selectedElement ? (
          <div className="space-y-5 bg-slate-950 p-4 border border-slate-800 rounded-xl">
            <h3 className="text-xs font-bold text-sky-400 uppercase">Gewähltes Objekt</h3>

            <div>
              <span className="text-[10px] text-slate-500 font-bold block">Objekt-Typ</span>
              <span className="text-xs text-slate-300 font-semibold uppercase">{selectedElement.toolType.replace('_', ' ')}</span>
            </div>

            {selectedElement.toolType === 'circle' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold">Mitte X (mm)</label>
                    <input 
                      type="number" 
                      value={Math.round(selectedElement.x1)} 
                      onChange={(e) => updateSelected('x1', Number(e.target.value))}
                      className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold">Mitte Y (mm)</label>
                    <input 
                      type="number" 
                      value={Math.round(selectedElement.y1)} 
                      onChange={(e) => updateSelected('y1', Number(e.target.value))}
                      className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block">Radius R (mm)</label>
                  <input 
                    type="number" 
                    value={Math.round(selectedElement.r || 0)} 
                    onChange={(e) => updateSelected('r', Math.max(1, Number(e.target.value)))}
                    className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold">Start X1 (mm)</label>
                    <input 
                      type="number" 
                      value={Math.round(selectedElement.x1)} 
                      onChange={(e) => updateSelected('x1', Number(e.target.value))}
                      className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold">Start Y1 (mm)</label>
                    <input 
                      type="number" 
                      value={Math.round(selectedElement.y1)} 
                      onChange={(e) => updateSelected('y1', Number(e.target.value))}
                      className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold">Ende X2 (mm)</label>
                    <input 
                      type="number" 
                      value={Math.round(selectedElement.x2)} 
                      onChange={(e) => updateSelected('x2', Number(e.target.value))}
                      className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold">Ende Y2 (mm)</label>
                    <input 
                      type="number" 
                      value={Math.round(selectedElement.y2)} 
                      onChange={(e) => updateSelected('y2', Number(e.target.value))}
                      className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            <button 
              onClick={deleteSelected}
              className="w-full py-1.5 bg-red-950/40 hover:bg-red-900 border border-red-900/60 text-red-300 font-bold text-xs rounded transition"
            >
              Element entfernen
            </button>
          </div>
        ) : (
          <div className="bg-slate-800/20 border border-slate-800/80 rounded-xl p-4 text-center text-xs text-slate-500">
            Zeichne ein Element oder wähle eines aus, um dessen metrische Maße direkt zu kontrollieren.
          </div>
        )}

        <hr className="border-slate-800" />

        {/* Echte Konstruktions-Hilfen */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Magnet-Schiene (Snap)</h3>
          
          <div className="space-y-3 bg-slate-950 p-4 border border-slate-800 rounded-xl">
            <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
              <input 
                type="checkbox" 
                checked={snapToGrid} 
                onChange={(e) => setSnapToGrid(e.target.checked)} 
                className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-sky-500"
              />
              <span>Raster fangen ({gridSize} mm)</span>
            </label>
            
            <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
              <input 
                type="checkbox" 
                checked={snapToObjects} 
                onChange={(e) => setSnapToObjects(e.target.checked)} 
                className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-sky-500"
              />
              <span>Schnitt- & Endpunkte fangen</span>
            </label>

            <div>
              <label className="text-[10px] text-slate-500 font-bold">Rastergröße (mm)</label>
              <select 
                value={gridSize} 
                onChange={(e) => setGridSize(Number(e.target.value))}
                className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-slate-200"
              >
                <option value={5}>5 mm</option>
                <option value={10}>10 mm</option>
                <option value={20}>20 mm</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Didaktische Info-Box */}
      <div className="bg-sky-950/20 border border-sky-900/40 p-3 rounded-lg flex items-start space-x-2 text-[11px] text-sky-300/80">
        <HelpCircle className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Didaktischer Tipp:</strong> Nutze Konstruktionslinien (blau), um Kanten im 45°-Winkel umzulenken. So entsteht das perfekte Drei-Tafel-Projekt ganz ohne Automatisierungsfehler!
        </p>
      </div>
    </aside>
  );
}
