<script>
  import APP from "$lib/__generated/constants.json";

  let { attribute, contentLang } = $props();
  
  let currentImg = $state(attribute.img[0]);

  function updateImg(img) {
    currentImg = img;
  }

  function getImage(entryImg, format) {
    const group = attribute.uid.split(":")[1] === "fgosvt" ? entryImg[2] : entryImg[0];
    return `https://img${group}.tmdict.com/profile/${format}/${entryImg}.${format}`;
  }
</script>

{#if attribute.img.length > 0}
  <a href={getImage(currentImg.src, "jpg")}>
    <picture>
      <source srcset={getImage(currentImg.src, "avif")} type="image/avif" />
      <img src={getImage(currentImg.src, "jpg")} id={currentImg.id} alt={currentImg.id} />
    </picture>
  </a>
  {#if attribute.img.length > 1}
    <ul>
      {#each attribute.img as img}
        <li class="image-list" class:active={img.id === currentImg.id}>
          <a class="image-link" href={getImage(img.src, "jpg")} onmouseover={() => updateImg(img)} onfocus={() => updateImg(img)}>
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

  ul li.active,
  ul li:hover {
    background: var(--bg-row-grey-light);
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