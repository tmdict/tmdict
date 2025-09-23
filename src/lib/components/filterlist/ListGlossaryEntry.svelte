<script>
  import { slide } from "svelte/transition";
  import APP from "$lib/__generated/constants.json";

  let { lang, entry, i18n } = $props();

  let showDetail = $state(false);

  function toggleDetails() {
    showDetail = !showDetail;
  }

  function preventDefault(fn) {
    return function (event) {
      event.preventDefault();
      fn.call(this, event);
    };
  }
</script>

<svelte:head>
  <style>
    .entry-item .name .search-highlight { color: var(--primary-highlight); background-color: var(--text-dark); }
    .entry-content p { padding: 0 5px; }
    .entry-content h3 { font-size: .75rem; margin: 0 0 0 5px; }
    .entry-content h4 { font-size: 0.8rem; margin-left: 5px; }
    .entry-content h5 { margin: 15px 0 5px 15px; }
  </style>
</svelte:head>

<div class="entry-item">
  <div class="name">
    {@html entry.name[lang]}
  </div>
  <div class="category">
    [
      {#if entry.category.length > 0}
        {#each entry.category as category, i}
          {#if i > 0}{" / "}{/if}{i18n["category"][category][lang]}
        {/each}
      {:else}
        -
      {/if}
    ]
  </div>
  <div class="work">
    {#each entry.work as work, i}
      {#if i > 0}{", "}{/if}{i18n["work"][work][lang]}
    {/each}
  </div>
  <div class="expand" onclick={preventDefault(() => toggleDetails())} onkeydown={toggleDetails} role="button" tabindex="0">
    {showDetail ? "-" : "+"}
  </div>
</div>
{#if showDetail}
<div transition:slide class="entry-content">
  <a href="/{lang}/{entry.hiragana}.{entry.id}">
    {#each entry.content as content, j}
      <h2>{i18n["content-id"][content.cid][lang]}</h2>
      <p>{@html content[lang]}</p>
    {/each}
  </a>
</div>
{/if}

<style>
  .entry-item {
    display: flex;
    flex: 0 0 100%;
    align-items: stretch;
  }

  .entry-item:hover {
    cursor: pointer;
  }

  .name {
    color: var(--text-medium);
    margin: 4px 6px;
    font-weight: bold;
    flex: 1 1 352px;
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .category {
    color: var(--primary-link-highlight);
    font-size: 0.95em;
    margin: 4px 6px;
    flex: 0 1 240px;
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .work {
    color: var(--primary-link);
    font-size: 0.9em;
    margin: 4px 6px;
    flex: 0 1 220px;
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .expand {
    color: var(--text-medium);
    font-size: 0.9em;
    padding: 0 10px;
    flex: 0 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .expand:hover {
    color: var(--primary-link-highlight);
    border-left: 1px dotted #aaa;
    border-right: 1px dotted #aaa;
  }

  .entry-content {
    flex: 0 0 100%;
    background: var(--bg-main);
    border-top: 1px dotted #aaa;
  }

  .entry-content h2 {
    font-size: 1rem;
    font-weight: bold;
    letter-spacing: 0.1rem;
    margin: 30px 0 0 10px;
  }

  .entry-content a {
    text-decoration: none;
  }

  .entry-content p {
    color: var(--text-medium);
  }

  @media only screen and (max-width: 660px) {
    .category {
      flex: 1 1 195px;
    }

    .work,
    .expand {
      display: none;
    }
  }
</style>
