<script>
  import FilterNav from "$lib/components/filterlist/FilterNav.svelte";
  import List from "$lib/components/filterlist/List.svelte";
  import Filter from "$lib/components/filterlist/Filter.svelte";
  import Fuse from "fuse.js";
  import { slide } from "svelte/transition";
  import { store } from "$lib/util/stores.svelte.js";
  import { highlight } from "$lib/util/highlight.js";
  import { filterlist } from "$lib/util/filterlist.svelte.js"
  import APP from "$lib/__generated/constants.json";

  let { lang, data } = $props();
  let expandFilter = $state(true);

  filterlist.init(data.attribute.filter);

  // Preprocess a list of filter values given filter keys and data to be filtered
  const filterValues = data.attribute.filter.filter(f => f !== "source").reduce(
    // For each filter id
    (acc, filter) => {
      const flattened = data.content.list
        .flatMap(d => d[filter]) // Flatten
        .filter(Boolean); // Filter out falsy values
      const deduped = [...new Set(flattened)];
      return {
        ...acc, // data filter collected so far
        [filter]: deduped, // Get distinct filter data for current filter id
      };
    },
    {} // Default empty {} for reducer
  );

  // Source filter for sidebar
  const sourceFilterValues = { source: [...new Set(
    data.content.list.flatMap(d => d["source"]).filter(Boolean)
  )] };

  // Initialize search options
  let searchTerm = $state("");
  const searchOptions = {
    ignoreLocation: true,
    includeMatches: true,
    shouldSort: true,
    threshold: 0.0,
  };

  // Update filtered data by given filter (or return as-is) whenever global filter changes
  let entryList = $derived.by(() => {
    let filtered = structuredClone(filterlist.filterList(data.content.list));
    // Filter by search if is glossary
    if (data.attribute.type === "glossary") {
      if (searchTerm !== "" && searchTerm.length > 1) {
        const fuse = new Fuse(filtered, {
          ...searchOptions,
          minMatchCharLength: searchTerm.length,
          keys: ["name." + lang],
        });
        const results = fuse.search(searchTerm);
        return (results.length > 0) ? structuredClone(highlight(results)) : [];
        }
      }
      return structuredClone(filtered);
  })
</script>

<h1>{data.attribute.name[lang]}</h1>

{#if data.attribute.type === "glossary"}
  <div class="search">
    <input
      class="search-box"
      bind:value={searchTerm}
      placeholder="{APP.i18n.search[lang]}{lang === "en" ? " " : ""}{data.attribute.name[lang]}..."
    />
  </div>
{/if}

<div class="filter-nav">
  <div class="menu">
    <div class={store.showfilter ? 'show' : 'collapse'}
      role="button"
      tabindex="0"
      onclick={() => store.showfilter = !store.showfilter}
      onkeydown={() => store.showfilter = !store.showfilter}
    >
      Filters
    </div>
  </div>
  {#if store.showfilter}
    <div transition:slide>
      {#each Object.keys(filterValues) as filterKey (filterKey)}
        <FilterNav {lang} {filterKey} filterValues={filterValues[filterKey]} i18n={data.content.i18n} />
      {/each}
    </div>
  {/if}
</div>

<div class="filter-list">
  <List
    {lang}
    listType={data.attribute.type}
    {entryList}
    i18n={data.content.i18n}
    bind:expandFilter
  />
  {#if expandFilter}
    <Filter
      {lang} type={data.attribute.type}
      filterValues={sourceFilterValues}
      i18n={data.content.i18n}
      bind:expandFilter
    />
  {/if}
</div>

<style>
  .filter-list {
    font-size: 0.8rem;
    margin-top: 2em;
  }
  
  .search {
    display: flex;
  }

  input {
    margin: 30px 15px 0;
    padding: 10px;
    flex: 1 1 auto;
    font-size: 1.4rem;
    line-height: 2rem;
    border-radius: 10px;
    border: 1px solid #ccc;
  }

  input::placeholder {
    opacity: 0.5;
  }

  .filter-nav {
    margin-top: 40px;
  }

  .filter-nav .menu {
    font: bold 0.8rem Arial, "Microsoft YaHei", Meiryo, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.1rem;
    cursor: pointer;
    text-align: center;
    color: var(--primary-link);
  }

  .filter-nav .menu:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  .menu .show:after {
    content: ' - ';
    color: #777;
  }

  .menu .collapse:after {
    content: ' + ';
    color: #777;
  }
  
  @media only screen and (max-width: 660px) {
    input {
      margin: 30px 6px 0;
    }

    .filter-nav {
      display: none;
    }
  }
</style>
