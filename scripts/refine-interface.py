from pathlib import Path
p=Path('src/components/UI.jsx');s=p.read_text(encoding='utf-8')
s='import ProjectImage from "./ProjectImage";\n'+s
s=s.replace('navigation.slice(0, 5)', '[...navigation.slice(0, 3), navigation[6], navigation[5]]').replace('...navigation.slice(5),','navigation[3],')
s=s.replace('className="header-cta" to="/opening-2030"','className="header-cta" to="/events"').replace('Программа открытия <span aria-hidden="true">↗</span>','Афиша <span aria-hidden="true">↗</span>')
s=s.replace('Проект кинорезиденции · с 2030 года','Проект кинорезиденции · не ранее 2030')
a=s.index('export function EventCard(');b=s.index('export function SpaceCard(',a)
s=s[:a]+'''export function EventCard({ event }) {
  const theme = event.category.includes('Кинопоказ') ? 'dark' : /Вечер|Концерт|Дискус/.test(event.category) ? 'wine' : 'cream';
  return <article className={`event-card ticket-${theme}`}>
    <Link className="ticket-shell" to={`/events/${event.slug}`}>
      <div className="ticket-main">
        <div className="ticket-kicker"><span>{event.category}</span><span aria-hidden="true">МК / КИНОРЕЗИДЕНЦИЯ</span></div>
        <h3>{event.title}</h3>
        <div className="ticket-information"><p className="ticket-time">{event.date ? `${event.startTime}–${event.endTime}` : 'Дата не определена'}</p><p className="ticket-venue">{event.venue}</p></div>
        <div className="ticket-bottom"><small>Предварительная программа · не билет</small><span>О событии ↗</span></div>
      </div>
      <div className="ticket-stub"><span className="stub-label">МИХАЙЛОВСКОЕ</span><div className="stub-date"><strong>{event.date ? event.date.slice(-2) : '∞'}</strong><span>{event.date ? 'СЕНТЯБРЯ' : 'БЕЗ ДАТЫ'}</span><b>{event.date ? '2030' : 'ПРОЕКТ'}</b></div><span className="stub-barcode" aria-hidden="true"/><small aria-hidden="true">КАДР {event.id.replace(/[^0-9]/g,'').padStart(2,'0')}</small></div>
    </Link>
  </article>;
}
''' + s[b:]
s=s.replace('<img loading="lazy" src={asset(space.image)} alt="" />','<ProjectImage src={space.image} alt="" sizes="(max-width: 640px) 100vw, 33vw" />').replace('<Placeholder />','<div className="space-type"><span aria-hidden="true">{space.number}</span><p>{space.category}</p><small>Проектное пространство · фото готовится</small></div>')
s=s.replace('<div className="space-card-text">','<div className="space-card-text">\n{space.imageNote && <small className="image-status">{space.imageNote}</small>}')
s=s.replace('className="gallery-image"','className={`gallery-image ${item.diagram || item.contain ? "contain" : ""}`}').replace('<img loading="lazy" src={asset(item.src)} alt={item.title} />','<ProjectImage src={item.src} alt={item.title} sizes="(max-width: 640px) 100vw, 33vw" />')
s=s.replace('<span>{item.caption}</span>','<span>{item.caption}</span>{item.source && <a href={item.source} target="_blank" rel="noreferrer">Источник ↗</a>}')
s=s.replace('<img\n            className="lightbox-image"\n            src={asset(current.src)}','<ProjectImage\n            className="lightbox-image"\n            src={current.src}').replace('<p>{current.caption}</p>','<p>{current.caption}</p>{current.source && <a href={current.source} target="_blank" rel="noreferrer">Источник изображения ↗</a>}')
p.write_text(s,encoding='utf-8')
p=Path('src/pages/Home.jsx');s=p.read_text(encoding='utf-8');s='import ProjectImage from "../components/ProjectImage";\n'+s
s=s.replace('<img\n            src={asset("estate.webp")}','<ProjectImage eager\n            src="estate.webp"')
a=s.index('        <section className="audience-grid');b=s.index('        </section>',a)+len('        </section>');audience=s[a:b].replace('audience-grid section','audience-grid audience-entry');s=s[:a]+s[b:];s=s.replace('<div className="quick-links">',audience+'\n<div className="quick-links">',1)
s=s.replace('"opening-23"','"opening-23", "opening-16"')
s=s.replace('<img\n              loading="lazy"\n              src={asset("archive-main.webp")}\n              alt="Архивный вид главного корпуса"\n            />','<ProjectImage src="archive-cyclists.webp" alt="Катание на велосипедах в Михайловском, 1880-е" />').replace('Из архива проекта · Дата и автор уточняются','Ламберг, 1880-е · Музей-усадьба «Останкино»')
s=s.replace('<img src={asset(img)} alt="" />','<ProjectImage src={img} alt="" sizes="180px" />')
p.write_text(s,encoding='utf-8')
p=Path('src/main.jsx');s=p.read_text(encoding='utf-8').replace('import "./styles.css";','import "./styles.css";\nimport "./refinements.css";');p.write_text(s,encoding='utf-8')
