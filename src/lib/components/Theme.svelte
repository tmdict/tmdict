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
</svelte:head>
