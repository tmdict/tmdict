<script>
  import Top from "$lib/components/Top.svelte";
  import Footer from "$lib/components/Footer.svelte";

  import { store } from "$lib/util/stores.svelte.js"
  import APP from "$lib/__generated/constants.json";
  import PAGES from "$lib/__generated/pages.json";
  import profileBanner from "$lib/img/banner_profile.png?enhanced";
  import glossaryBanner from "$lib/img/banner_glossary.png?enhanced";
</script>

<svelte:head>
  <title>型月辞典 | TMdict</title>
  <link rel="canonical" href="https://www.tmdict.com/{store.lang.value}/" />
</svelte:head>

<div class="content">
  <div>{@html PAGES.top.i18n[store.lang.value].html}</div>
</div>

<div class="content frontpage">
  <a href="/{store.lang.value}/profile/" aria-label="Profile">
    <enhanced:img class="center" src={profileBanner} alt="Profile" />
  </a>

  <a href="/{store.lang.value}/glossary" aria-label="Glossary">
    <enhanced:img class="center" src={glossaryBanner} alt="Glossary" />
  </a>
</div>

<div class="content frontpage">
  <h2>{APP.i18n.update[store.lang.value]}</h2>
  <div>{@html PAGES.updates.i18n[store.lang.value].html}</div>
</div>

<div class="content">
  <h2>{PAGES.collaborate.i18n[store.lang.value].name.name}</h2>
  <div>{@html PAGES.collaborate.i18n[store.lang.value].html}</div>
</div>

<div class="content">
  <h2>{PAGES.usage.i18n[store.lang.value].name.name}</h2>
  <div>{@html PAGES.usage.i18n[store.lang.value].html}</div>
</div>

<style>
  .center {
    margin: 15px auto;
  }

  :global(.frontpage img) {
    display: block;
  }

  :global(.frontpage ul) {
    padding-left: 30px;
  }

  :global(.frontpage li) {
    margin-top: 10px;
  }
</style>
