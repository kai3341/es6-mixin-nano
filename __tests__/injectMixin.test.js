import injectMixin from "../src/injectMixin";

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


describe("injectMixin", () => {
  test("FooAble", () => {
    const T = class {};
    injectMixin(T, FooAble);
    const t = new T();

    testFooAble(T, t);
  });


  test("BarAble", () => {
    const T = class {};
    injectMixin(T, BarAble);
    const t = new T();

    testBarAble(T, t);
  });


  test("FooBarAble", () => {
    const T = class {};
    injectMixin(T, FooAble);
    injectMixin(T, BarAble);
    const t = new T();

    testFooAble(T, t);
    testBarAble(T, t);
  });

  test("BazAble", () => {
    const T = class {};
    injectMixin(T, BazAble);
    const t = new T();

    testBazAble(T, t);
  });

  test("FooBazAble", () => {
    const T = class {};
    injectMixin(T, FooAble);
    injectMixin(T, BazAble);
    const t = new T();

    testFooAble(T, t);
    testBazAble(T, t);
  });

  test("FuzzBazAble", () => {
    const T = class {};
    injectMixin(T, FuzzAble);
    injectMixin(T, BazAble);
    const t = new T();

    testFuzzAble(T, t);
    testBazAble(T, t);
  });
});

