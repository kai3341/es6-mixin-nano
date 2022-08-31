import parentList from "../src/parentList";

class A {};
class B extends A {};
class C extends B {};
class D extends C {};

describe("parentList", () => {
  test("class A", () => {
    expect(parentList(A)).toEqual([A]);
  });

  test("class B", () => {
    expect(parentList(B)).toEqual([A, B]);
  });

  test("class C", () => {
    expect(parentList(C)).toEqual([A, B, C]);
  });

  test("class D", () => {
    expect(parentList(D)).toEqual([A, B, C, D]);
  });
});

