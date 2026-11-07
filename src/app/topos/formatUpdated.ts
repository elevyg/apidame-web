const MONTHS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sept",
  "oct",
  "nov",
  "dic",
];

const santiagoParts = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Santiago",
  day: "numeric",
  month: "numeric",
  year: "numeric",
});

// Spelled out by hand so the server and every browser render the same text.
export function formatUpdated(dateValue: string | null) {
  if (!dateValue) return "Actualización reciente";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Actualización reciente";
  const parts = Object.fromEntries(
    santiagoParts.formatToParts(date).map((part) => [part.type, part.value]),
  );
  const day = parts.day.padStart(2, "0");
  return `${day} ${MONTHS[Number(parts.month) - 1]} ${parts.year}`;
}
