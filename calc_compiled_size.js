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

  center() {
    const result = [this.str];
    let rest = this.len - this.str.length;
    const restOdd = rest % 2;
    rest = (rest - restOdd) / 2;

    for (let i=0; i<rest; i++) {
      result.push(" ");
      result.unshift(" ");
    }

    if (restOdd) result.push(" ");

    return result.join("");
  }
}


class MarkdownTable {
  constructor(/*{ key, head, len, align }, ...*/) {
    this.report = [];
    this.rowConfig = arguments;

    this.rowConfigIndex = {};
    for (const item of arguments) {
      if (!item.hasOwnProperty("len")) item.len = 0;
      this.rowConfigIndex[item.key] = item;
    }
  }

  updateConfig(row) {
    for (const [key, value] of Object.entries(row)) {
      const valueStr = value.toString();
      row[key] = valueStr;

      const cfg = this.rowConfigIndex[key];

      if(!cfg) continue;

      const valueStrLength = valueStr.length + 2;
      if (cfg.len < valueStrLength) cfg.len = valueStrLength;
    }
  }

  row(row) {
    this.updateConfig(row);
    this.report.push(row);
  }

  render() {
    const headerRow = this.headerRow();
    this.updateConfig(headerRow);

    const result = this.report.map(this.renderRow);

    result.unshift(this.renderDelimiter());
    result.unshift(this.renderRow(headerRow));
    return result.join("\n");
  }

  headerRow() {
    const row = {};

    for (const { key, head } of this.rowConfig) row[key] = head;

    return row;
  }

  renderRow = (row) => {
    const result = ["|"];

    for (const { key, len, align } of this.rowConfig) {
      const value = row[key] || " ";
      const wrapper = new WrapString(value, len);
      const wrapped = wrapper.align(align);
      result.push(wrapped);
      result.push("|");
    }

    return result.join("");
  }

  renderDelimiter() {
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

    return result.join("");
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
    { key: "name", head: "Name", align: "left"},
    { key: "bytes", head: "Size (bytes)", align: "right" },
    { key: "source", head: "Source Code", align: "left" },
  )

  for (const [name, value] of Object.entries(ES6MixinNanoDesciptors)) {
    const compiled = value.get();
    const source = compiled.toString();
    const bytes = source.length;
    mdReport.row({ name, source, bytes });
  }

  console.log(mdReport.render());
})
.catch(() => console.error("Run `npm run build` first!"))

