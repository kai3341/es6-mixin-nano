class WrapString {
  constructor(str, len) {
    this.str = str.toString();
    this.len = len;
  }

  align(_align) {
    const alignMethod = this[_align];
    return alignMethod.call(this);
  }

  left() {
    const result = [" ", this.str];
    const rest = this.len - this.str.length - 1;
    for (let i=0; i<rest; i++) result.push(" ");
    return result.join("");
  }

  right() {
    const result = [];
    const rest = this.len - this.str.length - 1;
    for (let i=0; i<rest; i++) result.push(" ");
    result.push(this.str, " ");
    return result.join("");
  }
}


class MarkdownTable {
  constructor(/*{ key, head, len, align }, ...*/) {
    this.report = [];
    this.rowConfig = arguments;
    this.head();
  }

  head() {
    const obj = {};

    for (const { key, head } of this.rowConfig) obj[key] = head;

    this.row(obj);
    this.delimiter();
  }

  render() {
    return this.report.join("\n");
  }

  row(obj) {
    const result = ["|"];

    for (const { key, len, align } of this.rowConfig) {
      const value = obj[key] || " ";
      const wrapper = new WrapString(value, len);
      const wrapped = wrapper.align(align);
      result.push(wrapped);
      result.push("|");
    }

    this.report.push(result.join(""));
  }

  delimiter() {
    const result = ["|"];

    for (const { key, len, align } of this.rowConfig) {
      const dashCount = (align === "center")
      ? len - 2
      : len - 1

      if (align !== "right") result.push(":");
      for (let i=0; i<dashCount; i++) result.push("-");
      if (align !== "left") result.push(":");
      result.push("|");
    }

    this.report.push(result.join(""));
  }
}

const self = {};
global.self = self;

import("./dist/bundle.js")
.then(bundle => {
  const { ES6MixinNano } = self;
  const ES6MixinNanoDesciptors = Object.getOwnPropertyDescriptors(ES6MixinNano);
  delete ES6MixinNanoDesciptors["__esModule"];

  const mdReport = new MarkdownTable(
    { key: "name", head: "Name", len: 20, align: "left"},
    { key: "bytes", head: "Size (bytes)", len: 14, align: "right" },
  )

  for (const [name, value] of Object.entries(ES6MixinNanoDesciptors)) {
    const compiled = value.get();
    const source = compiled.toString();
    const bytes = source.length;
    mdReport.row({ name, bytes });
  }

  console.log(mdReport.render());
})
.catch(console.error)

