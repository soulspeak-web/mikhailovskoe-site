import opening from "./opening.json";
import { regularEvents } from "./content";
export const openingEvents = [...opening].sort((a, b) =>
  (a.date + a.startTime).localeCompare(b.date + b.startTime),
);
export const allEvents = [...openingEvents, ...regularEvents];
export const categories = [...new Set(allEvents.map((e) => e.category))];
export { filterEvents } from "./filterEvents.js";
