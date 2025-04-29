//import entries from "$lib/__generated/data/glossary/entries.json";

export async function load({ params }) {
  const glossaryEntry = params.glossary.split(".")[1];
  const entry = await import (`$lib/__generated/data/glossary/entries/${glossaryEntry}.json`);
  return entry.default;
  //return entries[glossaryEntry];
}
