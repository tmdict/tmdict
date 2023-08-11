<script>
  import Metadata from './Metadata.svelte';
  import { activeLang, activeLangTick } from '../stores.js';

  export let entryType;
  export let entryId;
  export let data;

  let contentLang = $activeLang;

  // Update local contentLang when global activeLang changes
  $: {
    $activeLangTick;
    contentLang = $activeLang;
  }

  const updateLang = (event) => (contentLang = event.detail.lang);

  const getGitUrl = (source, entryId, entryType, contentId, contentLang, parent) => {
    const path = entryType === 'profile' ? `${source}/${entryId}/${contentId}` : `${source}/${entryId}`;
    return parent == 'chaldea-app' ? '#' : `https://github.com/tmdict/tmdict/blob/main/data/content/${path}`;
  };
</script>

<div class="content">
  {#if data.i18n[contentLang]}
    {#if data.i18n[contentLang].name.name}
      <h2 id="{contentLang}.{data.id}">
        {data.i18n[contentLang].name.name} <a href="#{$activeLang}.{data.id}">#</a>
      </h2>
    {/if}

    <Metadata
      language={Object.keys(data.i18n)}
      source={(data.i18n[contentLang]) ? data.i18n[contentLang].source.name : ''}
      translation={(data.i18n[contentLang]) ? data.i18n[contentLang].translation : ''}
      gitUrl={getGitUrl(data.source, entryId, entryType, data.id, contentLang, data.parent)}
      on:langUpdate={updateLang}
    />

    <div>{@html data.i18n[contentLang].html}</div>
  {/if}
</div>
