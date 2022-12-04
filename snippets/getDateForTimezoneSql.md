---
title: "Get date for timezone in SQL"
createdAt: "2022-10-12"
description: "Get current date for specific timezone when server is in UTC timezone."
tags:
  - sql
---

Get current date for specific timezone when server is in UTC timezone.

See [stack overflow post](https://stackoverflow.com/questions/20086189/getdate-function-to-get-date-for-my-timezone).

```sql
SELECT GETDATE() AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time'
```
