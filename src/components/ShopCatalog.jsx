import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/* Каталог содержит только предметы из архива КН2026_Команда №5.zip. */
const products = [
  {
    id: "postcards",
    title: "Фирменные открытки",
    image: "postcards.webp",
    alt: "Две открытки с архивными изображениями усадьбы Михайловское",
    description: "Открытки с историческими видами усадьбы в оформлении коллекции.",
    featured: true,
  },
  {
    id: "tickets",
    title: "Сувенирные кинобилеты",
    image: "cinema-tickets.webp",
    alt: "Два дизайнерских образца билетов Кино в парке и Встреча с режиссером",
    description: "Макеты билетов с фирменной монограммой и типографикой проекта.",
  },
  {
    id: "tote",
    title: "Сумка с изображением усадьбы",
    image: "tote-bag.webp",
    alt: "Светлая тканевая сумка с изображением исторического здания",
    description: "Светлая текстильная сумка с архитектурной иллюстрацией.",
  },
  {
    id: "strap",
    title: "Ремень для фотоаппарата",
    image: "camera-strap.webp",
    alt: "Бордовый ремень фотоаппарата с тисненым мотивом кинопленки",
    description: "Аксессуар в бордовом цвете с декоративным мотивом кинопленки.",
  },
  {
    id: "case",
    title: "Чехол для фотоаппарата",
    image: "camera-case.webp",
    alt: "Бордовый чехол для фотоаппарата с тисненой монограммой",
    description: "Чехол с тисненой монограммой кинорезиденции.",
  },
  {
    id: "bag",
    title: "Фирменный подарочный пакет",
    image: "gift-bag.webp",
    alt: "Бордовый подарочный пакет с фирменной монограммой и узором",
    description: "Бордовый пакет с монограммой и повторяющимся орнаментом.",
  },
  {
    id: "slippers",
    title: "Музейные тапочки",
    image: "museum-slippers.webp",
    alt: "Пара бордовых музейных тапочек с белой монограммой",
    description: "Мягкие тапочки с фирменной монограммой для музейной коллекции.",
  },
];

export default function ShopCatalog() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (!selectedProduct) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedProduct(null);
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProduct]);

  // BASE_URL сохраняет корректные пути при публикации сайта на GitHub Pages.
  const base = import.meta.env.BASE_URL;

  return (
    <section className="shop-catalog" aria-label="Сувениры и фирменная графика">
      <div className="shop-catalog__grid">
        {products.map((product) => {
          const imageUrl = `${base}shop/${product.image}`;
          return (
            <article
              className={`shop-catalog__item${product.featured ? " shop-catalog__item--featured" : ""}`}
              key={product.id}
            >
              <button
                type="button"
                className="shop-catalog__image"
                onClick={() => setSelectedProduct(product)}
                aria-label={`Рассмотреть образец: ${product.title}`}
              >
                <img src={imageUrl} alt={product.alt} loading="lazy" />
              </button>
              <div className="shop-catalog__body">
                <div className="shop-catalog__eyebrow">КОЛЛЕКЦИЯ МИХАЙЛОВСКОЕ</div>
                <h2>{product.title}</h2>
                <p>{product.description}</p>
                <button
                  type="button"
                  className="shop-catalog__link"
                  onClick={() => setSelectedProduct(product)}
                >
                  Рассмотреть образец <span aria-hidden="true">↗</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <p className="shop-catalog__notice">
        Представлены дизайнерские образцы сувениров. Каталог не является предложением о продаже.
      </p>

      {selectedProduct && createPortal(
        <div
          className="shop-catalog__lightbox"
          role="presentation"
          onClick={(event) => {
            // Закрываем только по клику на темный фон, не по фотографии.
            if (event.target === event.currentTarget) setSelectedProduct(null);
          }}
        >
          <div
            className="shop-catalog__lightbox-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shop-catalog-lightbox-title"
          >
            <button
              type="button"
              className="shop-catalog__lightbox-close"
              onClick={() => setSelectedProduct(null)}
              aria-label="Закрыть фотографию"
              autoFocus
            >
              ×
            </button>
            <img
              src={`${base}shop/${selectedProduct.image}`}
              alt={selectedProduct.alt}
            />
            <p id="shop-catalog-lightbox-title">{selectedProduct.title}</p>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
