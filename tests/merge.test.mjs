import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { spaces } from "../src/data/content.js";
import { projectSpaces } from "../src/data/projectSpaces.js";
import { timeline, people } from "../src/data/history.js";
import {
  timeline as supplied,
  people as suppliedPeople,
} from "../src/data/history-v2.js";
const dimensions = JSON.parse(
  readFileSync(
    new URL("../src/data/imageDimensions.json", import.meta.url),
    "utf8",
  ),
);

test("Подробные описания всех 14 пространств второй версии доступны в объединённых данных", () => {
  assert.equal(projectSpaces.length, 14);
  for (const p of projectSpaces) {
    const match = spaces.find(
      (s) => s.slug === (p.id === "main-house" ? "main" : p.id),
    );
    assert.equal(match?.detail, p.detail, p.id);
    assert.equal(match.gallery.length, p.gallery.length, p.id);
  }
});
test("Все исторические тексты и биографии сохранены; краткое описание не заменяет полный текст", () => {
  assert.equal(timeline.length, 7);
  supplied.forEach((p, i) => {
    assert.equal(timeline[i].year, p.year);
    assert.ok(timeline[i].detail.includes(p.text));
    assert.ok(timeline[i].summary.length < 125);
  });
  suppliedPeople.forEach((p, i) => assert.equal(people[i].fact, p.fact));
  assert.ok(
    timeline[1].note.includes("1823") && timeline[1].note.includes("1826"),
  );
});
test("Галереи пространств и крупные исходники хронологии существуют", () => {
  for (const name of [
    ...spaces.flatMap((s) => s.gallery.map((i) => i.src)),
    ...timeline.map((p) => p.image),
  ])
    assert.ok(
      existsSync(new URL(`../public/assets/${name}`, import.meta.url)),
      name,
    );
  for (const item of timeline)
    assert.ok(dimensions[item.image].width >= 444, item.image);
});
test("Адаптивные версии фотографий не увеличены относительно исходника", () => {
  for (const [name, info] of Object.entries(dimensions)) {
    const match = name.match(/^(.*)-(480|960)\.webp$/);
    if (!match) continue;
    const source = dimensions[`${match[1]}.webp`];
    assert.ok(source && info.width < source.width, name);
    assert.equal(info.width, Number(match[2]));
    assert.ok(
      Math.abs(info.width / info.height - source.width / source.height) < 0.01,
      name,
    );
  }
});
