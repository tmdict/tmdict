<script>
  import { slide } from "svelte/transition";
  import { filterlist } from "$lib/util/filterlist.svelte.js"
  import APP from "$lib/__generated/constants.json";

  let { lang, filterKey, filterValues, i18n } = $props();
  let showFilter = $state(false);

  const sorted = filterValues.sort((a, b) => i18n[filterKey][a][lang].localeCompare(i18n[filterKey][b][lang]))

  if (["en", "star"].includes(filterKey)) {
    showFilter = true;
  }

  function getWidthByLongestElement(arr) {
    const maxLength = Math.max(...arr.map(item => {
      return i18n[filterKey][item][lang].length;
    }));
    return `${maxLength * 8 + 8}px`; // 7px per char + padding
  }
</script>

  <div class="filter">
    <h6>
      <div class="show"
        role="button"
        tabindex="0"
        onclick={() => { showFilter = !showFilter }}
        onkeydown={() => { showFilter = !showFilter }}
      >
        {APP.i18n[filterKey][lang]} 
        <span class="label">{#if showFilter}-{:else}+{/if}</span>
      </div>
    </h6>
    {#if showFilter}
    <div class="content-row" transition:slide>
      {#each filterValues as item (item)}
        <div class="filter-item" class:active={item === filterlist.get(filterKey).quick || filterlist.get(filterKey).common.includes(item)}>
          <div class="quick"
            class:active={item === filterlist.get(filterKey).quick}
            style:min-width={getWidthByLongestElement(filterValues)}
            style:padding-left={(i18n[filterKey][item][lang].length) === 1 ? "10px" : "5px"}
            role="button"
            tabindex="0"
            onclick={() => filterlist.updateQuickFilter(filterKey, item)}
            onkeydown={() => filterlist.updateQuickFilter(filterKey, item)}
          >
            {i18n[filterKey][item][lang]}
          </div>
          <div class="common"
            class:active={filterlist.get(filterKey).common.includes(item)}
            role="button"
            tabindex="0"
            onclick={() => filterlist.updateCommonFilter(filterKey, item)}
            onkeydown={() => filterlist.updateCommonFilter(filterKey, item)}
          ></div>
        </div>
      {/each}
      <span class="clear"
        role="button"
        tabindex="0"
        onclick={() => filterlist.reset()}
        onkeydown={() => filterlist.reset()}
      >
        Clear
      </span>
    </div>
  {/if}
</div>

<style>
  .filter {
    margin-bottom: 25px;
  }

  h6 {
    font-size: 0.9rem;
    margin-left: 8px;
  }

  h6 .show {
    cursor: pointer;
  }

  h6:hover .show {
    text-decoration: underline;
  }

  h6 .show .label {
    font-size: 1rem;
    color: var(--secondary-heading);
  }

  h6, h6:hover .label {
    color: var(--primary-link-highlight);
  }

  .content-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .clear {
    font-size: 0.9em;
    margin: 8px;
    color: var(--primary-link);
  }

  .clear:hover {
    cursor: pointer;
    text-decoration: underline;
    color: var(--primary-link-highlight);
  }

  .filter-item {
    display: flex;
    font-size: 0.8rem;
    margin: 6px;
    align-items: stretch;
    border: 1px solid #aaa;
  }
 
  .filter-item.active {
    display: flex;
    font-size: 0.8rem;
    margin: 5px;
    align-items: stretch;
    border: 2px solid #999;
  }
 
  .filter-item .quick {
    padding: 5px 10px 5px 5px;
    overflow-wrap: anywhere;
    align-items: center;
    color: var(--primary-link);
  }
  
  .filter-item .quick.active,
  .filter-item .common.active {
    color: var(--secondary-highlight);
    background-color: var(--bg-row-grey-light);
  }

  .filter-item .quick:hover,
  .filter-item .common:hover {
    cursor: pointer;
    background-color: var(--bg-row-grey-dark);
  }

  .filter-item .quick.active:hover {
    text-decoration: underline;
  }
  
  .filter-item .common {
    width: 30px;
    margin-left: 1px;
    border-left: 1px solid #aaa;
  }
  
  .filter-item .common.active {
    background-color: #999;
    margin: 1px;
    margin-left: 0;
    border-left: 0;
  }
</style>
