import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { asset } from "../data/content";
import "../park-routes.css";
import "../park-route-zoom.css";
import ParkRouteZoom from "./ParkRouteZoom";

const routes = [
  {
    id: "general",
    title: "Общий план",
    image: "park-routes/map-general-hq.jpg",
    description: "План территории с проектными пространствами и основными аллеями.",
    lines: [],
  },
  {
    id: "transport",
    title: "Транспорт",
    image: "park-routes/map-transport-hq.jpg",
    description: "Предлагаемые пути прибытия и подъезда к территории усадьбы.",
    lines: [
      { color: "#2869db", label: "Синий — путь гостей к парковке" },
      { color: "#e4b32d", label: "Желтый — путь кинорезидентов к парковке и служебному входу" },
    ],
  },
  {
    id: "walking",
    title: "Пешеходные маршруты",
    image: "park-routes/map-walking-hq.jpg",
    description: "Прогулочные маршруты и основные точки знакомства с парком.",
    lines: [
      { color: "#905cb8", label: "Фиолетовый — путь к главному входу" },
      { color: "#34874a", label: "Зеленый — прогулка по территории парка" },
      { color: "#be443d", label: "Красный — маршрут по кинематографичным местам" },
    ],
  },
];

// Координаты ориентировочные, указаны в процентах от размеров схемы.
// При утверждении маршрутов их можно уточнить по генплану.
const places = [
  { id: "alley", title: "Тенистая аллея", image: "park-routes/alley.webp", x: 48, y: 58 },
  { id: "pier", title: "Пирс", image: "park-routes/pier.webp", x: 84, y: 43 },
  { id: "amphitheater", title: "Амфитеатр", image: "park-routes/amphitheater.webp", x: 56, y: 27 },
  { id: "rose", title: "Розарий", image: "park-routes/rose.webp", x: 54, y: 34 },
  { id: "botanical", title: "Ботанический сад", image: "park-routes/botanical.webp", x: 28, y: 24 },
  { id: "rotunda", title: "Ротонда", image: "park-routes/rotunda.webp", x: 82, y: 54 },
  { id: "gazebo", title: "Беседка", image: "park-routes/gazebo.webp", x: 73, y: 35 },
  { id: "aviary", title: "Птичник", image: "park-routes/aviary.webp", x: 65, y: 60 },
  { id: "grotto", title: "Грот с декоративным прудом", image: "park-routes/grotto.webp", x: 56, y: 16 },
  { id: "fountain", title: "Фонтан регулярного парка", image: "park-routes/fountain.webp", x: 56, y: 43 },
  { id: "cafe", title: "Кафе", image: "park-routes/cafe.webp", x: 44, y: 34 },
];

export default function ParkRoutes() {
  const [activeRoute, setActiveRoute] = useState("general");
  const [activePlace, setActivePlace] = useState(null);
  const closeButtonRef = useRef(null);
  const dialogTitleId = "park-routes-dialog-title";
  const route = routes.find((item) => item.id === activeRoute) ?? routes[0];

  useEffect(() => {
    if (!activePlace) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") setActivePlace(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus?.();
    };
  }, [activePlace]);

  return (
    <section className="estate-park-routes section" aria-labelledby="estate-park-routes-heading">
      <div className="estate-park-routes__head">
        <div>
          <span className="estate-park-routes__kicker">Парк и территория / маршруты</span>
          <h2 id="estate-park-routes-heading">Исследовать парк</h2>
          <p>Выберите схему маршрута и нажмите на маркер на карте, чтобы посмотреть визуализацию места.</p>
        </div>
      </div>

      <div className="estate-park-routes__tabs" role="group" aria-label="Выбрать схему маршрута">
        {routes.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`estate-park-routes__tab ${activeRoute === item.id ? "is-active" : ""}`}
            aria-pressed={activeRoute === item.id}
            onClick={() => setActiveRoute(item.id)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span> {item.title}
          </button>
        ))}
      </div>

      <div className="estate-park-routes__layout">
        <div className="estate-park-routes__primary">
          <ParkRouteZoom key={route.id}>
            <div className="estate-park-routes__map">
              <img
                className="estate-park-routes__plan"
                src={asset(route.image)}
                alt={route.description}
                
              />
              {places.map((place, i) => (
                <button
                  key={place.id}
                  type="button"
                  className="estate-park-routes__pin"
                  style={{ left: `${place.x}%`, top: `${place.y}%` }}
                  onClick={() => setActivePlace(place)}
                  aria-label={`Посмотреть визуализацию: ${place.title}`}
                  title={place.title}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              ))}
            </div>
          </ParkRouteZoom>
          <div className="estate-park-routes__map-details">
            <div>
              <h3>{route.title}</h3>
              <p>{route.description}</p>
            </div>
            
          </div>
          {route.lines.length > 0 && (
            <div className="estate-park-routes__legend" aria-label="Обозначения маршрутов">
              {route.lines.map((line) => (
                <div key={line.label} className="estate-park-routes__legend-row">
                  <span className="estate-park-routes__line" style={{ background: line.color }} aria-hidden="true" />
                  <span>{line.label}</span>
                </div>
              ))}
            </div>
          )}
          <p className="estate-park-routes__note">
            Маршруты и расположение интерактивных маркеров показаны по проектным материалам и подлежат уточнению. Изображения — визуализации предполагаемого благоустройства, а не фотографии действующих объектов.
          </p>
        </div>


      </div>

      {activePlace && createPortal(
        <div
          className="estate-park-routes__overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setActivePlace(null);
          }}
        >
          <div className="estate-park-routes__dialog" role="dialog" aria-modal="true" aria-labelledby={dialogTitleId}>
            <div className="estate-park-routes__dialog-head">
              <span>Визуализация / {String(places.findIndex((place) => place.id === activePlace.id) + 1).padStart(2, "0")}</span>
              <button ref={closeButtonRef} type="button" aria-label="Закрыть визуализацию" onClick={() => setActivePlace(null)}>×</button>
            </div>
            <img src={asset(activePlace.image)} alt={activePlace.title} />
            <div className="estate-park-routes__dialog-footer">
              <h3 id={dialogTitleId}>{activePlace.title}</h3>
              <p>Концепция благоустройства территории усадьбы</p>
            </div>
          </div>
        </div>
        , document.body
      )}
    </section>
  );
}
