<script>
  import BookTop from './BookTop.svelte';
  import BookContent from './BookContent.svelte';

  export let book;
</script>

<div id="container">
  <BookTop {book} />

  <div class="wrapper">
    <div id="main">
      {#each book.entries as entry}
        <BookContent {entry} />
      {/each}
    </div>
  </div>
</div>
