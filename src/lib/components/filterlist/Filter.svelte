<script>
  import { createEventDispatcher } from "svelte";
  import { filterlist } from "$lib/util/filterlist.svelte.js"
  import APP from "$lib/__generated/constants.json";

  let { lang, type, filterValues, i18n, expandFilter = $bindable() } = $props();

  // https://stackoverflow.com/questions/48601273/sorting-royal-names-using-javascript
  const romanToNum = (roman) => {
    if (roman === "") return 0;
    if (roman.startsWith("l")) return 50 + romanToNum(roman.substring(1));
    if (roman.startsWith("xl")) return 40 + romanToNum(roman.substring(2));
    if (roman.startsWith("x")) return 10 + romanToNum(roman.substring(1));
    if (roman.startsWith("ix")) return 9 + romanToNum(roman.substring(2));
    if (roman.startsWith("v")) return 5 + romanToNum(roman.substring(1));
    if (roman.startsWith("iv")) return 4 + romanToNum(roman.substring(2));
    if (roman.startsWith("i")) return 1 + romanToNum(roman.substring(1));
    return 0;
  };

  // Sort filter values, with special rules for source names
  const sortFilterValues = (values, key) => {
    // If source, sort by roman numeral if FGOM, else sort by name
    if (key === "source" && type === "profile") {
      return values
        .map((n) => {
          if (n.split("-")[0] === "fgo") {
            return { name: n, num: romanToNum(n.split("-").pop()) };
          }
          return { name: n, num: 0 };
        })
        .sort((a, b) => b.num - a.num || a.name.localeCompare(b.name))
        .map(({ name, num }) => name);
    }
    return values.sort();
  };
</script>

<div class="filter">
  {#each Object.keys(filterValues) as filterKey (filterKey)}
    <div
      class="filter-header"
      role="button"
      tabindex="0"
      onclick={() => expandFilter = !expandFilter}
      onkeydown={() => expandFilter = !expandFilter}
    >
      <h6>
        {APP.i18n[filterKey][lang]}
        <span class="arrow">▶</span>
      </h6>
    </div>
    <ul>
      <li>
        <div class="item"
          role="button"
          tabindex="0"
          onclick={() => filterlist.resetByType(filterKey)}
          onkeydown={() => filterlist.resetByType(filterKey)}
        >
          all
        </div>
      </li>
      {#each sortFilterValues(filterValues[filterKey], filterKey) as filterValue (filterValue)}
        {#if i18n[filterKey][filterValue]}
          <li>
            <div class="item"
              class:active={filterValue === filterlist.get(filterKey).quick}
              role="button"
              tabindex="0"
              onclick={() => filterlist.updateQuickFilter(filterKey, filterValue)}
              onkeydown={() => filterlist.updateQuickFilter(filterKey, filterValue)}
            >
              {i18n[filterKey][filterValue][lang]}
            </div>
          </li>
        {/if}
      {/each}
      <li>
        <div class="item"
          role="button"
          tabindex="0"
          onclick={() => filterlist.reset()}
          onkeydown={() => filterlist.reset()}
        >
          reset all
        </div>
      </li>
    </ul>
  {/each}
</div>

<style>
  .filter {
    width: 180px;
    float: left;
    line-height: 1.4em;
    margin: 0 6px;
  }

  .filter-header {
    cursor: pointer;
  }

  .filter-header h6 {
    display: flex;
    justify-content: space-between;
  }

  .filter-header h6 .arrow {
    color: var(--text-dark);
    font-size: 0.8em;
  }

  ul {
    list-style: none;
    margin: 0 0 2em;
    padding: 0;
  }

  ul li {
    border-bottom: 1px dotted #aaa;
    display: flex;
    overflow-wrap: break-word;
  }

  ul li:first-child {
    border-top: 1px dotted #aaa;
  }

  .item {
    width: 100%;
    height: 90%;
    display: block;
    text-decoration: none;
    padding: 0.35em 0.25em;
    color: var(--primary-link);
  }

  .item.active {
    color: var(--primary-link-highlight);
    background: var(--bg-row-grey-light);
  }

  .item:hover {
    background: none;
    cursor: pointer;
    background: var(--bg-row-grey-dark);
  }

  @media only screen and (max-width: 840px) {
    .filter {
      width: 120px;
    }

    .item {
      font-size: 0.75rem;
    }
  }

  @media only screen and (max-width: 660px) {
    .filter {
      display: none;
    }
  }
</style>
