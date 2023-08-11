<script>
  import APP from '../../__tmp/data/constants.js';
  import { createEventDispatcher } from 'svelte';
  import { activeLang, filters } from '../stores.js';

  export let type;
  export let i18n;
  export let filterValues;

  // Reset current filter to empty
  const resetCurrentFilter = (fk) => {
    let updatedFilters = $filters;
    updatedFilters[fk].common = [];
    updatedFilters[fk].quick = '';
    filters.set(updatedFilters);
  };

  // Update global filter state on click
  const updateCommonFilterState = (fk, fv) => {
    let updatedFilters = $filters;
    // Update contents of filter kv buckets
    updatedFilters[fk].common = updatedFilters[fk].common.includes(fv)
      ? updatedFilters[fk].common.filter((e) => e !== fv) // Remove
      : [...updatedFilters[fk].common, fv]; // Add
    filters.set(updatedFilters);
  };

  // Update global quick filter state on click
  const updateQuickFilterState = (fk, fv) => {
    let updatedFilters = $filters;
    // Update contents of filter kv buckets
    updatedFilters[fk].quick = fv;
    filters.set(updatedFilters);
  };

  const dispatch = createEventDispatcher();
  const resetFilters = () => dispatch('filterReset', {});

  // https://stackoverflow.com/questions/48601273/sorting-royal-names-using-javascript
  const romanToNum = (roman) => {
    if (roman === '') return 0;
    if (roman.startsWith('l')) return 50 + romanToNum(roman.substring(1));
    if (roman.startsWith('xl')) return 40 + romanToNum(roman.substring(2));
    if (roman.startsWith('x')) return 10 + romanToNum(roman.substring(1));
    if (roman.startsWith('ix')) return 9 + romanToNum(roman.substring(2));
    if (roman.startsWith('v')) return 5 + romanToNum(roman.substring(1));
    if (roman.startsWith('iv')) return 4 + romanToNum(roman.substring(2));
    if (roman.startsWith('i')) return 1 + romanToNum(roman.substring(1));
    return 0;
  };

  // Sort filter values, with special rules for source names
  const sortFilterValues = (values, key) => {
    // If source, sort by roman numeral if FGOM, else sort by name
    if (key === 'source' && type === 'profile') {
      return values
        .map((n) => {
          if (n.split('-')[0] === 'fgo') {
            return { name: n, num: romanToNum(n.split('-').pop()) };
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
    <h6>{APP.i18n[filterKey][$activeLang]}</h6>
    <ul>
      <li><div class="item"><a href="#{$activeLang}" on:click={() => resetCurrentFilter(filterKey)}>all</a></div></li>
      {#each sortFilterValues(filterValues[filterKey], filterKey) as filterValue (filterValue)}
        {#if i18n[filterKey][filterValue]}
          <li>
            <div class="item quick" class:active={filterValue === $filters[filterKey].quick}>
              <a href="#{$activeLang}" on:click={() => updateQuickFilterState(filterKey, filterValue)}>
                {i18n[filterKey][filterValue][$activeLang]}
              </a>
            </div>
            <div class="item common" class:active={$filters[filterKey].common.includes(filterValue)}>
              <a href="#{$activeLang}" on:click={() => updateCommonFilterState(filterKey, filterValue)}>&nbsp;</a>
            </div>
          </li>
        {/if}
      {/each}
      <li><div class="item"><a href="#{$activeLang}" on:click={resetFilters}>reset all</a></div></li>
    </ul>
  {/each}
</div>
