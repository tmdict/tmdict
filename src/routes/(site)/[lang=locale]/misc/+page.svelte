<script>
  import PAGES from "$lib/__generated/pages.json";

  let { data } = $props();
</script>

<svelte:head>
  <title>{PAGES.misc.i18n[data.lang].name} | TMdict</title>
  <link rel="canonical" href="https://www.tmdict.com/{data.lang}/misc" />
</svelte:head>

<div class="content"><h1>{PAGES.misc.i18n[data.lang].name}</h1></div>
<div class="content">{@html PAGES.misc.i18n[data.lang].html}</div>
