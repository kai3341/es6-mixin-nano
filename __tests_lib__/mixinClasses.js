export class FooAble {
  fooFunc() {}
  get fooPreperty() { return this._fooPrepertyValue }
  set fooPreperty(value) { this._fooPrepertyValue = value }
  static fooStaticFunc() {}
  static fooStaticArrowFunc = () => {}
  static fooStaticAttr = "fooAttribute"
}


export class FuzzAble extends FooAble {
  fooFunc() {}
  fuzzFunc() {}
  static fooStaticAttr = "fuzzAttribute"
}


export class BarAble {
  barFunc() {}
  get barPreperty() { return this._barPrepertyValue }
  set barPreperty(value) { this._barPrepertyValue = value }
  static barStaticFunc() {}
  static barStaticArrowFunc = () => {}
  static barStaticAttr = "barAttribute"
}


export class BazAble extends BarAble {
  bazFunc() {}
  static barStaticAttr = "bazAttribute"
}

