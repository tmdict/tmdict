<script>
	import { page } from '$app/state';
  import errorImg from "$lib/img/error.png?enhanced";
</script>

<svelte:head>
  <title>Not Found | 型月辞典</title>
  <meta charset="utf-8">
  <meta name="description" content="404 Not Found.">
  <link rel="icon" type="image/x-icon" href="favicon.ico" />
</svelte:head>

<div id="error">
  <div class="error-block">
    <a href="/" aria-label="TMdict"><enhanced:img class="logo" src={errorImg} title="TMdict" alt="TMdict" /></a>
  </div>
  <h1>{page.error.message}</h1>
</div>

<style>
  :global(body), :global(html) {
    background: #222;
  }

  #error {
    background: #fff;
    margin: 200px auto;
    padding-bottom: 20px;
    width: 270px;
    border-radius: 15px;
  }

  .error-block .logo{
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
  }

  .error-block .logo:hover { opacity: 0.9; }

  h1 {
    font: 2.4rem Georgia, serif;
    color: var(--primary-heading);
    margin: 0.6em 0.2em;
    text-align: center;
  }
</style>
