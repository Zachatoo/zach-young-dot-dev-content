---
title: "Invariant"
createdAt: "2023-06-19"
updatedAt: "2023-06-19"
description: "Simple function to assert a condition and for type narrowing in TypeScript."
tags:
  - javascript
---

Simple function to assert a condition and for type narrowing in TypeScript.

Inspired by [tinyinvariant](https://github.com/alexreardon/tiny-invariant).

```ts title="invariant.ts"
function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Invariant failed: ${message}`);
  }
}
```

## Example usage

The following example will throw an error and prevent the code from moving forward.

```ts title="Asserting a condition"
const value = false;
invariant(value === true, "'value' must be true."); // throw here
console.log("I will not run");
```

This example will let the TypeScript compiler know that `car` is an object and has a `door` property on it, narrowing the type to `object & Record<"door", unknown>` instead of `unknown`.

```ts title="Type narrowing"
const car: unknown = JSON.parse(JSON.stringify({ door: "red" })); // unknown
invariant(
  car && typeof car === "object" && "door" in car,
  "'car' must be object and have 'door' property."
);
console.log(car.door); // object & Record<"door", unknown>
```
