
<script>
  import Entry from "$lib/components/entry/Entry.svelte";

  let { data } = $props();

  const parsed = data.data.content
    .filter(ctn => !ctn.profile)[0].i18n[data.lang].html
    .replace(/(?:<[^>]*>|\n)+/g, " ")
    .substring(1, 161);
  const metaDescription = (parsed.lastIndexOf(" ") !== -1) ? parsed.substring(0, parsed.lastIndexOf(" ")) : parsed;
</script>

<svelte:head>
  <title>{data.data.attribute.name[data.lang]} | TMdict</title>
  <meta name="description" content={metaDescription} />
  <link rel="canonical" href="https://www.tmdict.com/{data.lang}/{data.data.attribute.hiragana}.{data.data.attribute.id}" />
</svelte:head>

<Entry {...data} />
