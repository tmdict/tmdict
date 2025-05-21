
<script>
  import Entry from "$lib/components/entry/Entry.svelte";

  let { data } = $props();

  let parsed = $derived(
    data.data.content
      .filter(ctn => !ctn.profile)[0].i18n[data.lang].html
      .replace(/(?:<[^>]*>|\n)+/g, " ")
      .substring(1, 160)
  );
  let metaDescription = $derived(parsed.substring(0, Math.min(parsed.length, parsed.lastIndexOf(" "))));
</script>

<svelte:head>
  <title>{data.data.attribute.attr.name[data.lang]} | TMdict</title>
  <meta name="description" content={metaDescription} />
  <link rel="canonical" href="https://www.tmdict.com/{data.lang}/{data.data.attribute.ja}.{data.data.attribute.id}" />
</svelte:head>

<Entry {...data} />
