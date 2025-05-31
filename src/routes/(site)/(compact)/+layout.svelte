<script>
  import hashes from "$lib/__generated/hashes.json";

  let { children } = $props();
</script>

<svelte:head>
  <style>
    #container { grid-template-columns: [col-start] auto [col-1] 400px [col-2] auto [col-end]; }
    @media only screen and (max-width: 660px) {
      #container { grid-template-columns: auto; }
    }
  </style>
</svelte:head>

{@render children()}
