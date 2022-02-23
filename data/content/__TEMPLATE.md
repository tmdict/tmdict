```
---
parent: <string> # required: a parent attribute id this content falls under
source: <string> # optional: source of the content (needs to exist as a source attribute)
id: <string> # required: unique id for contents (per language) under the same parent
language: <string> # required: 2-character string representing the content’s language (en, ja, zh)
weight: <number> # required: order of this content relative to other content under the same parent
name: <string> # optional: name/title for the content, if present, this overrides id’s name
translation: <string> # optional: person responsible for translating this content
img: <string> # optional: link to entry image
category: <string> # optional: 1 or more categories belonging to the entry
---

// Markdown and HTML text.
```
