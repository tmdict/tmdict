<script>
  import PAGES from "$lib/__generated/pages.json";
  import { store } from "$lib/util/stores.svelte.js"
</script>

<div class="content">
  <h1>{PAGES.about.i18n[store.lang.value].name.name}</h1>
  <div class="content"></div>
  <div>{@html PAGES.about.i18n[store.lang.value].html}</div>
</div>
