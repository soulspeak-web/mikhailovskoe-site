import ResidentSpaces from "../components/ResidentSpaces";
import ParkRoutes from "../components/ParkRoutes";
import ParkMap from "../components/ParkMap";
import ShopCatalog from "../components/ShopCatalog";
import "../shop-catalog.css";
import ProjectImage from "../components/ProjectImage";
import { EnquiryForm } from "../components/EnquiryForm";
import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { asset, spaces, galleries } from "../data/content";
import { openingEvents } from "../data/events";
import {
  Button,
  PageIntro,
  Notice,
  SectionHeading,
  Gallery,
  SpaceCard,
  EventCard,
  FAQ,
  Placeholder,
  Eyebrow,
  Modal,
} from "../components/UI";
export { default as History } from "./History";
export function Concept() {
  return (
    <>
      <div className="container page-content concept-page">
        <section className="editorial-split concept-introduction">
          <div>
            <Eyebrow>Реставрация и новое использование</Eyebrow>
            <h1>Бережное продолжение</h1>
            <p>
              Театральная традиция Шереметевых стала отправной точкой для
              проекта кинорезиденции.
            </p>
            <p>
              Для фасадов предлагается сохранить исторические слои, укрепить
              поврежденную штукатуркуи адаптировать часть интерьеров под кинозалы и общественные пространства.
            </p>
            <p>
              Главный дом объединяет культурные и резидентские пространства.
              Во флигеле предусмотрено кафе, в парке —
              амфитеатр у белокаменной лестницы.
            </p>
          </div>
          <figure>
            <ProjectImage
              src="estate-front.webp"
              className="editorial-image"
              alt="Существующее состояние усадьбы со стороны парка"
            />
            <figcaption>Существующее состояние · материалы проекта</figcaption>
          </figure>
        </section>
        
<section className="section concept-architecture">
  <SectionHeading title="Архитектурные решения"/>

  <div className="architecture-solutions">
    <div>
      <Eyebrow>01 / Главное здание</Eyebrow>
      <h3>Главный дом</h3>
      <p>
        В главном доме планируется разместить кинозалы,
        мастерские, библиотеку и пространства для резидентов.
        Проектные решения предусматривают сохранение
        исторических особенностей здания.
      </p>
    </div>

    <div>
      <Eyebrow>02 / Часть ансамбля</Eyebrow>
      <h3>Флигель</h3>
      <p>
        После реставрации во флигеле предусмотрено
        размещение кафе для посетителей и резидентов.
        Новая функция будет адаптирована к историческому
        облику здания.
      </p>
    </div>
  </div>

  <figure className="architecture-plan">
    <a
      href={asset("main-house-zoning.jpg")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Открыть схему главного дома"
    >
      <img
        src={asset("main-house-zoning.jpg")}
        alt="Схема функционального зонирования главного дома"
        loading="lazy"
      />
    </a>
    <figcaption>
      Главный дом. Функциональное зонирование.
      Нажмите на схему для увеличения.
    </figcaption>
  </figure>
</section>

        <section className="section concept-territory">
          <SectionHeading title="Территория и генеральный план" />
          <p className="section-deck">
            Геометрические аллеи регулярного парка переходят в дорожки пейзажной
            части. В проекте предусмотрены розарий, декоративный пруд и площадка
            для кинопоказов.
          </p>

          
<ParkMap />
        </section>
        <div className="callout">
          <div>
            <Eyebrow>Культура как продолжение</Eyebrow>
            <h2>Пространства для разных историй</h2>
          </div>
          <Button to="/spaces">Открыть пространства</Button>
        </div>
      </div>
    </>
  );
}
export function Spaces() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "Все";
  const selected = spaces.filter(
    (s) => category === "Все" || s.category === category,
  );
  return (
    <>
      <PageIntro title="Пространства">
        От большого экрана до тихой работы над сценарием. 
        Будущие места встреч, открытий и творчества.
      </PageIntro>
      <div className="container page-content">
        <div className="chip-list" aria-label="Тип пространства">
          {["Все", ...new Set(spaces.map((s) => s.category))].map((c) => (
            <button
              key={c}
              className={category === c ? "active" : ""}
              aria-pressed={category === c}
              onClick={() => setParams(c === "Все" ? {} : { category: c })}
            >
              {c}
            </button>
          ))}
        </div>
        <p className="muted" aria-live="polite">
          Пространств: {selected.length}
        </p>
        <div className="space-grid">
          {selected.map((space) => (
            <SpaceCard key={space.slug} space={space} />
          ))}
        </div>
      </div>
    </>
  );
}

