<script>
  import APP from "$lib/__generated/constants.json";

  let { attribute, contentLang } = $props();
  
  let currentImg = $state(attribute.img[0]);

  function updateImg(img) {
    currentImg = img;
  }
</script>

{#if attribute.img.length > 0}
  <a href="https://img.tmdict.com/profile/{currentImg.src}.png"><img src="https://img.tmdict.com/profile/{currentImg.src}.png" id={currentImg.id} alt={currentImg.id} /></a>

  {#if attribute.img.length > 1}
    <ul>
      {#each attribute.img as img}
        <li class="image-list" class:active={img.id === currentImg.id}>
          <a class="image-link" href="https://img.tmdict.com/profile/{img.src}.png" onmouseover={() => updateImg(img)} onfocus={() => updateImg(img)}>
            <span>{APP.i18n[img.id][contentLang]}</span>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
{/if}

<style>
  img {
    width: 256px;
    border: 1px solid #baaf81;
    outline: 2px solid #baaf81;
    outline-offset: 1px;
  }

  ul {
    list-style: none;
    padding: 0;
  }
  
  ul li {
    font-weight: 700;
    line-height: 1.4em;
    padding: 3px 5px;
    border-bottom: 1px dotted #aaa;
  }

  ul li:first-child {
    border-top: 1px dotted #aaa;
  }

  ul li a {
    display: block;
    font-size: 0.75rem;
  }

  @media only screen and (max-width: 660px) {
    img {
      width: 100%;
    }
  }
</style>