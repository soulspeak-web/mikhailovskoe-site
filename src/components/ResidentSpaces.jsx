import ProjectImage from "./ProjectImage";
import { residentRoomGroups, filmingLocationGroups } from "../data/residents";
import { SectionHeading } from "./UI";
import "../residents.css";

function SpaceGroups({ groups }) {
  return groups.map((group) => (
    <section className="resident-space-group" key={group.id} aria-labelledby={`resident-${group.id}`}>
      <h3 className="resident-group-heading" id={`resident-${group.id}`}>{group.title}</h3>
      <div className="space-grid resident-spaces resident-offerings-grid">
        {group.items.map((item) => (
          <article className="resident-space-card resident-offering" key={item.id}>
            {item.photo && <ProjectImage className="resident-offering-photo" src={item.photo.src} alt={item.photo.alt || item.title} width={item.photo.width} height={item.photo.height} />}
            <div className="resident-offering-content">
              {item.icon && <ProjectImage className="resident-offering-icon" src={item.icon} alt="" width={item.width} height={item.height} />}
              <h4>{item.title}</h4>
              {item.description && <p>{item.description}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  ));
}

export default function ResidentSpaces() {
  return <>
    <section className="section resident-offerings">
      <SectionHeading title="Предлагаемые пространства для резидентов" to="/spaces" linkText="Все пространства" ruled />
      <SpaceGroups groups={residentRoomGroups} />
    </section>
    <section className="section resident-filming">
      <SectionHeading title="Предлагаемые съемочные площадки" />
      <SpaceGroups groups={filmingLocationGroups} />
    </section>
  </>;
}
