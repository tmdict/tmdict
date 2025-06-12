import paths from "$lib/__generated/entrypaths.json";

export async function load({ params }) {
  const entry = await import (`$lib/__generated/data/profile/entries/${params.profile}.json`);
  return {
    lang: params.lang,
    data: entry.default
  };
}

export const entries = () => {
  return paths.profile
}
