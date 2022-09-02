import injectMixin from "./injectMixin";

export default function injectMany(BaseClass , ...Mixins) {
  for (const Mixin of Mixins.reverse()) injectMixin(BaseClass, Mixin);
}

