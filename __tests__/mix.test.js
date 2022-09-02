import mix from "../src/mix";

import {
  FooAble,
  FuzzAble,
  BarAble,
  BazAble,
} from "../__tests_lib__/mixinClasses";

import {
  testFooAble,
  testFuzzAble,
  testBarAble,
  testBazAble,
} from "../__tests_lib__/testMixinClass";


describe("mix", () => {
  test("FooAble", () => {
    const T = class extends mix(FooAble) { };
    const t = new T();

    testFooAble(T, t);
  });


  test("BarAble", () => {
    const T = class extends mix(BarAble) { };
    const t = new T();

    testBarAble(T, t);
  });


  test("FooBarAble", () => {
    const T = class extends mix(FooAble, BarAble) { };
    const t = new T();

    testFooAble(T, t);
    testBarAble(T, t);
  });

  test("BazAble", () => {
    const T = class extends mix(BazAble) { };
    const t = new T();

    testBazAble(T, t);
  });

  test("FooBazAble", () => {
    const T = class extends mix(FooAble, BazAble) { };
    const t = new T();

    testFooAble(T, t);
    testBazAble(T, t);
  });

  test("FuzzBazAble", () => {
    const T = class extends mix(FuzzAble, BazAble) { };
    const t = new T();

    testFuzzAble(T, t);
    testBazAble(T, t);
  });
});
