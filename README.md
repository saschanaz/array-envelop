# array-envelop

This wraps an array-like object to an array so that every array method can be utilized.

```js
import { envelop } from "array-envelop";

const object = {
  0: "maya",
  1: "eve",
  length: 2
};

const enveloped = envelop(object);
enveloped.indexOf("eve"); // returns 1

/*
 * Anything that mutates the array will throw, including the followings:
 *
 * enveloped.length = "peanut";
 * enveloped.push("peanut");
 * enveloped.pop();
 * enveloped.shift();
 */
```

### Why not `Array.from`?

`Array.from` copies everything while `array-envelop` keeps refering to the original object.

```js
object[2] = "aya";
object.length = 3;

enveloped.join(" "); // "maya eve aya"
```
