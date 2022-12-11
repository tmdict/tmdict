<script>
  import { theme } from '../stores.js';

  export let level;
</script>

<svelte:head>
  {#if $theme === 'shadow-border'}
    <link rel="stylesheet" type="text/css" href="{level}src/css/shadow-border.css" />
  {:else}
    <link rel="stylesheet" type="text/css" href="{level}src/css/chaldea.css" />
  {/if}
</svelte:head>
