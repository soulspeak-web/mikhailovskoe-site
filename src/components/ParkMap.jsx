import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { asset } from "../data/content";
import "../park-map.css";

// Позиции привязаны к исходному изображению генплана.
// Точки, включая вторую беседку, сохраняются без изменения координат.
const parkPoints = [
  { id: 1, title: "Тенистая аллея", image: "park-01-alley.jpg", x: 55.6, y: 52.2 },
  { id: 2, title: "Пирс", image: "park-02-pier.jpg", x: 83.5, y: 54.4 },
  { id: 3, title: "Амфитеатр", image: "park-03-amphitheater.jpg", x: 55.7, y: 34.1 },
  { id: 4, title: "Розарий", image: "park-04-rose-garden.jpg", x: 55.7, y: 41.0 },
  { id: 5, title: "Ботанический сад", image: "park-05-botanical-garden.jpg", x: 38.8, y: 30.8 },
  { id: 6, title: "Ротонда", image: "park-06-rotunda.jpg", x: 85.2, y: 66.0 },
  { id: 7, title: "Беседка", image: "park-07-gazebo.jpg", x: 75.9, y: 45.9 },
  { id: 7, key: "gazebo-secondary", title: "Беседка", image: "park-07-gazebo.jpg", x: 80.5, y: 70.5 },
  { id: 8, title: "Птичник", image: "park-08-aviary.jpg", x: 64.1, y: 68.3 },
  { id: 9, title: "Грот с декоративным прудом", image: "park-09-grotto.jpg", x: 55.7, y: 27.1 },
];

const MAX_SCALE = 3.5;
const MIN_SCALE = 1;
const limit = (value, min, max) => Math.min(max, Math.max(min, value));

