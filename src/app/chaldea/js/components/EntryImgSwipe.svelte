<script>
  import Swiper from 'tiny-swiper';
  import SwiperPluginPagination from 'tiny-swiper/lib/modules/pagination.min.js';
  import { afterUpdate } from 'svelte';

  export let attribute;

  afterUpdate(() => {
    // https://github.com/joe223/tiny-swiper/
    const swiper = new Swiper('.swiper-container', {
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      plugins: [SwiperPluginPagination],
    });
  });
</script>

<svelte:head>
  <style type="text/css">
    .swiper-pagination-bullet {
      margin: 0 1px 4px;
      background: #777;
      opacity: 0.5;
    }
    .swiper-pagination-bullet-active {
      background: #007aff;
      opacity: 1;
    }
  </style>
</svelte:head>

<div class="swiper-container">
  <div class="swiper-wrapper">
    {#each attribute.img as img}
      <div class="swiper-slide"><a href="https://img.tmdict.com/profile/{img.src}"><img src="https://img.tmdict.com/profile/{img.src}" id={img.id} alt={img.id} /></a></div>
    {/each}
  </div>
  <div class="swiper-pagination"></div>
</div>

<style>
  .swiper-container {
    width: 340px;
  }

  .swiper-container img {
    outline: 0;
  }

  .swiper-pagination {
    position: relative;
  }
</style>
