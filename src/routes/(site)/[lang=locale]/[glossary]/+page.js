import paths from "$lib/__generated/entrypaths.json";
//import entryData from "$lib/__generated/data/glossary/entries.json";

export async function load({ params }) {
  const glossaryEntry = params.glossary.split(".")[1];
  const entry = await import (`$lib/__generated/data/glossary/entries/${glossaryEntry}.json`);
  return {
    lang: params.lang,
    data: entry.default
    //data: entryData[glossaryEntry]
  };
}

export const entries = () => {
  return paths.glossary
}
