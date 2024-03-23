<script>
  import APP from '../../__tmp/data/constants.js';
  import { activeLang, currentSource } from '../stores.js';

  export let entry;

  let contentLang = $activeLang;

  // Update local contentLang when global activeLang changes
  $: contentLang = $activeLang;

  const updateContentLang = (lang) => (contentLang = lang);
</script>

<div class="entry" id={`${entry.source}.${entry.parent}`} lang={contentLang}>
  <div class="entry-header group">
    <div class="entry-title">{entry.name[contentLang]}</div>
    <div class="permalink">
      <a href={`#${entry.source}.${entry.parent}`} title={entry.name[contentLang]}>#</a>
    </div>
  </div>

  <div class="entry-lang group">
    <a href={`https://github.com/tmdict/tmdict/blob/main/data/content/${entry.source}/${entry.parent}.${contentLang}.md`}>
      <img title="git" src={"src/img/edit.svg"} alt="git" />
    </a>{' ・ '}
    {#each Object.keys(APP.i18n.lang) as lang, i}
      {#if i !== 0}{' ・ '}{/if}<a class:active={contentLang === lang} on:click={() => updateContentLang(lang)} href="#{entry.source}">{APP.i18n.lang[lang]}</a>
    {/each}
  </div>

  <div class="entry-main group">
    {#if entry.i18n[contentLang].category.length > 0}
      <div class="entry-category">
          {entry.i18n[contentLang].category.map(c => c.name).join('/')}
      </div>
    {/if}
    <div class="entry-content">{@html entry.i18n[contentLang].html}</div>
    {#if entry.img}
      <div class="group">
        <div class="entry-image">
          <img title={entry.name[contentLang]} src={`src/img/glossary/${entry.img}`} alt={entry.img} />
        </div>
      </div>
    {/if}
  </div>
</div>
