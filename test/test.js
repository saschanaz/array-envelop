"use strict";

const expect = require("expect");
const { envelop } = require("..");

const target = envelop({ 0: "eve", 1: "maya", length: 2, excessive: "no" });

describe("feature test", () => {
  it("should return items", () => {
    expect(target[0]).toBe("eve");
    expect(target[1]).toBe("maya");
  });
  it("should check existence", () => {
    expect(0 in target).toBe(true);
    expect(1 in target).toBe(true);
    expect(2 in target).toBe(false);
  });
  it("should join", () => {
    expect(target.join(" ")).toBe("eve maya");
  });
  it("should concat", () => {
    expect(target.concat(["aya"])).toEqual(["eve", "maya", "aya"]);
  });
  it("should iterate via forEach", () => {
    target.forEach((item, i) => expect(item).toBe(target[i]));
  });
  it("should iterate via for-of", () => {
    const items = [];
    for (const item of target) items.push(item);
    expect(items.join(" ")).toBe(target.join(" "));
  });
  it("should iterate via for-in", () => {
    const indices = [];
    for (const i in target) indices.push(i);
    expect(indices).toEqual(["0", "1"]);
  });
  it("should work with iterators", () => {
    for (const [i, item] of target.entries()) {
      expect(item).toBe(target[i]);
    }
  });
  it("should work with Array.from", () => {
    expect(Array.from(target).join(" ")).toBe(target.join(" "));
  });
  it("should indexOf", () => {
    expect(target.indexOf("maya")).toBe(1);
  });
  it("should find", () => {
    expect(target.find(item => item === "maya")).toBe("maya");
  });
  it("shouldn't fail to index by a Symbol", () => {
    expect(target[Symbol.toStringTag]).toBeUndefined();
  });
  it("should shadow excessive properties", () => {
    expect("excessive" in target).toBe(false);
  });
});

describe("failure test", () => {
  it("should fail to resize", () => {
    expect(() => target.length = 4).toThrow();
    expect(target.length).toBe(2);
  });
  it("should fail to push", () => {
    expect(() => target.push(4)).toThrow();
    expect(target.length).toBe(2);
    expect(target[3]).toBeUndefined();
  });
  it("should fail to pop", () => {
    expect(() => target.pop()).toThrow();
    expect(target.length).toBe(2);
    expect(target[1]).toBe("maya");
  });
});

describe("mutation test", () => {
  it("should respond to addition", () => {
    const original = { 0: "moca", 1: "ran", length: 2 };
    const enveloped = envelop(original);

    original[2] = "tsugumi";
    original.length = 3;

    expect(enveloped[2]).toBe("tsugumi");
    expect(enveloped.length).toBe(3);
  });
  it("should respond to deletion", () => {
    const original = { 0: "kokoro", 1: "misaki", length: 2 };
    const enveloped = envelop(original);

    delete original[1];
    original.length = 1;

    expect(1 in enveloped).toBe(false);
    expect(enveloped.length).toBe(1);
  });
});
