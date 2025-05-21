<script>
  import Entry from "$lib/components/entry/Entry.svelte";
  import APP from "$lib/__generated/constants.json";

  let { data } = $props();

  let metaDescription = $derived.by(() => {
    let attrContent = data.data.attribute.attr.name[data.lang];
    if (data.data.attribute.layout[data.lang].length > 0) {
      // If has attr data
      const layoutAttr = [
        ...Object.entries(data.data.attribute.layout[data.lang][0]),
        ...Object.entries(data.data.attribute.layout[data.lang][1])
      ];

      for (const [attr, value] of layoutAttr) {
        attrContent += ` | ${APP.i18n[attr][data.lang]}: ${value}`;
      }
    } else if (data.data.content.length > 0 && data.data.content[0].i18n[data.lang]) {
      // If has content data
      attrContent += ` | ${data.data.content[0].i18n[data.lang].html
        .replace(/(?:<[^>]*>|\n)+/g, " ")
        .replace(/    /g, " ")
        .substring(1)}`;
    }
    const parsed = attrContent.substring(0, 160)
    return (parsed.lastIndexOf(" ") !== -1) ? parsed.substring(0, parsed.lastIndexOf(" ")) : parsed;
  });
</script>

<svelte:head>
  <title>{data.data.attribute.attr.name[data.lang]} | TMdict</title>
  <meta name="description" content={metaDescription} />
  <link rel="canonical" href="https://www.tmdict.com/{data.lang}/profile/{data.data.attribute.id}" />
</svelte:head>

<Entry {...data} />
