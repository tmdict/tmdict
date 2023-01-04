export function highlight(searchResult, highlightClassName = 'search-highlight') {
  // Iteratively go into nested object key until highlight value, then replace it with highlighted value
  const set = (item, match, value) => {
    const pathValue = match.key.split('.')
    let i
    for (i = 0; i < pathValue.length - 1; i++) {
      if (Array.isArray(item) && 'refIndex' in match) {
        item = item[match.refIndex][pathValue[i]]
      } else {
        item = item[pathValue[i]]
      }
    }
    if (Array.isArray(item) && 'refIndex' in match) {
      item[pathValue[i]][match.refIndex] = value
    } else {
      item[pathValue[i]] = value
    }
  }

  // Given match value(s) and the indices of the matching substring, append span tags around the substrings
  const generateHighlightedText = (inputText, indices = []) => {
    let content = ''
    // Start = start of string of end of last highlight
    let start = 0
    indices.forEach((highlightStartEnd) => {
      // End = end of current highlight
      const end = highlightStartEnd[1] + 1
      content += [
        inputText.substring(start, highlightStartEnd[0]),
        `<span class="${highlightClassName}">`,
        inputText.substring(highlightStartEnd[0], end),
        '</span>',
      ].join('')
      start = end
    })
    // Append rest of none highlighted string to recreate entire content
    content += inputText.substring(start)
    return content
  }

  // Truncate result (text only) using first result index as starting point
  const truncateText = (inputText, match, maxLength = 400) => {
    if (inputText.length <= maxLength || match.key !== 'text') {
      return inputText;
    }
    const start = Math.max(0, match.indices[0][0] - 50);
    const pre = start === 0 ? '' : '...'
    return pre + inputText.slice(start, start + maxLength) + '...';
  }

  return searchResult
    .filter(({ matches }) => matches && matches.length)
    .map(({ item, matches }) => {
      const highlightedItem = { ...item }
      // For each match, highlight the search result item
      matches.forEach((match) => {
        const highlight = generateHighlightedText(match.value, match.indices)
        const truncate = truncateText(highlight, match)
        set(highlightedItem, match, truncate)
      })
      return highlightedItem
    })
}
