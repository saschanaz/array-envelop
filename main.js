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
      if ((typeof property !== "symbol") && !isNaN(property)) {
        return iterable[property];
      }
    },
    has: (_, property) => {
      if (property in Array.prototype) {
        return true;
      }
      if ((typeof property !== "symbol") && !isNaN(property)) {
        return property in iterable;
      }
    },
    ownKeys: _ => [...Array.prototype.keys.call(iterable), "length"].map(i => i.toString()),
    getOwnPropertyDescriptor: (_, property) => {
      if ((typeof property !== "symbol") && !isNaN(property)) {
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
