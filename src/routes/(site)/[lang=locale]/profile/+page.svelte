
<script>
  import FilterList from "$lib/components/filterlist/FilterList.svelte";
  import filterlistData from "$lib/__generated/data/profile/filterlist.json";

  let { data } = $props();
</script>

<FilterList lang={data.lang} data={filterlistData} />
