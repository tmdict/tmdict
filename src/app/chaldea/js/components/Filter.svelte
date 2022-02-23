<script>
  import APP from '../../__tmp/data/constants.js'
  import { createEventDispatcher } from 'svelte'
  import { activeLang, filters } from '../stores.js'

  export let i18n
  export let filterValues

  // Reset current filter to empty
  const resetCurrentFilter = (fk) => {
    let updatedFilters = $filters
    updatedFilters[fk].common = []
    updatedFilters[fk].quick = ''
    filters.set(updatedFilters)
  }

  // Update global filter state on click
  const updateCommonFilterState = (fk, fv) => {
    let updatedFilters = $filters
    // Update contents of filter kv buckets
    updatedFilters[fk].common = updatedFilters[fk].common.includes(fv)
      ? updatedFilters[fk].common.filter(e => e !== fv) // Remove
      : [...updatedFilters[fk].common, fv] // Add
    filters.set(updatedFilters)
  }

  // Update global quick filter state on click
  const updateQuickFilterState = (fk, fv) => {
    let updatedFilters = $filters
    // Update contents of filter kv buckets
    updatedFilters[fk].quick = fv
    filters.set(updatedFilters)
  }

  const dispatch = createEventDispatcher()
  const resetFilters = () => dispatch('filterReset', {})
</script>

<div class="filter">
  {#each Object.keys(filterValues) as filterKey (filterKey)}
    <h6>{APP.i18n[filterKey][$activeLang]}</h6>
    <ul>
      <li><a href="#{$activeLang}" on:click={() => resetCurrentFilter(filterKey)}>all</a></li>
      {#each filterValues[filterKey].sort() as filterValue (filterValue)}
      {#if i18n[filterKey][filterValue]}
        <li>
          <div class="quick" class:active={filterValue === $filters[filterKey].quick}>
            <a href="#{$activeLang}" on:click={() => updateQuickFilterState(filterKey, filterValue)}>
              {i18n[filterKey][filterValue][$activeLang]}
            </a>
          </div>
          <div class="common" class:active={$filters[filterKey].common.includes(filterValue)}>
            <a href="#{$activeLang}" on:click={() => updateCommonFilterState(filterKey, filterValue)}>&nbsp;</a>
          </div>
        </li>
      {/if}
      {/each}
      <li><a href="#{$activeLang}" on:click={resetFilters}>reset all</a></li>
    </ul>
  {/each}
</div>
