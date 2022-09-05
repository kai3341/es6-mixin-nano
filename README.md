# es6-mixin-nano

ES6 Mixin / polyfill tool

As minimal as possible modular class mixin / polyfill utility. Size report is at
the bottom of this document at the [reports](#reports) section, just roll down

Modularity means you can include only required to you part of this library into
your application, so no dumb data will be included

What about performance. Runtime overhead is zero. Library code executes only
once on application startup (normally. But you may to create classes
(not instances, exactly classes) in the runtime) and looks has no place to stuck

Works fine:

- `static` methods and attributes
- properties
- regular methods

Limitations:

- Instance attributes does not work
- Arrow function methods does not work
- `super` in the mixin class does not work
- No magic. Just copy attributes

## API Reference

### mix

High-level API. Works the same as `mixin` of [es6-class-mixin](https://www.npmjs.com/package/es6-class-mixin)
and `mix` of [mixin-es6](https://www.npmjs.com/package/mixin-es6). Look there
for more examples

Difference is in method resolve order, explaination is in example

#### Importing

```
import { mix } from "es6-mixin-nano";
```

_OR_

```
import mix from "es6-mixin-nano/src/mix";
```

#### [Usage example](https://github.com/kai3341/es6-mixin-nano/blob/main/__tests__/mix.test.js)

```
class MyClass extends mix(Base, FooMixin, BarMixin, BazMixin) { /* --- */ }
```

#### Method resolve order

```
MyClass => FooMixin => BarMixin => BazMixin => Base
```

It means if you define the same method in `FooMixin` and `BazMixin`, `MyClass`
will have `FooMixin`'s implementation

### injectMany

Mid-level API, used by `mix`. `injectMany` handles method resolve order and
uses `injectMixin` as worker. Injects mixins into the target class in-place

#### Importing

```
import { injectMany } from "es6-mixin-nano";
```

_OR_

```
import injectMany from "es6-mixin-nano/src/injectMany";
```

#### [Usage example](https://github.com/kai3341/es6-mixin-nano/blob/main/__tests__/injectMany.test.js)

```
injectMany(Base, FooMixin, BarMixin, BazMixin);
```

#### Method resolve order

```
FooMixin => BarMixin => BazMixin => Base
```

### injectMixin

Mid-level API, used by `injectMany`, handles only one mixin but makes it
perfectly. Injects mixin behavior into target class in-place. Besides own
given mixin's attributes injects into target class all attributes found in
given mixin's parent classes

#### Importing

```
import { injectMixin } from "es6-mixin-nano";
```

_OR_

```
import injectMixin from "es6-mixin-nano/src/injectMixin";
```

#### [Usage example](https://github.com/kai3341/es6-mixin-nano/blob/main/__tests__/injectMixin.test.js)

```
class MapViaForOf {
  map(func) {
    const result = [];
    const i = 0;

    for (const item of this) {
      const value = func(item, i);
      result.push(value);
      i++;
    }

    return result;
  }
}

injectMixin(Set, MapViaForOf);

class LengthViaSize {
  // Unify API
  get length() {
    return this.size;
  }
}

injectMixin(Set, LengthViaSize);
injectMixin(Map, LengthViaSize);
```

### parentList

Low-level introspection API. Returns `Array` of parent classes including given

#### Importing

```
import { parentList } from "es6-mixin-nano";
```

_OR_

```
import parentList from "es6-mixin-nano/src/parentList";
```

#### [Usage example](https://github.com/kai3341/es6-mixin-nano/blob/main/__tests__/parentList.test.js)

`// I'll publish the package which use this API`

#### Parent resolve order

Here is a test example:

```
class A {};
class B extends A {};
class C extends B {};
class D extends C {};

// parentList(D) === [A, B, C, D]
```

## Similar packages and difference

Both of them does not handle correctly mixins which are subclassed
from parent class

Both of them provide high-level API the same as my `mix` method, so by
inspiration of them I've create it, test it, but never use it :)

Both of them are dense and ignore
[SRP](https://en.wikipedia.org/wiki/Single-responsibility_principle).
It means you can't use only part of their's functionality -- all or nothing

### [es6-class-mixin](https://www.npmjs.com/package/es6-class-mixin)

True minimal implementation, but does not support static class attributes /
functions and properties

### [mixin-es6](https://www.npmjs.com/package/mixin-es6)

Nice one, works fine with properties and static attributes and methods

## Reports

### Test coverage report

| File           | % Stmts | % Branch | % Funcs | % Lines |
| :------------- | ------: | -------: | ------: | ------: |
| All files      |     100 |      100 |     100 |     100 |
| index.js       |       0 |        0 |       0 |       0 |
| injectMany.js  |     100 |      100 |     100 |     100 |
| injectMixin.js |     100 |      100 |     100 |     100 |
| mix.js         |     100 |      100 |     100 |     100 |
| parentList.js  |     100 |      100 |     100 |     100 |

### Size cost report

Approximate cost of including `es6-mixin-nano` into your application bundle. You
may view full report via running `npm run sizereport`. Keep in mind I did not
extract full module code and check only exported function source code size

| API Name    | Size (bytes) |
| ----------- | -----------: |
| injectMany  |           53 |
| injectMixin |           74 |
| mix         |           80 |
| parentList  |           74 |
