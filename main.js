export function envelop(iterable) {
  return new Proxy(iterable, {
    getPrototypeOf: () => Array.prototype,
    isExtensible: () => false,
    preventExtensions: () => true,
    set: () => false,
    deleteProperty: () => false,
    get: (target, property) => {
      if (property === "length") {
        return "length" in target ? target.length : 0;
      }
      if (property === "concat") {
        return concat;
      }
      if (typeof Array.prototype[property] === "function") {
        return Array.prototype[property];
      }
      if ((typeof property !== "symbol") && !isNaN(property)) {
        return target[property];
      }
    },
    has: (target, property) => {
      if (property in Array.prototype) {
        return true;
      }
      if ((typeof property !== "symbol") && !isNaN(property)) {
        return property in target;
      }
    },
    ownKeys: target => [...Array.prototype.keys.call(target)].map(i => i.toString())
  });
}

function concat(array) {
  return Array.from(this).concat(array);
}
