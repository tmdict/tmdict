<script>
  import page from 'page';

  import APP from '../../__tmp/data/constants.js';
  import { activeLang, activeLangTick, theme } from '../stores.js';

  export let level;

  const updateActiveLang = (lang) => {
    activeLangTick.update((n) => !n);
    activeLang.set(lang);
  };

  // Update browser local storage when theme toggle is updated
  const toggleDarkMode = () => {
    $theme == 'chaldea' ? theme.set('shadow-border') : theme.set('chaldea');
    localStorage.setItem('tmdict.chaldea.theme', $theme);
  };

  // Set route based on URL
  page('/*', (ctx) => {
    const hash = ctx.hash.match(/^([a-z]{2})($|\.)/);
    // Check if language in hash is valid
    if (hash !== null && Object.keys(APP.lang).includes(hash[1])) {
      updateActiveLang(hash[1]);
    }
  });
  // Start listening to change
  page({ click: false });
</script>

<div id="top"></div>
<div id="header">
  <span on:click={toggleDarkMode} on:keydown={toggleDarkMode} role="button" tabindex="0">
    {#if $theme === 'chaldea'}
      <img class="logo" src="{level}src/img/top.png" title="Chaldea" alt="Chaldea" />
    {:else}
      <img class="logo" src="{level}src/img/top_.png" title="Shadow Border" alt="Shadow Border" />
    {/if}
  </span>

  <div id="name">
    <a href="{level}#{$activeLang}">CHALDEA<span style="color: #777;">の</span><span class="alt">記録</span></a>
  </div>

  <div id="nav">
    <a href="{level}#{$activeLang}" class="first">HOME</a>
    <a href="{level}glossary/#{$activeLang}">GLOSSARY</a>
    <a href="{level}profile/#{$activeLang}">PROFILE</a>

    <div class="language">
      {#each Object.keys(APP.lang) as lang, i}
        <a
          href="#{APP.lang[lang].id}"
          class:first={i === 0}
          class:active={$activeLang === APP.lang[lang].id}>
            {APP.lang[lang].name}
        </a>
      {/each}
    </div>
  </div>
</div>
