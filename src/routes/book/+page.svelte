<script>
  import Book from "$lib/components/book/Book.svelte";
  import { onMount } from 'svelte';
  import { bookstore } from "$lib/util/stores.svelte.js"
  import APP from "$lib/__generated/constants.json";
  import BOOK_DATA from "$lib/__generated/data/book.json";
  import hashes from "$lib/__generated/hashes.json";

  let currentSource = $state("");
  BOOK_DATA.sort((a, b) => (a.source.weight > b.source.weight) ? -1 : 1);

  function parseUrlSource() {
    const hashUrl = window.location.hash.substring(1);
    return hashUrl.split(".")[0];
  }

  function handleHashChange() {
    // Update source depending on URL
    if (BOOK_DATA.find((b) => b.source.id === parseUrlSource())) {
      currentSource = parseUrlSource();
    } else {
      currentSource = "";
    }
  }

  onMount(() => {
    window.addEventListener('hashchange', handleHashChange);
    // Initialize with current hash
    currentSource = parseUrlSource();
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  });

  function updateActiveLang(lang) {
    bookstore.lang = lang;
  }
</script>

<svelte:head>
  <link rel="canonical" href="https://www.tmdict.com/book/" />
  <link rel="stylesheet" type="text/css" href="/__generated/css/{hashes["vendors/normalize"]}.css" />
  <link rel="stylesheet" type="text/css" href="/__generated/css/{hashes["kara"]}.css" />
</svelte:head>

<div id="main">
  {#if currentSource === ""}
    
    <div id="toc">
      <h1>Glossary § 辞典</h1>
      <div class="centered-info">
        {#each Object.keys(APP.lang) as lang, i}
          {#if i !== 0}{" ・ "}{/if}<a onclick={() => updateActiveLang(lang)} href="/book/#">{APP.lang[lang].book}</a>
        {/each}
      </div>
      <div class="centered-info">
        <a href="/{bookstore.lang}/">TMdict</a>
      </div>
      <div class="separator"></div>
      <ul>
        {#each BOOK_DATA as book}
          <li>
            <a href={`#${book.source.id}`} id={`${book.source.id}`} title={book.glossary.data.name[bookstore.lang]}>
              <div class="info" class:new={book.source.releaseDate.split("-")[0] === "2023"}>
                {book.source.releaseDate} / {book.source.data.name[bookstore.lang]}
              </div>
              {book.glossary.data.name[bookstore.lang]}
            </a>
          </li>
        {/each}
      </ul>
      <div class="separator-small"></div>
    </div>
  {:else}
    <Book book={BOOK_DATA.find(b => b.source.id === currentSource)} />
  {/if}
</div>
