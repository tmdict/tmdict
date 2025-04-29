<script>
  import { store } from "$lib/util/stores.svelte.js"
  import APP from "$lib/__generated/constants.json";

  let { 
    data,
    language = [],
    gitUrl = "#",
    updateContentLang
  } = $props();

  let contentLang = $derived(store.lang.value);

  function updateLang(lang) {
    contentLang = lang;
    updateContentLang(lang);
  };
</script>

<div class="metadata">
  {#if data.i18n && data.i18n[contentLang] && data.i18n[contentLang].source}
    <div class="source">
      {APP.i18n.source[contentLang]}: {data.i18n[contentLang].source.name} · {data.i18n[contentLang].name.name}
    </div>
  {/if}
  {#if data.i18n && data.i18n[contentLang] && data.i18n[contentLang].category.length > 0}
    <div class="category">
      {APP.i18n.category[contentLang]}: 
      {#each data.i18n[contentLang].category as cat, i}
      {#if i > 0},{/if} {cat.name}
      {/each}
    </div>
  {/if}
  {#if data.i18n && data.i18n[contentLang] && data.i18n[contentLang].translation}
    <div class="translation">
      {APP.i18n.translation[contentLang]}: {data.i18n[contentLang].translation}
    </div>
  {/if}
  <div class="language">
    {#each language as lang}
      [ <span class="select"
          role="button"
          tabindex="0"
          onclick={() => updateLang(lang)}
          onkeydown={() => updateLang(lang)}
        >
          {APP.lang[lang].name}
        </span> ]{" "}
    {/each}
    {#if gitUrl != "#"}
      [ <span class="git"><a href={`${gitUrl}.${contentLang}.md`}>GIT</a></span> ]
    {/if}
  </div>
</div>

<style>
  .metadata {
    font-size: 0.85rem;
    margin-bottom: 1em;
    line-height: 1.5em;
  }

  .language {
    margin-top: 8px;
    font-size: 0.85rem;
  }

  .language .select:hover {
    cursor: pointer;
  }
</style>