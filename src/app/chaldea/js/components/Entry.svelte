<script>
  import Top from './Top.svelte';
  import Footer from './Footer.svelte';
  import Content from './Content.svelte';
  import EntryImgHover from './EntryImgHover.svelte';
  import EntryImgSwipe from './EntryImgSwipe.svelte';
  import Metadata from './Metadata.svelte';
  import Sidebar from './Sidebar.svelte';
  import Theme from './Theme.svelte';

  import APP from '../../__tmp/data/constants.js';
  import { activeLang, activeLangTick } from '../stores.js';

  export let attribute;
  export let content;

  let contentLang = $activeLang;
  let screenWidth;

  // Update local contentLang when global activeLang changes
  $: {
    $activeLangTick;
    contentLang = $activeLang;
  }

  const updateLang = (event) => (contentLang = event.detail.lang);
</script>

<svelte:head>
  <title>{attribute.attr.name[$activeLang]} | CHALDEAの記録</title>
  <link rel="canonical" href="https://chaldea.tmdict.com/{attribute.type}/{attribute.id}" />
</svelte:head>

<Theme level='../' />

<svelte:window bind:innerWidth={screenWidth} />

<div id="container" lang={$activeLang}>
  <Top level='../' />

  {#if screenWidth > 1220}
    <Sidebar {attribute} {content} />
  {/if}

  <div id="main">
    <h1 id="{contentLang}.{attribute.id}">{attribute.attr.name[$activeLang]}</h1>
      {#if attribute.type === 'profile' && attribute.layout[Object.keys(attribute.layout)[0]].length > 0}
        <div class="content top">
          <div class="image">
            {#if screenWidth > 520}
              <EntryImgHover {attribute} {contentLang} />
            {:else}
              <EntryImgSwipe {attribute} />
            {/if}
          </div>

          <div class="attribute">
            <Metadata language={Object.keys(attribute.layout)} on:langUpdate={updateLang} />

            <div>
              <table>
                {#if attribute.uid.split(":")[1] === "fgosvt"} 
                  <tr><td>ID</td><td>{attribute.uid.split(':')[0]}</td></tr>
                {/if}
                {#each attribute.layout[contentLang] as section, i}
                  {#each Object.keys(section) as attr, j}
                    <tr class:break={i !== 0 && j === 0}>
                      <td>{APP.i18n[attr][contentLang]}</td>
                      {#if ['origin', 'region'].includes(attr)}
                        <td>{@html section[attr].join(' · ')}</td>
                      {:else}
                        <td>{@html section[attr].join(', ')}</td>
                      {/if}
                    </tr>
                  {/each}
                {/each}
              </table>
            </div>
          </div>
        </div>
      {/if}

      <div class="top-break" />

      {#each content as section}
        {#if section.i18n[contentLang]}
          <Content entryType={attribute.type} entryId={attribute.id} data={section} />
        {/if}
      {/each}
  </div>

  <Footer level={"../"} name="{[$activeLang]}-{attribute.id}" />
</div>
