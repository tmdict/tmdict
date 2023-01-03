<script>
  import Fuse from 'fuse.js';
  import { highlight } from '../highlight';

  export let data;

  let minChar = data.lang === 'en' ? 3 : 2;

  // Initialize search
  const fuse = new Fuse(data.search, {
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: minChar,
    threshold: 0.0,
    shouldSort: true,
    ignoreLocation: true,
    keys: ['text', 'title'],
  });

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  let searchResults = [];
  if (params.q !== null && params.q.length > 0) {
    const results = fuse.search(params.q);
    if (results.length > 0) {
      // Highlight and return search results
      searchResults = structuredClone(highlight(results));
    }
  }

  function truncateString(str, num) {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  }
</script>

<h4>{params.q} (<span style="color:#c05b4d;">{searchResults.length}</span> results)</h4>

<div>
  {#each searchResults as result}
    <div class="result">
      <div class="title">{@html result.title}</div>
      <a href={result.url}>
        <div class="url">{result.url}</div>
        <div class="text">{@html truncateString(result.text, 1000)}</div>
      </a>
    </div>
  {/each}
</div>
