<script>
  import emblaCarouselSvelte from 'embla-carousel-svelte'
  import hashes from "$lib/__generated/hashes.json";

  let { attribute } = $props();

  function getImage(entryImg, format) {
    const group = attribute.uid.split(":")[1] === "fgosvt" ? entryImg[2] : entryImg[0];
    return `https://img${group}.tmdict.com/profile/${format}/${entryImg}.${format}`;
  }
</script>

<div class="embla" use:emblaCarouselSvelte="{{ loop: false }}">
  <div class="embla__container">
      {#each attribute.img as img}
      <div class="embla__slide">
        <a href={getImage(img.src, "jpg")}>
          <picture>
            <source srcset={getImage(img.src, "avif")} type="image/avif" />
            <img src={getImage(img.src, "jpg")} id={img.id} alt={img.id} />
          </picture>
        </a>
      </div>
      {/each}
    </div>
  </div>

<style>
  img {
    width: 256px;
    border: 1px solid #baaf81;
    outline: 2px solid #baaf81;
    outline-offset: 1px;
  }

  .embla {
    overflow: hidden;
  }

  .embla__container {
    display: flex;
  }

  .embla__slide {
    flex: 0 0 100%;
    min-width: 0;
  }

  @media only screen and (max-width: 660px) {
    img {
      width: 100%;
    }
  }
</style>
