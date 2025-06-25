<script>
  import { slide } from "svelte/transition";
  import APP from "$lib/__generated/constants.json";

  let { lang, entry, i18n, showDetail = false } = $props();

  function toggleDetails() {
    showDetail = !showDetail;
  }
</script>

<div class="entry-header" onclick={toggleDetails} onkeydown={toggleDetails} role="button" tabindex="0">
  <div class="name">
    <a href="/{lang}/{entry.hiragana}.{entry.id}">
      {@html entry.name[lang]}
    </a>
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
</div>
{#if showDetail}
  <div transition:slide={{ duration: 200 }} class="entry-content">
    <a href="/{lang}/{entry.hiragana}.{entry.id}">
      {#each entry.content as content, j}
        <h2>{i18n["content-id"][content.cid][lang]}</h2>
        <p>{@html content[lang]}</p>
      {/each}
    </a>
  </div>
{/if}

<style>
  .name {
    float: left;
    margin: 4px 6px;
    font-weight: bold;
    width: calc(100% - 208px);
  }

  .name a {
    color: var(--text-medium);
  }

  .category {
    float: left;
    font-size: 0.95em;
    margin: 4px 6px;
    width: calc(100% - 360px);
    align-content: center;
    color: var(--primary-link-highlight);
  }

  .work {
    float: left;
    font-size: 0.9em;
    margin: 4px 6px;
    width: calc(100% - 380px);
    align-content: center;
    color: var(--primary-link);
  }

  .entry-header {
    display: flex;
    flex: 0 0 100%;
    color: var(--primary-link);
  }

  .entry-header:hover {
    cursor: pointer;
  }

  .entry-content {
    border-top: 1px dotted #aaa;
    flex: 0 0 100%;
  }

  .entry-content h2 {
    font-size: 1rem;
    font-weight: bold;
    letter-spacing: 0.1rem;
    margin: 30px 0 0 10px;
  }

  .entry-header a,
  .entry-content a {
    text-decoration: none;
  }

  .entry-content p {
    color: var(--text-medium);
  }

  @media only screen and (max-width: 660px) {
    .category {
      float: right;
      width: calc(80% - 100px);
    }

    .work { display: none; }
  }
</style>
