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

## API Reference

### mix

High-level API

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
class My extends mix(Base, FooMixin, BarMixin, BazMixin) { /* --- */ }
```

### injectMixin

Mid-level API, used by `mix`. Injects mixin behavior into target class in-place.


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

No one support mixins which are subclassed from parent class

### [es6-class-mixin](https://www.npmjs.com/package/es6-class-mixin)

True minimal implementation, but does not support static class attributes /
functions and properties

### [mixin-es6](https://www.npmjs.com/package/mixin-es6)

Nice one. By inspiration of this package I've implement the same high-level API,
but I've never use it :) Dense, ignores [SRP](https://en.wikipedia.org/wiki/Single-responsibility_principle)

