import { useEffect, useState } from "react";

/**
 * Projective "corner pin" transform (Heckbert's square-to-quad method).
 * Maps a flat rectangle of size (w x h) onto 4 arbitrary destination
 * points, returned as a CSS matrix3d() string.
 *
 * dest points order: p0 = top-left, p1 = top-right, p2 = bottom-right, p3 = bottom-left
 */
function computeMatrix3d(w, h, p0, p1, p2, p3) {
  const { x: x0, y: y0 } = p0;
  const { x: x1, y: y1 } = p1;
  const { x: x2, y: y2 } = p2;
  const { x: x3, y: y3 } = p3;

  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;

  let a, b, c, d, e, f, g, hh;

  if (dx3 === 0 && dy3 === 0) {
    // destination is already a parallelogram -> plain affine map
    a = x1 - x0; b = x2 - x1; c = x0;
    d = y1 - y0; e = y2 - y1; f = y0;
    g = 0; hh = 0;
  } else {
    const det = dx1 * dy2 - dx2 * dy1;
    g = (dx3 * dy2 - dx2 * dy3) / det;
    hh = (dx1 * dy3 - dx3 * dy1) / det;
    a = x1 - x0 + g * x1;
    b = x3 - x0 + hh * x3;
    c = x0;
    d = y1 - y0 + g * y1;
    e = y3 - y0 + hh * y3;
    f = y0;
  }

  // rescale so the source rect is (0,0)-(w,h) instead of the unit square
  const A = a / w, D = d / w, G = g / w;
  const B = b / h, E = e / h, H = hh / h;

  return `matrix3d(${A},${D},0,${G}, ${B},${E},0,${H}, 0,0,1,0, ${c},${f},0,1)`;
}

/**
 * React hook: watches `containerRef` size and returns a live CSS
 * matrix3d() transform that pins a `source` sized box onto the
 * fractional `corners` (0..1 relative to the container) of that container.
 *
 * corners = { tl:{x,y}, tr:{x,y}, br:{x,y}, bl:{x,y} }  (fractions, 0..1)
 * source  = { w, h }  (px size you set on the element being warped)
 */
export default function useCornerPin(containerRef, corners, source) {
  const [transform, setTransform] = useState("none");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      if (!w || !h) return;
      const toPx = (c) => ({ x: c.x * w, y: c.y * h });
      const p0 = toPx(corners.tl);
      const p1 = toPx(corners.tr);
      const p2 = toPx(corners.br);
      const p3 = toPx(corners.bl);
      setTransform(computeMatrix3d(source.w, source.h, p0, p1, p2, p3));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, corners.tl.x, corners.tl.y, corners.tr.x, corners.tr.y, corners.br.x, corners.br.y, corners.bl.x, corners.bl.y, source.w, source.h]);

  return transform;
}
