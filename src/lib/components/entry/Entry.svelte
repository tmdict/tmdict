<script>
  import Content from "$lib/components/entry/Content.svelte";
  import ProfileTop from "$lib/components/entry/ProfileTop.svelte";
  import Sidebar from "$lib/components/entry/Sidebar.svelte";

  import { store } from "$lib/util/stores.svelte.js"
  import APP from "$lib/__generated/constants.json";
  
  export let data;

  let screenWidth;
</script>

<svelte:head>
  <title>{data.attribute.attr.name[store.lang.value]} | CHALDEAの記録</title>
  <link rel="canonical" href="https://tmdict.com/{data.attribute.type}/{data.attribute.id}" />
</svelte:head>

<svelte:window bind:innerWidth={screenWidth} />

{#if screenWidth > 1220}
  <Sidebar attribute={data.attribute} content={data.content} />
{/if}

<h1 id="{data.attribute.id}">{data.attribute.attr.name[store.lang.value]}</h1>

{#if data.attribute.type === "profile" && data.attribute.layout[Object.keys(data.attribute.layout)[0]].length > 0}
  <ProfileTop {data} {screenWidth} />
{/if}

{#if data.attribute.type === "glossary"}
  <div class="content"></div>
{/if}

{#each data.content as section}
  <Content entryType={data.attribute.type} entryId={data.attribute.id} data={section} />
{/each}
