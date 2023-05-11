---
title: "Templater multi-select suggester"
createdAt: "2023-05-10"
updatedAt: "2023-05-10"
description: "We can (kindof) do a multi-select suggester by sticking the suggester in a `while` loop, letting the user keep selecting options and adding them to a list of selected options until the user hits the `escape` key to exit out of the loop."
tags:
  - obsidianmd
  - javascript
---

We can (kindof) do a multi-select suggester by sticking the suggester in a `while` loop, letting the user keep selecting options and adding them to a list of selected options until the user hits the `escape` key to exit out of the loop.

Here's a simple example of how to do this.

```js title="multi-select.md"
<%*
// List of items
let items = ["Value1", "Value2"];
// List of items that are selected in the suggester
const selectedItems = [];
// Looping to keep suggester modal open until escape is hit
while (true) {
  const selectedItem = await tp.system.suggester(item => item, items);
  // If escape is hit, break out of loop to close suggester modal
  if (!selectedItem) {
    break;
  }
  // Otherwise, add selected item to list of selected items, remove item from multi-select, and keep looping
  selectedItems.push(selectedItem);
  items = items.filter(item => item !== selectedItem);
}
if (selectedItems.length > 0) {
  // Do something with selected items
  tR += selectedItems;
}
_%>
```

Here's an example getting a list of tags as a multi-select and setting those tags in the current file's frontmatter.

```js title="add-tags-to-current-file.md"
<%*
// List of tags without # symbol (# denotes a comment in YAML)
let tags = Object.keys(app.metadataCache.getTags()).map(x => x.replace("#", ""));
const selectedTags = [];
while (true) {
  const selectedTag = await tp.system.suggester(tag => tag, tags);
  if (!selectedTag) {
    break;
  }
  selectedTags.push(selectedTag);
  tags = tags.filter(tag => tag !== selectedTag);
}
// If any tags were selected
if (selectedTags.length > 0) {
  const file = tp.file.find_tfile(tp.file.title);
  await app.fileManager.processFrontMatter(file, (frontmatter) => {
    // Ensure tags exist in frontmatter
    frontmatter["tags"] = frontmatter["tags"] || [];
    // Add selected tags to frontmatter
    frontmatter["tags"].push(...selectedTags);
  });
}
_%>
```

To make this easier to use, we could abstract this functionality away into a [user script](https://silentvoid13.github.io/Templater/user-functions/script-user-functions.html).

```js title="multiSuggester.js"
/**
 * Spawns a multi-select suggester prompt and returns the user's chosen items.
 * @param {object} tp Templater tp object.
 * @param {string[] | ((item: T) => string)} textItems Array of strings representing the text that will be displayed for each item in the suggester prompt. This can also be a function that maps an item to its text representation.
 * @param {T[]} items Array containing the values of each item in the correct order.
 * @param {boolean} throwOnCancel Throws an error if the prompt is canceled, instead of returning a null value.
 * @param {string} placeholder Placeholder string of the prompt.
 * @param {number} limit Limit the number of items rendered at once (useful to improve performance when displaying large lists).
 * @returns A list of selected items.
 */
async function multiSuggester(
  tp,
  textItems,
  items,
  throwOnCancel = false,
  placeholder = "",
  limit = undefined
) {
  // List of items that are selected in the suggester
  const selectedItems = [];
  // Looping to keep suggester modal open until escape is hit
  while (true) {
    const selectedItem = await tp.system.suggester(
      textItems,
      items,
      throwOnCancel,
      placeholder,
      limit
    );
    // If escape is hit, break out of loop to close suggester modal
    if (!selectedItem) {
      break;
    }
    // Otherwise, add selected item to list of selected items, remove item from multi-select, and keep looping
    selectedItems.push(selectedItem);
    items = items.filter((item) => item !== selectedItem);
  }

  return selectedItems;
}

module.exports = multiSuggester;
```

Then use it in our template like this.

```js title="multi-select.md"
<% tp.user.multiSuggester(tp, item => item, ["Value1", "Value2"]) %>
```
