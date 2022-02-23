<script>
  import APP from '../../__tmp/data/constants.js'
  import { activeLang, sortBy } from '../stores.js'

  export let i18n
  export let listType
  export let entryList
  export let level
  export let env

  const ext = (env === 'production') ? '' : '.html'

  const getImgLink = (fgoId, type) => {
    const prefix = (type === 'servant') ? 'S' : 'C'
    return `${prefix}${fgoId.toString().padStart(4, '0')}icon.jpg`
  }

  const updateSortBy = sortHeader => {
    const updatedSortBy = {
      id: sortHeader,
      order: $sortBy.order === '▲' ? '▼' : '▲'
    }
    sortBy.set(updatedSortBy)
    sessionStorage.setItem('tmdict.chaldea.sortBy', JSON.stringify(updatedSortBy))
  }
</script>

<div class="list">
  <div class="header item">
    <div class="id" on:click={() => updateSortBy("fgoId")}>
      {APP.i18n.id[$activeLang]}
      {$sortBy.id === "fgoId" ? ` ${$sortBy.order}` : ""}
    </div>
    <div class="name" on:click={() => updateSortBy("name")}>
      {APP.i18n.name[$activeLang]}
      {$sortBy.id === "name" ? ` ${$sortBy.order}` : ""}
    </div>
    <div class="star" on:click={() => updateSortBy("star")}>
      {APP.i18n.star[$activeLang]}
      {$sortBy.id === "star" ? ` ${$sortBy.order}` : ""}
    </div>
  </div>

  <ul>
    {#each entryList as entry, i}
      <li><a href="{level}{listType}/{entry.id}{ext}#{$activeLang}"><div class="item">
        <div class="icon"><img src="https://img.tmdict.com/{listType}/{getImgLink(entry.fgoId, listType)}" alt="{entry.name[$activeLang]}" /></div>
        <div class="id">{entry.fgoId}</div>
        <div class="name">{entry.name[$activeLang]}</div>
        <div class="star">{i18n['star'][entry.star][$activeLang]}</div>
      </div></a></li>
    {/each}
  </ul>
</div>
