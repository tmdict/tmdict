<script>
  import Fuse from 'fuse.js';
  import cloneDeep from 'lodash/clonedeep';
  import { highlight } from '../highlight';

  export let data;

  // Initialize search
  const fuse = new Fuse(data.search, {
    includeMatches: true,
    minMatchCharLength: 3,
    findAllMatches: true,
    shouldSort: true,
    ignoreLocation: true,
    threshold: 0.0,
    keys: ['text', 'title'],
  });

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  let searchResults = [];
  if (params.q !== '') {
    const results = fuse.search(params.q);
    if (results.length > 0) {
      // Highlight and return search results
      console.log(results);
      searchResults = cloneDeep(highlight(results));
    }
  }

  function truncateString(str, num) {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  }
</script>

<h4>{searchResults.length} results</h4>

<div>
  {#each searchResults as result}
    <div class="result">
      <div class="title">{@html result.title}</div>
      <div class="url"><a href={result.url}>{result.url}</a></div>
      <div class="text">{@html truncateString(result.text, 1000)}</div>
    </div>
  {/each}
</div>
