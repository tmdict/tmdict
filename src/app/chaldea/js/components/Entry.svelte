<script>
  import Top from './Top.svelte'
  import Footer from './Footer.svelte'
  import Content from './Content.svelte'
  import EntryImgHover from './EntryImgHover.svelte'
  import EntryImgSwipe from './EntryImgSwipe.svelte'
  import Metadata from './Metadata.svelte'
  import Sidebar from './Sidebar.svelte'
  import Theme from './Theme.svelte'

  import APP from '../../__tmp/data/constants.js'
  import { activeLang, activeLangTick } from '../stores.js'

  export let attribute
  export let content

  let contentLang = $activeLang  
  let screenWidth

  // Update local contentLang when global activeLang changes
  $: {
    $activeLangTick
    contentLang = $activeLang
  }

  const updateLang = event => (contentLang = event.detail.lang)

  const getGitUrl = (entryId, entryType, contentLang, isDev = false) => {
    const dev = (isDev) ? 'dev' : 'com'
    const path = `fate-grand-order/${attribute.type}/${attribute.id}/attr`
    return `https://github.${dev}/tmdict/tmdict/tree/main/data/content/${path}`
  }
</script>

<svelte:head>
  <title>{attribute.attr.name[$activeLang]} | CHALDEAの記録</title>
  <link rel="canonical" href="https://www.chaldea.tmdict.com/{attribute.type}/{attribute.id}" />
</svelte:head>

<Theme level='../' />

<svelte:window bind:innerWidth={screenWidth} />

<div id="container">
  <Top level='../' />

  {#if screenWidth > 1220}
    <Sidebar {attribute} {content} />
  {/if}

  <div id="main">
    <h1 id="{contentLang}.{attribute.id}">{attribute.attr.name[$activeLang]}</h1>
      <div class="content top">

        <div class="image">
          {#if screenWidth > 520}
            <EntryImgHover {attribute} {contentLang} />
          {:else}
            <EntryImgSwipe {attribute} />
          {/if}
        </div>

        <div class="attribute">
          <Metadata
            language={Object.keys(attribute.layout)}
            gitUrl={getGitUrl(attribute.id, attribute.type, contentLang)}
            devUrl={getGitUrl(attribute.id, attribute.type, contentLang, true)}
            on:langUpdate={updateLang}
          />

          <div>
            <table>
              <tr><td>ID</td><td>{attribute.fgoId}</td></tr>
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
            {@html ('content' in attribute.attr && contentLang in attribute.attr.content) ? attribute.attr.content[contentLang] : ''}
          </div>
        </div>
      </div>

      <div class="top-break" />

      {#each content as section}
        {#if section.i18n[contentLang]}
          <Content entryType={attribute.type} entryId={attribute.id} data={section} />
        {/if}
      {/each}
  </div>

  <Footer level={"../"} name="{[$activeLang]}-{attribute.id}" />
</div>
