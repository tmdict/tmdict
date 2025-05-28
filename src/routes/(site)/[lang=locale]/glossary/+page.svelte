
<script>
  import FilterList from "$lib/components/filterlist/FilterList.svelte";
  import FILTERLIST_DATA from "$lib/__generated/data/glossary/filterlist.json";

  let { data } = $props();
</script>

<svelte:head>
  <title>{FILTERLIST_DATA.attribute.name[data.lang]} | TMdict</title>
  <link rel="canonical" href="https://www.tmdict.com/{data.lang}/{FILTERLIST_DATA.attribute.type}" />
</svelte:head>

<FilterList lang={data.lang} data={FILTERLIST_DATA} />
