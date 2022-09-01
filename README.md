# es6-mixin-nano
ES6 Mixin support

As minimal as possible modular class mixin / polyfill utility

Works fine:
* `static` methods and attributes
* properties
* regular methods

Limitations:
* Instance attributes does not work
* Arrow function methods does not work
* `super` in the mixin class does not work
* No magic. Just copy attributes

## Test coverage report

| File           | % Stmts | % Branch | % Funcs | % Lines |
|:---------------|--------:|---------:|--------:|--------:|
| All files      |     100 |      100 |     100 |     100 |
| index.js       |       0 |        0 |       0 |       0 |
| injectMany.js  |     100 |      100 |     100 |     100 |
| injectMixin.js |     100 |      100 |     100 |     100 |
| mix.js         |     100 |      100 |     100 |     100 |
| parentList.js  |     100 |      100 |     100 |     100 |

## Size cost report

Approximate cost of including `es6-mixin-nano` API:

| Name               | Size (bytes) |
|:-------------------|-------------:|
| injectMany         |           79 |
| injectMixin        |           74 |
| mix                |           86 |
| parentList         |           74 |

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

*OR*

```
import mix from "es6-mixin-nano/src/mix";
```

#### [Usage example](https://github.com/kai3341/es6-mixin-nano/blob/main/__tests__/mix.test.js)

```
class MyClass extends mix(Base, FooMixin, BarMixin, BazMixin) { /* --- */ }
```

Method resolve order:

```
MyClass => FooMixin => BarMixin => BazMixin => Base
```

It means if you define the same method in `FooMixin` and `BazMixin`, `MyClass`
will have `FooMixin`'s implementation

### injectMany

Mid-level API, used by `mix`

#### Importing

```
import { injectMany } from "es6-mixin-nano";
```

*OR*

```
import injectMany from "es6-mixin-nano/src/injectMany";
```

#### [Usage example](https://github.com/kai3341/es6-mixin-nano/blob/main/__tests__/injectMany.test.js)


### injectMixin

Mid-level API, used by `injectMany`. Injects mixin behavior into target class
in-place. Besides own given mixin's attributes injects into target class all
attributes found in given mixin's parent classes

#### Importing

```
import { injectMixin } from "es6-mixin-nano";
```

*OR*

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

*OR*

```
import parentList from "es6-mixin-nano/src/parentList";
```

#### [Usage example](https://github.com/kai3341/es6-mixin-nano/blob/main/__tests__/parentList.test.js)

`// I'll publish the package which use this API`

## Similar packages and difference

Both of them does not handle correctly mixins which are subclassed
from parent class

Both of them provide high-level API the same as my `mix` method, so by
inspiration of them I've create it, test it, but never use it :)

### [es6-class-mixin](https://www.npmjs.com/package/es6-class-mixin)

True minimal implementation, but does not support static class attributes /
functions and properties

### [mixin-es6](https://www.npmjs.com/package/mixin-es6)

Nice one, works fine with properties and static attributes and methods. Dense,
ignores [SRP](https://en.wikipedia.org/wiki/Single-responsibility_principle).
Unfortunally, the author did not check the build -- `webpack` generates weird and surprising
code on [this](https://github.com/guiguan/mixin-es6/blob/master/src/index.js#L18) line:

```
const mix = (BaseClass, ...Mixins) => {
```
