<script>
  import Clear from "$lib/components/svg/Clear.svelte";
  import Filter from "$lib/components/filterlist/Filter.svelte";
  import FilterNav from "$lib/components/filterlist/FilterNav.svelte";
  import List from "$lib/components/filterlist/List.svelte";
  import Fuse from "fuse.js";
  import { slide } from "svelte/transition";
  import { store } from "$lib/util/stores.svelte.js";
  import { highlight } from "$lib/util/highlight.js";
  import { filterlist } from "$lib/util/filterlist.svelte.js"
  import APP from "$lib/__generated/constants.json";

  let { lang, data } = $props();
  let expandFilter = $state(data.attribute.type !== "glossary");
  let screenWidth = $state(0);
  let prevWidth = $state(9999);

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
          keys: ["name." + lang, "content." + lang],
        });
        const results = fuse.search(searchTerm);
        return (results.length > 0) ? structuredClone(highlight(results)) : [];
      }
    }
    return structuredClone(filtered);
  })

  $effect(() => {
    if (screenWidth < 660 && prevWidth >= 660) {
      store.showfilter = false;
    }
    prevWidth = screenWidth;
  })
</script>

<svelte:window bind:innerWidth={screenWidth} />

<h1>{data.attribute.name[lang]}</h1>

{#if data.attribute.type === "glossary"}
  <div class="search">
    <input
      class="search-box"
      bind:value={searchTerm}
      placeholder="{APP.i18n.search[lang]}{lang === "en" ? " " : ""}{data.attribute.name[lang]}..."
    />
    {#if searchTerm}
      <button
        class="clear-button"
        onclick={() => searchTerm = ""}
        onkeydown={(e) => (e.key === "Enter" || e.key === " ") && (searchTerm = "")}
        aria-label="Clear search"
        type="button"
      >
        <Clear />
      </button>
    {/if}
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
    justify-content: center;
    position: relative;
    margin: 30px 15px 0;
  }

  input {
    padding: 10px 36px 10px 14px;
    width: 100%;
    font-size: 1.4rem;
    line-height: 2rem;
    border-radius: 10px;
    border: 1px solid #ccc;
  }

  input::placeholder {
    opacity: 0.5;
  }

  .clear-button {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
  }

  .clear-button:hover {
    color: #666;
  }

  .clear-button:active {
    opacity: 0.7;
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
    .search {
      margin: 30px 6px 0;
    }

    input {
      width: 88%;
    }

    .clear-button {
      right: 4%;
    }
  }
</style>
