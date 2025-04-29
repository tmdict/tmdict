//import entries from "$lib/__generated/data/profile/entries.json";

export async function load({ params }) {
  const entry = await import (`$lib/__generated/data/profile/entries/${params.profile}.json`);
  //return entries[params.profile];
  console.log(entry.default);
  return entry.default;
}
