---
title: "Log Entity Framework generated SQL"
createdAt: "2022-03-23"
description: "Log generated SQL from Entity Framework."
tags:
  - sql
  - dotnet
  - csharp
---

Log generated SQL from Entity Framework.

```csharp
context.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
```
