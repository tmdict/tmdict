<script>
  import APP from '../../__tmp/data/constants.js';
  import { activeLang, activeLangTick } from '../stores.js';

  export let attribute;
  export let contentLang = $activeLang;

  // Update local contentLang when global activeLang changes
  $: {
    $activeLangTick;
    contentLang = $activeLang;
  }

  let currentImg = attribute.img[0];

  const updateImg = (img) => (currentImg = img);
</script>

{#if attribute.img.length > 0}
  <a href="https://img.tmdict.com/profile/{currentImg.src}"><img src="https://img.tmdict.com/profile/{currentImg.src}" id={currentImg.id} alt={currentImg.id} /></a>

  {#if attribute.img.length > 1}
    <ul>
      {#each attribute.img as img}
        <li class="image-list" class:active={img.id === currentImg.id}>
          <a class="image-link" href="https://img.tmdict.com/profile/{img.src}" on:mouseover={() => updateImg(img)} on:focus={() => updateImg(img)}>
            <span>{APP.i18n[img.id][contentLang]}</span>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
{/if}
