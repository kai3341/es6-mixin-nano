import { FooAble, BarAble, BazAble } from "./mixinClasses";

const propertyChecks = [42, "123", [], {}];

// ===

export function testFooAble(T, t) {
  for (const checkValue of propertyChecks) {
    t.fooPreperty = checkValue;
    expect(t.fooPreperty).toEqual(checkValue);
    expect(t._fooPrepertyValue).toEqual(checkValue);
  }

  expect(typeof t.fooFunc).toEqual("function");
  expect(t.fooFunc).toEqual(FooAble.prototype.fooFunc);

  expect(typeof T.fooStaticFunc).toEqual("function");
  expect(typeof t.constructor.fooStaticFunc).toEqual("function");
  expect(t.constructor.fooStaticFunc).toEqual(T.fooStaticFunc);

  expect(typeof T.fooStaticArrowFunc).toEqual("function");
  expect(typeof t.constructor.fooStaticArrowFunc).toEqual("function");
  expect(t.constructor.fooStaticArrowFunc).toEqual(T.fooStaticArrowFunc);

  expect(T.fooStaticAttr).toEqual(FooAble.fooStaticAttr);
  expect(t.constructor.fooStaticAttr).toEqual(FooAble.fooStaticAttr);
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
