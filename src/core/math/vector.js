/**
 * 2D Vektor- und Geometrie-Mathematik für 2DTinker
 */
export const Vector = {
  dist: (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2),
  
  // Berechnet den Schnittpunkt zweier unendlicher Linien (p1-p2 und p3-p4)
  getLineIntersection: (p1, p2, p3, p4) => {
    const denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
    if (denom === 0) return null; // Parallel

    const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
    return {
      x: p1.x + ua * (p2.x - p1.x),
      y: p1.y + ua * (p2.y - p1.y)
    };
  },

  // Lotpunkt einer Maus-Koordinate auf eine Linie fällen
  getClosestPointOnSegment: (p, a, b) => {
    const atob = { x: b.x - a.x, y: b.y - a.y };
    const atop = { x: p.x - a.x, y: p.y - a.y };
    const lenSq = atob.x * atob.x + atob.y * atob.y;
    if (lenSq === 0) return a;

    let t = (atop.x * atob.x + atop.y * atob.y) / lenSq;
    t = Math.max(0, Math.min(1, t)); // Auf Segment begrenzen

    return {
      x: a.x + t * atob.x,
      y: a.y + t * atob.y
    };
  }
};
