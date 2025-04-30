
<script>
  import FilterList from "$lib/components/filterlist/FilterList.svelte";
  import filterlistData from "$lib/__generated/data/profile/filterlist.json";

  let { data } = $props();
</script>

<svelte:head>
  <title>{filterlistData.attribute.name[data.lang]} | TMdict</title>
  <link rel="canonical" href="https://www.tmdict.com/{data.lang}/{filterlistData.attribute.type}" />
</svelte:head>

<FilterList lang={data.lang} data={filterlistData} />
