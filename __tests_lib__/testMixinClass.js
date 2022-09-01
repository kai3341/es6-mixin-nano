import { FooAble, FuzzAble, BarAble, BazAble } from "./mixinClasses";

const propertyChecks = [42, "123", [], {}];

// ===

function baseTestFooAble(T, t) {
  for (const checkValue of propertyChecks) {
    t.fooPreperty = checkValue;
    expect(t.fooPreperty).toEqual(checkValue);
    expect(t._fooPrepertyValue).toEqual(checkValue);
  }

  expect(typeof t.fooFunc).toEqual("function");

  expect(typeof T.fooStaticFunc).toEqual("function");
  expect(typeof t.constructor.fooStaticFunc).toEqual("function");
  expect(t.constructor.fooStaticFunc).toEqual(T.fooStaticFunc);

  expect(typeof T.fooStaticArrowFunc).toEqual("function");
  expect(typeof t.constructor.fooStaticArrowFunc).toEqual("function");
  expect(t.constructor.fooStaticArrowFunc).toEqual(T.fooStaticArrowFunc);
}

// ===

export function testFooAble(T, t) {
  baseTestFooAble(T, t)

  expect(t.fooFunc).toEqual(FooAble.prototype.fooFunc);

  expect(T.fooStaticAttr).toEqual(FooAble.fooStaticAttr);
  expect(t.constructor.fooStaticAttr).toEqual(FooAble.fooStaticAttr);
}


// ===

export function testFuzzAble(T, t) {
  baseTestFooAble(T, t)

  expect(t.fooFunc).toEqual(FuzzAble.prototype.fooFunc);

  expect(typeof t.fuzzFunc).toEqual("function");
  expect(t.fuzzFunc).toEqual(FuzzAble.prototype.fuzzFunc);

  expect(T.fooStaticAttr).toEqual(FuzzAble.fooStaticAttr);
  expect(t.constructor.fooStaticAttr).toEqual(FuzzAble.fooStaticAttr);
}

// ===


function baseTestBarAble(T, t) {
  for (const checkValue of propertyChecks) {
    t.barPreperty = checkValue;
    expect(t.barPreperty).toEqual(checkValue);
    expect(t._barPrepertyValue).toEqual(checkValue);
  }

  expect(typeof t.barFunc).toEqual("function");
  expect(t.barFunc).toEqual(BarAble.prototype.barFunc);

  expect(typeof T.barStaticFunc).toEqual("function");
  expect(typeof t.constructor.barStaticFunc).toEqual("function");
  expect(t.constructor.barStaticFunc).toEqual(T.barStaticFunc);

  expect(typeof T.barStaticArrowFunc).toEqual("function");
  expect(typeof t.constructor.barStaticArrowFunc).toEqual("function");
  expect(t.constructor.barStaticArrowFunc).toEqual(T.barStaticArrowFunc);
}

// ===

export function testBarAble(T, t) {
  baseTestBarAble(T, t);

  expect(T.barStaticAttr).toEqual(BarAble.barStaticAttr);
  expect(t.constructor.barStaticAttr).toEqual(BarAble.barStaticAttr);
}

// ===

export function testBazAble(T, t) {
  baseTestBarAble(T, t);

  expect(typeof t.bazFunc).toEqual("function");
  expect(t.bazFunc).toEqual(BazAble.prototype.bazFunc);

  expect(T.barStaticAttr).toEqual(BazAble.barStaticAttr);
  expect(t.constructor.barStaticAttr).toEqual(BazAble.barStaticAttr);
}

