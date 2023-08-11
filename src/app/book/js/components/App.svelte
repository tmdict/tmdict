<script>
  import page from 'page';

  import APP from '../../__tmp/data/constants.js';
  import Toc from './Toc.svelte';
  import Book from './Book.svelte';

  import { activeLang, currentSource } from '../stores.js';

  export let data;

  const updateActiveLang = (lang) => {
    activeLang.set(lang);
    localStorage.setItem('tmdict.book.lang', lang);
  };

  // Set route based on URL
  page('/*', (ctx) => {
    const src = ctx.hash.split('?')[0];
    const lang = ctx.hash.match(/\?lang=([a-z]{2})$/);
    if (src === '') {
      currentSource.set('toc');
    } else {
      if (data.find((b) => b.source.id === src)) {
        currentSource.set(src);
      }
    }
    if (lang !== null && Object.keys(APP.lang).includes(lang[1])) {
      updateActiveLang(lang[1]);
    }
  });
  // Start listening to change
  page({ click: false });
</script>

<div id="main">
  {#if $currentSource === 'toc'}
    <Toc {data} />
  {:else}
    <Book book={data.find(b => b.source.id === $currentSource)} />
  {/if}
</div>
