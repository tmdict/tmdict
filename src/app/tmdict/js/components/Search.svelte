<script>
  import Fuse from 'fuse.js';
  import { highlight } from '../highlight';

  export let data;

  const minCharLenOffset = 0;
  const minChar = data.lang === 'en' ? 3 : 2;
  const queryTooShort = {
    en: `…Keyword must be longer than ${minChar - 1} characters`,
    zh: `…关键字必须长于${minChar - 1}个字符`,
    ja: `…キーワードは${minChar - 1}文字以上であること`,
  };

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  let minMatchCharLen = minChar;
  if (params.q !== null && params.q.length > 0) {
    if (params.q.length - minCharLenOffset > minMatchCharLen) {
      minMatchCharLen = params.q.length - minCharLenOffset;
    }
  }

  const fuse = new Fuse(data.search, {
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
      searchResults = structuredClone(highlight(results));
    }
  }
</script>

<h2>{params.q} (<span style="color:#c05b4d;">{searchResults.length}</span> results)</h2>

<div>
  {#if params.q.length < minChar}
    {queryTooShort[data.lang]}
  {/if}
  {#each searchResults as result}
    <div class="result">
      <div class="title">{@html result.title}</div>
      <a href="https://www.tmdict.com/{data.lang}/{result.url}">
        <div class="url">https://www.tmdict.com/{data.lang}/{result.url}</div>
        <div class="text">{@html result.text}</div>
      </a>
    </div>
  {/each}
</div>
