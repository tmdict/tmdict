<script>
  import ToggleDark from "$lib/components/svg/Moon.svelte";
  import ToggleLight from "$lib/components/svg/Sun.svelte";
  import { browser } from '$app/environment';
  import { afterNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import { store } from "$lib/util/stores.svelte.js";
  import APP from "$lib/__generated/constants.json";
  import topImgBamboo from "$lib/img/top.png?enhanced";
  import topImgChaldea from "$lib/img/top2.png?enhanced";
  import topImgShadowBorder from "$lib/img/top3.png?enhanced";

  let { lang = "en" } = $props();
  let spin = $state(false);
  let topImg = $state(topImgBamboo);
  let path = $derived(page.url.pathname.replace(/^\/\w+/, "") + page.url.hash);

  afterNavigate(() => {
    topImage();
  });

  function topImage() {
    if (page.url.pathname.split("/").includes("profile")) {
      topImg = (store.theme === "chaldea") ? topImgChaldea : topImgShadowBorder;
    } else {
      topImg = topImgBamboo;
    }
  }

  function toggleDarkMode() {
    spinIcon(650);
    store.theme = store.theme === "chaldea" ? "shadowborder" : "chaldea";
    topImage();
  }

  function spinIcon(duration) {
    spin = true;
    setTimeout(() => (spin = false), duration);
  }
</script>

<div id="top"></div>

<div id="header">
  <a href="/{lang}/" aria-label="TMdict"><enhanced:img class="logo" src={topImg} title="TMdict" alt="TMdict" /></a>

  <div id="title">
    <div id="name">
      <a href="/"><span class="alt">TM</span>dict</a>
    </div>

    <div id="svg-icons">
      <div class="theme-toggle"
        class:spin-left={spin}
        role="button"
        tabindex="0"
        onclick={toggleDarkMode}
        onkeydown={toggleDarkMode}
      >
        {#if store.theme !== "chaldea"}
          <ToggleLight />
        {:else}
          <ToggleDark />
        {/if}
      </div>
    </div>
  </div>

  <div id="nav">
    <div id="menu">
      <a href="/{lang}/" class="first">{APP.i18n.index[lang]}</a>
      <a href="/{lang}/glossary">{APP.i18n.glossary[lang]}</a>
      <a href="/{lang}/profile/">{APP.i18n.profile[lang]}</a>
      <a href="/book/">{APP.i18n.book[lang]}</a>
    </div>

    <div id="language">
      {#each Object.keys(APP.lang) as appLang, i}
        <a href="/{APP.lang[appLang].id}{path}"
          class:first={i === 0}
          class:active={lang === APP.lang[appLang].id}>
            {APP.lang[appLang].name}
        </a>
      {/each}
    </div>
  </div>
</div>
<style>
  #top {
    background-image: url("$lib/img/style/bg_dark.gif");
    background-image: image-set(
      url("$lib/img/style/bg_dark.avif") type("image/avif"),
      url("$lib/img/style/bg_dark.gif") type("image/gif")
    );
    grid-column: col-start / col-end;
    grid-row: row-start / row-1;
  }

  #header {
    grid-column: col-1/col-2;
    grid-row: row-start/row-1;
    text-align: center;
    padding: 1em;
    color: var(--text-header);
  }

  #header .logo {
    border-radius: 10px;
    width: 100px;
    height: 100px;
    cursor: pointer;
  }

  #header .logo:hover { opacity: 0.9; }

  #title {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #name {
    margin: 0.4em 0 0.2em;
    font: bold 2rem Times;
    letter-spacing: 0.1rem;
  }
  
  #name a {
    text-decoration: none;
    color: var(--text-header);
  }

  #name a .alt { color: var(--primary-highlight); }
  #name a:hover { color: #ccc; }
  #name a:hover .alt { color: #777; }

  #svg-icons {
    position: absolute;
    left: 50%;
    transform: translateX(100%); /* Push it to the right of the center div */
    padding: 14px;
  }

  #svg-icons .theme-toggle:hover {
    cursor: pointer;
  }

  .spin-left {
    animation: spin 575ms cubic-bezier(0.075, 0.82, 0.17, 1.135);
  }

  @keyframes spin {
    0% {
      transform: scale(0) rotate(0deg);
    }
    100% {
      transform: scale(1) rotate(-720deg);
    }
  }

  #nav a {
    font: 0.8rem Arial, "Microsoft YaHei", Meiryo, sans-serif;
    text-decoration: none;
    padding: 0 0.2em;
    color: var(--text-header);
  }
  
  #nav a:before { 
    content: " | ";
    margin-right: 5px;
    color: var(--text-header);
  }

  #nav a.first::before { content: ""; }
  #nav a.active { color: #f7d87c; }
  #nav a:hover { color: var(--primary-highlight); }

  #menu {
    text-transform: uppercase;
  }

  #language {
    margin-top: 0.3em;
  }

  @media only screen and (max-width: 660px) {
    #top {
      display: none;
    }
    
    #header {
      grid-column: 1 / 2;
      grid-row: row-start / row-1;
    }

    #header a { font-size: 0.9rem; }
    #header #language a { font-size: 0.8rem; }
    #name a { font-size: 2rem; }
  }
</style>
