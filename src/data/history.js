import {
  timeline as suppliedTimeline,
  people as suppliedPeople,
} from "./history-v2.js";
export const historySources = [
  {
    label: "История ансамбля · Архнадзор",
    url: "https://archnadzor.ru/2026/10/07/razvyiyavlenie-22-usadba-grafov-sheremetevyih-mihaylovskoe/",
  },
  {
    label: "Усадьбы Шереметевых · музейная фотоколлекция",
    url: "https://russiainphoto.ru/exhibitions/424/",
  },
  {
    label: "С. Д. Шереметев. «Михайловское», 1906 · РГБ",
    url: "https://search.rsl.ru/ru/record/01003740291",
  },
];
const images = [
  "portrait-krechetnikov.webp",
  "portrait-sergey.webp",
  "portrait-sheremetev.webp",
  "portrait-sultanov.webp",
  "estate-painting.webp",
  "sanatorium.webp",
  "estate.webp",
];
const summaries = [
  "Начало архитектурно-паркового ансамбля на берегу Пахры.",
  "Имена, с которыми связана новая глава усадебной жизни.",
  "Сергей Дмитриевич Шереметев приобретает Михайловское.",
  "Новая архитектурная глава под руководством Николая Султанова.",
  "После национализации меняются функции усадьбы.",
  "История места продолжается в качестве санатория.",
  "Сохранение ансамбля и проект его культурного будущего.",
];
export const timeline = suppliedTimeline.map((entry, i) => ({
  ...entry,
  id: `period-${i + 1}`,
  image: images[i],
  portrait: i < 4,
  summary: summaries[i],
  detail: [
    entry.text,
    ...(i === 0
      ? [suppliedPeople[0].fact]
      : i === 2
        ? [suppliedPeople[1].fact]
        : i === 3
          ? [suppliedPeople[2].fact]
          : []),
  ],
  note:
    i === 1
      ? "В ТЗ указан переход владения в 1823 году, а в справке Архнадзора — владение С. В. Шереметева в 1826–1834 годах. Расхождение требует сверки; дату 1823 не считаем подтверждённой."
      : i === 3
        ? "Начало периода «с 1879 года» сохранено из второй версии. ТЗ обозначает реконструкцию 1879–1914 годов; точные этапы ещё предстоит сверить."
        : i === 5
          ? "Датировка «с 1944 года» сохранена из предоставленной второй версии и требует отдельного подтверждения."
          : i === 6
            ? "Начало эксплуатации кинорезиденции предполагается не ранее 2030 года."
            : "Текст сохранён из предоставленных материалов. Атрибуция портретов и отдельные детали требуют окончательной исторической сверки.",
  sources:
    i === 2 ? historySources.slice(1) : i === 6 ? [] : [historySources[0]],
}));
export const people = suppliedPeople.map((p, i) => ({
  ...p,
  image: images[[0, 2, 3][i]],
  source: historySources[i === 1 ? 2 : 0],
}));
