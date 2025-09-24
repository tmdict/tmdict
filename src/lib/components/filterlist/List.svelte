<script>
  import ListGlossaryEntry from "$lib/components/filterlist/ListGlossaryEntry.svelte";
  import ListProfileEntry from "$lib/components/filterlist/ListProfileEntry.svelte";
  import SortHeader from "$lib/components/filterlist/SortHeader.svelte";
  import APP from "$lib/__generated/constants.json";

  let { lang, listType, entryList, i18n, expandFilter = $bindable() } = $props();

  const defaultSortBy = (listType === "profile") ? "id" : "name";
  const defaultSortOrder = (listType !== "profile");
  let sortBy = $state(defaultSortBy);
  let sortOrder = $state(defaultSortOrder);

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

<div class="list" class:expanded={!expandFilter}>
  <div class="header item {listType}">
    {#if listType === "profile"}
      <SortHeader {lang} headerId="id" marginLeft={70} width={40} {i18n} {sortBy} {sortOrder} {updateSortBy} />
      <SortHeader {lang} headerId="name" marginLeft={12} {i18n} {sortBy} {sortOrder} {updateSortBy} />
    {:else}
      <SortHeader {lang} headerId="name" marginLeft={6} {i18n} {sortBy} {sortOrder} {updateSortBy} />
    {/if}
    {#if !expandFilter}
      <div
        class="expand-filter"
        role="button"
        tabindex="0"
        onclick={() => expandFilter = !expandFilter}
        onkeydown={() => expandFilter = !expandFilter}
      >
        <span class="highlight">{APP.i18n.source[lang]}</span> +
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
            <a href="/{lang}/{entry.hiragana}.{entry.id}">
              <ListGlossaryEntry {lang} {entry} {i18n} />
            </a>
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

  .list.expanded {
    width: 100%;
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

  .header .expand-filter {
    margin: 0 15px;
    margin-left: auto;
    font-weight: bold;
  }

  .header .expand-filter:hover {
    color: var(--secondary-highlight);
  }

  .header .expand-filter .highlight {
    color: var(--primary-heading);
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
    .list {
      width: 540px;
    }

    .list.expanded {
      width: 100%;
    }
  }

  @media only screen and (max-width: 660px) {
    .list {
      width: 100%;
    }

    .list .header .expand-filter {
      display: none;
    }
  }
</style>
