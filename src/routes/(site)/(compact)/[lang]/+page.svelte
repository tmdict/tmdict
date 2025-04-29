<script>
  import Top from "$lib/components/Top.svelte";
  import Footer from "$lib/components/Footer.svelte";

  import { store } from "$lib/util/stores.svelte.js"
  import APP from "$lib/__generated/constants.json";
  import PAGES from "$lib/__generated/pages.json";
  import profileBanner from "$lib/img/banner_profile.png?enhanced";
  import glossaryBanner from "$lib/img/banner_glossary.png?enhanced";
</script>

<div class="content">
  <div>{@html PAGES.top.i18n[store.lang.value].html}</div>
</div>

<div class="content">
  <a href="/{store.lang.value}/profile/" aria-label="Profile">
    <enhanced:img class="center" src={profileBanner} alt="Profile" />
  </a>

  <a href="/{store.lang.value}/glossary" aria-label="Glossary">
    <enhanced:img class="center" src={glossaryBanner} alt="Glossary" />
  </a>
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
  img {
    display: block;
  }

  .center {
    margin: 15px auto;
  }
</style>
