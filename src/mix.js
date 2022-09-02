import injectMany from "./injectMany";

export default function mix(BaseClass , ...Mixins) {
  const Class = class extends BaseClass {};
  Mixins.unshift(Class);
  injectMany.apply(0, Mixins);
  return Class;
}

