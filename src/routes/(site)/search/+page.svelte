<script>
  import { browser } from "$app/environment";
  import Fuse from "fuse.js";
  import { highlight } from "$lib/util/highlight.js";
  import APP from "$lib/__generated/constants.json";
  import SEARCH_DATA from "$lib/__generated/data/search.json";

  // Get search query and setup
  const minChar = 2;
  const searchTerm = (browser) ? window.location.search : ""
  const params = new Proxy(new URLSearchParams(searchTerm), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  const minMatchCharLen = Math.max(minChar, params.q?.length || 0);
  const fuse = new Fuse(SEARCH_DATA, {
    ignoreLocation: true,
    includeMatches: true,
    includeScore: true,
    minMatchCharLength: minMatchCharLen,
    shouldSort: true,
    threshold: 0.0,
    keys: ["text", "title"],
  });

  let currentFilter = $state("");
  let currentPage = $state(1);
  const resultsPerPage = 10;
  let searchResults = $state([]);

  if (params.q !== null && params.q.length > 0 && params.q.length >= minChar) {
    const results = fuse.search(params.q.replace("+", " "));
    if (results.length > 0) {
      searchResults = highlight(results, true).map(result => ({
        ...result,
        // Trim text if only title is highlighted
        text: result.text.length > 500 ? result.text.substring(0, 500) + "..." : result.text
      }));
    }
  }

  let filters = $derived(countByLang(searchResults));
  let filteredResults = $derived(
    currentFilter ? searchResults.filter(r => r.lang === currentFilter) : searchResults
  );

  let paginatedResults = $derived(
    filteredResults.slice(
      (currentPage - 1) * resultsPerPage,
      currentPage * resultsPerPage
    )
  );

  let totalPages = $derived(Math.ceil(filteredResults.length / resultsPerPage));

  function goToPage(page) {
    currentPage = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function countByLang(results) {
    return results.reduce((acc, result) => {
      const lang = result.lang || "unknown";
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {});
  }
</script>

<svelte:head>
  <title>Search | TMdict</title>
  <link rel="canonical" href="https://www.tmdict.com/contact" />
  <style>
    .search-highlight { color: var(--bg-main); background-color: var(--text-dark); font-size: 1.1em; }
  </style>
</svelte:head>

<h1>{params.q} (<span style="color:#777;">{searchResults.length}</span> results)</h1>

{#if params.q && params.q.length < minChar}
  <div class="content" style="text-align:center;">
    <p>Keyword must be longer than {minChar - 1} character{(minChar - 1 > 1) ? "s" : ""}</p>
    <p>关键字必须长于{minChar - 1}个字符</p>
  </div>
{:else}
  <div class="filters">
    {#each Object.keys(filters).sort() as filter}
      <span
        class="filter"
        class:active={filter === currentFilter}
        role="button"
        tabindex="0"
        onclick={() => {
          currentFilter = filter;
          currentPage = 1;
        }}
        onkeydown={() => {
          currentFilter = filter;
          currentPage = 1;
        }}
      >
        {APP.lang[filter].name} 
        <span class="count">(<span class="number">{filters[filter]}</span>)</span>
      </span>
      {" · "}
    {/each}
    <span
      class="filter"
      role="button"
      tabindex="0"
      onclick={() => {
        currentFilter = "";
        currentPage = 1;
      }}
      onkeydown={() => {
        currentFilter = "";
        currentPage = 1;
      }}
    >
      All
    </span>
  </div>

  <div class="content">
    {#each paginatedResults as result (result.url)}
      <div class="result">
        <a href={result.url}>
          <div class="title">{@html result.title}</div>
          <div class="info">
            {APP.i18n[result.type][result.lang]}
              · {APP.lang[result.lang].name}
            <span class="url"> · www.tmdict.com{result.url}</span>
          </div>
          <div class="text">{@html result.text}</div>
        </a>
      </div>
    {/each}
  </div>
{/if}

{#if totalPages > 1}
  <div class="content">
      <div class="pagination">
        {#if currentPage > 1}
          <button class="nav" onclick={() => goToPage(currentPage - 1)}>«</button>
        {/if}
        
        {#each Array(totalPages) as _, i}
          <button class:active={currentPage === i + 1} onclick={() => goToPage(i + 1)}>
            {i + 1}
          </button>
        {/each}

        {#if currentPage < totalPages}
          <button class="nav" onclick={() => goToPage(currentPage + 1)}>»</button>
        {/if}
      </div>
  </div>
{/if}

<style>
  .filters {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
  }

  .filters .filter {
    color: var(--primary-link);
    font-size: 1.1em;
    margin: 10px;
  }

  @media only screen and (max-width: 660px) {
    .filters .count {
      display: none;
    }
  }

  .filters .filter.active {
    color: var(--primary-heading);
    font-weight: bold;
  }

  .filters .filter:hover {
    color: var(--primary-link-highlight);
    text-decoration: underline;
    cursor: pointer;
  }

  .filters .count { color: #777; }
  .filters .number { color: var(--primary-heading); }

  .result {
    margin-top: 30px;
  }

  .result .title {
    color: var(--primary-heading);
    font-weight: bold;
  }

  .result a {
    color: var(--text-dark);
    text-decoration: none;
    line-height: 1.6em;
  }

  .result a:hover {
    color: var(--text-light);
    text-decoration: underline dotted;
  }
  
  .result .info {
    color: var(--primary-link);
    font-size: 0.9em;
  }
  
  @media only screen and (max-width: 660px) {
    .result .info .url {
      display: none;
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    margin: 30px 0;
  }

  .pagination button {
    padding: 8px 12px;
    border: 1px solid var(--primary-link);
    background: none;
    color: var(--primary-link);
    cursor: pointer;
    border-radius: 4px;
  }

  .pagination button.nav {
    padding: 8px 12px;
    border: 1px dotted var(--primary-link);
  }

  .pagination button:hover {
    background: var(--primary-link);
    color: var(--bg-main);
  }

  .pagination button.active {
    background: var(--primary-link);
    color: var(--bg-main);
  }
</style>
