<script>
  import APP from "$lib/__generated/constants.json";

  let { lang = "en" } = $props();
</script>

<div id="footer">
  <a href="/{lang}/about">{APP.i18n.about[lang]}</a> · 
  <a href="/{lang}/site">{APP.i18n.site[lang]}</a> · 
  <a href="/{lang}/misc">{APP.i18n.misc[lang]}</a> · 
  <a href="/legacy/{lang}/index.html">{APP.i18n.legacy[lang]}</a> · 
  <a href="/contact/">{APP.i18n.contact[lang]}</a>
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
