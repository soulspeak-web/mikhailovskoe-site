import { galleries } from "../data/content";
import HistoryFilmstrip from "../components/HistoryFilmstrip";
import { SectionHeading, Gallery } from "../components/UI";

export default function History() {
  return (
    <div className="container page-content history-page">
      <HistoryFilmstrip />
      <section className="section">
        <SectionHeading title="Архив усадьбы" />
        <Gallery
          items={galleries.history.map((item, index) => ({
            ...item,
            cardCaption:
              index === 0
                ? item.caption
                : [
                    "",
                    "Главный дом на архивной фотографии",
                    "Интерьер усадьбы",
                    "Из архивной подборки усадьбы",
                  ][index],
          }))}
          hideCardSources
        />
      </section>
      <section className="section">
        <SectionHeading title="Усадьба сегодня" />
        <Gallery items={galleries.current} hideCardCaptions hideCardSources />
      </section>
    </div>
  );
}
