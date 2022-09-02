/*
This module is a good example how to create a library while you are publishing
your another library
*/


class WrapString {
  constructor(len, align = "left") {
    this.len = len;
    this.align = align;
    this.wrap = this[align];
  }

  wrap(str) { /* replaces by left/right/center */ }

  left(str) {
    const rest = this.len - str.length - 1;
    const result = [" ", str, " ".repeat(rest)];
    return result.join("");
  }

  right(str) {
    const rest = this.len - str.length - 1;
    const result = [" ".repeat(rest), str, " "];
    return result.join("");
  }

  center(str) {
    const rest = this.len - str.length;
    const isEven = rest % 2;
    const before = (rest - isEven) / 2;
    const after = before + isEven;

    const result = [" ".repeat(before), str, " ".repeat(after)];
    return result.join("");
  }
}


class MarkdownTable {
  constructor(/*{ key, head, len, align }, ...*/) {
    this.report = [];
    this.rowConfig = arguments;

    this.rowConfigIndex = {};
    for (const item of arguments) {
      const itemLen = item.len || 0;
      item.$wrapString = new WrapString(itemLen, item.align);
      this.rowConfigIndex[item.key] = item;
    }
  }

  updateConfig(row) {
    for (const [key, value] of Object.entries(row)) {
      const valueStr = value.toString();
      row[key] = valueStr;

      const cfg = this.rowConfigIndex[key];

      if (!cfg) continue;

      const valueLength = valueStr.length + 2;
      cfg.$wrapString.len = Math.max(cfg.$wrapString.len, valueLength);
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

    for (const { key, align, $wrapString } of this.rowConfig) {
      const value = row[key] || " ";
      const wrapped = $wrapString.wrap(value);
      result.push(wrapped);
      result.push("|");
    }

    return result.join("");
  }

  static renderDelimiterSettings = {
    [undefined]: [0b00, 0],
    left: [0b10, 1],
    right: [0b01, 1],
    center: [0b11, 2],
  }

  renderDelimiter() {
    const { renderDelimiterSettings } = this.constructor;
    const result = ["|"];

    for (const { key, $wrapString, align } of this.rowConfig) {
      const len = $wrapString.len;
      const [alignCode, alignLength] = renderDelimiterSettings[align];

      const dashCount = len - alignLength;

      if (alignCode & 0b10) result.push(":");
      result.push("-".repeat(dashCount));
      if (alignCode & 0b01) result.push(":");
      result.push("|");
    }

    return result.join("");
  }
}

// -----------------------------------------------------------------------------

const self = {};
global.self = self;

import("./dist/bundle.js")
  .then(bundle => {
    const { ES6MixinNano } = self;
    const ES6MixinNanoDesciptors = Object.getOwnPropertyDescriptors(ES6MixinNano);
    delete ES6MixinNanoDesciptors["__esModule"];

    const mdReport = new MarkdownTable(
      { key: "name", head: "API Name" },
      { key: "bytes", head: "Size (bytes)", align: "right" },
      { key: "source", head: "Source Code" },
    )

    for (const [name, value] of Object.entries(ES6MixinNanoDesciptors)) {
      const compiled = value.get();
      const source = compiled.toString();
      const bytes = source.length;
      mdReport.row({ name, bytes, source });
    }

    console.log(mdReport.render());
  })
  .catch((e) => console.error("Run `npm run build` first!", e))
