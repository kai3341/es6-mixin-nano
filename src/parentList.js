const { getPrototypeOf } = Object;
const protoObject = getPrototypeOf(Object);

export default function parentList(Class) {
  const parents = [Class];
  while ((Class = getPrototypeOf(Class)) !== protoObject) parents.push(Class);
  return parents.reverse();
}
