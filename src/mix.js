import injectMixin from "./injectMixin";

export default function mix(BaseClass) {
  const Class = class extends BaseClass {};
  for (const Mixin of arguments.slice(1-arguments.length)) {
    injectMixin(Class, Mixin);
  }
  return Class;
}

