import injectMixin from "./injectMixin";

export default function mix(BaseClass /*, ...Mixins*/) {
  const Class = class extends BaseClass {};
  const Mixins = [...arguments].reverse();
  Mixins.pop();
  for (const Mixin of Mixins) injectMixin(Class, Mixin);
  return Class;
}

