export function filterEvents(
  events,
  { date = "all", category = "all", venue = "all", query = "" } = {},
) {
  return events.filter(
    (event) =>
      (date === "all" ||
        (date === "undated" ? !event.date : event.date === date)) &&
      (category === "all" || event.category === category) &&
      (venue === "all" || event.venue === venue) &&
      `${event.title} ${event.fullDescription}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
}
