import injectMixin from "./injectMixin";

export default function mix(BaseClass) {
  const Class = class extends BaseClass {};
  for (const Mixin of arguments.slice(1)) injectMixin(Class, Mixin);
  return Class;
}

