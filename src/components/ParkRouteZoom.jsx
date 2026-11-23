import { useEffect, useRef, useState } from "react";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3.5;
const clamp = (number, min, max) => Math.min(max, Math.max(min, number));

/**
 * Interactive viewport for the existing ParkRoutes map (image + numbered pins).
 * Does not alter the data, the route images, or the modal behavior.
 */
export default function ParkRouteZoom({ children }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const viewportRef = useRef(null);
  const zoomRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const pointersRef = useRef(new Map());
  const dragRef = useRef(null);
  const pinchRef = useRef(null);

  const bounds = (scale) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    return {
      x: rect ? (rect.width * (scale - 1)) / 2 : 0,
      y: rect ? (rect.height * (scale - 1)) / 2 : 0,
    };
  };

  const setView = (nextZoom, nextPan) => {
    const safeZoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
    const max = bounds(safeZoom);
    const safePan = {
      x: clamp(nextPan.x, -max.x, max.x),
      y: clamp(nextPan.y, -max.y, max.y),
    };
    zoomRef.current = safeZoom;
    panRef.current = safePan;
    setZoom(safeZoom);
    setPan(safePan);
  };

  const adjustZoom = (nextZoom, clientX, clientY) => {
    const oldZoom = zoomRef.current;
    const newZoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect || newZoom === oldZoom) return;
    const fx = (clientX ?? rect.left + rect.width / 2) - rect.left - rect.width / 2;
    const fy = (clientY ?? rect.top + rect.height / 2) - rect.top - rect.height / 2;
    const ratio = newZoom / oldZoom;
    setView(newZoom, {
      x: fx - ratio * (fx - panRef.current.x),
      y: fy - ratio * (fy - panRef.current.y),
    });
  };

  const reset = () => setView(1, { x: 0, y: 0 });

  const pointerDown = (event) => {
    // Markers retain their own clicks: no dragging if touch began on a pin.
    if (event.target.closest("button")) return;
    if (event.pointerType !== "touch" && zoomRef.current === 1) return;

    pointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    if (zoomRef.current > 1 || pointersRef.current.size > 1) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (pointersRef.current.size === 1) {
      dragRef.current = {
        x: event.clientX,
        y: event.clientY,
        pan: { ...panRef.current },
      };
      pinchRef.current = null;
    } else if (pointersRef.current.size === 2) {
      const [first, second] = [...pointersRef.current.values()];
      pinchRef.current = {
        distance: Math.hypot(first.x - second.x, first.y - second.y) || 1,
        center: { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 },
        zoom: zoomRef.current,
        pan: { ...panRef.current },
      };
      dragRef.current = null;
    }
  };

  const pointerMove = (event) => {
    if (!pointersRef.current.has(event.pointerId)) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointersRef.current.size === 2 && pinchRef.current) {
      const [first, second] = [...pointersRef.current.values()];
      const start = pinchRef.current;
      const currentDistance = Math.hypot(first.x - second.x, first.y - second.y);
      const newZoom = clamp(start.zoom * currentDistance / start.distance, MIN_ZOOM, MAX_ZOOM);
      const mid = { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
      const rect = viewportRef.current?.getBoundingClientRect();
      if (!rect) return;
      const startX = start.center.x - rect.left - rect.width / 2;
      const startY = start.center.y - rect.top - rect.height / 2;
      const endX = mid.x - rect.left - rect.width / 2;
      const endY = mid.y - rect.top - rect.height / 2;
      const ratio = newZoom / start.zoom;
      setView(newZoom, {
        x: endX - ratio * (startX - start.pan.x),
        y: endY - ratio * (startY - start.pan.y),
      });
    } else if (pointersRef.current.size === 1 && dragRef.current && zoomRef.current > 1) {
      const start = dragRef.current;
      setView(zoomRef.current, {
        x: start.pan.x + event.clientX - start.x,
        y: start.pan.y + event.clientY - start.y,
      });
    }
  };

  const pointerEnd = (event) => {
    pointersRef.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    pinchRef.current = null;
    const remaining = [...pointersRef.current.values()];
    dragRef.current = remaining.length === 1
      ? { x: remaining[0].x, y: remaining[0].y, pan: { ...panRef.current } }
      : null;
  };

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    const onWheel = (event) => {
      // Ordinary mouse wheel continues to scroll the page.
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      adjustZoom(zoomRef.current + (event.deltaY < 0 ? 0.25 : -0.25), event.clientX, event.clientY);
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const onResize = () => setView(zoomRef.current, panRef.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="estate-park-zoom">
      <div className="estate-park-zoom__toolbar">
        <span className="estate-park-zoom__hint">Увеличьте карту и перемещайте ее пальцем или мышью</span>
        <div className="estate-park-zoom__controls" role="group" aria-label="Масштаб схемы парка">
          <button type="button" aria-label="Увеличить карту" disabled={zoom >= MAX_ZOOM} onClick={() => adjustZoom(zoomRef.current + 0.5)}>+</button>
          <button type="button" aria-label="Уменьшить карту" disabled={zoom <= MIN_ZOOM} onClick={() => adjustZoom(zoomRef.current - 0.5)}>−</button>
          <button type="button" aria-label="Сбросить масштаб и положение" disabled={zoom === 1 && pan.x === 0 && pan.y === 0} onClick={reset}>Сбросить</button>
          <span className="estate-park-zoom__value" aria-live="polite">{Math.round(zoom * 100)}%</span>
        </div>
      </div>
      <div
        ref={viewportRef}
        className={`estate-park-zoom__viewport ${zoom > 1 ? "is-zoomed" : ""}`}
        style={{ touchAction: zoom > 1 ? "none" : "pan-y" }}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerEnd}
        onPointerCancel={pointerEnd}
        onDoubleClick={(event) => {
          if (event.target.closest("button")) return;
          adjustZoom(zoomRef.current >= MAX_ZOOM ? 1 : zoomRef.current + 0.5, event.clientX, event.clientY);
        }}
        aria-label="Схема парка: используйте кнопки для увеличения, затем перемещайте карту"
      >
        <div
          className="estate-park-zoom__stage"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, "--route-pin-relative-scale": 1 / Math.sqrt(zoom) }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
