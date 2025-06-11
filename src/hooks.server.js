export function handle({ event, resolve }) {
  const lang = ["en", "ja", "zh"].includes(event.params.lang) ? event.params.lang : "en";
  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', lang)
  });
}
