import injectMany from "../src/injectMany";

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


describe("injectMany", () => {
  test("FooAble", () => {
    const T = class { };
    injectMany(T, FooAble);
    const t = new T();

    testFooAble(T, t);
  });

  test("FooBarAble", () => {
    const T = class { };
    injectMany(T, FooAble, BarAble);
    const t = new T();

    testFooAble(T, t);
    testBarAble(T, t);
  });

  test("BazAble", () => {
    const T = class { };
    injectMany(T, BazAble);
    const t = new T();

    testBazAble(T, t);
  });

  test("FooBazAble", () => {
    const T = class { };
    injectMany(T, FooAble, BazAble);
    const t = new T();

    testFooAble(T, t);
    testBazAble(T, t);
  });

  test("FuzzBazAble", () => {
    const T = class { };
    injectMany(T, FuzzAble, BazAble);
    const t = new T();

    testFuzzAble(T, t);
    testBazAble(T, t);
  });
});
