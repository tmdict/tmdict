<script>
  import ListGlossaryEntry from "$lib/components/filterlist/ListGlossaryEntry.svelte";
  import ListProfileEntry from "$lib/components/filterlist/ListProfileEntry.svelte";
  import SortHeader from "$lib/components/filterlist/SortHeader.svelte";
  
  import { store } from "$lib/util/stores.svelte.js"
  import APP from "$lib/__generated/constants.json";

  let { i18n, listType, entryList } = $props();

  const defaultSortBy = (listType === "profile") ? "id" : "name";
  const defaultSortOrder = (listType !== "profile");
  let sortBy = $state(defaultSortBy);
  let sortOrder = $state(defaultSortOrder);
  let expandAll = $state(false);

  let sortedEntries = $derived.by(() => {
    return entryList.toSorted((a, b) => {
      switch (sortBy) {
        case "id": {
          return sortOrder
            ? parseFloat(a["uid"].split(":")[0]) - parseFloat(b["uid"].split(":")[0]) ||
                b["name"][store.lang.value].localeCompare(a["name"][store.lang.value])
            : parseFloat(b["uid"].split(":")[0]) - parseFloat(a["uid"].split(":")[0]) ||
                a["name"][store.lang.value].localeCompare(b["name"][store.lang.value]);
        }
        case "name": {
          // Sorts by name in current language
          return sortOrder
            ? a[sortBy][store.lang.value].localeCompare(b[sortBy][store.lang.value])
            : b[sortBy][store.lang.value].localeCompare(a[sortBy][store.lang.value]);
        }
        case "star": {
          // Rarity level is in first element of the array
          return sortOrder
            ? a[sortBy][0].localeCompare(b[sortBy][0])
            : b[sortBy][0].localeCompare(a[sortBy][0]);
        }
        default:
          return 0;
      }
    })
  });

  function updateSortBy(sortHeader) {
    sortBy = sortHeader;
    sortOrder = !sortOrder;
  }
</script>

<div class="list">
  <div class="header item {listType}">
    {#if listType === "profile"}
      <SortHeader headerId="id" margin={64} width={40} {i18n} {sortBy} {sortOrder} {updateSortBy} />
      <SortHeader headerId="name" margin={12} {i18n} {sortBy} {sortOrder} {updateSortBy} />
      <SortHeader headerId="star" margin={335} {i18n} {sortBy} {sortOrder} {updateSortBy} />
    {:else}
      <SortHeader headerId="name" margin={6} {i18n} {sortBy} {sortOrder} {updateSortBy} />
      <div
        class="expand-all"
        role="button"
        tabindex="0"
        onclick={() => (expandAll = !expandAll)}
        onkeydown={() => (expandAll = !expandAll)}
      >
        {expandAll ? `${APP.i18n.expand[store.lang.value]} -` : `${APP.i18n.expand[store.lang.value]} +`}
      </div>
    {/if}
  </div>

  <ul>
    {#if sortedEntries.length > 0}
      {#each sortedEntries as entry, i (entry.id)}
        {#if listType === "profile"}
          <li><a href="/{store.lang.value}/{listType}/{entry.id}">
            <div class="item">
              <ListProfileEntry {entry} {i18n} />
            </div>
          </a></li>
        {:else}
          <li>
            <div class="item">
              <ListGlossaryEntry {entry} {i18n} showDetail={expandAll} />
            </div>
          </li>
        {/if}
      {/each}
    {:else}
      <li><div class="item"><div class="no-result">No Results</div></div></li>
    {/if}
  </ul>
</div>

<style>
  .list {
    float: left;
    width: 600px;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
  }

  ul li {
    border-top: 1px dotted #aaa;
    line-height: 1.7em;
  }

  ul li a { text-decoration: none; }
  ul li:nth-child(even) { background: var(--bg-row-grey-light); }
  ul li:hover { background: var(--bg-row-grey-dark); }


  .header {
    font-weight: bold;
    margin: 18px 0 6px;
  }

  .header:hover { cursor: pointer; }

  .header.glossary .expand-all {
    margin: 0 16px;
    margin-left: auto;
    font-weight: bold;
  }

  .item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .no-result {
    margin: 6px;
    font-weight: bold;
  }

  @media only screen and (max-width: 840px) {
    .list { width: 540px; }
  }

  @media only screen and (max-width: 660px) {
    .list { width: 100%; }
    .list .header.glossary .expand-all { display: none; }
  }
</style>
