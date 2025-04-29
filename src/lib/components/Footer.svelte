<script>
  import { store } from "$lib/util/stores.svelte.js"
  import APP from "$lib/__generated/constants.json";
</script>

<div id="footer">
  <a href="/{store.lang.value}/about">{APP.i18n.about[store.lang.value]}</a> · 
  <a href="/{store.lang.value}/site">{APP.i18n.site[store.lang.value]}</a> · 
  <a href="/{store.lang.value}/misc">{APP.i18n.misc[store.lang.value]}</a> · 
  <a href="/legacy/{store.lang.value}/index.html">{APP.i18n.legacy[store.lang.value]}</a> · 
  <a href="/contact/">{APP.i18n.contact[store.lang.value]}</a>
</div>

<style>
  #footer {
    grid-column: col-1 / col-2;
    grid-row: row-2 / row-end;
    font: 0.85rem Verdana, Arial, "Microsoft YaHei", Meiryo, sans-serif;
    text-align: center;
    margin: 10px 0 25px;
    color: var(--text-light);
  }

  a {
    text-decoration: none;
    color: #639db9;
  }

  a:hover {
    color: #f7d87c;
  }

  @media only screen and (max-width: 660px) {
      #footer {
      grid-column: 1 / 2;
      grid-row: row-2 / row-end;
    }
  }
</style>
