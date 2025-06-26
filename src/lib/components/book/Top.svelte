<script>
  import { page } from "$app/state";
  import { onMount } from 'svelte';
  import APP from "$lib/__generated/constants.json";
  import { bookstore } from "$lib/util/stores.svelte.js"

  let { book } = $props();

  onMount(() => {
    const hash = page.url.hash.substring(1);
    document.getElementById(hash).scrollIntoView();
  });

  function updateActiveLang(lang) {
    bookstore.lang = "";
    bookstore.lang = lang;
  }
</script>

<div id="top">
  <div class="wrapper group">
    <h1 id={book.source.id}>{book.source.data.name[bookstore.lang]}</h1>
    <div class="nav">
      <div class="nav-info">
        {book.source.releaseDate}
        <br />
        pp.{book.glossary.page}: {book.glossary.data.name[bookstore.lang]}
        <br />
      </div>
      <div class="nav-lang">
        {#each Object.keys(APP.lang) as lang, i}
          {#if i !== 0}{" | "}{/if}
          <a href={`#${book.source.id}`} title={APP.lang[lang].book} onclick={() => updateActiveLang(lang)}>{APP.lang[lang].name}</a>
        {/each} | <a href="/book/#">↵</a>
      </div>
    </div>
  </div>
</div>
