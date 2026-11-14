import ProjectImage from "./ProjectImage";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { asset, navigation } from "../data/content";
export function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
export function Button({
  to,
  children,
  secondary = false,
  arrow = true,
  ...props
}) {
  return (
    <Link
      className={`button ${secondary ? "secondary" : ""}`}
      to={to}
      {...props}
    >
      {children}
      {arrow && (
        <svg className="button-arrow" aria-hidden="true" viewBox="0 0 24 24">
          <path d="M3 12h17m-6-6 6 6-6 6" />
        </svg>
      )}
    </Link>
  );
}
export function Eyebrow({ children }) {
  return (
    <p className="eyebrow">
      <span />
      {children}
    </p>
  );
}
export function Notice({ children }) {
  return (
    <div className="notice">
      <span aria-hidden="true">◌</span>
      <p>
        {children ||
          "Проектное предложение. Кинорезиденция не принимает посетителей. Начало эксплуатации — не ранее 2030 года."}
      </p>
    </div>
  );
}
export function PageIntro({ number, title, children }) {
  return (
    <header className="page-intro container">
      {number && <Eyebrow>Михайловское / {number}</Eyebrow>}
      <h1>{title}</h1>
      <p className="intro-text">{children}</p>
    </header>
  );
}
export function SectionHeading({
  label,
  title,
  to,
  linkText = "Подробнее",
  ruled = false,
}) {
  return (
    <div className="section-heading">
      <div>
        {label && <Eyebrow>{label}</Eyebrow>}
        <h2>{title}</h2>
      </div>
      {to && (
        <Link className={ruled ? "ruled-link" : "text-link"} to={to}>
          {linkText} {!ruled && <Arrow />}
        </Link>
      )}
    </div>
  );
}
export function Placeholder({ label = "Материал уточняется", type = "frame" }) {
  return (
    <div className={`placeholder ${type}`}>
      <div className="placeholder-lines" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <span>{label}</span>
    </div>
  );
}
export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const menuButton = useRef(null);
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main").focus();
        }}
      >
        К содержимому
      </a>
      <header className="site-header">
        <Link to="/" aria-label="Михайловское — главная" className="brand">
          <img src={asset("brand.svg")} alt="Кинорезиденция Михайловское" />
        </Link>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {navigation
            .filter(([to]) => to !== "/events")
            .map(([to, title]) => (
              <NavLink key={to} to={to}>
                {title}
              </NavLink>
            ))}
        </nav>
        <Link className="header-cta" to="/events">
          Афиша <span aria-hidden="true">↗</span>
        </Link>
        <button
          ref={menuButton}
          className={`menu-toggle ${open ? "close-button" : ""}`}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
        >
          {open ? "×" : "☰"}
        </button>
        {open && (
          <nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Мобильная навигация"
          >
            {navigation.map(([to, title]) => (
              <NavLink key={to} to={to}>
                {title}
                <Arrow />
              </NavLink>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link className="footer-brand" to="/">
            Михайловское<span>История обретает новые кадры.</span>
          </Link>
          <p>
            Проект кинорезиденции
            <br />
            Хакатон «Наследие»
          </p>
        </div>
        <nav aria-label="Навигация в подвале">
          {navigation.map(([to, title]) => (
            <Link key={to} to={to}>
              {title}
            </Link>
          ))}
        </nav>
        <div className="footer-status">
          <span className="status-dot" /> Будущее начинается с сохранения
          <p>
            Открытие планируется на 2030 год.
            <br />
            Программа предварительная.
            <br />
            Продажа билетов и приём заявок не ведутся.
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© Михайловское · Проектная концепция</span>
      </div>
    </footer>
  );
}
export function Modal({ title, onClose, children }) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const prev = document.activeElement;
    const d = ref.current;
    d.showModal();
    document.body.classList.add("modal-open");
    return () => {
      d.close();
      document.body.classList.remove("modal-open");
      prev?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={() => closeRef.current()}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeRef.current();
      }}
      aria-labelledby="modal-title"
    >
      <div className="modal-content">
        <div className="modal-heading">
          <h2 id="modal-title">{title}</h2>
          <button
            className="close-button"
            autoFocus
            aria-label="Закрыть окно"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
export function Gallery({
  items,
  hideCardSources = false,
  hideCardCaptions = false,
  hideModalCaption = false,
}) {
  const [selected, setSelected] = useState(null);
  const current = selected === null ? null : items[selected];
  return (
    <>
      <div className="gallery-grid">
        {items.map((item, i) => (
          <figure key={item.src}>
            <button
              className={`gallery-image ${item.diagram || item.contain ? "contain" : ""}`}
              onClick={() => setSelected(i)}
              aria-label={`Увеличить: ${item.title}`}
            >
              <ProjectImage
                src={item.src}
                alt={item.title}
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <span aria-hidden="true">↗</span>
            </button>
            <figcaption>
              <strong>{item.title}</strong>
              {!hideCardCaptions && (
                <span>{item.cardCaption ?? item.caption}</span>
              )}
              {item.source && !hideCardSources && (
                <a href={item.source} target="_blank" rel="noreferrer">
                  Источник ↗
                </a>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
      {current && (
        <Modal title={current.title} onClose={() => setSelected(null)}>
          <ProjectImage
            className="lightbox-image"
            src={current.src}
            alt={current.title}
          />
          {(!hideModalCaption || current.source) && <p>{current.caption}</p>}
          {current.source && (
            <a href={current.source} target="_blank" rel="noreferrer">
              Источник изображения ↗
            </a>
          )}
          <div className="gallery-controls">
            <button
              className="button secondary"
              onClick={() =>
                setSelected((selected + items.length - 1) % items.length)
              }
            >
              ← Предыдущее
            </button>
            <span>
              {selected + 1} / {items.length}
            </span>
            <button
              className="button secondary"
              onClick={() => setSelected((selected + 1) % items.length)}
            >
              Следующее →
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
export function EventCard({ event }) {
  const theme = event.category.includes("Кинопоказ")
    ? "dark"
    : /Вечер|Концерт|Дискус/.test(event.category)
      ? "wine"
      : "cream";
  return (
    <article className={`event-card ticket-${theme}`}>
      <Link className="ticket-shell" to={`/events/${event.slug}`}>
        <div className="ticket-main">
          <div className="ticket-kicker">
            <span>{event.category}</span>
            <span aria-hidden="true">МК / КИНОРЕЗИДЕНЦИЯ</span>
          </div>
          <h3>{event.title}</h3>
          <div className="ticket-information">
            <p className="ticket-time">
              {event.date
                ? `${event.startTime}–${event.endTime}`
                : "Дата не определена"}
            </p>
            <p className="ticket-venue">{event.venue}</p>
          </div>
          <div className="ticket-bottom">
            <small>Предварительная программа · не билет</small>
            <span>О событии ↗</span>
          </div>
        </div>
        <div className="ticket-stub">
          <span className="stub-label">МИХАЙЛОВСКОЕ</span>
          <div className="stub-date">
            <strong>{event.date ? event.date.slice(-2) : "∞"}</strong>
            <span>{event.date ? "СЕНТЯБРЯ" : "БЕЗ ДАТЫ"}</span>
            <b>{event.date ? "2030" : "ПРОЕКТ"}</b>
          </div>
          <span className="stub-barcode" aria-hidden="true" />
          <small aria-hidden="true">
            КАДР {event.id.replace(/[^0-9]/g, "").padStart(2, "0")}
          </small>
        </div>
      </Link>
    </article>
  );
}
export function SpaceCard({ space, showImageCredit = true }) {
  return (
    <article className="space-card">
      <Link to={`/spaces/${space.slug}`} tabIndex={-1} aria-hidden="true">
        {space.image ? (
          <ProjectImage
            src={space.image}
            alt=""
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        ) : (
          <div className="space-type">
            <span aria-hidden="true">{space.number}</span>
            <p>{space.category}</p>
            <small>Проектное пространство · фото готовится</small>
          </div>
        )}
      </Link>
      <div className="space-card-text">
        {space.imageNote && (
          <small className="image-status">{space.imageNote}</small>
        )}
        {showImageCredit && space.slug === "park" && (
          <details className="image-credit">
            <summary>О фотографии</summary>
            <p>
              ЛЮБИТЕль ·{" "}
              <a
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="noreferrer"
              >
                CC BY-SA 4.0
              </a>
              . Кадрирование и уменьшение для сайта.{" "}
              <a
                href="https://commons.wikimedia.org/wiki/File:Аллея_парка_в_Михайловском.jpg"
                target="_blank"
                rel="noreferrer"
              >
                Оригинал фотографии ↗
              </a>
            </p>
          </details>
        )}
        <span className="eyebrow">
          {space.number} / {space.category}
        </span>
        <h3>
          <Link to={`/spaces/${space.slug}`}>
            {space.title} <Arrow />
          </Link>
        </h3>
        <p>{space.description}</p>
      </div>
    </article>
  );
}
export function FAQ({ items }) {
  return (
    <div className="faq">
      {items.map(([question, answer]) => (
        <details key={question}>
          <summary>
            {question}
            <span className="faq-icon" aria-hidden="true" />
          </summary>
          <p>{answer}</p>
        </details>
      ))}
    </div>
  );
}
export function OpeningBanner() {
  return (
    <section className="opening-banner film-edges">
      <div>
        <Eyebrow>Планируемое открытие</Eyebrow>
        <h2>
          28–29 сентября <em>2030</em>
        </h2>
        <p>Два дня кино, открытий и диалога с историей.</p>
        <small>Предварительная программа. Возможны изменения.</small>
      </div>
      <div className="opening-days">
        <p>
          <b>28.09</b>
          <span>
            История и кадр<small>Экскурсии · Кинопоказы · Мастерские</small>
          </span>
        </p>
        <p>
          <b>29.09</b>
          <span>
            Профессия: кино<small>Питчинг · Практикумы · Дискуссии</small>
          </span>
        </p>
      </div>
      <Button to="/events?program=opening" secondary>
        Программа открытия
      </Button>
    </section>
  );
}
