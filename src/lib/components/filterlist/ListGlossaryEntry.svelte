<script>
  import { slide } from "svelte/transition";
  import { store } from "$lib/util/stores.svelte.js"
  import APP from "$lib/__generated/constants.json";

  let { entry, i18n, showDetail = false } = $props();

  function toggleDetails() {
    showDetail = !showDetail;
  }
</script>

<div class="entry-header" onclick={toggleDetails} onkeydown={toggleDetails} role="button" tabindex="0">
  <div class="name">
    <a href="/{store.lang.value}/{entry.ja}.{entry.id}">
      {@html entry.name[store.lang.value]}
    </a>
  </div>
  <div class="category">
    [
    {#each entry.category as category, i}
      {#if i > 0}{" / "}{/if}{i18n["category"][category][store.lang.value]}
    {/each}
    ]
  </div>
  <div class="work">
    [
    {#each entry.work as work, i}
      {#if i > 0}{", "}{/if}{i18n["work"][work][store.lang.value]}
    {/each}
    ]
  </div>
</div>
{#if showDetail}
  <div transition:slide={{ duration: 200 }} class="entry-content">
    <a href="/{store.lang.value}/{entry.ja}.{entry.id}">
      {#each entry.content as content, j}
        <h2>{content[store.lang.value].id}</h2>
        <p>{@html content[store.lang.value].html}</p>
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

  .category {
    float: left;
    font-size: 0.95em;
    margin: 4px 6px;
    width: calc(100% - 360px);
    align-content: center;
  }

  .work {
    float: left;
    font-size: 0.9em;
    margin: 4px 6px;
    width: calc(100% - 380px);
    align-content: center;
  }

  .entry-header {
    display: flex;
    flex: 0 0 100%;
    
  }

  .entry-header:hover {
    cursor: pointer;
  }

  .entry-content {
    border-top: 1px dotted #aaa;
    flex: 0 0 100%;
  }

  .entry-header a, .entry-content a {
    text-decoration: none;
  }

  @media only screen and (max-width: 660px) {
    .category {
      float: right;
      width: calc(80% - 180px);
    }

    .work { display: none; }
  }
</style>