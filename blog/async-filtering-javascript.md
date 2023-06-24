---
title: "Async filtering in Javascript"
createdAt: "2023-06-24"
updatedAt: "2023-06-24"
description: "How to perform async operations when trying to filter data in an array in Javascript."
tags:
  - javascript
---

Here's a simple example of filtering an array of numbers to only get numbers that are less than 3.

```js title="synchronous-filtering.js"
const data = [1, 2, 3, 4, 5];
const filteredResults = data.filter((x) => x < 3);
console.log(filteredResults); // [1, 2]
```

Now let's try doing it asynchronously.

```js title="async-filtering.js"
const data = [1, 2, 3, 4, 5];
const filteredResults = await Promise.all(data.filter(async (x) => x < 3));
console.log(filteredResults); // [1, 2, 3, 4, 5]
```

It doesn't work. Why? Let's break out the [callback function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#parameters) function and explicitly type everything using Typescript.

```ts title="async-filtering.ts"
const data: number[] = [1, 2, 3, 4, 5];
async function callbackFn(value: number): Promise<boolean> {
  return value < 3;
}
const filteredResults: number[] = Promise.all(data.filter(callbackFn));
console.log(filteredResults); // [1, 2, 3, 4, 5]
```

An herein lies the issue. Since the callbackFn provided to `data.filter()` is [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), it will always [return a Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#return_value) instead of a boolean like it did before. A Promise object is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), so nothing will ever be filtered out if the callbackFn is async.

## Solutions

So how do we get around this?

One option would be to first map over the items in the array and for each iteration, return an object that contains the item and an additional property that determines whether or not that item should be filtered out. We can then filter on that property synchronously and then map again to get just the values.

```js title="async-mapping-then-sync-filtering.js"
const data = [1, 2, 3, 4, 5];
const mappedResults = await Promise.all(
  data.map(async (x) => {
    // return an object with the value and condition
    return {
      value: x,
      shouldInclude: x < 3,
    };
  })
);
const filteredResults = mappedResults
  .filter((x) => x.shouldInclude) // synchronously filter
  .map((x) => x.value); // grab just the values, filter condition no longer needed
console.log(filteredResults); // [1, 2]
```

We could also accomplish the same thing with either a `for` loop or `Array.prototype.reduce`.

```js title="async-for-loop-filtering.js"
const data = [1, 2, 3, 4, 5];
const filteredResults = [];
for (let i = 0; i < data.length; ++i) {
  const condition = (await data[i]) < 3;
  if (condition) {
    filteredResults.push(data[i]);
  }
}
console.log(filteredResults); // [1, 2]
```

```js title="async-reduce.js"
const data = [1, 2, 3, 4, 5];
const filteredResults = await data.reduce(async (acc, curr) => {
  const condition = (await curr) < 3;
  if (condition) {
    (await acc).push(curr);
  }
  return acc;
}, []);
console.log(filteredResults); // [1, 2]
```
