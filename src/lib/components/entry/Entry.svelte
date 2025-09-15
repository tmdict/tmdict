<script>
  import Content from "$lib/components/entry/Content.svelte";
  import ProfileTop from "$lib/components/entry/ProfileTop.svelte";
  import Sidebar from "$lib/components/entry/Sidebar.svelte";
  import APP from "$lib/__generated/constants.json";
  
  let { lang, data } = $props();
  let screenWidth = $state(0);
</script>

<svelte:window bind:innerWidth={screenWidth} />

{#if screenWidth > 1220}
  <Sidebar {lang} attribute={data.attribute} content={data.content} />
{/if}

<h1 id="{data.attribute.id}">{data.attribute.name[lang]}</h1>

{#if data.attribute.type === "profile" && data.attribute.layout[Object.keys(data.attribute.layout)[0]].length > 0}
  <ProfileTop {lang} {data} />
{/if}

{#each data.content as section (`${section.id}-${section.weight}`)}
  <Content {lang} data={section} entryType={data.attribute.type} entryId={data.attribute.id} />
{/each}

<style>
  h1 {
    margin-bottom: 40px;
  }
</style>
