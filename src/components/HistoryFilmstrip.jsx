import { useRef, useState } from "react";
import { timeline } from "../data/history";
import ProjectImage from "./ProjectImage";
import { Modal, Eyebrow } from "./UI";

export default function HistoryFilmstrip() {
  const rail = useRef(null);
  const [selected, setSelected] = useState(null);
  function move(direction) {
    const node = rail.current;
    const step = node.children[1].offsetLeft - node.children[0].offsetLeft;
    node.scrollBy({
      left: direction * step,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  const entry = selected === null ? null : timeline[selected];
  return (
    <section className="history-cinema" aria-labelledby="history-reel-title">
      <div className="section-heading">
        <div>
          <Eyebrow>Семь глав одной истории</Eyebrow>
          <h1 id="history-reel-title">История в кадрах</h1>
        </div>
      </div>
      <p className="section-deck">
        Листайте плёнку. Откройте кадр, чтобы прочитать полную историю.
      </p>
      <div className="reel-housing">
        <ol
          className="history-reel"
          ref={rail}
          tabIndex={0}
          aria-label="Историческая киноплёнка, пролистывается стрелками"
          onKeyDown={(e) => {
            if (
              e.target === e.currentTarget &&
              ["ArrowLeft", "ArrowRight"].includes(e.key)
            ) {
              e.preventDefault();
              move(e.key === "ArrowRight" ? 1 : -1);
            }
          }}
        >
          {timeline.map((p, i) => (
            <li key={p.id}>
              <button
                className="history-frame"
                onClick={() => setSelected(i)}
                aria-label={`${p.year}. ${p.title}. Читать подробнее`}
                aria-haspopup="dialog"
              >
                <div className={`frame-image ${p.portrait ? "portrait" : ""}`}>
                  <ProjectImage src={p.image} alt="" sizes="300px" />
                  <span className="frame-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="frame-caption">
                  <span className="frame-year">{p.year}</span>
                  <h3>{p.title}</h3>
                  <p>{p.summary}</p>
                  <span className="frame-read">
                    Раскрыть историю <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </button>
            </li>
          ))}
                </ol>
      </div>

      <div className="reel-navigation">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="Предыдущая карточка"
        >
          ← Назад
        </button>

        <button
          type="button"
          onClick={() => move(1)}
          aria-label="Следующая карточка"
        >
          Вперед →
        </button>
      </div>

      <div className="reel-footnote">
        <span>МИХАЙЛОВСКОЕ / ИСТОРИЧЕСКАЯ ХРОНИКА</span>
        <span>XVIII век — настоящее время</span>
      </div>
      {entry && (
        <Modal title={entry.title} onClose={() => setSelected(null)}>
          <div className="history-expanded">
            <div
              className={`history-expanded-image ${entry.portrait ? "portrait" : ""}`}
            >
              <ProjectImage src={entry.image} alt={entry.title} sizes="450px" />
            </div>
            <div>
              <Eyebrow>{entry.year}</Eyebrow>
              {entry.detail.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
          </div>
          <div className="gallery-controls">
            <button
              className="button secondary"
              disabled={selected === 0}
              onClick={() => setSelected(selected - 1)}
            >
              ← Предыдущая глава
            </button>
            <span>
              {selected + 1} / {timeline.length}
            </span>
            <button
              className="button secondary"
              disabled={selected === timeline.length - 1}
              onClick={() => setSelected(selected + 1)}
            >
              Следующая глава →
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
