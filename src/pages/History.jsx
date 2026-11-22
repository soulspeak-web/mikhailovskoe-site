import { galleries } from "../data/content";
import HistoryFilmstrip from "../components/HistoryFilmstrip";
import { SectionHeading, Gallery } from "../components/UI";

export default function History() {
  return (
    <div className="container page-content history-page">
      <HistoryFilmstrip />
      <section className="section">
        <SectionHeading title="Архив усадьбы" />
        <Gallery items={galleries.history} hideCardSources />
      </section>
      
      <section className="section">
        <SectionHeading title="Усадьба сегодня" />
        <Gallery
          items={galleries.current.map((item) => ({
            ...item,
            cardCaption: item.cardCaption ?? "",
          }))}
          hideCardSources
        />
      </section>

    </div>
  );
}
