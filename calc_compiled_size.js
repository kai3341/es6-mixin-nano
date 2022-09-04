/*
This module is a good example how to create two new libraries while you are
publishing your library
*/

class ColumnRendererDefault {
  static hasCentralDash = false;
  static defaults = {
    alignDelimiters: true,
    delimiterDash: "-",
    alignDelimiter: ":",
    alignCenterLeft: 1,
    space: " ",
    len: 2,
  };

  static delimiters = ({ delimiterDash }) => [delimiterDash, delimiterDash];

  constructor(options) {
    const userOptions = { ...this.constructor.defaults, ...options };
    userOptions.delimiters = this.constructor.delimiters(userOptions);
    Object.assign(this, userOptions);
  }

  render(str) {
    const rest = this.len - str.length;
    return str + this.space.repeat(rest);
  }

  renderDelimiter() {
    const [start, end] = this.delimiters;
    const centralDashCount = this.alignDelimiters
      ? this.len - 2
      : this.constructor.hasCentralDash;

    return start + this.delimiterDash.repeat(centralDashCount) + end;
  }

  renderTitle() {
    return this.render(this.title);
  }

  setLen(value) {
    this.len = Math.max(this.len, value);
  }
}

class ColumnRendererLeft extends ColumnRendererDefault {
  static delimiters = ({ delimiterDash, alignDelimiter }) => (
    [alignDelimiter, delimiterDash]
  );
}

class ColumnRendererRight extends ColumnRendererDefault {
  static delimiters = ({ delimiterDash, alignDelimiter }) => (
    [delimiterDash, alignDelimiter]
  );

  render(str) {
    const rest = this.len - str.length;
    return this.space.repeat(rest) + str;
  }
}

class ColumnRendererCenter extends ColumnRendererDefault {
  static hasCentralDash = true;
  static delimiters = ({ alignDelimiter }) => [alignDelimiter, alignDelimiter];

  render(str) {
    const rest = this.len - str.length;
    const isEven = (rest % 2) * this.alignCenterLeft;
    const before = (rest - isEven) / 2;
    const after = before + isEven;

    return this.space.repeat(before) + str + this.space.repeat(after);
  }
}


class ColumnKeeper {
  static rendererDefault = ColumnRendererDefault;
  static renderers = {
    left: ColumnRendererLeft,
    right: ColumnRendererRight,
    center: ColumnRendererCenter,
  };

  static defaults = {
    serializer: (value) => (
      (value === undefined || value === null)
        ? " "
        : value.toString()
    ),
  };

  serialize(value) {
    const serialized = this.serializer(value);
    const serializedLen = serialized.length;
    this.renderer.setLen(serializedLen);
    return serialized
  }

  constructor({ align, serializer, key, hide, ...options }) {
    const { defaults, renderers, rendererDefault } = this.constructor;
    this.align = align;
    this.key = key;
    this.hide = hide;
    this.serializer = serializer || defaults.serializer;
    const Renderer = renderers[align] || rendererDefault;
    this.renderer = new Renderer(options);
    this.renderer.setLen(2 + this.renderer.constructor.hasCentralDash);
    this.renderer.title = this.serialize(options.title);
  }
}


class MarkdownTable {
  static defaults = {
    rowStart: '|',
    rowEnd: '|',
    rowJoin: '|',
    padding: " ",
  };

  static settingsFromOptions(options) {
    const merged = { ...this.defaults, ...options };
    const { rowStart, rowEnd, rowJoin, padding } = merged;

    return {
      rowStart: rowStart ? rowStart + padding : "",
      rowEnd: rowEnd ? padding + rowEnd : "",
      rowJoin: rowJoin ? padding + rowJoin + padding : padding,
    };
  }

  constructor(columns, options) {
    this.settings = this.constructor.settingsFromOptions(options);
    this.report = [];
    this.rowConfig = [];
    this.rowConfigIndex = {};

    for (const item of columns) {
      const columnKeeper = new ColumnKeeper(item);
      this.rowConfig.push(columnKeeper);
      this.rowConfigIndex[item.key] = columnKeeper;
    }
  }

  prepareRow(row) {
    for (const [key, value] of Object.entries(row)) {
      const cfg = this.rowConfigIndex[key];
      if (!cfg) continue;
      row[key] = cfg.serialize(value);
    }
  }

  row(row) {
    this.prepareRow(row);
    this.report.push(row);
  }

  render() {
    const result = this.report.map(this.renderRow);
    result.unshift(this.renderRowFrom("renderDelimiter"));
    result.unshift(this.renderRowFrom("renderTitle"));
    return result.join("\n");
  }

  renderLine(arr) {
    const { settings } = this;
    return settings.rowStart + arr.join(settings.rowJoin) + settings.rowEnd;
  }

  renderRowFrom(key) {
    const result = [];

    for (const cfg of this.rowConfig) {
      if (cfg.hide) continue;
      const rendered = cfg.renderer[key]();
      result.push(rendered);
    }

    return this.renderLine(result);
  }

  renderRow = (row) => {
    const result = [];

    for (const cfg of this.rowConfig) {
      if (cfg.hide) continue;
      const serialized = row[cfg.key] || "";
      const rendered = cfg.renderer.render(serialized);
      result.push(rendered);
    }

    return this.renderLine(result);
  }
}

// -----------------------------------------------------------------------------

const self = {};
global.self = self;

async function sizeReport(path, exportedName, mdReportColumns) {
  try {
    const bundle = await import(path);
  } catch (e) {
    console.error("Run `npm run build` first!", e);
  }

  const targetModule = self[exportedName];
  const targetModuleDesciptors = Object.getOwnPropertyDescriptors(targetModule);
  delete targetModuleDesciptors["__esModule"];

  const mdReport = new MarkdownTable(mdReportColumns)

  for (const [name, value] of Object.entries(targetModuleDesciptors)) {
    const compiled = value.get();
    const source = compiled.toString();
    const bytes = source.length;
    mdReport.row({ name, bytes, source });
  }

  console.log(mdReport.render());
}

// -----------------------------------------------------------------------------

const mdReportColumns = [
  { key: "name", title: "API Name" },
  { key: "bytes", title: "Size (bytes)", align: "right" },
  { key: "source", title: "Source Code", hide: process.env.SOURCE_HIDE },
];

sizeReport("./dist/bundle.js", "ES6MixinNano", mdReportColumns);
