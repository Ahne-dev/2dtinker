import React, { createContext, useContext, useState } from 'react';
import { useHistory } from '../hooks/useHistory';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Das zentrale Datenelement sind handgezeichnete Linien und Kreise der SuS
  // Jedes Element hat: id, x1, y1, x2, y2, toolType ('body_edge' | 'helper_line' | 'hidden_edge' | 'dimension')
  const { state: elements, setState: setElements, undo, redo, canUndo, canRedo, clear } = useHistory([]);
  
  const [selectedId, setSelectedId] = useState(null);
  const [activeTool, setActiveTool] = useState('line'); // 'select', 'line', 'circle', 'dimension', 'erase'
  const [activeLineType, setActiveLineType] = useState('body_edge'); // 'body_edge', 'helper_line', 'hidden_edge'
  
  const [gridSize, setGridSize] = useState(10); // in mm
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [snapToObjects, setSnapToObjects] = useState(true);

  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 100, y: 100 });

  const clearWorkspace = () => {
    clear([]);
    setSelectedId(null);
  };

  return (
    <AppContext.Provider value={{
      elements,
      setElements,
      undo,
      redo,
      canUndo,
      canRedo,
      selectedId,
      setSelectedId,
      activeTool,
      setActiveTool,
      activeLineType,
      setActiveLineType,
      gridSize,
      setGridSize,
      snapToGrid,
      setSnapToGrid,
      snapToObjects,
      setSnapToObjects,
      zoom,
      setZoom,
      pan,
      setPan,
      clearWorkspace
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