export function SpaceDetail() {
  const { slug } = useParams();
  const space = spaces.find((s) => s.slug === slug);

  if (!space) return <NotFound />;

  const isMainHouse = slug === "main";

  const events = openingEvents.filter(
    (e) =>
      e.venue.includes(space.title) ||
      e.venue.includes(space.title.replace("Зал", "зал")) ||
      (slug === "park" && e.venue.includes("Парк")),
  );

  return (
    <>
      <PageIntro
        number={`Пространство ${space.number}`}
        title={space.title}
      >
        {space.description}
      </PageIntro>

      <div className={[
        "container page-content",
        slug === "cafe" && "cafe-detail-page",
        slug === "park" && "park-space-detail",
      ].filter(Boolean).join(" ")}>
        <Link className="text-link back-link" to="/spaces">
          ← Все пространства
        </Link>
        {slug === "park" && <ParkRoutes />}

        <div
          className={`editorial-split ${
            isMainHouse ? "main-detail-intro" : ""
          }`}
        >


{slug === "wing" && (
  <figure className="wing-detail-plan">
    <a
      href={asset("wing-zoning-final.png")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Открыть трехмерную схему флигеля"
    >
      <img
        src={asset("wing-zoning-final.png")}
        width="1240"
        height="1038"
        alt="Трехмерная схема функционального зонирования флигеля"
        loading="lazy"
      />
    </a>

    <figcaption>
      Флигель. Трехмерная схема функционального зонирования.
      Нажмите для увеличения.
    </figcaption>
  </figure>
)}


          {!isMainHouse && (
            <div>
              {slug === "park" ? null : space.image ? (
                <figure>
                  <ProjectImage
                    className={slug === "cafe" ? "editorial-image cafe-detail-image" : "editorial-image"}
                    src={space.image}
                    alt={`${space.title} · ${space.imageNote || ""}`}
                  />
                  <figcaption>{space.imageNote}</figcaption>
                </figure>
              ) : (
                <Placeholder label="Фото / визуализация пространства · материал уточняется" />
              )}
            </div>
          )}

          <div>
            <Eyebrow>{space.category}</Eyebrow>
            <h2>Место будущих встреч</h2>

            <p className="lead">
              {space.detail || space.description}
            </p>

            <dl>
              <div>
                <dt>Статус</dt>
                <dd>Проектное предложение</dd>
              </div>

              <div>
                <dt>Расположение</dt>
                <dd>
                  {slug === "main"
                    ? "Главный дом ансамбля"
                    : slug === "wing"
                      ? "Флигель ансамбля"
                      : slug === "park"
                        ? "Территория усадьбы"
                        : space.location ||
                          "Точное размещение уточняется"}
                </dd>
              </div>

              <div>
                <dt>Оснащение и вместимость</dt>
                <dd>
                  Будут определены после согласования проекта
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {isMainHouse && (
          <figure className="main-house-detail-plan">
            <a
              href={asset("main-house-zoning.jpg")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Открыть схему главного дома в полном размере"
            >
              <img
                src={asset("main-house-zoning.jpg")}
                alt="Трехмерная схема функционального зонирования главного дома"
                loading="lazy"
              />
            </a>

            <figcaption>
              Главный дом. Функциональное зонирование.
              Нажмите для увеличения.
            </figcaption>
          </figure>
        )}

        <section className="section">
          <SectionHeading
            title={
              isMainHouse
                ? "Виды и архитектурные материалы"
                : "Галерея пространства"
            }
          />

          {space.gallery?.length ? (
            <Gallery
              items={space.gallery}
              hideCardSources
              hideCardCaptions
              hideModalCaption
            />
          ) : (
            <Placeholder label="Нужны план помещения и фотографии пространства" />
          )}
        </section>

        {events.length > 0 && (
          <section className="section">
            <SectionHeading
              title="В предварительной программе"
              to="/events?program=opening"
              linkText="Вся программа"
            />

            <div className="event-grid">
              {events.map((e) => (
                <EventCard event={e} key={e.id} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export function Visit() {
  return (
    <>
      <PageIntro number="Для гостей" title="Знакомство начинается здесь">
        Будущее посещение «Михайловского»: прогулки, экскурсии и культура в
        историческом пространстве.
      </PageIntro>
      <div className="container page-content">
        <section className="three-col visit-facts">
          <div>
            <Eyebrow>Когда</Eyebrow>
            <h2>Не ранее 2030</h2>
            <p>
              Часы работы и дата начала приёма гостей появятся после
              утверждения.
            </p>
          </div>
          <div>
            <Eyebrow>Как добраться</Eyebrow>
            <h2>Маршрут готовится</h2>
            <p>
              Адрес, транспортная схема и условия доступа требуют подтверждения
              команды.
            </p>
          </div>
          <div>
            <Eyebrow>Связаться</Eyebrow>
            <h2>Контакты уточняются</h2>
            <p>Официальные каналы связи будут добавлены после согласования.</p>
          </div>
        </section>
        <section className="section visit-territory">
          <Gallery
            hideCardSources
            hideCardCaptions
            items={[
              {
                src: "park-plan.png",
                diagram: true,
                title: "Генеральный план парка",
              },
            ]}
          />
          <div>
            <SectionHeading title="Территория усадьбы" />
            <p>
              Геометрические аллеи регулярной части переходят в извилистые
              дорожки пейзажной. У белокаменной лестницы предусмотрен амфитеатр
              для кинопоказов.
            </p>
            <Button to="/spaces" secondary>
              Исследовать пространства
            </Button>
          </div>
        </section>
        <section className="section">
          <SectionHeading title="Экскурсионные маршруты" />
          <div className="event-grid">
            {openingEvents
              .filter((e) => e.category === "Экскурсии")
              .map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
          </div>
        </section>
        <section className="section two-col">
          <div className="booklet">
            <Eyebrow>Михайловское · путеводитель</Eyebrow>
            <img src={asset("mark.svg")} alt="" />
            <h2>
              Ваша история
              <br />
              знакомства
            </h2>
            <p>Буклет для посетителей</p>
            <button disabled>PDF готовится</button>
            <small>
              Скачивание появится после предоставления финального файла.
            </small>
          </div>
          <div>
            <SectionHeading title="Перед будущим визитом" />
            <FAQ
              items={[
                [
                  "Можно ли приехать сейчас?",
                  "Кинорезиденция ещё не работает. Условия доступа к самому объекту не подтверждены; сайт не является приглашением к посещению территории.",
                ],
                [
                  "Когда появятся билеты?",
                  "Продажа не ведётся. Условия посещения и участия в мероприятиях будут опубликованы после согласования.",
                ],
                [
                  "Можно ли прийти с детьми?",
                  "В концепции есть детские программы. Возрастные ограничения, сопровождение и правила безопасности будут уточнены.",
                ],
                [
                  "Будет ли доступная среда?",
                  "Решения по доступности находятся в разработке. Подтверждённая информация о маршрутах и оборудовании появится позднее.",
                ],
              ].map(([question]) => [question, "—"])}
            />
          </div>
        </section>
      </div>
    </>
  );
}
export function Residents() {
  return (
    <>
      <header className="page-intro container residents-intro">
        <Eyebrow>Михайловское / Для авторов</Eyebrow>
        <h1>Возможности кинорезиденции</h1>
        <div className="intro-text">
          <p>
            Кинозалы, библиотека, мастерские и резидентские пространства
            объединят работу над фильмом, показы и профессиональный диалог в
            исторической усадьбе. В проектной программе — практикумы, встречи и обсуждения. 
          </p>
        </div>
      </header>
      <div className="container page-content residents-page">
        <ResidentSpaces />
        <section className="section resident-form-section">
          <div>
            <Eyebrow>Будущая программа</Eyebrow>
            <h2>Стать резидентом</h2>
            <p>
              Резидентская программа предполагает участие представителей
              киноиндустрии. Порядок участия будет опубликован после утверждения
              программы.
            </p>
            <FAQ
              items={[
                ["Как стать резидентом?", "—"],
                ["Предоставляется ли оборудование?", "—"],
              ]}
            />
          </div>
          <EnquiryForm resident />
        </section>
      </div>
    </>
  );
}
export function About() {
  return (
    <>
      <PageIntro number="О проекте" title="Сохранить, чтобы продолжить">
        Концепция будущей кинорезиденции «Михайловское» для хакатона «Наследие».
      </PageIntro>
      <div className="container page-content">
        <div className="editorial-split">
          <div>
            <Eyebrow>Идея проекта</Eyebrow>
            <h2>Кино встречает наследие</h2>
            <p className="lead">
              Проект объединяет архитектурное сохранение и предполагаемые
              культурные функции усадьбы.
            </p>
            <p>
              Сайт — цифровая модель будущего учреждения: он показывает
              пространства и сценарии их использования, помогает исследовать
              концепцию и знакомит с предварительной программой открытия.
            </p>
          </div>
          <img
            className="editorial-image"
            src={asset("detail.webp")}
            alt="Архитектурные детали существующего здания"
          />
        </div>
        <section className="section two-col">
          <div className="text-panel">
            <Eyebrow>Реставрационный подход</Eyebrow>
            <h2>От исследования к решению</h2>
            <p>
              Сохранение исторического облика, изучение архивов и состояния
              здания — основа дальнейшего проектирования. Итоговые решения
              требуют профессионального согласования.
            </p>
            <Link className="text-link" to="/concept">
              Архитектурная концепция →
            </Link>
          </div>
          <div className="text-panel">
            <Eyebrow>Экономическая концепция</Eyebrow>
            <h2>Модель в разработке</h2>
            <p>
              Согласованная экономическая модель не предоставлена. Источники
              финансирования, бюджеты, доходы и условия эксплуатации не
              публикуются до подтверждения.
            </p>
          </div>
        </section>
        <section className="section">
          <SectionHeading title="Команда и партнёры" />
          <div className="two-col">
            <Placeholder label="Состав команды и роли уточняются" />
            <Placeholder label="Подтверждённые партнёры пока не представлены" />
          </div>
          <p className="muted">
            Логотипы организаций из рабочих подборок не означают подтверждённое
            партнёрство.
          </p>
        </section>
        <ImageCredits embedded />
        <Notice />
      </div>
    </>
  );
}


export function Shop() {
  return (
    <>
      <PageIntro
        number="Коллекция"
        title="Маленькая часть большой истории"
      >
        Демонстрационный каталог фирменной графики и сувениров
        «Михайловского».
      </PageIntro>

      <div className="container page-content">
        <ShopCatalog />
      </div>
    </>
  );
}

export function NotFound() {
  return (
    <div className="container not-found">
      <Eyebrow>404 / Кадр не найден</Eyebrow>
      <h1>
        Этой сцены
        <br />
        пока нет в сценарии.
      </h1>
      <p>
        Возможно, ссылка изменилась. Вернитесь к знакомству с «Михайловским».
      </p>
      <Button to="/">На главную</Button>
    </div>
  );
}

export function ImageCredits({ embedded = false }) {
  const content = (
    <details className="source-note" id="credits" open>
      <summary>Фотографии и материалы проекта</summary>
      <p>
        Современные виды и архитектурные материалы предоставлены командой.
        Визуализации флигеля показывают проектный замысел; они не являются
        фотографиями существующего здания. Атрибуция части архивных снимков и
        портретов уточняется.
      </p>
      <p>
        Фото аллеи парка: ЛЮБИТЕль, CC BY-SA 4.0. Для сайта подготовлены
        уменьшенные WebP-копии, кадрирование меняется по размеру экрана.
      </p>
      <a
        href="https://commons.wikimedia.org/wiki/File:Аллея_парка_в_Михайловском.jpg"
        target="_blank"
        rel="noreferrer"
      >
        Автор и оригинал фотографии парка ↗
      </a>
      <a
        href="https://creativecommons.org/licenses/by-sa/4.0/"
        target="_blank"
        rel="noreferrer"
      >
        Лицензия CC BY-SA 4.0 ↗
      </a>
      <a
        href="https://russiainphoto.ru/photos/146713/"
        target="_blank"
        rel="noreferrer"
      >
        «Катание на велосипедах в Михайловском», Ламберг, 1880-е · музей-усадьба
        «Останкино» ↗
      </a>
    </details>
  );
  return embedded ? (
    content
  ) : (
    <div className="container page-content">
      <h1>Сведения об изображениях</h1>
      {content}
    </div>
  );
}
