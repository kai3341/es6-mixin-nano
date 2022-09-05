/*
This module is a good example how to create two new libraries while you are
publishing your library
*/

class ColumnRendererDefault {
  static defaults = {
    alignDelimiters: true,
    delimiterDash: "-",
    alignDelimiter: ":",
    alignCenterPreferLeft: 1,
    space: " ",
    len: 1,
  };

  static delimiters = ({ delimiterDash }) => [delimiterDash, delimiterDash];
  static minimalDelimiter = ({ delimiterDash }) => (delimiterDash);

  constructor(options) {
    const userOptions = { ...this.constructor.defaults, ...options };
    userOptions.delimiters = this.constructor.delimiters(userOptions);
    const minimalDelimiter = this.constructor.minimalDelimiter(userOptions);
    const minLength = minimalDelimiter.length;
    this.minimalDelimiter = minimalDelimiter;
    this.minLength = minLength;
    this.options = userOptions;
    this.setLen(minLength);
  }

  render(str) {
    const { len, space } = this.options;
    const rest = len - str.length;
    return str + space.repeat(rest);
  }

  renderDelimiter() {
    const { options, minimalDelimiter, minLength } = this;
    const { delimiters, alignDelimiters, delimiterDash, len } = options;

    if (!(alignDelimiters && len > minLength)) return minimalDelimiter;

    const [start, end] = delimiters;
    const centralDashCount = len - 2;

    return start + delimiterDash.repeat(centralDashCount) + end;
  }

  renderTitle() {
    return this.render(this.options.title);
  }

  setLen(value) {
    const { options } = this;
    options.len = Math.max(options.len, value);
  }
}

class _ColumnRendererLeftRight extends ColumnRendererDefault {
  static minimalDelimiter = ({ delimiters }) => (delimiters.join(""));
}

class ColumnRendererLeft extends _ColumnRendererLeftRight {
  static delimiters = ({ delimiterDash, alignDelimiter }) => (
    [alignDelimiter, delimiterDash]
  );
}

class ColumnRendererRight extends _ColumnRendererLeftRight {
  static delimiters = ({ delimiterDash, alignDelimiter }) => (
    [delimiterDash, alignDelimiter]
  );

  render(str) {
    const { len, space } = this.options;
    const rest = len - str.length;
    return space.repeat(rest) + str;
  }
}

class ColumnRendererCenter extends ColumnRendererDefault {
  static delimiters = ({ alignDelimiter }) => [alignDelimiter, alignDelimiter];
  static minimalDelimiter = ({ delimiters, delimiterDash }) => (
    delimiters.join(delimiterDash)
  );

  render(str) {
    const { len, space, alignCenterPreferLeft } = this.options;
    const rest = len - str.length;
    const isEven = (rest % 2) * alignCenterPreferLeft;
    const before = (rest - isEven) / 2;
    const after = before + isEven;

    return space.repeat(before) + str + space.repeat(after);
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
        ? ""
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
    this.renderer.options.title = this.serialize(options.title);
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

  constructor({ columns, columnMutual, reportOptions }) {
    this.settings = this.constructor.settingsFromOptions(reportOptions);
    this.report = [];
    this.rowConfig = columns.map(
      item => new ColumnKeeper({ ...columnMutual, ...item })
    );
  }

  prepareRow(row) {
    for (const cfg of this.rowConfig) {
      const { key } = cfg;
      const value = row[key];
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

async function sizeReport(path, exportedName, mdReportSettings) {
  try {
    const bundle = await import(path);
  } catch (e) {
    console.error("Run `npm run build` first!", e);
  }

  const targetModule = self[exportedName];
  const targetModuleDesciptors = Object.getOwnPropertyDescriptors(targetModule);
  delete targetModuleDesciptors["__esModule"];

  const mdReport = new MarkdownTable(mdReportSettings);

  for (const [name, value] of Object.entries(targetModuleDesciptors)) {
    const compiled = value.get();
    const source = compiled.toString();
    const bytes = source.length;
    mdReport.row({ name, bytes, source });
  }

  console.log(mdReport.render());
}

// -----------------------------------------------------------------------------

const mdReportSettings = {
  columns: [
    { key: "name", title: "API Name" },
    { key: "bytes", title: "Size (bytes)", align: "right" },
    { key: "source", title: "Source Code", hide: process.env.SOURCE_HIDE },
  ],
  columnMutual: {
    delimiterDash: "=",
  },
};

sizeReport("./dist/bundle.js", "ES6MixinNano", mdReportSettings);
