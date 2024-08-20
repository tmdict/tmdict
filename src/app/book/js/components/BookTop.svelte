<script>
  import APP from '../../__tmp/data/constants.js';
  import { activeLang, currentSource } from '../stores.js';

  export let book;

  const updateActiveLang = (lang) => {
    activeLang.set(lang);
    localStorage.setItem('tmdict.book.lang', $activeLang);
  };
  const updateCurrentSource = (src) => currentSource.set(src);
</script>

<div id="top">
  <div class="wrapper group">
    <h1>{book.source.data.name[$activeLang]}</h1>
    <div class="nav">
      <div class="nav-info">
        {book.source.releaseDate}
        <br />
        pp.{book.glossary.page}: {book.glossary.data.name[$activeLang]}
        <br />
      </div>
      <div class="nav-lang">
        {#each Object.keys(APP.lang) as lang, i}
          {#if i !== 0}{" | "}{/if}<a href={`#${book.source.id}?lang=${lang}`} title={APP.lang[lang].name} on:click={() => updateActiveLang(lang)}>{APP.lang[lang].name}</a>
        {/each} | <a on:click={() => updateCurrentSource('toc')} href="./#">↵</a>
      </div>
    </div>
  </div>
</div>
