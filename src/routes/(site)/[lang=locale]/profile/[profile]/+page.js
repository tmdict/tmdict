import paths from "$lib/__generated/entrypaths.json";
//import entryData from "$lib/__generated/data/profile/entries.json";

export async function load({ params }) {
  const entry = await import (`$lib/__generated/data/profile/entries/${params.profile}.json`);
  return {
    lang: params.lang,
    data: entry.default
    //data: entryData[params.profile]
  };
}

export const entries = () => {
  return paths.profile
}
