//import entries from "$lib/__generated/data/profile/entries.json";

export async function load({ params }) {
  const entry = await import (`$lib/__generated/data/profile/entries/${params.profile}.json`);
  return entry.default;
  //return entries[params.profile];
}
