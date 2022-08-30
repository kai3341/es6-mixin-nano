const { getPrototypeOf } = Object;
const protoObject = getPrototypeOf(Object);

export default function parentList(Class) {
  const parentList = [Class];
  while((Class = getPrototypeOf(Class)) !== protoObject) parentList.push(Class);
  return parentList.reverse();
}

