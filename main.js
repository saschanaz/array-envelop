export function envelop(iterable) {
  return new Proxy([], {
    getPrototypeOf: () => Array.prototype,
    isExtensible: () => false,
    preventExtensions: () => true,
    set: () => false,
    deleteProperty: () => false,
    get: (_, property) => {
      if (property === "length") {
        return "length" in iterable ? iterable.length : 0;
      }
      if (property === "concat") {
        return concat;
      }
      if (typeof Array.prototype[property] === "function") {
        return Array.prototype[property];
      }
      if (isNumberLike(property)) {
        return iterable[property];
      }
    },
    has: (_, property) => {
      if (property in Array.prototype) {
        return true;
      }
      if (isNumberLike(property)) {
        return property in iterable;
      }
    },
    ownKeys: _ => [...Array.prototype.keys.call(iterable), "length"].map(i => i.toString()),
    getOwnPropertyDescriptor: (_, property) => {
      if (isNumberLike(property)) {
        return Object.getOwnPropertyDescriptor(iterable, property);
      }
      if (property === "length") {
        return Object.getOwnPropertyDescriptor(Array.prototype, "length");
      }
    }
  });
}

function concat(array) {
  return Array.from(this).concat(array);
}

function isNumberLike(name) {
  return (typeof name !== "symbol") && !isNaN(name);
}