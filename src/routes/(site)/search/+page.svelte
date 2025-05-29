<script>
  import SEARCH_DATA from "$lib/__generated/data/search.json";
  import { browser } from '$app/environment';
  import Fuse from "fuse.js";
  import { highlight } from "$lib/util/highlight.js";

  const minCharLenOffset = 0;
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

  let minMatchCharLen = minChar;
  if (params.q !== null && params.q.length > 0) {
    if (params.q.length - minCharLenOffset > minMatchCharLen) {
      minMatchCharLen = params.q.length - minCharLenOffset;
    }
  }

  const fuse = new Fuse(SEARCH_DATA, {
    ignoreLocation: true,
    includeMatches: true,
    includeScore: true,
    minMatchCharLength: minMatchCharLen,
    shouldSort: true,
    threshold: 0.0,
    keys: ['text', 'title'],
  });

  let searchResults = [];
  if (params.q !== null && params.q.length > 0 && params.q.length >= minChar) {
    const results = fuse.search(params.q.replace('+', ' '));
    if (results.length > 0) {
      // Highlight and return search results
      searchResults = structuredClone(highlight(results, true));
    }
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
<br />
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
  h1 {
    font-size: 1.8rem;
  }

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
