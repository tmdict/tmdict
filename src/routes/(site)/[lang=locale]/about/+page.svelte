<script>
  import PAGES from "$lib/__generated/pages.json";

  let { data } = $props();
</script>

<svelte:head>
  <title>{PAGES.about.i18n[data.lang].name} | TMdict</title>
  <link rel="canonical" href="https://www.tmdict.com/{data.lang}/about" />
</svelte:head>

<div class="content"><h1>{PAGES.about.i18n[data.lang].name}</h1></div>
<div class="content">{@html PAGES.about.i18n[data.lang].html}</div>
