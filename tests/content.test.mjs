import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { filterEvents } from "../src/data/filterEvents.js";
import { regularEvents, spaces, galleries } from "../src/data/content.js";
const opening = JSON.parse(
  readFileSync(new URL("../src/data/opening.json", import.meta.url), "utf8"),
);
const source = readFileSync(
  new URL("../docs/requirements-extracted.txt", import.meta.url),
  "utf8",
);
test("Все перечисленные в приложении А события перенесены без изменения названий, времени, площадок и описаний", () => {
  const rows = [
    ...source.matchAll(
      /(\d{2}:\d{2})–(\d{2}:\d{2})\s*\|\s*(.+)\r?\nПлощадка: (.+)\r?\n(.+)/g,
    ),
  ];
  assert.equal(rows.length, 28);
  assert.equal(opening.length, rows.length);
  rows.forEach((row, i) =>
    assert.deepEqual(
      [
        opening[i].startTime,
        opening[i].endTime,
        opening[i].title,
        opening[i].venue,
        opening[i].fullDescription,
      ],
      row.slice(1).map((x) => x.trim()),
    ),
  );
});
test("Оба дня и заключительный показ сохранены", () => {
  assert.equal(opening.filter((e) => e.date === "2030-09-28").length, 15);
  assert.equal(opening.filter((e) => e.date === "2030-09-29").length, 13);
  assert.equal(
    opening.at(-1).title,
    "Закрытый показ для участников и резидентов",
  );
  for (const e of opening) {
    assert.ok(e.startTime < e.endTime);
    assert.equal(e.status, "planned");
    assert.equal(e.externalLink, null);
    assert.equal(e.price, undefined);
  }
});
test("Маршруты событий и пространств уникальны", () => {
  const events = [...opening, ...regularEvents];
  assert.equal(new Set(events.map((e) => e.slug)).size, events.length);
  assert.equal(spaces.length, 14);
  assert.equal(new Set(spaces.map((s) => s.slug)).size, 14);
});
test("Сочетание дня, категории и площадки возвращает нужный практикум", () => {
  const result = filterEvents(opening, {
    date: "2030-09-29",
    category: "Мастер-классы",
    venue: "Мастерская Гончарова",
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].slug, "opening-23");
});
test("Поиск нечувствителен к регистру, пустое состояние корректно", () => {
  assert.equal(
    filterEvents(opening, { query: "  ЗВУК В КИНО  " })[0].slug,
    "opening-23",
  );
  assert.equal(
    filterEvents(opening, { query: "НесуществующееСобытие" }).length,
    0,
  );
});
test("Регулярные форматы не получают вымышленных дат", () => {
  const undated = filterEvents([...opening, ...regularEvents], {
    date: "undated",
  });
  assert.equal(undated.length, 4);
  assert.ok(undated.every((e) => e.date === null));
});
test("Все используемые файлы галерей и пространств существуют", () => {
  for (const filename of [
    ...Object.values(galleries)
      .flat()
      .map((i) => i.src),
    ...spaces.map((s) => s.image).filter(Boolean),
    "masterplan.webp",
    "brand.svg",
    "mark.svg",
  ]) {
    assert.ok(
      existsSync(new URL(`../public/assets/${filename}`, import.meta.url)),
      filename,
    );
  }
});
