<script>
  import APP from '../../__tmp/data/constants.js';
  import ListGlossary from './ListGlossary.svelte';
  import { activeLang, sortBy } from '../stores.js';

  export let i18n;
  export let listType;
  export let entryList;
  export let level;
  export let env;
  let expandAll = false;

  const ext = env === 'production' ? '' : '.html';

  const updateSortBy = (sortHeader) => {
    const updatedSortBy = {
      id: sortHeader,
      order: $sortBy.order === '▲' ? '▼' : '▲',
    };
    sortBy.set(updatedSortBy);
  };

  const getImgSrc = (uid) => {
    let img = '';
    const parsedUid = uid.split(':');
    switch (parsedUid[parsedUid.length - 1]) {
      case 'fgosvt': {
        img = `S${parsedUid[0].toString().padStart(4, '0')}.jpg`;
        break;
      }
      case 'default': {
        img = '0000.jpg';
        break;
      }
      default: {
        img = `${parsedUid[0]}.jpg`;
        break;
      }
    }
    return img;
  };
</script>

<div class="list">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
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
      <div class="expand-all" on:click={() => (expandAll = !expandAll)} on:keydown={() => (expandAll = !expandAll)}>
        {expandAll ? `${APP.i18n.expand[$activeLang]} -` : `${APP.i18n.expand[$activeLang]} +`}
        {$sortBy.id === "name" ? ` ${$sortBy.order}` : ""}
      </div>
    {/if}
  </div>

  <ul>
    {#if entryList.length > 0}
      {#each entryList as entry, i (entry.id)}
        {#if listType === 'profile'}
          <li><a href="{level}{listType}/{entry.id}{ext}#{$activeLang}">
            <div class="item">
              <div class="icon">
                <img src="{level}src/img/profile/icon/{getImgSrc(entry.uid)}" alt="{entry.name[$activeLang]}" />
              </div>
              <div class="id">{(entry.uid.split(":")[1] === "fgosvt") ? entry.uid.split(':')[0] : '-'}</div>
              <div class="name">{entry.name[$activeLang]}</div>
              <div class="star">{i18n['star'][entry.star][$activeLang]}</div>
            </div>
          </a></li>
        {:else}
          <ListGlossary {entry} {i18n} {level} {env} showDetail={expandAll} />
        {/if}
      {/each}
    {:else}
      <li><div class="item"><div class="name">No Results</div></div></li>
    {/if}
  </ul>
</div>
