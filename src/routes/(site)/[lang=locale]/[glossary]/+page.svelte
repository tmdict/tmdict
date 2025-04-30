
<script>
  import Entry from "$lib/components/entry/Entry.svelte";

  let { data } = $props();

  // Generate meta description
  //const cleaned = data.data.content[0].i18n[data.lang].html.replace(/(<([^>]+)>)/gi, " ").substring(1, 160);
  //const metaDescription = cleaned.substring(0, Math.min(cleaned.length, cleaned.lastIndexOf(" ")));
</script>

<svelte:head>
  <title>{data.data.attribute.attr.name[data.lang]} | TMdict</title>
  <link rel="canonical" href="https://www.tmdict.com/{data.lang}/{data.data.attribute.ja}.{data.data.attribute.id}" />
</svelte:head>

<Entry {...data} />
