<script>
  import Top from "$lib/components/book/Top.svelte";
  import Content from "$lib/components/book/Content.svelte";

  let { book } = $props();
</script>

<div id="container">
  <Top {book} />

  <div class="wrapper">
    <div id="main">
      {#each book.entries as entry}
        <Content {entry} />
      {/each}
    </div>
  </div>
</div>
