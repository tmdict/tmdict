<script>
  import { browser } from '$app/environment';
  import Fuse from "fuse.js";
  import { highlight } from "$lib/util/highlight.js";
  import APP from "$lib/__generated/constants.json";
  import SEARCH_DATA from "$lib/__generated/data/search.json";

  const minChar = 2;
  const queryTooShort = {
    en: `…Keyword must be longer than ${minChar - 1} characters`,
    zh: `…关键字必须长于${minChar - 1}个字符`,
    ja: `…キーワードは${minChar - 1}文字以上であること`,
  };

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
    keys: ['text', 'title'],
  });

  let currentFilter = $state("");
  let searchResults = $state([]);
  if (params.q !== null && params.q.length > 0 && params.q.length >= minChar) {
    const results = fuse.search(params.q.replace('+', ' '));
    if (results.length > 0) {
      // Highlight and return search results
      searchResults = structuredClone(highlight(results, true));
    }
  }

  let filters = $derived(countByLang(searchResults));

  function countByLang(results) {
    return results.reduce((acc, result) => {
      const lang = result.lang || "unknown";
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {});
  }

  function clearAll() {
    currentFilter = "";
  }
</script>

<svelte:head>
  <title>Search | TMdict</title>
  <link rel="canonical" href="https://www.tmdict.com/contact" />
  <style>
    .search-highlight {
      color: var(--bg-main);
      background-color: var(--text-dark);
      font-size: 1.1em;
    }
  </style>
</svelte:head>

<h1>{params.q} (<span style="color:#777;">{searchResults.length}</span> results)</h1>

<div class="filters">
  {#each Object.keys(filters) as filter}
    <span
      class="filter"
      class:active={filter === currentFilter}
      role="button"
      tabindex="0"
      onclick={() => (currentFilter = filter)}
      onkeydown={() => (currentFilter = filter)}
    >
      {APP.lang[filter].name} 
      <span class="count">(<span class="number">{filters[filter]}</span>)</span>
    </span>
    {' · '}
  {/each}
  <span
    class="filter"
    role="button"
    tabindex="0"
    onclick={clearAll}
    onkeydown={clearAll}
  >
    Clear All
  </span>
</div>

<div class="content">
  {#if params.q && params.q.length < minChar}
    {queryTooShort[data.lang]}
  {/if}
  {#each searchResults as result}
    <div class="result">
      <div class="title">{@html result.title}</div>
      <a href={result.url}>
        <div class="text">{@html result.text}</div>
      </a>
    </div>
  {/each}
</div>

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

  .filters .filter:hover {
    color: var(--primary-link-highlight);
    text-decoration: underline;
    cursor: pointer;
  }

  .filters .count { color: #777; }
  .filters .number { color: var(--primary-heading); }

  .result .title {
    color: var(--primary-heading);
    font-weight: bold;
    margin: 20px 0 5px;
  }

  .result a {
    color: var(--text-dark);
    text-decoration: none;
  }
</style>
