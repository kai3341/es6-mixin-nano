import injectMixin from "./injectMixin";

export default function injectMany(BaseClass /*, ...Mixins*/) {
  const Mixins = [...arguments].reverse();
  Mixins.pop();
  for (const Mixin of Mixins) injectMixin(BaseClass, Mixin);
}

