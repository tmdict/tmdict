<script>
  import Top from "$lib/components/Top.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { store } from "$lib/util/stores.svelte.js"
  import APP from "$lib/__generated/constants.json";
  import PAGES from "$lib/__generated/pages.json";
  import profileBanner from "$lib/img/banner_profile.png?enhanced";
  import glossaryBanner from "$lib/img/banner_glossary.png?enhanced";
  import tsukikan from "$lib/img/tsukikan.png?enhanced";
  import mhy from "$lib/img/mhy.png?enhanced";

  let { data } = $props();

  let parsed = $derived(PAGES.top.i18n[data.lang].html.replace(/(?:<[^>]*>|\n)+/g, " ").substring(1, 161));
  let metaDescription = $derived(
    (parsed.lastIndexOf(" ") !== -1) ? parsed.substring(0, parsed.lastIndexOf(" ")) : parsed
  );
</script>

<svelte:head>
  <title>型月辞典 | TMdict</title>
  <meta name="description" content={metaDescription} />
  <link rel="canonical" href="https://www.tmdict.com/{data.lang}/" />
  <style>
    ul {
      padding-left: 30px;
    }

    .frontpage li {
      margin-top: 10px;
    }
  </style>
</svelte:head>

<div class="content">
  <div>{@html PAGES.top.i18n[data.lang].html}</div>
</div>

<div class="content">
  <a href="/{data.lang}/glossary" aria-label="Glossary">
    <enhanced:img class="center img" src={glossaryBanner} alt="Glossary" />
  </a>

  <a href="/{data.lang}/profile/" aria-label="Profile">
    <enhanced:img class="center img" src={profileBanner} alt="Profile" />
  </a>
</div>

<div class="content">
  <h2>{APP.i18n.update[data.lang]}</h2>
  <div>{@html PAGES.updates.i18n[data.lang].html}</div>
</div>

<div class="content">
  <h2>{PAGES.collaborate.i18n[data.lang].name.name}</h2>
  <div>{@html PAGES.collaborate.i18n[data.lang].html}</div>
</div>

<div class="projects">
  <a class="project" href="https://tsukikan.com/" aria-label="Tsukikan">
    <enhanced:img class="center img" src={tsukikan} alt="Tsukikan" />
  </a>
  <a class="project" href="https://mhy.tmdict.com/" aria-label="mHY-notes">
    <enhanced:img class="center img" src={mhy} alt="mHY-notes" />
  </a>
</div>

<style>
  .center {
    margin: 15px auto;
  }

  .content .img {
    display: block;
  }

  .projects {
    display: flex;
    margin-bottom: 5px;
    justify-content: center;
    column-gap: 25px;
  }

  .project .img {
    border-radius: 4px;
    filter: grayscale(0.35);
    opacity: 0.9;
  }

  .project .img:hover {
    filter: none;
    opacity: 1;
  }
</style>
