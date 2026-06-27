import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Vector } from '../../core/math/vector';

export default function CanvasContainer() {
  const {
    elements, setElements, selectedId, setSelectedId, activeTool, activeLineType,
    gridSize, snapToGrid, snapToObjects, zoom, setZoom, pan, setPan
  } = useApp();

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // States für das Zeichnen
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // In mm-Weltkoordinaten
  const [activeSnapPoint, setActiveSnapPoint] = useState(null); // {x, y, type: 'endpoint'|'midpoint'|'intersection'}

  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const showAnchors = true;

  const isPointInShape = (x, y, el) => {
    const p = { x, y };
    if (el.toolType === 'circle') {
      const center = { x: el.x1, y: el.y1 };
      const dist = Vector.dist(p, center);
      return Math.abs(dist - el.r) < (6 / zoom); // 6 pixels tolerance in mm
    } else {
      const a = { x: el.x1, y: el.y1 };
      const b = { x: el.x2, y: el.y2 };
      const closest = Vector.getClosestPointOnSegment(p, a, b);
      const dist = Vector.dist(p, closest);
      return dist < (6 / zoom); // 6 pixels tolerance in mm
    }
  };

  // Bildschirmkoordinaten -> Vektor-Weltkoordinaten (mm)
  const getMouseWorldCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;

    return {
      x: (screenX - pan.x) / zoom,
      y: (screenY - pan.y) / zoom
    };
  };

  // Ermittelt alle relevanten geometrischen Punkte im System, an denen die Maus einrasten kann
  const calculateSnapping = (rawCoords) => {
    if (!snapToObjects && !snapToGrid) return { coords: rawCoords, point: null };

    let snapCandidates = [];

    // 1. Objekt-Snapping (Schnittpunkte, Endpunkte, Mitten)
    if (snapToObjects) {
      elements.forEach(el => {
        // Endpunkte fangen
        snapCandidates.push({ x: el.x1, y: el.y1, type: 'endpoint' });
        if (el.toolType !== 'circle') {
          snapCandidates.push({ x: el.x2, y: el.y2, type: 'endpoint' });
          // Mittelpunkt fangen
          snapCandidates.push({ x: (el.x1 + el.x2)/2, y: (el.y1 + el.y2)/2, type: 'midpoint' });
        }
      });

      // Schnittpunkte berechnen (Jede Linie mit jeder anderen schneiden)
      for (let i = 0; i < elements.length; i++) {
        for (let j = i + 1; j < elements.length; j++) {
          const el1 = elements[i];
          const el2 = elements[j];
          if (el1.toolType !== 'circle' && el2.toolType !== 'circle') {
            const pIntersect = Vector.getLineIntersection(
              { x: el1.x1, y: el1.y1 }, { x: el1.x2, y: el1.y2 },
              { x: el2.x1, y: el2.y1 }, { x: el2.x2, y: el2.y2 }
            );
            if (pIntersect) {
              snapCandidates.push({ x: pIntersect.x, y: pIntersect.y, type: 'intersection' });
            }
          }
        }
      }
    }

    // Finde den nächsten Snapping-Kandidaten im Umkreis von 12 mm
    let bestSnap = null;
    let minDistance = 12 / zoom;

    snapCandidates.forEach(cand => {
      const d = Vector.dist(rawCoords, cand);
      if (d < minDistance) {
        minDistance = d;
        bestSnap = cand;
      }
    });

    if (bestSnap) {
      return { coords: { x: bestSnap.x, y: bestSnap.y }, point: bestSnap };
    }

    // 2. Gitter-Snapping (falls kein Objekt gefangen wurde)
    if (snapToGrid) {
      const gx = Math.round(rawCoords.x / gridSize) * gridSize;
      const gy = Math.round(rawCoords.y / gridSize) * gridSize;
      const d = Vector.dist(rawCoords, { x: gx, y: gy });
      if (d < 15 / zoom) {
        return { coords: { x: gx, y: gy }, point: { x: gx, y: gy, type: 'grid' } };
      }
    }

    return { coords: rawCoords, point: null };
  };

  // Canvas Renderschleife
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width <= 0 || canvas.height <= 0) return;
    const ctx = canvas.getContext('2d');

    // 1. Zeichenkarton (Reinweiß)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Millimeter-Gitter zeichnen
    ctx.strokeStyle = '#e2e8f0'; // Sehr dezentes Grau
    ctx.lineWidth = 0.5;
    const step = gridSize * zoom;
    const startX = pan.x % step;
    const startY = pan.y % step;

    for (let x = startX; x < canvas.width; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = startY; y < canvas.height; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Hauptachsen
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pan.x, 0); ctx.lineTo(pan.x, canvas.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, pan.y); ctx.lineTo(canvas.width, pan.y); ctx.stroke();

    // 3. Gezeichnete Elemente der Schüler rendern
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    elements.forEach(el => {
      ctx.beginPath();
      const isSel = el.id === selectedId;

      // Stil des Werkzeugs anwenden (didaktischer Standard)
      if (el.toolType === 'body_edge') {
        ctx.strokeStyle = isSel ? '#0ea5e9' : '#000000'; // Schwarz (Körperkante)
        ctx.lineWidth = 2.0;
        ctx.setLineDash([]);
      } else if (el.toolType === 'helper_line') {
        ctx.strokeStyle = isSel ? '#38bdf8' : '#38bdf8'; // Hellblau (Konstruktionslinie)
        ctx.lineWidth = 0.8;
        ctx.setLineDash([]);
      } else if (el.toolType === 'hidden_edge') {
        ctx.strokeStyle = isSel ? '#0ea5e9' : '#1e293b';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]); // Gestrichelt
      } else if (el.toolType === 'dimension') {
        ctx.strokeStyle = '#059669'; // Smaragdgrün für Maßlinien
        ctx.lineWidth = 1.0;
        ctx.setLineDash([]);
      }

      if (el.toolType === 'circle') {
        ctx.arc(el.x1, el.y1, el.r, 0, 2 * Math.PI);
        ctx.stroke();
      } else {
        // Linien & Bemaßungen
        ctx.moveTo(el.x1, el.y1);
        ctx.lineTo(el.x2, el.y2);
        ctx.stroke();

        // Bemaßungs-Hilfspfeile zeichnen
        if (el.toolType === 'dimension') {
          const angle = Math.atan2(el.y2 - el.y1, el.x2 - el.x1);
          const arrowSize = 6;
          // Pfeil am Ende
          ctx.beginPath();
          ctx.moveTo(el.x2, el.y2);
          ctx.lineTo(el.x2 - arrowSize * Math.cos(angle - Math.PI/6), el.y2 - arrowSize * Math.sin(angle - Math.PI/6));
          ctx.lineTo(el.x2 - arrowSize * Math.cos(angle + Math.PI/6), el.y2 - arrowSize * Math.sin(angle + Math.PI/6));
          ctx.fillStyle = '#059669';
          ctx.fill();

          // Text-Distanz mittig schreiben
          const midX = (el.x1 + el.x2) / 2;
          const midY = (el.y1 + el.y2) / 2;
          ctx.save();
          ctx.translate(midX, midY);
          ctx.rotate(angle);
          ctx.font = '9px sans-serif';
          ctx.fillStyle = '#047857';
          ctx.textAlign = 'center';
          ctx.fillText(`${Math.round(Vector.dist({ x: el.x1, y: el.y1 }, { x: el.x2, y: el.y2 }))} mm`, 0, -4);
          ctx.restore();
        }
      }

      // Ankerpunkte anzeigen
      if (showAnchors) {
        ctx.fillStyle = isSel ? '#0ea5e9' : '#64748b';
        ctx.beginPath(); ctx.arc(el.x1, el.y1, 3, 0, 2*Math.PI); ctx.fill();
        if (el.toolType !== 'circle') {
          ctx.beginPath(); ctx.arc(el.x2, el.y2, 3, 0, 2*Math.PI); ctx.fill();
        }
      }
    });

    // 4. Temporäre Vorschau beim Zeichnen
    if (isDrawing) {
      ctx.beginPath();
      if (activeTool === 'line' || activeTool === 'dimension') {
        ctx.moveTo(drawStart.x, drawStart.y);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.strokeStyle = activeTool === 'dimension' ? '#059669' : (activeLineType === 'helper_line' ? '#38bdf8' : '#000000');
        ctx.lineWidth = activeLineType === 'body_edge' ? 2 : 1;
        if (activeLineType === 'hidden_edge') ctx.setLineDash([4, 4]);
        ctx.stroke();
      } else if (activeTool === 'circle') {
        const radius = Vector.dist(drawStart, mousePos);
        ctx.arc(drawStart.x, drawStart.y, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#38bdf8';
        ctx.setLineDash([2, 2]);
        ctx.stroke();
      }
    }

    ctx.restore();

    // 5. Magnetischer Snapping-Indikator
    if (activeSnapPoint) {
      const snapScreenX = activeSnapPoint.x * zoom + pan.x;
      const snapScreenY = activeSnapPoint.y * zoom + pan.y;

      ctx.strokeStyle = '#06b6d4'; // Cyan
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(snapScreenX, snapScreenY, 8, 0, 2 * Math.PI);
      ctx.stroke();

      // Kleiner gefüllter Punkt in der Mitte
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(snapScreenX, snapScreenY, 3, 0, 2 * Math.PI);
      ctx.fill();

      // Label anzeigen (didaktische Unterstützung)
      ctx.fillStyle = '#0891b2';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(activeSnapPoint.type.toUpperCase(), snapScreenX + 12, snapScreenY + 4);
    }
  };

  useEffect(() => {
    draw();
  }, [elements, selectedId, zoom, pan, gridSize, isDrawing, mousePos, activeSnapPoint, activeTool]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        draw();
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [elements, zoom, pan]);

  const handleMouseDown = (e) => {
    const rawCoords = getMouseWorldCoords(e);
    const { coords, point } = calculateSnapping(rawCoords);

    if (e.button === 1 || activeTool === 'pan') {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      return;
    }

    if (activeTool === 'line' || activeTool === 'circle' || activeTool === 'dimension') {
      setIsDrawing(true);
      setDrawStart(coords);
      setMousePos(coords);
      return;
    }

    if (activeTool === 'select') {
      let clickedId = null;
      for (let i = elements.length - 1; i >= 0; i--) {
        if (isPointInShape(rawCoords.x, rawCoords.y, elements[i])) {
          clickedId = elements[i].id;
          break;
        }
      }
      setSelectedId(clickedId);
    }

    if (activeTool === 'erase') {
      const clicked = elements.find(el => isPointInShape(rawCoords.x, rawCoords.y, el));
      if (clicked) {
        setElements(elements.filter(el => el.id !== clicked.id));
        setSelectedId(null);
      }
    }
  };

  const handleMouseMove = (e) => {
    const rawCoords = getMouseWorldCoords(e);
    const { coords, point } = calculateSnapping(rawCoords);

    setActiveSnapPoint(point);

    if (isPanning) {
      setPan({
        x: pan.x + (e.clientX - panStart.x),
        y: pan.y + (e.clientY - panStart.y)
      });
      setPanStart({ x: e.clientX, y: e.clientY });
      return;
    }

    if (isDrawing) {
      setMousePos(coords);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      
      const newElement = {
        id: Date.now().toString(),
        toolType: activeTool === 'dimension' ? 'dimension' : activeLineType,
        x1: drawStart.x,
        y1: drawStart.y,
        x2: mousePos.x,
        y2: mousePos.y,
        r: activeTool === 'circle' ? Vector.dist(drawStart, mousePos) : 0
      };

      setElements([...elements, newElement]);
    }
    setIsPanning(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const factor = 1.1;
    const newZoom = e.deltaY < 0 ? zoom * factor : zoom / factor;
    setZoom(Math.min(Math.max(0.2, newZoom), 8));
  };

  return (
    <div ref={containerRef} className="flex-1 h-full relative bg-slate-950 overflow-hidden">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="absolute inset-0 block cursor-crosshair"
      />
    </div>
  );
}
