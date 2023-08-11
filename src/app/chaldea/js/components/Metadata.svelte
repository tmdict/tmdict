<script>
  import APP from '../../__tmp/data/constants.js';
  import { createEventDispatcher } from 'svelte';
  import { activeLang, activeLangTick } from '../stores.js';

  export let source = '';
  export let translation = '';
  export let language = [];
  export let gitUrl = '#';

  let contentLang = $activeLang;

  // Update local contentLang when global activeLang changes
  $: {
    $activeLangTick;
    contentLang = $activeLang;
  }

  const dispatch = createEventDispatcher();

  const updateLang = (lang) => {
    contentLang = lang;
    dispatch('langUpdate', {
      lang: lang,
    });
  };
</script>

<div class="metadata">
  {#if source}
    <div class="source">{APP.i18n.source[contentLang]}: {source}</div>
  {/if}
  {#if translation}
    <div class="translation">{APP.i18n.translation[contentLang]}: {translation}</div>
  {/if}
  <div class="language">
    {#each language as lang}
      [ <a href="#{lang}" on:click|preventDefault={() => updateLang(lang)}>{APP.lang[lang].name}</a> ]{" "}
    {/each}
    {#if gitUrl != '#'}
      [ <span class="git"><a href={`${gitUrl}.${contentLang}.md`}>GIT</a></span> ]
    {/if}
  </div>
</div>
