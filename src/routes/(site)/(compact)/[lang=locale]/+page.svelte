<script>
  import Top from "$lib/components/Top.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { store } from "$lib/util/stores.svelte.js"
  import APP from "$lib/__generated/constants.json";
  import PAGES from "$lib/__generated/pages.json";
  import profileBanner from "$lib/img/banner_profile.png?enhanced";
  import glossaryBanner from "$lib/img/banner_glossary.png?enhanced";
  import afkj from "$lib/img/banner_afkj.png?enhanced";
  import mhy from "$lib/img/banner_mhy.png?enhanced";
  import tsukikan from "$lib/img/banner_tsukikan.png?enhanced";

  let { data } = $props();

  const parsed = $derived(PAGES.top.i18n[data.lang].html.replace(/(?:<[^>]*>|\n)+/g, " ").substring(1, 161));
  const metaDescription = $derived((parsed.lastIndexOf(" ") !== -1) ? parsed.substring(0, parsed.lastIndexOf(" ")) : parsed);
</script>

<svelte:head>
  <title>型月辞典 | TMdict</title>
  <meta name="description" content={metaDescription} />
  <link rel="canonical" href="https://www.tmdict.com/{data.lang}/" />
  <style>
    ul { padding-left: 30px; }
    .frontpage li { margin-top: 10px; }
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
  <div class="past">- <a href="/{data.lang}/site">{APP.i18n.pastupdates[data.lang]}</a> -</div>
</div>

<div class="content">
  <h2>{PAGES.collaborate.i18n[data.lang].name}</h2>
  <div>{@html PAGES.collaborate.i18n[data.lang].html}</div>
</div>

<a class="project" href="https://stargazer.tmdict.com/" aria-label="Stargazer">
  <enhanced:img class="center img" src={afkj} title="Stargazer" alt="Stargazer" />
</a>
<a class="project" href="https://mhy.tmdict.com/" aria-label="mHY一图流">
  <enhanced:img class="center img" src={mhy} title="mHY一图流" alt="mHY一图流" />
</a>
<a class="project" href="https://tsukikan.com/" aria-label="Tsukikan">
  <enhanced:img class="center img" src={tsukikan} title="Tsuki-kan" alt="Tsuki-kan" />
</a>

<style>
  .center {
    margin: 15px auto;
  }

  .content .img {
    display: block;
  }

  .project .img {
    display: block;
    border-radius: 3px;
    filter: grayscale(0.25);
    opacity: 0.9;
    margin-top: 25px;
  }

  .project .img:hover {
    filter: none;
    opacity: 1;
  }

  .past {
    text-align: center;
  }

  .past a {
    text-decoration: none;
  }
</style>
