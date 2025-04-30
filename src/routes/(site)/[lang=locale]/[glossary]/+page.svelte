
<script>
  import Entry from "$lib/components/entry/Entry.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.data.attribute.attr.name[data.lang]} | TMdict</title>
  <link rel="canonical" href="https://www.tmdict.com/{data.lang}/{data.data.attribute.ja}.{data.data.attribute.id}" />
</svelte:head>

<Entry {...data} />
