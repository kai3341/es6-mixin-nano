import parentList from "./parentList";

const { getOwnPropertyDescriptors, defineProperties } = Object;
const staticBlacklist = ["prototype", "length", "name"];
const methodBlacklist = ["constructor", ...staticBlacklist];


function applyMixin(BaseClass, Mixin, blacklist) {
  const properties = getOwnPropertyDescriptors(Mixin);
  for (const key of blacklist) delete properties[key];
  defineProperties(BaseClass, properties);
}

export default function injectMixin(BaseClass, MixinWithParents) {
  for (const Mixin of parentList(MixinWithParents)) {
    applyMixin(BaseClass.prototype, Mixin.prototype, methodBlacklist);
    applyMixin(BaseClass, Mixin, staticBlacklist);
  }
}
