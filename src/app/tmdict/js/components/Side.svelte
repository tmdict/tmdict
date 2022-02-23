<script>
  import APP from '../../__tmp/data/constants.js'
  import { navLang, navIndex, filterSrc } from '../stores.js'

  export let lang
  export let i18n

  const getSources = () => {
    return Object.keys(i18n.source).map(id => {
      return {
        id: id,
        name: i18n.source[id][lang]
      }
    }).sort((a, b) => a.name.localeCompare(b.name))
  }
</script>

<div class="side">
  <div class="side-content">
    {#if $navLang}
      <h2><span class="first-char">s</span>ource</h2>
      <ul>
        <li class:active={$filterSrc === ''}><a href="#{($navLang !== '') ? `?nav=${$navLang}` : ''}{($navIndex !== '') ? `.${$navIndex}` : ''}">
          <div class="entry group">
            <div class={`entry-source`}>all</div>
          </div>
        </a></li>
        {#each getSources() as src}
          <li class:active={$filterSrc === src.id}><a href="#{($navLang !== '') ? `?nav=${$navLang}` : ''}{($navIndex !== '') ? `.${$navIndex}` : ''}&src={src.id}">
            <div class="entry group">
              <div class={`entry-source`}>{src.name}</div>
            </div>
          </a></li>
        {/each}
      </ul>
    {:else}
      <h2><span class="first-char">H</span>ome</h2>
      {@html APP.i18n.side[lang].top}
      {@html APP.i18n.side[lang].contribute}
      {@html APP.i18n.side[lang].project}
    {/if}
    <div class="side-menu">
      <div class="menu-arrow"><a title="{APP.i18n.return[lang]}" href="../{lang}/">«</a></div>
    </div>
  </div>
</div>
