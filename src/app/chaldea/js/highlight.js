export function highlight(searchResult, highlightClassName = 'search-highlight') {
  // Iteratively go into nested object key until highlight value, then replace it with highlighted value
  const set = (item, match, value) => {
    const pathValue = match.key.split('.');
    let i;
    for (i = 0; i < pathValue.length - 1; i++) {
      if (Array.isArray(item) && 'refIndex' in match) {
        item = item[match.refIndex][pathValue[i]];
      } else {
        item = item[pathValue[i]];
      }
    }
    if (Array.isArray(item) && 'refIndex' in match) {
      item[pathValue[i]][match.refIndex] = value;
    } else {
      item[pathValue[i]] = value;
    }
  };

  // Given match value(s) and the indices of the matching substring, append span tags around the substrings
  const generateHighlightedText = (inputText, indices = []) => {
    let content = '';
    // Start = start of string of end of last highlight
    let start = 0;
    indices.forEach((highlightStartEnd) => {
      // End = end of current highlight
      const end = highlightStartEnd[1] + 1;
      content += [
        inputText.substring(start, highlightStartEnd[0]),
        `<span class="${highlightClassName}">`,
        inputText.substring(highlightStartEnd[0], end),
        '</span>',
      ].join('');
      start = end;
    });
    // Append rest of none highlighted string to recreate entire content
    content += inputText.substring(start);
    return content;
  };

  return searchResult
    .filter(({ matches }) => matches && matches.length)
    .map(({ item, matches }) => {
      const highlightedItem = { ...item };
      // For each match, highlight the search result item
      matches.forEach((match) => {
        const highlight = generateHighlightedText(match.value, match.indices);
        set(highlightedItem, match, highlight);
      });
      return highlightedItem;
    });
}
