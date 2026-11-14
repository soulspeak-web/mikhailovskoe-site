import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  allEvents,
  openingEvents,
  categories,
  filterEvents,
} from "../data/events";
import { spaces } from "../data/content";
import {
  Button,
  PageIntro,
  Notice,
  EventCard,
  Eyebrow,
  SectionHeading,
} from "../components/UI";
import { NotFound } from "./Pages";
export function Events() {
  const [params, setParams] = useSearchParams();
  const opening = params.get("program") === "opening";
  const [calendar, setCalendar] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const date = params.get("date") || (opening ? "2030-09-28" : "all");
  const category = params.get("category") || "all";
  const venue = params.get("venue") || "all";
  const query = params.get("q") || "";
  const source = opening ? openingEvents : allEvents;
  const filtered = filterEvents(source, { date, category, venue, query });
  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === "all" || !value) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };
  const reset = () => setParams(opening ? { program: "opening" } : {});
  return (
    <>
      <PageIntro
        number={opening ? "04" : "05"}
        title={opening ? "Открытие 2030" : "Афиша будущего"}
      >
        {opening
          ? "28–29 сентября. Два дня, чтобы увидеть историю по-новому и представить будущее кино."
          : "Кинопоказы, мастерские, прогулки и встречи. Предлагаемые форматы культурной жизни после открытия."}
      </PageIntro>
      <div className="container page-content">
        <div className="chip-list" aria-label="Программа афиши">
          <Link className={!opening ? "active" : ""} to="/events">
            Вся афиша
          </Link>
          <Link
            className={opening ? "active" : ""}
            to="/events?program=opening"
          >
            Программа открытия · 28–29 сентября
          </Link>
        </div>
        {opening ? (
          <div className="day-tabs" aria-label="День программы">
            {[
              ["2030-09-28", "28 сентября", "История и кадр"],
              ["2030-09-29", "29 сентября", "Профессия: кино"],
            ].map(([d, t, s]) => (
              <button
                key={d}
                aria-pressed={date === d}
                className={date === d ? "active" : ""}
                onClick={() => update("date", d)}
              >
                <span>
                  {t}
                  <small>2030</small>
                </span>
                <strong>{s}</strong>
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="calendar-block">
            <button
              className="text-link"
              aria-expanded={calendar}
              onClick={() => setCalendar(!calendar)}
            >
              {calendar ? "Скрыть" : "Открыть"} календарь · сентябрь 2030{" "}
              <span aria-hidden="true">⌄</span>
            </button>
            {calendar && (
              <div className="calendar">
                <h2>Сентябрь 2030</h2>
                <div className="calendar-grid">
                  {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                  {Array.from({ length: 6 }, (_, i) => (
                    <span key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((day) =>
                    day === 28 || day === 29 ? (
                      <button
                        key={day}
                        className={date === `2030-09-${day}` ? "active" : ""}
                        aria-label={`${day} сентября 2030 — события открытия`}
                        onClick={() => update("date", `2030-09-${day}`)}
                      >
                        {day}
                        <i />
                      </button>
                    ) : (
                      <span key={day}>{day}</span>
                    ),
                  )}
                </div>
                <p>
                  Отмечены дни предварительной программы открытия. Дат
                  регулярных событий пока нет.
                </p>
              </div>
            )}
          </div>
        )}
        <button
          className="filter-toggle"
          aria-expanded={filtersOpen}
          aria-controls="event-filters"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          Фильтры афиши{" "}
          <span>
            {[
              category !== "all",
              venue !== "all",
              !!query,
              !opening && date !== "all",
            ].filter(Boolean).length || ""}{" "}
            {filtersOpen ? "−" : "+"}
          </span>
        </button>
        <div
          id="event-filters"
          className={`filters ${filtersOpen ? "" : "mobile-collapsed"}`}
        >
          {!opening && (
            <label>
              Дата
              <select
                value={date}
                onChange={(e) => update("date", e.target.value)}
              >
                <option value="all">Все даты</option>
                <option value="2030-09-28">28 сентября 2030</option>
                <option value="2030-09-29">29 сентября 2030</option>
                <option value="undated">Без даты · регулярные форматы</option>
              </select>
            </label>
          )}
          <label>
            Направление
            <select
              value={category}
              onChange={(e) => update("category", e.target.value)}
            >
              <option value="all">Все категории</option>
              {categories
                .filter((c) => source.some((e) => e.category === c))
                .map((c) => (
                  <option key={c}>{c}</option>
                ))}
            </select>
          </label>
          <label>
            Пространство
            <select
              value={venue}
              onChange={(e) => update("venue", e.target.value)}
            >
              <option value="all">Все площадки</option>
              {[...new Set(source.map((e) => e.venue))].sort().map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label>
            Поиск
            <input
              type="search"
              value={query}
              placeholder="Название события"
              onChange={(e) => update("q", e.target.value)}
            />
          </label>
          <button className="reset-button" onClick={reset}>
            Сбросить
          </button>
        </div>
        <div className="results-heading">
          <p aria-live="polite">Найдено событий: {filtered.length}</p>
          <span>Предварительная программа</span>
        </div>
        {filtered.length ? (
          <div className="event-grid">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Пока ни одного кадра</h2>
            <p>
              По выбранным условиям нет событий. Попробуйте другую дату или
              категорию.
            </p>
            <button className="button" onClick={reset}>
              Сбросить фильтры →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
export function EventDetail() {
  const { slug } = useParams();
  const event = allEvents.find((e) => e.slug === slug);
  if (!event) return <NotFound />;
  const related = allEvents
    .filter((e) => e.id !== event.id && e.category === event.category)
    .slice(0, 3);
  const space = spaces.find(
    (s) =>
      event.venue.includes(s.title) ||
      event.venue.includes(s.title.replace("Зал", "зал")),
  );
  return (
    <>
      <PageIntro number="Событие" title={event.title}>
        {event.category}
      </PageIntro>
      <div className="container page-content">
        <Link
          className="text-link back-link"
          to={
            event.date
              ? `/events?program=opening&date=${event.date}`
              : "/events"
          }
        >
          ← Вернуться к программе
        </Link>
        <div className="event-detail">
          <div className="event-detail-ticket film-edges">
            <Eyebrow>Предварительное предложение</Eyebrow>
            <strong>{event.date ? event.date.slice(-2) : "∞"}</strong>
            <span>{event.date ? "сентября 2030" : "Дата не определена"}</span>
            <h2>
              {event.date
                ? `${event.startTime}–${event.endTime}`
                : "Будущий формат"}
            </h2>
            <p>{event.venue}</p>
            <span className="ticket-barcode" aria-hidden="true" />
          </div>
          <div className="event-description">
            <h2>О событии</h2>
            <p className="lead">{event.fullDescription}</p>
            <Notice>
              Это предложение из концепции кинорезиденции. Время и формат могут
              измениться. Билеты, запись и бронирование недоступны.
            </Notice>
            <dl>
              <div>
                <dt>Площадка</dt>
                <dd>
                  {space ? (
                    <Link to={`/spaces/${space.slug}`}>{event.venue} ↗</Link>
                  ) : (
                    event.venue
                  )}
                </dd>
              </div>
              <div>
                <dt>Условия посещения</dt>
                <dd>Будут опубликованы после утверждения</dd>
              </div>
              <div>
                <dt>Участники</dt>
                <dd>Состав не подтверждён</dd>
              </div>
            </dl>
            <Button to="/visit" secondary>
              Информация посетителям
            </Button>
          </div>
        </div>
        {related.length > 0 && (
          <section className="section">
            <SectionHeading title="Продолжить знакомство" />
            <div className="event-grid">
              {related.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
