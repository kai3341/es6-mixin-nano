import injectMany from "./injectMany";

export default function mix(BaseClass /*, ...Mixins*/) {
  const Class = class extends BaseClass {};
  const injectManyArgs = [...arguments];
  injectManyArgs[0] = Class;
  injectMany.apply(0, injectManyArgs);
  return Class;
}

