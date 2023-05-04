---
title: "Allow list for tracking changes in git"
createdAt: "2023-05-03"
updatedAt: "2023-05-03"
description: "Setting up an allow list instead of a block list for tracking file changes in git."
tags:
  - git
---

You can set up an allow list instead of a block list for tracking file changes in git by ignoring all file changes, then use the `!` operator to track just the files you want to track.

```shell title=".gitignore"
# Ignore all files
*

# Don't ignore .gitignore
!.gitignore

# Allow list
!file-i-want-to-track.md
!file2-i-want-to-track.md
```

To track files nested in subdirectories, you must add all directories and subdirectories and the nested file.

```shell title=".gitignore"
# Ignore all files
*

# Don't ignore .gitignore
!.gitignore

# Allow list
!nested/
!nested/nested-file-i-want-to-track.md
```
