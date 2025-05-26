// Filterlist
let _filterlist = $state({});

export const filterlist = {
  get: (filterType) => { return _filterlist[filterType]; },
  getFilters: () => { return Object.keys(_filterlist); },
  // Given a list of keys, create an empty filter for each key
  init: (filterKeys) => {
    _filterlist = filterKeys.reduce(
      (acc, filterName) => ({
        [filterName]: { common: [], quick: "" },
        ...acc
      }),
      {}
    )
  },
  // Only one quick filter can be selected at a time
  updateQuickFilter: (filterType, filterValue) => {
    _filterlist[filterType].quick = filterValue;
  },
  // Multiple common filters can be selected at the same time
  updateCommonFilter: (filterType, filterValue) => {
    _filterlist[filterType].common = _filterlist[filterType].common.includes(filterValue)
      ? _filterlist[filterType].common.filter((e) => e !== filterValue) // Remove
      : [..._filterlist[filterType].common, filterValue]; // Add
  },
  // Reset content of a filter given its type
  resetByType: (filterType) => {
    _filterlist[filterType].common = [];
    _filterlist[filterType].quick = "";
  },
  // Reset all filter types
  reset: () => {
    // Iterate over each filter type and reset their content
    Object.keys(_filterlist).forEach((filterType) => {
      _filterlist[filterType].common = [];
      _filterlist[filterType].quick = "";
    })
  },
  filterList: (arr) => {
    return arr.filter((item) => {
      for (const [filterKey, filterValue] of Object.entries(_filterlist)) {
        // If at least one filter is set
        if (filterValue.quick !== "" || filterValue.common.length !== 0) {
          // If current item has a tag that matches the filter
          if (
            item[filterKey] &&
            item[filterKey].some((el) => filterValue.quick === el || filterValue.common.includes(el))
          ) {
            continue; // Has a match for current filter, move on to next filter type
          } else {
            return false; // No match, short-circuit to next filter type
          }
        }
      }
      // Either there is a matching tag for ALL selected filters, or no filter selected
      return true;
    });
  }
};
