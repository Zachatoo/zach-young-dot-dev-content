---
title: "Theming Obsidian canvas"
createdAt: "2022-12-18"
description: "Changing the default colors for Obsidian's canvas plugin."
tags:
  - obsidianmd
  - css
---

To create a CSS snippet, create a `.css` file in the `.obsidian/snippets` folder in your vault, and then turning on the snippet in Settings > Appearance. It's easiest to edit `.css` files in a text editor like Visual Studio Code to get highlighting and formatting.

## Card colors

Change the value of `--canvas-color` to the three numbers that will be passed into an [rbg](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb) function.

```css
.mod-canvas-color-1 {
  --canvas-color: 224, 1, 23; /* r, g, b */
}
.mod-canvas-color-2 {
  --canvas-color: 224, 1, 23; /* r, g, b */
}
.mod-canvas-color-3 {
  --canvas-color: 224, 1, 23; /* r, g, b */
}
.mod-canvas-color-4 {
  --canvas-color: 224, 1, 23; /* r, g, b */
}
.mod-canvas-color-5 {
  --canvas-color: 224, 1, 23; /* r, g, b */
}
.mod-canvas-color-6 {
  --canvas-color: 224, 1, 23; /* r, g, b */
}
```
