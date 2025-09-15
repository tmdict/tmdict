<script>
  import { slide } from "svelte/transition";
  import APP from "$lib/__generated/constants.json";

  let { lang, entry, i18n } = $props();
</script>

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
</div>

<style>
  .entry-item {
    display: flex;
    flex: 0 0 100%;
  }

  .entry-item:hover {
    cursor: pointer;
  }

  .name {
    float: left;
    color: var(--text-medium);
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

  @media only screen and (max-width: 660px) {
    .category {
      float: right;
      width: calc(80% - 100px);
    }

    .work {
      display: none;
    }
  }
</style>
