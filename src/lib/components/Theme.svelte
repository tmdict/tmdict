<script>
  import { store } from "$lib/util/stores.svelte.js"
  import hashes from "$lib/__generated/hashes.json";
</script>

<svelte:head>
  <link rel="stylesheet" type="text/css" href="/__generated/css/{hashes["vendors/normalize"]}.css" />
  <link rel="stylesheet" type="text/css" href="/__generated/css/{hashes["global"]}.css" />

  {#if store.theme === "shadowborder"}
    <style>
      :root {
        --primary-link: #72a6c0;
        --primary-link-highlight: #f7d87c;
        --primary-highlight: #c05b4d;
        --primary-heading: #f7d87c;
        --secondary-heading: #c05b4d;
        --secondary-highlight: #f7d87c;
        --bg-main: #121621;
        --bg-body: #000;
        --bg-row-grey-light: #2b2c3e;
        --bg-row-grey-dark: #1d1d29;
        --text-header: #eee;
        --text-light: #aaa;
        --text-medium: #bfbfbf;
        --text-dark: #ccc;
        --content-break: "§";
        --content-break-position: calc(50%);
      }
    </style>
  {:else}
    <style>
      :root {
        --primary-link: #21759b;
        --primary-link-highlight: #c05b4d;
        --primary-heading: #c05b4d;
        --primary-highlight: #f7d87c;
        --secondary-heading: #333;
        --secondary-highlight: #c05b4d;
        --bg-main: #f8f7f6;
        --bg-body: #222;
        --bg-row-grey-light: #eee;
        --bg-row-grey-dark: #e9e9e9;
        --text-header: #e6eaed;
        --text-light: #757575;
        --text-medium: #555;
        --text-dark: #333;
        --content-break: url("/img/ornament.png");
        --content-break-position: calc(50% - 95px);
      }
    </style>
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
