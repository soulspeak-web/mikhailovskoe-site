import ProjectImage from "../components/ProjectImage";
import { asset, spaces } from "../data/content";
import { openingEvents } from "../data/events";
import {
  Arrow,
  Button,
  Eyebrow,
  SectionHeading,
  OpeningBanner,
  EventCard,
  SpaceCard,
} from "../components/UI";
export default function Home() {
  return (
    <>
    
      <section className="hero">
        <div className="hero-copy">
          <Eyebrow>Кино. Культура. Наследие.</Eyebrow>
          <h1>
            Кинорезиденция
            <br />
            <span>Михайловское</span>
          </h1>
          <p className="hero-subtitle">
            Историческое наследие.
            <br />
            <em>Новая культурная жизнь.</em>
          </p>
          <p className="hero-description">
            Место для кино, творчества и диалога с историей. Здесь наследие
            усадьбы встречается с искусством кино.
          </p>
          <div className="hero-actions">
            <Button to="/concept" arrow={false}>
              О концепции
            </Button>
            <Button to="/spaces" secondary>
              Исследовать пространства
            </Button>
          </div>
          <div className="hero-status">
            <span className="status-dot" />
            Проект кинорезиденции · Открытие не ранее 2030
          </div>
        </div>
        
        <div className="hero-image">
          <ProjectImage
            eager
            src="hero-estate-wide-rec.png"
            alt="Усадьба Михайловское в осеннем парке"
            fetchPriority="high"
          />
        </div>
      </section>

    
<div className="container home-content">
  <OpeningBanner />

  <section className="audience-grid audience-entry">
    <div>
      <Eyebrow>Открыть для себя</Eyebrow>
      <h2>Я — посетитель</h2>
      <p>
        Будущие экскурсии, культурная программа и знакомство с
        территорией.
      </p>
      <Button to="/visit" secondary>
        Спланировать знакомство
      </Button>
    </div>
    <div>
      <Eyebrow>Стать частью истории</Eyebrow>
      <h2>Я — кинорезидент</h2>
      <p>
        Пространства для творчества, профессионального общения и новых
        идей.
      </p>
      <Button to="/residents" secondary>
        О возможностях
      </Button>
    </div>
  </section>

        
      
        <section className="section">
          <SectionHeading
            label="Следующий кадр"
            title="События будущего"
            to="/events"
            linkText="Вся афиша"
            ruled
          />
          <div className="event-grid">
            {["opening-02", "opening-14", "opening-23", "opening-16"].map(
              (id) => (
                <EventCard
                  key={id}
                  event={openingEvents.find((e) => e.id === id)}
                />
              ),
            )}
          </div>
        </section>
        <section className="heritage-section section">
          <div className="heritage-photo">
            <ProjectImage
              src="archive-cyclists.webp"
              alt="Катание на велосипедах в Михайловском, 1880-е"
            />
            <span>Ламберг, 1880-е · Музей-усадьба «Останкино»</span>
          </div>
          <div>
            <Eyebrow>Место с продолжением</Eyebrow>
            <h2>
              Прошлое становится
              <br />
              <em>началом нового.</em>
            </h2>
            <p>
                Архитектура хранит память о людях и времени. Концепция
                кинорезиденции «Михайловское» предлагает бережно сохранить
                эту память и дать историческим пространствам новую
                культурную функцию.
            </p>
            <p>
              Кинопоказы, творческие мастерские, исследования и встречи —
              будущие способы заново увидеть усадьбу.
            </p>
            <Button to="/history" secondary>
              История усадьбы
            </Button>
          </div>
        </section>
        <section className="section home-spaces">
          <SectionHeading
            label="Архитектура встречи"
            title="Пространства для новых историй"
            to="/spaces"
            linkText="Все пространства"
            ruled
          />
          <div className="space-grid">
            {spaces.slice(0, 3).map((space) => (
              <SpaceCard
                showImageCredit={false}
                key={space.slug}
                space={{
                  ...space,
                  description: {
                    main: "Кинозалы, мастерские и места встреч в историческом доме.",
                    wing: "Кафе в здании ансамбля «Усадьба Михайловское, XVIII в.».",
                    park: "Прогулки, экскурсии и кино под открытым небом.",
                  }[space.slug],
                  imageNote:
                    space.slug === "park"
                      ? "Территория усадьбы"
                      : space.imageNote,
                }}
              />
            ))}
          </div>
        </section>
        <section className="directions section">
          <h2>Смотреть. Создавать. Сохранять.</h2>
          <div className="three-col">
            {[
              [
                "01",
                "Кино и культура",
                "Показы, обсуждения, выставки и встречи с будущими авторами.",
              ],
              [
                "02",
                "Образование и практика",
                "Мастерские и творческий обмен для тех, кто начинает или продолжает свой путь в кино.",
              ],
              [
                "03",
                "Наследие и исследование",
                "Архитектура и история усадьбы как основа новых культурных проектов.",
              ],
            ].map(([n, t, d]) => (
              <div key={n}>
                <span className="large-number">{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
