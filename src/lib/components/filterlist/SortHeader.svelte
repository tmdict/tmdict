<script>
  import { store } from "$lib/util/stores.svelte.js"
  import APP from "$lib/__generated/constants.json";

  let {
    headerId,
    i18n,
    margin = 0,
    sortBy,
    sortOrder,
    style,
    updateSortBy,
    width = 70
  } = $props();

  function updateSort(id) {
    updateSortBy(id);
  }
</script>

<div {style}
  style:width="{width}px"
  style:margin-left="{margin}px"
  role="button"
  tabindex="0"
  onclick={() => updateSort(headerId)}
  onkeydown={() => updateSort(headerId)}
>
  {APP.i18n[headerId][store.lang.value]}
  {sortBy === headerId ? ` ${sortOrder ? "▲" : "▼"}` : ""}
</div>
