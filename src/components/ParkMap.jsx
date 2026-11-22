import { useEffect, useState } from "react";
import { asset } from "../data/content";
import "../park-map.css";

// Позиции отмечены в процентах относительно исходного генплана.
// Если потребуется, их можно слегка скорректировать, меняя x/y.
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

export default function ParkMap() {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!selected) return;
    function handleKeyDown(event) {
      if (event.key === "Escape") setSelected(null);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selected]);

  return (
    <section className="park-interactive" aria-label="Интерактивный генеральный план">
      <div className="park-interactive-intro">
        <p>Выберите точку на плане, чтобы рассмотреть визуализацию пространства.</p>
        <span>09 / ПРОСТРАНСТВ</span>
      </div>
      <div className="park-interactive-scroll" tabIndex={0} aria-label="План территории. На узких экранах прокрутите вправо для просмотра всего плана">
        <div className="park-interactive-stage">
          <img
            src={asset("park-plan-interactive.jpg")}
            alt="Генеральный план территории усадьбы с расположением девяти проектируемых пространств парка"
            width="2048"
            height="1509"
            loading="lazy"
          />
          {parkPoints.map((point) => (
            <button
              key={point.key ?? point.id}
              type="button"
              className="park-interactive-pin"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              onClick={() => setSelected(point)}
              title={point.title}
              aria-label={`Показать визуализацию: ${point.title}`}
            >
              {String(point.id).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>
      <p className="park-interactive-note">
        Изображения показывают проектные визуализации будущих пространств,
        а не их существующее состояние.
      </p>

      {selected && (
        <div
          className="park-preview-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <div
            className="park-preview-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="park-preview-title"
          >
            <div className="park-preview-topbar">
              <span>ВИЗУАЛИЗАЦИЯ / {String(selected.id).padStart(2, "0")}</span>
              <button
                type="button"
                className="park-preview-close"
                aria-label="Закрыть визуализацию"
                onClick={() => setSelected(null)}
                autoFocus
              >
                ×
              </button>
            </div>
            <img
              src={asset(selected.image)}
              alt={`Проектная визуализация: ${selected.title}`}
            />
            <div className="park-preview-bottom">
              <h3 id="park-preview-title">{selected.title}</h3>
              <p>Концепция благоустройства территории усадьбы</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
