<script>
  import APP from '../../__tmp/data/constants.js';
  import Toc from './Toc.svelte';
  import Book from './Book.svelte';

  import { activeLang, currentSource } from '../stores.js';

  export let data;

  const updateActiveLang = (lang) => {
    activeLang.set(lang);
    localStorage.setItem('tmdict.book.lang', lang);
  };

  const url = window.location.hash.substr(1).split('?')[0].split('.');
  if (data.find((b) => b.source.id === url[0])) {
    currentSource.set(url[0]);
  }
  const regexLang = window.location.hash.substr(1).match(/\?lang=([a-z]{2})$/);
  if (regexLang !== null && Object.keys(APP.lang).includes(regexLang[1])) {
    updateActiveLang(regexLang[1]);
  }
</script>

<div id="main">
  {#if $currentSource === 'toc'}
    <Toc {data} />
  {:else}
    <Book book={data.find(b => b.source.id === $currentSource)} />
  {/if}
</div>
