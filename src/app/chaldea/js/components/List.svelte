<script>
  import APP from '../../__tmp/data/constants.js'
  import { activeLang, sortBy } from '../stores.js'

  export let i18n
  export let listType
  export let entryList
  export let level
  export let env

  const ext = (env === 'production') ? '' : '.html'

  const getImgLink = (uid, type) => {
    const prefix = (type === 'profile') ? 'S' : ''
    return `${prefix}${uid.toString().padStart(4, '0')}icon.jpg`
  }

  const updateSortBy = sortHeader => {
    const updatedSortBy = {
      id: sortHeader,
      order: $sortBy.order === '▲' ? '▼' : '▲'
    }
    sortBy.set(updatedSortBy)
  }
</script>

<div class="list">
  <div class="header item {listType}">
    {#if listType === 'profile'}
      <div class="id" on:click={() => updateSortBy("uid")} on:keydown={() => updateSortBy("uid")}>
        {APP.i18n.id[$activeLang]}
        {$sortBy.id === "uid" ? ` ${$sortBy.order}` : ""}
      </div>
      <div class="name" on:click={() => updateSortBy("name")} on:keydown={() => updateSortBy("name")}>
        {APP.i18n.name[$activeLang]}
        {$sortBy.id === "name" ? ` ${$sortBy.order}` : ""}
      </div>
      <div class="star" on:click={() => updateSortBy("star")} on:keydown={() => updateSortBy("star")}>
        {APP.i18n.star[$activeLang]}
        {$sortBy.id === "star" ? ` ${$sortBy.order}` : ""}
      </div>
    {:else}
      <div class="name" on:click={() => updateSortBy("name")} on:keydown={() => updateSortBy("name")}>
        {APP.i18n.name[$activeLang]}
        {$sortBy.id === "name" ? ` ${$sortBy.order}` : ""}
      </div>
    {/if}
  </div>

  <ul>
    {#each entryList as entry, i}
      <li><a href="{level}{listType}/{entry.id}{ext}#{$activeLang}"><div class="item">
        {#if listType === 'profile'}
          <div class="icon"><img src="https://img.tmdict.com/{listType == 'profile' ? 'servant' : listType}/{getImgLink(entry.uid.split('.')[1], listType)}" alt="{entry.name[$activeLang]}" /></div>
          <div class="id">{entry.uid.split('.')[1]}</div>
          <div class="name">{entry.name[$activeLang]}</div>
          <div class="star">{i18n['star'][entry.star][$activeLang]}</div>
        {:else}
          <div class="name">{entry.name[$activeLang]}</div>
          <div class="info">
            {#each entry.work as work, i}
              {#if i > 0}, {/if}{i18n['work'][work][$activeLang]}
            {/each}
          </div>
        {/if}
      </div></a></li>
    {/each}
  </ul>
</div>
