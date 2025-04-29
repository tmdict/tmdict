<script>
  import emblaCarouselSvelte from 'embla-carousel-svelte'
  import hashes from "$lib/__generated/hashes.json";

  let { attribute } = $props();
</script>

<div class="embla" use:emblaCarouselSvelte="{{ loop: false }}">
  <div class="embla__container">
      {#each attribute.img as img}
      <div class="embla__slide">
        <a href="https://img.tmdict.com/profile/{img.src}.png">
          <img src="https://img.tmdict.com/profile/{img.src}.png" id={img.id} alt={img.id} />
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
