<script>
  import { store } from "$lib/util/stores.svelte.js"
  import hashes from "$lib/__generated/hashes.json";
</script>

<svelte:head>
  {#if store.theme === "shadowborder"}
    <link rel="stylesheet" type="text/css" href="/__generated/css/{hashes.shadowborder}.css" />
  {:else}
    <link rel="stylesheet" type="text/css" href="/__generated/css/{hashes.chaldea}.css" />
  {/if}

  <style>
    #container {
      display: grid;
      grid-template-columns: [col-start] auto [col-1] 840px [col-2] auto [col-end];
      grid-template-rows: [row-start] 345px [row-1] auto [row-2] auto [row-end];
    }
    @media only screen and (max-width: 840px) {
      #container { grid-template-columns: [col-start] auto [col-1] 720px [col-2] auto [col-end]; }
    }
    @media only screen and (max-width: 660px) {
      #container {
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: [row-start] 345px [row-1] auto [row-2] auto [row-end];
      }
    }
  </style>
</svelte:head>
