<script>
  import ListGlossaryEntry from "$lib/components/filterlist/ListGlossaryEntry.svelte";
  import ListProfileEntry from "$lib/components/filterlist/ListProfileEntry.svelte";
  import SortHeader from "$lib/components/filterlist/SortHeader.svelte";
  import APP from "$lib/__generated/constants.json";

  let { lang, listType, entryList, i18n } = $props();

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
            ? parseFloat(a["uid"].split(":")[1]) - parseFloat(b["uid"].split(":")[1]) ||
                b["name"][lang].localeCompare(a["name"][lang])
            : parseFloat(b["uid"].split(":")[1]) - parseFloat(a["uid"].split(":")[1]) ||
                a["name"][lang].localeCompare(b["name"][lang]);
        }
        case "name": {
          // Sorts by name in current language
          return sortOrder
            ? a[sortBy][lang].localeCompare(b[sortBy][lang])
            : b[sortBy][lang].localeCompare(a[sortBy][lang]);
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

<svelte:head>
  <style>
    .entry-header .search-highlight { color: var(--primary-highlight); background-color: var(--text-dark); }
    .entry-content p .search-highlight { color: var(--primary-highlight); background-color: var(--text-dark); }
    .entry-content p { padding: 0 5px; }
    .entry-content h3 { font-size: .75rem; margin: 0 0 0 5px; }
    .entry-content h4 { font-size: 0.8rem; margin-left: 5px; }
    .entry-content h5 { margin: 15px 0 5px 15px; }
  </style>
</svelte:head>

<div class="list">
  <div class="header item {listType}">
    {#if listType === "profile"}
      <SortHeader {lang} headerId="id" margin={64} width={40} {i18n} {sortBy} {sortOrder} {updateSortBy} />
      <SortHeader {lang} headerId="name" margin={12} {i18n} {sortBy} {sortOrder} {updateSortBy} />
    {:else}
      <SortHeader {lang} headerId="name" margin={6} {i18n} {sortBy} {sortOrder} {updateSortBy} />
      <div
        class="expand-all"
        role="button"
        tabindex="0"
        onclick={() => (expandAll = !expandAll)}
        onkeydown={() => (expandAll = !expandAll)}
      >
        {expandAll ? `${APP.i18n.expand[lang]} -` : `${APP.i18n.expand[lang]} +`}
      </div>
    {/if}
  </div>

  <ul>
    {#if sortedEntries.length > 0}
      {#each sortedEntries as entry, i (entry.id)}
        <li>
          {#if listType === "profile"}
            <a href="/{lang}/{listType}/{entry.id}">
              <ListProfileEntry {lang} {entry} {i18n} />
            </a>
          {:else}
            <div class="item">
              <ListGlossaryEntry {lang} {entry} {i18n} showDetail={expandAll} />
            </div>
          {/if}
        </li>
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
