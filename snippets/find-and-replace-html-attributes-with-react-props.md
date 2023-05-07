---
title: "Find and replace HTML attributes with React props"
createdAt: "2023-05-07"
updatedAt: "2023-05-07"
description: "Regex for finding and replacing all instances of HTML attributes with dashes to camelCase React props in VS Code."
tags:
  - regex
  - react
---

Regex for finding and replacing all instances of HTML attributes with dashes to camelCase React props in VS Code.

```regex title="find"
-([a-z])(\w+)=
```

```regex title="replace"
\U$1$2=
```
