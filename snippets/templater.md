---
title: "Templater snippets"
description: "Snippets I've written for the Templater Obsidian plugin."
---

# Templater snippets

## Reuse value from prompt or suggester

Instead of prompting for the same value multiple times, you can prompt for it once, store it in a variable, and reference that variable multiple times.

Before:

```js
<%* await tp.system.prompt("Result") %>
<%* await tp.system.prompt("Result") %>
```

After:

```js
<%*
const result = await tp.system.prompt("Result")
_%>

<% result %>
<% result %>
```
