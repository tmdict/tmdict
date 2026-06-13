export function highlight(searchResult, truncate = false, highlightClassName = "search-highlight") {
  // Iteratively go into nested object key until highlight value, then replace it with highlighted value
  const set = (item, match, value) => {
    const pathValue = match.key.split(".");
    let i;
    for (i = 0; i < pathValue.length - 1; i++) {
      // Check if current item is an array and we have a refIndex
      if (Array.isArray(item[pathValue[i]]) && "refIndex" in match) {
        item = item[pathValue[i]][match.refIndex];
      } else {
        item = item[pathValue[i]];
      }
    }
    // Set the final value
    if (Array.isArray(item[pathValue[i]]) && "refIndex" in match) {
      item[pathValue[i]][match.refIndex] = value;
    } else {
      item[pathValue[i]] = value;
    }
  };

  // Given match value(s) and the indices of the matching substring, append span tags around the substrings
  const generateHighlightedText = (inputText, indices = []) => {
    let content = "";
    // Start = start of string of end of last highlight
    let start = 0;
    indices.forEach((highlightStartEnd) => {
      // End = end of current highlight
      const end = highlightStartEnd[1] + 1;
      content += [
        inputText.substring(start, highlightStartEnd[0]),
        `<span class="${highlightClassName}">`,
        inputText.substring(highlightStartEnd[0], end),
        "</span>",
      ].join("");
      start = end;
    });
    // Append rest of none highlighted string to recreate entire content
    content += inputText.substring(start);
    return content;
  };

  // Truncate the raw text to a window around the first match, remapping the
  // match indices into that window. Truncating BEFORE highlighting guarantees
  // the inserted <span> tags are never split by the cut.
  const truncateText = (inputText, indices, maxLength = 400, lead = 50) => {
    if (inputText.length <= maxLength) {
      return { text: inputText, indices, pre: "", post: "" };
    }
    const start = Math.max(0, indices[0][0] - lead);
    const end = start + maxLength;
    return {
      text: inputText.slice(start, end),
      // Keep highlights that start inside the window; clamp ends to the window
      indices: indices
        .filter(([s]) => s >= start && s < end)
        .map(([s, e]) => [s - start, Math.min(e, end - 1) - start]),
      pre: start === 0 ? "" : "...",
      post: "...",
    };
  };

  return searchResult
    .filter(({ matches }) => matches && matches.length)
    .map(({ item, matches }) => {
      const highlightedItem = { ...item };
      // For each match, highlight the search result item
      matches.forEach((match) => {
        if (truncate && match.key === "text") {
          const { text, indices, pre, post } = truncateText(match.value, match.indices);
          set(highlightedItem, match, pre + generateHighlightedText(text, indices) + post);
        } else {
          set(highlightedItem, match, generateHighlightedText(match.value, match.indices));
        }
      });
      return highlightedItem;
    });
}