export default function ParkMap() {
  const [selected, setSelected] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const viewportRef = useRef(null);
  const pointersRef = useRef(new Map());
  const dragRef = useRef(null);
  const pinchRef = useRef(null);
  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);

  // Рефы позволяют обрабатывать указатель без запаздывания при перетаскивании.
  zoomRef.current = zoom;
  panRef.current = pan;

  const bounds = (scale) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    return {
      x: rect ? (rect.width * (scale - 1)) / 2 : 0,
      y: rect ? (rect.height * (scale - 1)) / 2 : 0,
    };
  };

  const setView = (nextZoom, nextPan) => {
    const z = limit(nextZoom, MIN_SCALE, MAX_SCALE);
    const bound = bounds(z);
    const next = {
      x: limit(nextPan.x, -bound.x, bound.x),
      y: limit(nextPan.y, -bound.y, bound.y),
    };
    zoomRef.current = z;
    panRef.current = next;
    setZoom(z);
    setPan(next);
  };

  const adjustZoom = (nextZoom, clientX, clientY) => {
    const currentZoom = zoomRef.current;
    const z = limit(nextZoom, MIN_SCALE, MAX_SCALE);
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect || z === currentZoom) return;
    const fx = (clientX ?? (rect.left + rect.width / 2)) - rect.left - rect.width / 2;
    const fy = (clientY ?? (rect.top + rect.height / 2)) - rect.top - rect.height / 2;
    const factor = z / currentZoom;
    setView(z, {
      x: fx - factor * (fx - panRef.current.x),
      y: fy - factor * (fy - panRef.current.y),
    });
  };

  const resetView = () => setView(1, { x: 0, y: 0 });

  const onPointerDown = (event) => {
    // Клик по маркеру должен открывать визуализацию, а не двигать карту.
    if (event.target.closest("button")) return;
    if (zoomRef.current === 1 && event.pointerType !== "touch") return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (zoomRef.current > 1 || pointersRef.current.size > 1) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (pointersRef.current.size === 1) {
      dragRef.current = { x: event.clientX, y: event.clientY, pan: { ...panRef.current } };
      pinchRef.current = null;
    } else if (pointersRef.current.size === 2) {
      const [a, b] = [...pointersRef.current.values()];
      pinchRef.current = {
        distance: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
        zoom: zoomRef.current,
        pan: { ...panRef.current },
      };
      dragRef.current = null;
    }
  };

  const onPointerMove = (event) => {
    if (!pointersRef.current.has(event.pointerId)) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointersRef.current.size === 2 && pinchRef.current) {
      const [a, b] = [...pointersRef.current.values()];
      const start = pinchRef.current;
      const newZoom = limit(start.zoom * Math.hypot(a.x - b.x, a.y - b.y) / start.distance, MIN_SCALE, MAX_SCALE);
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const rect = viewportRef.current?.getBoundingClientRect();
      if (!rect) return;
      const oldFx = start.center.x - rect.left - rect.width / 2;
      const oldFy = start.center.y - rect.top - rect.height / 2;
      const newFx = mid.x - rect.left - rect.width / 2;
      const newFy = mid.y - rect.top - rect.height / 2;
      const ratio = newZoom / start.zoom;
      setView(newZoom, {
        x: newFx - ratio * (oldFx - start.pan.x),
        y: newFy - ratio * (oldFy - start.pan.y),
      });
    } else if (pointersRef.current.size === 1 && dragRef.current && zoomRef.current > 1) {
      const start = dragRef.current;
      setView(zoomRef.current, {
        x: start.pan.x + event.clientX - start.x,
        y: start.pan.y + event.clientY - start.y,
      });
    }
  };

  const onPointerUp = (event) => {
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
    if (!selected) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = before;
      document.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  useEffect(() => {
    const onResize = () => setView(zoomRef.current, panRef.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    // Ctrl + колесо: масштабируем карту, не перехватывая обычную прокрутку страницы.
    const wheel = (event) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      adjustZoom(zoomRef.current + (event.deltaY < 0 ? 0.25 : -0.25), event.clientX, event.clientY);
    };
    node.addEventListener("wheel", wheel, { passive: false });
    return () => node.removeEventListener("wheel", wheel);
  }, []);

  return (
    <section className="park-interactive" aria-label="Интерактивный генеральный план">
      <div className="park-interactive-intro">
        <p>Выберите точку на плане, чтобы рассмотреть визуализацию пространства.</p>
        <span>09 / ПРОСТРАНСТВ</span>
      </div>
      <div className="park-map-toolbar">
        <span className="park-map-hint">Увеличьте карту и перемещайте ее мышью или пальцем</span>
        <div className="park-map-controls" aria-label="Масштаб карты">
          <button type="button" onClick={() => adjustZoom(zoomRef.current + 0.5)} disabled={zoom >= MAX_SCALE} aria-label="Увеличить карту">+</button>
          <button type="button" onClick={() => adjustZoom(zoomRef.current - 0.5)} disabled={zoom <= MIN_SCALE} aria-label="Уменьшить карту">−</button>
          <button type="button" onClick={resetView} disabled={zoom === 1 && pan.x === 0 && pan.y === 0} aria-label="Сбросить масштаб и положение">Сбросить</button>
          <span aria-live="polite" className="park-map-scale">{Math.round(zoom * 100)}%</span>
        </div>
      </div>
      <div
        ref={viewportRef}
        className={`park-interactive-scroll park-map-viewport ${zoom > 1 ? "is-zoomed" : ""}`}
        style={{ touchAction: zoom > 1 ? "none" : "pan-y" }}
        aria-label="Интерактивная карта парка. Используйте кнопки масштаба и перетаскивание для исследования плана"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={(event) => {
          if (event.target.closest("button")) return;
          adjustZoom(zoomRef.current === MAX_SCALE ? 1 : zoomRef.current + 0.5, event.clientX, event.clientY);
        }}
      >
        <div
          className="park-map-transform"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, "--park-pin-inverse-scale": 1 / zoom }}
        >
          <div className="park-interactive-stage">
            <img
              src={asset("park-plan-interactive.jpg")}
              alt="Генеральный план усадьбы с девятью будущими пространствами парка"
              width="2048"
              height="1509"
              loading="lazy"
              draggable="false"
            />
            {parkPoints.map((point) => (
              <button
                key={point.key ?? point.id}
                type="button"
                className="park-interactive-pin"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                onClick={() => setSelected(point)}
                title={point.title}
                data-label={point.title}
                aria-label={`Показать визуализацию: ${point.title}`}
              >
                {String(point.id).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="park-interactive-note">
        Изображения показывают проектные визуализации будущих пространств,
        а не их существующее состояние.
      </p>
      {selected && createPortal(
        <div
          className="park-preview-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <div className="park-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="park-preview-title">
            <div className="park-preview-topbar">
              <span>ВИЗУАЛИЗАЦИЯ / {String(selected.id).padStart(2, "0")}</span>
              <button type="button" className="park-preview-close" aria-label="Закрыть визуализацию" onClick={() => setSelected(null)} autoFocus>×</button>
            </div>
            <img src={asset(selected.image)} alt={`Проектная визуализация: ${selected.title}`} />
            <div className="park-preview-bottom">
              <h3 id="park-preview-title">{selected.title}</h3>
              <p>Концепция благоустройства территории усадьбы</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
