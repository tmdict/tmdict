<script>
  import PAGES from "$lib/__generated/pages.json";

  let { data } = $props();
</script>

<svelte:head>
  <title>{PAGES.site.i18n[data.lang].name.name} | TMdict</title>
  <link rel="canonical" href="https://www.tmdict.com/{data.lang}/site" />
</svelte:head>

<div class="content"><h1>{PAGES.site.i18n[data.lang].name.name}</h1></div>
<div class="content">{@html PAGES.site.i18n[data.lang].html}</div>
