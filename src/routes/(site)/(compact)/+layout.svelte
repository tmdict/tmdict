<script>
  import hashes from "$lib/__generated/hashes.json";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="stylesheet" type="text/css" href="/__generated/css/{hashes["overrides/compact"]}.css" />
</svelte:head>

{@render children()}
