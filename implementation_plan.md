# Implementation Plan: 2DTinker Project Scaffolding & Setup

This plan details the setup and configuration of the **2DTinker** project, an educational 2D CAD system designed for school technical drawing lessons. The project will be initialized in a subdirectory `2dtinker` under `C:\Users\Udo-A\.gemini\antigravity\scratch\2dtinker`.

## User Review Required

> [!IMPORTANT]
> Since you currently do not have an active workspace, this project will be scaffolded in the directory:
> **`C:\Users\Udo-A\.gemini\antigravity\scratch\2dtinker`**
>
> After the setup is completed, **please open/set this subdirectory as your active workspace in your editor.**

> [!NOTE]
> I have identified two small issues in the provided template files that would prevent the application from compiling/running:
> 1. In `CanvasContainer.jsx`, `showAnchors` was referenced but not defined. I have added `const showAnchors = true;` to enable anchor point visibility for selected/unselected elements.
> 2. In `CanvasContainer.jsx`, `isPointInShape` was used for selecting and erasing elements but was not defined. I have implemented a robust distance-based logic using vector math (`Vector.getClosestPointOnSegment` and `Vector.dist`) with a dynamic tolerance scale based on `zoom` (`6 / zoom`).

## Proposed Changes

### Configuration & Base

#### [NEW] [README.md](file:///C:/Users/Udo-A/.gemini/antigravity/scratch/2dtinker/README.md)
Contains description, feature list, and system standards (analog aesthetics, millimetres).

#### [NEW] [DIDACTIC_CONCEPT.md](file:///C:/Users/Udo-A/.gemini/antigravity/scratch/2dtinker/DIDACTIC_CONCEPT.md)
Explains the didactic pedagogical concept (no auto-projections, physical transfer, precision snapping).

#### [NEW] [package.json](file:///C:/Users/Udo-A/.gemini/antigravity/scratch/2dtinker/package.json)
Sets up React 18, Vite 5, Tailwind CSS 3, and Lucide icons.

#### [NEW] [vite.config.js](file:///C:/Users/Udo-A/.gemini/antigravity/scratch/2dtinker/vite.config.js)
Configures Vite, port 3000, and auto-opening.

#### [NEW] [tailwind.config.js](file:///C:/Users/Udo-A/.gemini/antigravity/scratch/2dtinker/tailwind.config.js)
Sets up Tailwind config with custom CAD colors.

#### [NEW] [postcss.config.js](file:///C:/Users/Udo-A/.gemini/antigravity/scratch/2dtinker/postcss.config.js)
Configures Tailwind CSS and Autoprefixer.

#### [NEW] [index.html](file:///C:/Users/Udo-A/.gemini/antigravity/scratch/2dtinker/index.html)
The HTML entrypoint, styled for the dark workspace container.

---

### Src & Styling

#### [NEW] [index.css](file:///C:/Users/Udo-A/.gemini/antigravity/scratch/2dtinker/src/assets/styles/index.css)
Base styles, scrollbar styling, and A4 print media queries for 1:1 printing scale.

#### [NEW] [main.jsx](file:///C:/Users/Udo-A/.gemini/antigravity/scratch/2dtinker/src/main.jsx)
React DOM mounting configuration.

#### [NEW] [App.jsx](file:///C:/Users/Udo-A/.gemini/antigravity/scratch/2dtinker/src/App.jsx)
Main App component orchestrating Layout and state Provider.

---

### Core Logic & Hooks

#### [NEW] [vector.js](file:///C:/Users/Udo-A/.gemini/antigravity/scratch/2dtinker/src/core/math/vector.js)
Geometrical vector calculations for distance, intersection, and closest point on segments.

#### [NEW] [useHistory.js](file:///C:/Users/Udo-A/.gemini/antigravity/scratch/2dtinker/src/hooks/useHistory.js)
Custom hook implementing Undo/Redo history stack state.

#### [NEW] [AppContext.jsx](file:///C:/Users/Udo-A/.gemini/antigravity/scratch/2dtinker/src/context/AppContext.jsx)
Central React state context for CAD settings, tools, element states, and canvas transforms.

---

### User Interface Components

#### [NEW] [Header.jsx](file:///C:/Users/Udo-A/.gemini/antigravity/scratch/2dtinker/src/components/layout/Header.jsx)
Top bar containing didactic line types selection, undo/redo, print trigger, and clear board.

#### [NEW] [Toolbar.jsx](file:///C:/Users/Udo-A/.gemini/antigravity/scratch/2dtinker/src/components/layout/Toolbar.jsx)
Left panel for switching tools (Select, Pan, Line, Circle compass, Dimension, Erase).

#### [NEW] [Sidebar.jsx](file:///C:/Users/Udo-A/.gemini/antigravity/scratch/2dtinker/src/components/layout/Sidebar.jsx)
Right panel containing geometry properties inspector (X, Y, radius, line coordinates) and snapping configuration.

#### [NEW] [CanvasContainer.jsx](file:///C:/Users/Udo-A/.gemini/antigravity/scratch/2dtinker/src/components/layout/CanvasContainer.jsx)
The interactive HTML5 Canvas drawing, snapping, and rendering engine. Corrected to define `showAnchors` and `isPointInShape`.

---

## Verification Plan

### Automated Verification
1. Verify package installation: `npm install` inside the directory.
2. Build verification: `npm run build` to confirm compiling successfully.

### Manual Verification
1. Run local development environment: `npm run dev` (starts on port 3000).
2. Open in browser and verify basic functionality:
   - Select tool, draw lines and circles.
   - Snapping (to grid and objects intersection/mid/endpoint).
   - Selection tool and property inspector values updating.
   - Eraser tool.
   - Undo/Redo.
