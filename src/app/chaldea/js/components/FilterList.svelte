<script>
  import Fuse from 'fuse.js';

  import Top from './Top.svelte';
  import Footer from './Footer.svelte';
  import List from './List.svelte';
  import Filter from './Filter.svelte';
  import { highlight } from '../highlight';
  import { activeLang, filters, sortBy } from '../stores.js';

  export let data;
  export let level;

  // Preprocess a list of filter values given filter keys and data to be filtered
  const filterValues = data.attribute.filter.reduce(
    // For each filter id
    (acc, filter) => {
      const flattened = data.content.map((d) => d[filter]).reduce((acc, cur) => acc.concat(cur));
      const deduped = [...new Set(flattened)];

      return {
        ...acc, // data filter collected so far
        [filter]: deduped, // Get distinct filter data for current filter id
      };
    },
    {} // Default empty {} for reducer
  );

  // Initialize search options
  let searchTerm = '';
  const searchOptions = {
    ignoreLocation: true,
    includeMatches: true,
    shouldSort: true,
    threshold: 0.0,
  };

  // Initialize full entry list
  let parsedEntryList = structuredClone(data.content);
  sortBy.set({ id: 'uid', order: '▼' });

  // Reset all filters to empty
  const resetAllFilter = () => {
    // Quick filter: can only select one at a time; Common filter: can select multiple at a time
    // {
    //   filter1: { common: [ ... ], quick: '...' },
    //   filter2: { common: [ ... ], quick: '...' },
    //   ...
    // }
    filters.set(
      data.attribute.filter.reduce(
        (acc, filter) => ({
          ...acc,
          [filter]: {
            common: [],
            quick: '',
          },
        }),
        {}
      )
    );
  };
  // Reset on load
  resetAllFilter();

  // Check if the given entry should be filtered out or not
  const isEntryFiltered = (entry) => {
    // Goes through each filter
    for (let [filterKey, filterBuckets] of Object.entries($filters)) {
      // If at least one of the filter buckets have filters in it
      if (filterBuckets.quick !== '' || filterBuckets.common.length !== 0) {
        // If current entry has an attribute match for any of the two buckets
        if (
          entry[filterKey] &&
          entry[filterKey].some((e) => filterBuckets.quick === e || filterBuckets.common.includes(e))
        ) {
          continue; // Has a match for current filter, move on to next filter
        } else {
          return false; // Current filter has no match, short-circuit
        }
      }
    }
    // Either entry has a matching attribute for ALL selected filters, or none are selected
    return true;
  };

  // Sort a given array `arr` by current sortBy state
  const sortByCurrentId = (arr) =>
    [...arr].sort((a, b) => {
      switch ($sortBy.id) {
        case 'uid': {
          return $sortBy.order === '▲'
            ? parseFloat(a[$sortBy.id].split(':')[0]) - parseFloat(b[$sortBy.id].split(':')[0]) ||
                b['name'][$activeLang].localeCompare(a['name'][$activeLang])
            : parseFloat(b[$sortBy.id].split(':')[0]) - parseFloat(a[$sortBy.id].split(':')[0]) ||
                a['name'][$activeLang].localeCompare(b['name'][$activeLang]);
        }
        case 'name': {
          // Sorts by name in current language
          return $sortBy.order === '▲'
            ? a[$sortBy.id][$activeLang].localeCompare(b[$sortBy.id][$activeLang])
            : b[$sortBy.id][$activeLang].localeCompare(a[$sortBy.id][$activeLang]);
        }
        case 'star': {
          // Content is in first element of the array
          return $sortBy.order === '▲'
            ? a[$sortBy.id][0].localeCompare(b[$sortBy.id][0])
            : b[$sortBy.id][0].localeCompare(a[$sortBy.id][0]);
        }
        default:
          // Fallback to sort by name
          return $sortBy.order === '▲' ? a['name'].localeCompare(b['name']) : b['name'].localeCompare(a['name']);
      }
    });

  // Re-sort data whenever sortBy state changes
  $: {
    $sortBy;
    parsedEntryList = structuredClone(sortByCurrentId(parsedEntryList));
  }

  // Update filtered data by given filter (or return as-is) whenever global filter changes
  // Filter by search if is glossary
  $: {
    $filters;
    // Filter entry list
    let filteredContent = structuredClone(data.content.filter(isEntryFiltered));
    let searchedSortedEntryList = structuredClone(sortByCurrentId(filteredContent));
    if (data.attribute.type === 'glossary') {
      if (searchTerm !== '' && searchTerm.length > 1) {
        const fuse = new Fuse(filteredContent, {
          ...searchOptions,
          minMatchCharLength: searchTerm.length,
          keys: ['name.' + $activeLang, 'content.' + $activeLang + '.html'],
        });
        const results = fuse.search(searchTerm);
        if (results.length > 0) {
          // Highlight and return search results
          searchedSortedEntryList = structuredClone(highlight(results));
        } else {
          searchedSortedEntryList = [];
        }
      }
    }
    // Sort entry list
    parsedEntryList = structuredClone(searchedSortedEntryList);
  }
</script>

<div id="container">
  <Top {level} />

  <div id="main">
    <div class="content no-break">
      <h1>{data.attribute.name[$activeLang]}</h1>

      {#if data.attribute.type === 'glossary'}
        <div class="search">
          <input class="search-box" bind:value={searchTerm} />
        </div>
      {/if}

      <div class="filter-list">
        <List i18n={data.i18n} listType={data.attribute.type} entryList={parsedEntryList} {level} env={data.env} />

        <Filter type={data.attribute.type} i18n={data.i18n} {filterValues} on:filterReset={resetAllFilter} />
      </div>
    </div>
  </div>

  <Footer {level} />
</div>

<style>
  .search {
    display: flex;
  }

  input {
    margin: 30px auto 0;
    padding: 10px;
    flex: 1 1 auto;
    font-size: 1.4rem;
    line-height: 2rem;
    border-radius: 10px;
    border: 1px solid #ccc;
  }
</style>
