<script>
  import Top from './Top.svelte'
  import Footer from './Footer.svelte'
  import List from './List.svelte'
  import Filter from './Filter.svelte'
  import { activeLang, filters, sortBy } from '../stores.js'

  export let data
  export let level

  // Initialize full entry list
  let parsedEntryList = data.content

  // Cache sortBy in browser session storage
  if (sessionStorage.getItem('tmdict.chaldea.sortBy')) {
    sortBy.set(JSON.parse(sessionStorage.getItem('tmdict.chaldea.sortBy')))
  } else {
    sortBy.set({ id: 'weight', order: '▼' })
  }

  // Reset all filters to empty
  const resetAllFilter = () => {
    // Quick filter: can only select one at a time; Common filter: can select multiple at a time
    // { 
    //   filter1: { common: [ ... ], quick: '...' },
    //   filter2: { common: [ ... ], quick: '...' },
    //   ...
    // }
    filters.set(
      data.attribute.filter.reduce((acc, filter) => (
        { ...acc, [filter]: {
          'common': [],
          'quick': '' }
        }
      ), {})
    )
  }

  // Check if the given entry should be filtered out or not
  const isEntryFiltered = (entry) => {
    // Goes through each filter
    for (let [filterKey, filterBuckets] of Object.entries($filters)) {
      // If at least one of the filter buckets have filters in it
      if ((filterBuckets.quick !== '') || (filterBuckets.common.length !== 0)) {
        // If current entry has an attribute match for any of the two buckets
        if (entry[filterKey] && entry[filterKey].some(e => (filterBuckets.quick === e || filterBuckets.common.includes(e)))) {  
          continue // Has a match for current filter, move on to next filter
        } else {
          return false // Current filter has no match, short-circuit
        }
      }
    }
    // Either entry has a matching attribute for ALL selected filters, or none are selected
    return true
  }

  // Sort a given array `arr` by current sortBy state
  const sortByCurrentId = (arr) =>
    [...arr].sort((a, b) => {
      switch ($sortBy.id) {
        case 'name': {
          // Sorts by name in current language
          return $sortBy.order === '▲'
            ? a[$sortBy.id][$activeLang].localeCompare(b[$sortBy.id][$activeLang])
            : b[$sortBy.id][$activeLang].localeCompare(a[$sortBy.id][$activeLang])
        }
        case 'star': {
          // Content is in first element of the array
          return $sortBy.order === '▲'
            ? a[$sortBy.id][0].localeCompare(b[$sortBy.id][0])
            : b[$sortBy.id][0].localeCompare(a[$sortBy.id][0])
        }
        default:
          // Sort by value directly
          return $sortBy.order === '▲'
            ? a[$sortBy.id] - b[$sortBy.id]
            : b[$sortBy.id] - a[$sortBy.id]
      }
    })

  // Preprocess a list of filter values given filter keys and data to be filtered
  // Updated each time going to a different filterable page
  $: filterValues = data.attribute.filter.reduce(
    // For each filter id
    (acc, filter) => {
      const flattened = data.content.map(d => d[filter]).reduce((acc, cur) => acc.concat(cur))
      const deduped = [...new Set(flattened)]

      return ({
        ...acc, // data filter collected so far
        [filter]: deduped // Get distinct filter data for current filter id
    })},
    {} // Default empty {} for reducer
  )

  // Update filtered data by given filter (or return as-is) whenever global filter changes
  $: {
    $filters
    // Update current entry dataset based on new filters
    let filteredContent = data.content.filter(isEntryFiltered)
    // Sort new entry list
    parsedEntryList = sortByCurrentId(filteredContent)
  }

  // Re-sort data whenever sortBy state changes
  $: {
    $sortBy
    parsedEntryList = sortByCurrentId(parsedEntryList)
  }

  resetAllFilter()
</script>

<div id="container">
  <Top {level} />

  <div id="main">
    <div class="content no-break">
      <h1>{data.attribute.name[$activeLang]}</h1>

      <div class="filter-list">
        <List i18n={data.i18n} listType={data.attribute.type} entryList={parsedEntryList} {level} env={data.env} />

        <Filter i18n={data.i18n} {filterValues} on:filterReset={resetAllFilter} />
      </div>
    </div>
  </div>

  <Footer {level} />
</div>
