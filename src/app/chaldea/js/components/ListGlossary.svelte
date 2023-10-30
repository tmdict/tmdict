<script>
  import { slide } from 'svelte/transition';
  import APP from '../../__tmp/data/constants.js';
  import { activeLang } from '../stores.js';

  export let i18n;
  export let entry;
  export let level;
  export let env;
  export let showDetail = false;

  const ext = env === 'production' ? '' : '.html';

  function toggleDetails() {
    showDetail = !showDetail;
  }
</script>

<li>
  <div class="item">
    <div class="item-header" on:click={toggleDetails} on:keydown={toggleDetails} role="button" tabindex="0">
      <div class="name">{@html entry.name[$activeLang]}</div>
      <div class="info">
        {#each entry.work as work, i}
          {#if i > 0}, {/if}{i18n['work'][work][$activeLang]}
        {/each}
      </div>
      <div class="link"><a href="{level}glossary/{entry.id}{ext}#{$activeLang}">
        <div class="link-content">#</div>
      </a></div>
    </div>
    {#if showDetail}
      <div transition:slide={{ duration: 200 }} class="item-content">
        <a href="{level}glossary/{entry.id}{ext}#{$activeLang}">
          {#each entry.content as content, j}
            <div class="source"><h2>{content[$activeLang].id}</h2></div>
            <p>{@html content[$activeLang].html}</p>
          {/each}
        </a>
      </div>
    {/if}
  </div>
</li>
