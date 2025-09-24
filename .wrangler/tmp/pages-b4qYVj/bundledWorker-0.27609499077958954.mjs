var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// ../.wrangler/tmp/bundle-oogNgg/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// ../node_modules/unenv/dist/runtime/_internal/utils.mjs
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
__name(PerformanceEntry, "PerformanceEntry");
var PerformanceMark = /* @__PURE__ */ __name(class PerformanceMark2 extends PerformanceEntry {
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
}, "PerformanceMark");
var PerformanceMeasure = class extends PerformanceEntry {
  entryType = "measure";
};
__name(PerformanceMeasure, "PerformanceMeasure");
var PerformanceResourceTiming = class extends PerformanceEntry {
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
__name(PerformanceResourceTiming, "PerformanceResourceTiming");
var PerformanceObserverEntryList = class {
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
__name(PerformanceObserverEntryList, "PerformanceObserverEntryList");
var Performance = class {
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
__name(Performance, "Performance");
var PerformanceObserver = class {
  __unenv__ = true;
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
__name(PerformanceObserver, "PerformanceObserver");
__publicField(PerformanceObserver, "supportedEntryTypes", []);
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
import { Socket } from "node:net";
var ReadStream = class extends Socket {
  fd;
  constructor(fd) {
    super();
    this.fd = fd;
  }
  isRaw = false;
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
  isTTY = false;
};
__name(ReadStream, "ReadStream");

// ../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
import { Socket as Socket2 } from "node:net";
var WriteStream = class extends Socket2 {
  fd;
  constructor(fd) {
    super();
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y2, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  columns = 80;
  rows = 24;
  isTTY = false;
};
__name(WriteStream, "WriteStream");

// ../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class extends EventEmitter {
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return "";
  }
  get versions() {
    return {};
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  ref() {
  }
  unref() {
  }
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: () => 0 });
  mainModule = void 0;
  domain = void 0;
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};
__name(Process, "Process");

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var { exit, platform, nextTick } = getBuiltinModule(
  "node:process"
);
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  nextTick
});
var {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  finalization,
  features,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  on,
  off,
  once,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// _worker.js
var Xr = Object.defineProperty;
var Ht = /* @__PURE__ */ __name((e) => {
  throw TypeError(e);
}, "Ht");
var Zr = /* @__PURE__ */ __name((e, t, r) => t in e ? Xr(e, t, { enumerable: true, configurable: true, writable: true, value: r }) : e[t] = r, "Zr");
var g = /* @__PURE__ */ __name((e, t, r) => Zr(e, typeof t != "symbol" ? t + "" : t, r), "g");
var ut = /* @__PURE__ */ __name((e, t, r) => t.has(e) || Ht("Cannot " + r), "ut");
var u = /* @__PURE__ */ __name((e, t, r) => (ut(e, t, "read from private field"), r ? r.call(e) : t.get(e)), "u");
var R = /* @__PURE__ */ __name((e, t, r) => t.has(e) ? Ht("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), "R");
var y = /* @__PURE__ */ __name((e, t, r, a) => (ut(e, t, "write to private field"), a ? a.call(e, r) : t.set(e, r), r), "y");
var b = /* @__PURE__ */ __name((e, t, r) => (ut(e, t, "access private method"), r), "b");
var Pt = /* @__PURE__ */ __name((e, t, r, a) => ({ set _(s) {
  y(e, t, s, r);
}, get _() {
  return u(e, t, a);
} }), "Pt");
var fr = { Stringify: 1 };
var B = /* @__PURE__ */ __name((e, t) => {
  const r = new String(e);
  return r.isEscaped = true, r.callbacks = t, r;
}, "B");
var Qr = /[&<>'"]/;
var pr = /* @__PURE__ */ __name(async (e, t) => {
  let r = "";
  t || (t = []);
  const a = await Promise.all(e);
  for (let s = a.length - 1; r += a[s], s--, !(s < 0); s--) {
    let n = a[s];
    typeof n == "object" && t.push(...n.callbacks || []);
    const o = n.isEscaped;
    if (n = await (typeof n == "object" ? n.toString() : n), typeof n == "object" && t.push(...n.callbacks || []), n.isEscaped ?? o)
      r += n;
    else {
      const i = [r];
      se(n, i), r = i[0];
    }
  }
  return B(r, t);
}, "pr");
var se = /* @__PURE__ */ __name((e, t) => {
  const r = e.search(Qr);
  if (r === -1) {
    t[0] += e;
    return;
  }
  let a, s, n = 0;
  for (s = r; s < e.length; s++) {
    switch (e.charCodeAt(s)) {
      case 34:
        a = "&quot;";
        break;
      case 39:
        a = "&#39;";
        break;
      case 38:
        a = "&amp;";
        break;
      case 60:
        a = "&lt;";
        break;
      case 62:
        a = "&gt;";
        break;
      default:
        continue;
    }
    t[0] += e.substring(n, s) + a, n = s + 1;
  }
  t[0] += e.substring(n, s);
}, "se");
var hr = /* @__PURE__ */ __name((e) => {
  const t = e.callbacks;
  if (!(t != null && t.length))
    return e;
  const r = [e], a = {};
  return t.forEach((s) => s({ phase: fr.Stringify, buffer: r, context: a })), r[0];
}, "hr");
var mr = /* @__PURE__ */ __name(async (e, t, r, a, s) => {
  typeof e == "object" && !(e instanceof String) && (e instanceof Promise || (e = e.toString()), e instanceof Promise && (e = await e));
  const n = e.callbacks;
  return n != null && n.length ? (s ? s[0] += e : s = [e], Promise.all(n.map((i) => i({ phase: t, buffer: s, context: a }))).then((i) => Promise.all(i.filter(Boolean).map((c) => mr(c, t, false, a, s))).then(() => s[0]))) : Promise.resolve(e);
}, "mr");
var ea = /* @__PURE__ */ __name((e, ...t) => {
  const r = [""];
  for (let a = 0, s = e.length - 1; a < s; a++) {
    r[0] += e[a];
    const n = Array.isArray(t[a]) ? t[a].flat(1 / 0) : [t[a]];
    for (let o = 0, i = n.length; o < i; o++) {
      const c = n[o];
      if (typeof c == "string")
        se(c, r);
      else if (typeof c == "number")
        r[0] += c;
      else {
        if (typeof c == "boolean" || c === null || c === void 0)
          continue;
        if (typeof c == "object" && c.isEscaped)
          if (c.callbacks)
            r.unshift("", c);
          else {
            const l = c.toString();
            l instanceof Promise ? r.unshift("", l) : r[0] += l;
          }
        else
          c instanceof Promise ? r.unshift("", c) : se(c.toString(), r);
      }
    }
  }
  return r[0] += e.at(-1), r.length === 1 ? "callbacks" in r ? B(hr(B(r[0], r.callbacks))) : B(r[0]) : pr(r, r.callbacks);
}, "ea");
var Ct = Symbol("RENDERER");
var Rt = Symbol("ERROR_HANDLER");
var N = Symbol("STASH");
var Er = Symbol("INTERNAL");
var ta = Symbol("MEMO");
var nt = Symbol("PERMALINK");
var Bt = /* @__PURE__ */ __name((e) => (e[Er] = true, e), "Bt");
var vr = /* @__PURE__ */ __name((e) => ({ value: t, children: r }) => {
  if (!r)
    return;
  const a = { children: [{ tag: Bt(() => {
    e.push(t);
  }), props: {} }] };
  Array.isArray(r) ? a.children.push(...r.flat()) : a.children.push(r), a.children.push({ tag: Bt(() => {
    e.pop();
  }), props: {} });
  const s = { tag: "", props: a, type: "" };
  return s[Rt] = (n) => {
    throw e.pop(), n;
  }, s;
}, "vr");
var gr = /* @__PURE__ */ __name((e) => {
  const t = [e], r = vr(t);
  return r.values = t, r.Provider = r, Ce.push(r), r;
}, "gr");
var Ce = [];
var Dt = /* @__PURE__ */ __name((e) => {
  const t = [e], r = /* @__PURE__ */ __name((a) => {
    t.push(a.value);
    let s;
    try {
      s = a.children ? (Array.isArray(a.children) ? new Rr("", {}, a.children) : a.children).toString() : "";
    } finally {
      t.pop();
    }
    return s instanceof Promise ? s.then((n) => B(n, n.callbacks)) : B(s);
  }, "r");
  return r.values = t, r.Provider = r, r[Ct] = vr(t), Ce.push(r), r;
}, "Dt");
var Ae = /* @__PURE__ */ __name((e) => e.values.at(-1), "Ae");
var Xe = { title: [], script: ["src"], style: ["data-href"], link: ["href"], meta: ["name", "httpEquiv", "charset", "itemProp"] };
var St = {};
var Ze = "data-precedence";
var ze = /* @__PURE__ */ __name((e) => Array.isArray(e) ? e : [e], "ze");
var Ut = /* @__PURE__ */ new WeakMap();
var qt = /* @__PURE__ */ __name((e, t, r, a) => ({ buffer: s, context: n }) => {
  if (!s)
    return;
  const o = Ut.get(n) || {};
  Ut.set(n, o);
  const i = o[e] || (o[e] = []);
  let c = false;
  const l = Xe[e];
  if (l.length > 0) {
    e:
      for (const [, d] of i)
        for (const p of l)
          if (((d == null ? void 0 : d[p]) ?? null) === (r == null ? void 0 : r[p])) {
            c = true;
            break e;
          }
  }
  if (c ? s[0] = s[0].replaceAll(t, "") : l.length > 0 ? i.push([t, r, a]) : i.unshift([t, r, a]), s[0].indexOf("</head>") !== -1) {
    let d;
    if (a === void 0)
      d = i.map(([p]) => p);
    else {
      const p = [];
      d = i.map(([f, , E]) => {
        let v = p.indexOf(E);
        return v === -1 && (p.push(E), v = p.length - 1), [f, v];
      }).sort((f, E) => f[1] - E[1]).map(([f]) => f);
    }
    d.forEach((p) => {
      s[0] = s[0].replaceAll(p, "");
    }), s[0] = s[0].replace(/(?=<\/head>)/, d.join(""));
  }
}, "qt");
var Ve = /* @__PURE__ */ __name((e, t, r) => B(new k(e, r, ze(t ?? [])).toString()), "Ve");
var Ye = /* @__PURE__ */ __name((e, t, r, a) => {
  if ("itemProp" in r)
    return Ve(e, t, r);
  let { precedence: s, blocking: n, ...o } = r;
  s = a ? s ?? "" : void 0, a && (o[Ze] = s);
  const i = new k(e, o, ze(t || [])).toString();
  return i instanceof Promise ? i.then((c) => B(i, [...c.callbacks || [], qt(e, c, o, s)])) : B(i, [qt(e, i, o, s)]);
}, "Ye");
var ra = /* @__PURE__ */ __name(({ children: e, ...t }) => {
  const r = jt();
  if (r) {
    const a = Ae(r);
    if (a === "svg" || a === "head")
      return new k("title", t, ze(e ?? []));
  }
  return Ye("title", e, t, false);
}, "ra");
var aa = /* @__PURE__ */ __name(({ children: e, ...t }) => {
  const r = jt();
  return ["src", "async"].some((a) => !t[a]) || r && Ae(r) === "head" ? Ve("script", e, t) : Ye("script", e, t, false);
}, "aa");
var sa = /* @__PURE__ */ __name(({ children: e, ...t }) => ["href", "precedence"].every((r) => r in t) ? (t["data-href"] = t.href, delete t.href, Ye("style", e, t, true)) : Ve("style", e, t), "sa");
var na = /* @__PURE__ */ __name(({ children: e, ...t }) => ["onLoad", "onError"].some((r) => r in t) || t.rel === "stylesheet" && (!("precedence" in t) || "disabled" in t) ? Ve("link", e, t) : Ye("link", e, t, "precedence" in t), "na");
var oa = /* @__PURE__ */ __name(({ children: e, ...t }) => {
  const r = jt();
  return r && Ae(r) === "head" ? Ve("meta", e, t) : Ye("meta", e, t, false);
}, "oa");
var _r = /* @__PURE__ */ __name((e, { children: t, ...r }) => new k(e, r, ze(t ?? [])), "_r");
var ia = /* @__PURE__ */ __name((e) => (typeof e.action == "function" && (e.action = nt in e.action ? e.action[nt] : void 0), _r("form", e)), "ia");
var yr = /* @__PURE__ */ __name((e, t) => (typeof t.formAction == "function" && (t.formAction = nt in t.formAction ? t.formAction[nt] : void 0), _r(e, t)), "yr");
var ca = /* @__PURE__ */ __name((e) => yr("input", e), "ca");
var la = /* @__PURE__ */ __name((e) => yr("button", e), "la");
var ft = Object.freeze(Object.defineProperty({ __proto__: null, button: la, form: ia, input: ca, link: na, meta: oa, script: aa, style: sa, title: ra }, Symbol.toStringTag, { value: "Module" }));
var da = /* @__PURE__ */ new Map([["className", "class"], ["htmlFor", "for"], ["crossOrigin", "crossorigin"], ["httpEquiv", "http-equiv"], ["itemProp", "itemprop"], ["fetchPriority", "fetchpriority"], ["noModule", "nomodule"], ["formAction", "formaction"]]);
var ot = /* @__PURE__ */ __name((e) => da.get(e) || e, "ot");
var Tr = /* @__PURE__ */ __name((e, t) => {
  for (const [r, a] of Object.entries(e)) {
    const s = r[0] === "-" || !/[A-Z]/.test(r) ? r : r.replace(/[A-Z]/g, (n) => `-${n.toLowerCase()}`);
    t(s, a == null ? null : typeof a == "number" ? s.match(/^(?:a|border-im|column(?:-c|s)|flex(?:$|-[^b])|grid-(?:ar|[^a])|font-w|li|or|sca|st|ta|wido|z)|ty$/) ? `${a}` : `${a}px` : a);
  }
}, "Tr");
var He = void 0;
var jt = /* @__PURE__ */ __name(() => He, "jt");
var ua = /* @__PURE__ */ __name((e) => /[A-Z]/.test(e) && e.match(/^(?:al|basel|clip(?:Path|Rule)$|co|do|fill|fl|fo|gl|let|lig|i|marker[EMS]|o|pai|pointe|sh|st[or]|text[^L]|tr|u|ve|w)/) ? e.replace(/([A-Z])/g, "-$1").toLowerCase() : e, "ua");
var fa = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"];
var pa = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "defer", "disabled", "download", "formnovalidate", "hidden", "inert", "ismap", "itemscope", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "selected"];
var At = /* @__PURE__ */ __name((e, t) => {
  for (let r = 0, a = e.length; r < a; r++) {
    const s = e[r];
    if (typeof s == "string")
      se(s, t);
    else {
      if (typeof s == "boolean" || s === null || s === void 0)
        continue;
      s instanceof k ? s.toStringToBuffer(t) : typeof s == "number" || s.isEscaped ? t[0] += s : s instanceof Promise ? t.unshift("", s) : At(s, t);
    }
  }
}, "At");
var k = /* @__PURE__ */ __name(class {
  constructor(e, t, r) {
    g(this, "tag");
    g(this, "props");
    g(this, "key");
    g(this, "children");
    g(this, "isEscaped", true);
    g(this, "localContexts");
    this.tag = e, this.props = t, this.children = r;
  }
  get type() {
    return this.tag;
  }
  get ref() {
    return this.props.ref || null;
  }
  toString() {
    var t, r;
    const e = [""];
    (t = this.localContexts) == null || t.forEach(([a, s]) => {
      a.values.push(s);
    });
    try {
      this.toStringToBuffer(e);
    } finally {
      (r = this.localContexts) == null || r.forEach(([a]) => {
        a.values.pop();
      });
    }
    return e.length === 1 ? "callbacks" in e ? hr(B(e[0], e.callbacks)).toString() : e[0] : pr(e, e.callbacks);
  }
  toStringToBuffer(e) {
    const t = this.tag, r = this.props;
    let { children: a } = this;
    e[0] += `<${t}`;
    const s = He && Ae(He) === "svg" ? (n) => ua(ot(n)) : (n) => ot(n);
    for (let [n, o] of Object.entries(r))
      if (n = s(n), n !== "children") {
        if (n === "style" && typeof o == "object") {
          let i = "";
          Tr(o, (c, l) => {
            l != null && (i += `${i ? ";" : ""}${c}:${l}`);
          }), e[0] += ' style="', se(i, e), e[0] += '"';
        } else if (typeof o == "string")
          e[0] += ` ${n}="`, se(o, e), e[0] += '"';
        else if (o != null)
          if (typeof o == "number" || o.isEscaped)
            e[0] += ` ${n}="${o}"`;
          else if (typeof o == "boolean" && pa.includes(n))
            o && (e[0] += ` ${n}=""`);
          else if (n === "dangerouslySetInnerHTML") {
            if (a.length > 0)
              throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
            a = [B(o.__html)];
          } else if (o instanceof Promise)
            e[0] += ` ${n}="`, e.unshift('"', o);
          else if (typeof o == "function") {
            if (!n.startsWith("on") && n !== "ref")
              throw new Error(`Invalid prop '${n}' of type 'function' supplied to '${t}'.`);
          } else
            e[0] += ` ${n}="`, se(o.toString(), e), e[0] += '"';
      }
    if (fa.includes(t) && a.length === 0) {
      e[0] += "/>";
      return;
    }
    e[0] += ">", At(a, e), e[0] += `</${t}>`;
  }
}, "k");
var pt = /* @__PURE__ */ __name(class extends k {
  toStringToBuffer(e) {
    const { children: t } = this, r = this.tag.call(null, { ...this.props, children: t.length <= 1 ? t[0] : t });
    if (!(typeof r == "boolean" || r == null))
      if (r instanceof Promise)
        if (Ce.length === 0)
          e.unshift("", r);
        else {
          const a = Ce.map((s) => [s, s.values.at(-1)]);
          e.unshift("", r.then((s) => (s instanceof k && (s.localContexts = a), s)));
        }
      else
        r instanceof k ? r.toStringToBuffer(e) : typeof r == "number" || r.isEscaped ? (e[0] += r, r.callbacks && (e.callbacks || (e.callbacks = []), e.callbacks.push(...r.callbacks))) : se(r, e);
  }
}, "pt");
var Rr = /* @__PURE__ */ __name(class extends k {
  toStringToBuffer(e) {
    At(this.children, e);
  }
}, "Rr");
var Ft = /* @__PURE__ */ __name((e, t, ...r) => {
  t ?? (t = {}), r.length && (t.children = r.length === 1 ? r[0] : r);
  const a = t.key;
  delete t.key;
  const s = Qe(e, t, r);
  return s.key = a, s;
}, "Ft");
var kt = false;
var Qe = /* @__PURE__ */ __name((e, t, r) => {
  if (!kt) {
    for (const a in St)
      ft[a][Ct] = St[a];
    kt = true;
  }
  return typeof e == "function" ? new pt(e, t, r) : ft[e] ? new pt(ft[e], t, r) : e === "svg" || e === "head" ? (He || (He = Dt("")), new k(e, t, [new pt(He, { value: e }, r)])) : new k(e, t, r);
}, "Qe");
var ha = /* @__PURE__ */ __name(({ children: e }) => new Rr("", { children: e }, Array.isArray(e) ? e : e ? [e] : []), "ha");
function S(e, t, r) {
  let a;
  if (!t || !("children" in t))
    a = Qe(e, t, []);
  else {
    const s = t.children;
    a = Array.isArray(s) ? Qe(e, t, s) : Qe(e, t, [s]);
  }
  return a.key = r, a;
}
__name(S, "S");
var $t = /* @__PURE__ */ __name((e, t, r) => (a, s) => {
  let n = -1;
  return o(0);
  async function o(i) {
    if (i <= n)
      throw new Error("next() called multiple times");
    n = i;
    let c, l = false, d;
    if (e[i] ? (d = e[i][0][0], a.req.routeIndex = i) : d = i === e.length && s || void 0, d)
      try {
        c = await d(a, () => o(i + 1));
      } catch (p) {
        if (p instanceof Error && t)
          a.error = p, c = await t(p, a), l = true;
        else
          throw p;
      }
    else
      a.finalized === false && r && (c = await r(a));
    return c && (a.finalized === false || l) && (a.res = c), a;
  }
  __name(o, "o");
}, "$t");
var ma = Symbol();
var Ea = /* @__PURE__ */ __name(async (e, t = /* @__PURE__ */ Object.create(null)) => {
  const { all: r = false, dot: a = false } = t, n = (e instanceof Nr ? e.raw.headers : e.headers).get("Content-Type");
  return n != null && n.startsWith("multipart/form-data") || n != null && n.startsWith("application/x-www-form-urlencoded") ? va(e, { all: r, dot: a }) : {};
}, "Ea");
async function va(e, t) {
  const r = await e.formData();
  return r ? ga(r, t) : {};
}
__name(va, "va");
function ga(e, t) {
  const r = /* @__PURE__ */ Object.create(null);
  return e.forEach((a, s) => {
    t.all || s.endsWith("[]") ? _a(r, s, a) : r[s] = a;
  }), t.dot && Object.entries(r).forEach(([a, s]) => {
    a.includes(".") && (ya(r, a, s), delete r[a]);
  }), r;
}
__name(ga, "ga");
var _a = /* @__PURE__ */ __name((e, t, r) => {
  e[t] !== void 0 ? Array.isArray(e[t]) ? e[t].push(r) : e[t] = [e[t], r] : t.endsWith("[]") ? e[t] = [r] : e[t] = r;
}, "_a");
var ya = /* @__PURE__ */ __name((e, t, r) => {
  let a = e;
  const s = t.split(".");
  s.forEach((n, o) => {
    o === s.length - 1 ? a[n] = r : ((!a[n] || typeof a[n] != "object" || Array.isArray(a[n]) || a[n] instanceof File) && (a[n] = /* @__PURE__ */ Object.create(null)), a = a[n]);
  });
}, "ya");
var Sr = /* @__PURE__ */ __name((e) => {
  const t = e.split("/");
  return t[0] === "" && t.shift(), t;
}, "Sr");
var Ta = /* @__PURE__ */ __name((e) => {
  const { groups: t, path: r } = Ra(e), a = Sr(r);
  return Sa(a, t);
}, "Ta");
var Ra = /* @__PURE__ */ __name((e) => {
  const t = [];
  return e = e.replace(/\{[^}]+\}/g, (r, a) => {
    const s = `@${a}`;
    return t.push([s, r]), s;
  }), { groups: t, path: e };
}, "Ra");
var Sa = /* @__PURE__ */ __name((e, t) => {
  for (let r = t.length - 1; r >= 0; r--) {
    const [a] = t[r];
    for (let s = e.length - 1; s >= 0; s--)
      if (e[s].includes(a)) {
        e[s] = e[s].replace(a, t[r][1]);
        break;
      }
  }
  return e;
}, "Sa");
var Ge = {};
var wa = /* @__PURE__ */ __name((e, t) => {
  if (e === "*")
    return "*";
  const r = e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (r) {
    const a = `${e}#${t}`;
    return Ge[a] || (r[2] ? Ge[a] = t && t[0] !== ":" && t[0] !== "*" ? [a, r[1], new RegExp(`^${r[2]}(?=/${t})`)] : [e, r[1], new RegExp(`^${r[2]}$`)] : Ge[a] = [e, r[1], true]), Ge[a];
  }
  return null;
}, "wa");
var lt = /* @__PURE__ */ __name((e, t) => {
  try {
    return t(e);
  } catch {
    return e.replace(/(?:%[0-9A-Fa-f]{2})+/g, (r) => {
      try {
        return t(r);
      } catch {
        return r;
      }
    });
  }
}, "lt");
var Oa = /* @__PURE__ */ __name((e) => lt(e, decodeURI), "Oa");
var wr = /* @__PURE__ */ __name((e) => {
  const t = e.url, r = t.indexOf("/", t.indexOf(":") + 4);
  let a = r;
  for (; a < t.length; a++) {
    const s = t.charCodeAt(a);
    if (s === 37) {
      const n = t.indexOf("?", a), o = t.slice(r, n === -1 ? void 0 : n);
      return Oa(o.includes("%25") ? o.replace(/%25/g, "%2525") : o);
    } else if (s === 63)
      break;
  }
  return t.slice(r, a);
}, "wr");
var ba = /* @__PURE__ */ __name((e) => {
  const t = wr(e);
  return t.length > 1 && t.at(-1) === "/" ? t.slice(0, -1) : t;
}, "ba");
var ye = /* @__PURE__ */ __name((e, t, ...r) => (r.length && (t = ye(t, ...r)), `${(e == null ? void 0 : e[0]) === "/" ? "" : "/"}${e}${t === "/" ? "" : `${(e == null ? void 0 : e.at(-1)) === "/" ? "" : "/"}${(t == null ? void 0 : t[0]) === "/" ? t.slice(1) : t}`}`), "ye");
var Or = /* @__PURE__ */ __name((e) => {
  if (e.charCodeAt(e.length - 1) !== 63 || !e.includes(":"))
    return null;
  const t = e.split("/"), r = [];
  let a = "";
  return t.forEach((s) => {
    if (s !== "" && !/\:/.test(s))
      a += "/" + s;
    else if (/\:/.test(s))
      if (/\?/.test(s)) {
        r.length === 0 && a === "" ? r.push("/") : r.push(a);
        const n = s.replace("?", "");
        a += "/" + n, r.push(a);
      } else
        a += "/" + s;
  }), r.filter((s, n, o) => o.indexOf(s) === n);
}, "Or");
var ht = /* @__PURE__ */ __name((e) => /[%+]/.test(e) ? (e.indexOf("+") !== -1 && (e = e.replace(/\+/g, " ")), e.indexOf("%") !== -1 ? lt(e, It) : e) : e, "ht");
var br = /* @__PURE__ */ __name((e, t, r) => {
  let a;
  if (!r && t && !/[%+]/.test(t)) {
    let o = e.indexOf(`?${t}`, 8);
    for (o === -1 && (o = e.indexOf(`&${t}`, 8)); o !== -1; ) {
      const i = e.charCodeAt(o + t.length + 1);
      if (i === 61) {
        const c = o + t.length + 2, l = e.indexOf("&", c);
        return ht(e.slice(c, l === -1 ? void 0 : l));
      } else if (i == 38 || isNaN(i))
        return "";
      o = e.indexOf(`&${t}`, o + 1);
    }
    if (a = /[%+]/.test(e), !a)
      return;
  }
  const s = {};
  a ?? (a = /[%+]/.test(e));
  let n = e.indexOf("?", 8);
  for (; n !== -1; ) {
    const o = e.indexOf("&", n + 1);
    let i = e.indexOf("=", n);
    i > o && o !== -1 && (i = -1);
    let c = e.slice(n + 1, i === -1 ? o === -1 ? void 0 : o : i);
    if (a && (c = ht(c)), n = o, c === "")
      continue;
    let l;
    i === -1 ? l = "" : (l = e.slice(i + 1, o === -1 ? void 0 : o), a && (l = ht(l))), r ? (s[c] && Array.isArray(s[c]) || (s[c] = []), s[c].push(l)) : s[c] ?? (s[c] = l);
  }
  return t ? s[t] : s;
}, "br");
var Na = br;
var Ca = /* @__PURE__ */ __name((e, t) => br(e, t, true), "Ca");
var It = decodeURIComponent;
var Wt = /* @__PURE__ */ __name((e) => lt(e, It), "Wt");
var Se;
var P;
var K;
var Cr;
var Dr;
var wt;
var Z;
var ar;
var Nr = (ar = /* @__PURE__ */ __name(class {
  constructor(e, t = "/", r = [[]]) {
    R(this, K);
    g(this, "raw");
    R(this, Se);
    R(this, P);
    g(this, "routeIndex", 0);
    g(this, "path");
    g(this, "bodyCache", {});
    R(this, Z, (e2) => {
      const { bodyCache: t2, raw: r2 } = this, a = t2[e2];
      if (a)
        return a;
      const s = Object.keys(t2)[0];
      return s ? t2[s].then((n) => (s === "json" && (n = JSON.stringify(n)), new Response(n)[e2]())) : t2[e2] = r2[e2]();
    });
    this.raw = e, this.path = t, y(this, P, r), y(this, Se, {});
  }
  param(e) {
    return e ? b(this, K, Cr).call(this, e) : b(this, K, Dr).call(this);
  }
  query(e) {
    return Na(this.url, e);
  }
  queries(e) {
    return Ca(this.url, e);
  }
  header(e) {
    if (e)
      return this.raw.headers.get(e) ?? void 0;
    const t = {};
    return this.raw.headers.forEach((r, a) => {
      t[a] = r;
    }), t;
  }
  async parseBody(e) {
    var t;
    return (t = this.bodyCache).parsedBody ?? (t.parsedBody = await Ea(this, e));
  }
  json() {
    return u(this, Z).call(this, "text").then((e) => JSON.parse(e));
  }
  text() {
    return u(this, Z).call(this, "text");
  }
  arrayBuffer() {
    return u(this, Z).call(this, "arrayBuffer");
  }
  blob() {
    return u(this, Z).call(this, "blob");
  }
  formData() {
    return u(this, Z).call(this, "formData");
  }
  addValidatedData(e, t) {
    u(this, Se)[e] = t;
  }
  valid(e) {
    return u(this, Se)[e];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [ma]() {
    return u(this, P);
  }
  get matchedRoutes() {
    return u(this, P)[0].map(([[, e]]) => e);
  }
  get routePath() {
    return u(this, P)[0].map(([[, e]]) => e)[this.routeIndex].path;
  }
}, "ar"), Se = /* @__PURE__ */ new WeakMap(), P = /* @__PURE__ */ new WeakMap(), K = /* @__PURE__ */ new WeakSet(), Cr = /* @__PURE__ */ __name(function(e) {
  const t = u(this, P)[0][this.routeIndex][1][e], r = b(this, K, wt).call(this, t);
  return r && /\%/.test(r) ? Wt(r) : r;
}, "Cr"), Dr = /* @__PURE__ */ __name(function() {
  const e = {}, t = Object.keys(u(this, P)[0][this.routeIndex][1]);
  for (const r of t) {
    const a = b(this, K, wt).call(this, u(this, P)[0][this.routeIndex][1][r]);
    a !== void 0 && (e[r] = /\%/.test(a) ? Wt(a) : a);
  }
  return e;
}, "Dr"), wt = /* @__PURE__ */ __name(function(e) {
  return u(this, P)[1] ? u(this, P)[1][e] : e;
}, "wt"), Z = /* @__PURE__ */ new WeakMap(), ar);
var Da = "text/plain; charset=UTF-8";
var mt = /* @__PURE__ */ __name((e, t) => ({ "Content-Type": e, ...t }), "mt");
var Ue;
var qe;
var V;
var we;
var Y;
var L;
var Fe;
var Oe;
var be;
var de;
var ke;
var $e;
var Q;
var Te;
var sr;
var ja = (sr = /* @__PURE__ */ __name(class {
  constructor(e, t) {
    R(this, Q);
    R(this, Ue);
    R(this, qe);
    g(this, "env", {});
    R(this, V);
    g(this, "finalized", false);
    g(this, "error");
    R(this, we);
    R(this, Y);
    R(this, L);
    R(this, Fe);
    R(this, Oe);
    R(this, be);
    R(this, de);
    R(this, ke);
    R(this, $e);
    g(this, "render", (...e2) => (u(this, Oe) ?? y(this, Oe, (t2) => this.html(t2)), u(this, Oe).call(this, ...e2)));
    g(this, "setLayout", (e2) => y(this, Fe, e2));
    g(this, "getLayout", () => u(this, Fe));
    g(this, "setRenderer", (e2) => {
      y(this, Oe, e2);
    });
    g(this, "header", (e2, t2, r) => {
      this.finalized && y(this, L, new Response(u(this, L).body, u(this, L)));
      const a = u(this, L) ? u(this, L).headers : u(this, de) ?? y(this, de, new Headers());
      t2 === void 0 ? a.delete(e2) : r != null && r.append ? a.append(e2, t2) : a.set(e2, t2);
    });
    g(this, "status", (e2) => {
      y(this, we, e2);
    });
    g(this, "set", (e2, t2) => {
      u(this, V) ?? y(this, V, /* @__PURE__ */ new Map()), u(this, V).set(e2, t2);
    });
    g(this, "get", (e2) => u(this, V) ? u(this, V).get(e2) : void 0);
    g(this, "newResponse", (...e2) => b(this, Q, Te).call(this, ...e2));
    g(this, "body", (e2, t2, r) => b(this, Q, Te).call(this, e2, t2, r));
    g(this, "text", (e2, t2, r) => !u(this, de) && !u(this, we) && !t2 && !r && !this.finalized ? new Response(e2) : b(this, Q, Te).call(this, e2, t2, mt(Da, r)));
    g(this, "json", (e2, t2, r) => b(this, Q, Te).call(this, JSON.stringify(e2), t2, mt("application/json", r)));
    g(this, "html", (e2, t2, r) => {
      const a = /* @__PURE__ */ __name((s) => b(this, Q, Te).call(this, s, t2, mt("text/html; charset=UTF-8", r)), "a");
      return typeof e2 == "object" ? mr(e2, fr.Stringify, false, {}).then(a) : a(e2);
    });
    g(this, "redirect", (e2, t2) => {
      const r = String(e2);
      return this.header("Location", /[^\x00-\xFF]/.test(r) ? encodeURI(r) : r), this.newResponse(null, t2 ?? 302);
    });
    g(this, "notFound", () => (u(this, be) ?? y(this, be, () => new Response()), u(this, be).call(this, this)));
    y(this, Ue, e), t && (y(this, Y, t.executionCtx), this.env = t.env, y(this, be, t.notFoundHandler), y(this, $e, t.path), y(this, ke, t.matchResult));
  }
  get req() {
    return u(this, qe) ?? y(this, qe, new Nr(u(this, Ue), u(this, $e), u(this, ke))), u(this, qe);
  }
  get event() {
    if (u(this, Y) && "respondWith" in u(this, Y))
      return u(this, Y);
    throw Error("This context has no FetchEvent");
  }
  get executionCtx() {
    if (u(this, Y))
      return u(this, Y);
    throw Error("This context has no ExecutionContext");
  }
  get res() {
    return u(this, L) || y(this, L, new Response(null, { headers: u(this, de) ?? y(this, de, new Headers()) }));
  }
  set res(e) {
    if (u(this, L) && e) {
      e = new Response(e.body, e);
      for (const [t, r] of u(this, L).headers.entries())
        if (t !== "content-type")
          if (t === "set-cookie") {
            const a = u(this, L).headers.getSetCookie();
            e.headers.delete("set-cookie");
            for (const s of a)
              e.headers.append("set-cookie", s);
          } else
            e.headers.set(t, r);
    }
    y(this, L, e), this.finalized = true;
  }
  get var() {
    return u(this, V) ? Object.fromEntries(u(this, V)) : {};
  }
}, "sr"), Ue = /* @__PURE__ */ new WeakMap(), qe = /* @__PURE__ */ new WeakMap(), V = /* @__PURE__ */ new WeakMap(), we = /* @__PURE__ */ new WeakMap(), Y = /* @__PURE__ */ new WeakMap(), L = /* @__PURE__ */ new WeakMap(), Fe = /* @__PURE__ */ new WeakMap(), Oe = /* @__PURE__ */ new WeakMap(), be = /* @__PURE__ */ new WeakMap(), de = /* @__PURE__ */ new WeakMap(), ke = /* @__PURE__ */ new WeakMap(), $e = /* @__PURE__ */ new WeakMap(), Q = /* @__PURE__ */ new WeakSet(), Te = /* @__PURE__ */ __name(function(e, t, r) {
  const a = u(this, L) ? new Headers(u(this, L).headers) : u(this, de) ?? new Headers();
  if (typeof t == "object" && "headers" in t) {
    const n = t.headers instanceof Headers ? t.headers : new Headers(t.headers);
    for (const [o, i] of n)
      o.toLowerCase() === "set-cookie" ? a.append(o, i) : a.set(o, i);
  }
  if (r)
    for (const [n, o] of Object.entries(r))
      if (typeof o == "string")
        a.set(n, o);
      else {
        a.delete(n);
        for (const i of o)
          a.append(n, i);
      }
  const s = typeof t == "number" ? t : (t == null ? void 0 : t.status) ?? u(this, we);
  return new Response(e, { status: s, headers: a });
}, "Te"), sr);
var C = "ALL";
var Aa = "all";
var Ia = ["get", "post", "put", "delete", "options", "patch"];
var jr = "Can not add a route since the matcher is already built.";
var Ar = /* @__PURE__ */ __name(class extends Error {
}, "Ar");
var xa = "__COMPOSED_HANDLER";
var Ma = /* @__PURE__ */ __name((e) => e.text("404 Not Found", 404), "Ma");
var zt = /* @__PURE__ */ __name((e, t) => {
  if ("getResponse" in e) {
    const r = e.getResponse();
    return t.newResponse(r.body, r);
  }
  return console.error(e), t.text("Internal Server Error", 500);
}, "zt");
var U;
var D;
var xr;
var q;
var ie;
var et;
var tt;
var nr;
var Ir = (nr = /* @__PURE__ */ __name(class {
  constructor(t = {}) {
    R(this, D);
    g(this, "get");
    g(this, "post");
    g(this, "put");
    g(this, "delete");
    g(this, "options");
    g(this, "patch");
    g(this, "all");
    g(this, "on");
    g(this, "use");
    g(this, "router");
    g(this, "getPath");
    g(this, "_basePath", "/");
    R(this, U, "/");
    g(this, "routes", []);
    R(this, q, Ma);
    g(this, "errorHandler", zt);
    g(this, "onError", (t2) => (this.errorHandler = t2, this));
    g(this, "notFound", (t2) => (y(this, q, t2), this));
    g(this, "fetch", (t2, ...r) => b(this, D, tt).call(this, t2, r[1], r[0], t2.method));
    g(this, "request", (t2, r, a2, s2) => t2 instanceof Request ? this.fetch(r ? new Request(t2, r) : t2, a2, s2) : (t2 = t2.toString(), this.fetch(new Request(/^https?:\/\//.test(t2) ? t2 : `http://localhost${ye("/", t2)}`, r), a2, s2)));
    g(this, "fire", () => {
      addEventListener("fetch", (t2) => {
        t2.respondWith(b(this, D, tt).call(this, t2.request, t2, void 0, t2.request.method));
      });
    });
    [...Ia, Aa].forEach((n) => {
      this[n] = (o, ...i) => (typeof o == "string" ? y(this, U, o) : b(this, D, ie).call(this, n, u(this, U), o), i.forEach((c) => {
        b(this, D, ie).call(this, n, u(this, U), c);
      }), this);
    }), this.on = (n, o, ...i) => {
      for (const c of [o].flat()) {
        y(this, U, c);
        for (const l of [n].flat())
          i.map((d) => {
            b(this, D, ie).call(this, l.toUpperCase(), u(this, U), d);
          });
      }
      return this;
    }, this.use = (n, ...o) => (typeof n == "string" ? y(this, U, n) : (y(this, U, "*"), o.unshift(n)), o.forEach((i) => {
      b(this, D, ie).call(this, C, u(this, U), i);
    }), this);
    const { strict: a, ...s } = t;
    Object.assign(this, s), this.getPath = a ?? true ? t.getPath ?? wr : ba;
  }
  route(t, r) {
    const a = this.basePath(t);
    return r.routes.map((s) => {
      var o;
      let n;
      r.errorHandler === zt ? n = s.handler : (n = /* @__PURE__ */ __name(async (i, c) => (await $t([], r.errorHandler)(i, () => s.handler(i, c))).res, "n"), n[xa] = s.handler), b(o = a, D, ie).call(o, s.method, s.path, n);
    }), this;
  }
  basePath(t) {
    const r = b(this, D, xr).call(this);
    return r._basePath = ye(this._basePath, t), r;
  }
  mount(t, r, a) {
    let s, n;
    a && (typeof a == "function" ? n = a : (n = a.optionHandler, a.replaceRequest === false ? s = /* @__PURE__ */ __name((c) => c, "s") : s = a.replaceRequest));
    const o = n ? (c) => {
      const l = n(c);
      return Array.isArray(l) ? l : [l];
    } : (c) => {
      let l;
      try {
        l = c.executionCtx;
      } catch {
      }
      return [c.env, l];
    };
    s || (s = (() => {
      const c = ye(this._basePath, t), l = c === "/" ? 0 : c.length;
      return (d) => {
        const p = new URL(d.url);
        return p.pathname = p.pathname.slice(l) || "/", new Request(p, d);
      };
    })());
    const i = /* @__PURE__ */ __name(async (c, l) => {
      const d = await r(s(c.req.raw), ...o(c));
      if (d)
        return d;
      await l();
    }, "i");
    return b(this, D, ie).call(this, C, ye(t, "*"), i), this;
  }
}, "nr"), U = /* @__PURE__ */ new WeakMap(), D = /* @__PURE__ */ new WeakSet(), xr = /* @__PURE__ */ __name(function() {
  const t = new Ir({ router: this.router, getPath: this.getPath });
  return t.errorHandler = this.errorHandler, y(t, q, u(this, q)), t.routes = this.routes, t;
}, "xr"), q = /* @__PURE__ */ new WeakMap(), ie = /* @__PURE__ */ __name(function(t, r, a) {
  t = t.toUpperCase(), r = ye(this._basePath, r);
  const s = { basePath: this._basePath, path: r, method: t, handler: a };
  this.router.add(t, r, [a, s]), this.routes.push(s);
}, "ie"), et = /* @__PURE__ */ __name(function(t, r) {
  if (t instanceof Error)
    return this.errorHandler(t, r);
  throw t;
}, "et"), tt = /* @__PURE__ */ __name(function(t, r, a, s) {
  if (s === "HEAD")
    return (async () => new Response(null, await b(this, D, tt).call(this, t, r, a, "GET")))();
  const n = this.getPath(t, { env: a }), o = this.router.match(s, n), i = new ja(t, { path: n, matchResult: o, env: a, executionCtx: r, notFoundHandler: u(this, q) });
  if (o[0].length === 1) {
    let l;
    try {
      l = o[0][0][0][0](i, async () => {
        i.res = await u(this, q).call(this, i);
      });
    } catch (d) {
      return b(this, D, et).call(this, d, i);
    }
    return l instanceof Promise ? l.then((d) => d || (i.finalized ? i.res : u(this, q).call(this, i))).catch((d) => b(this, D, et).call(this, d, i)) : l ?? u(this, q).call(this, i);
  }
  const c = $t(o[0], this.errorHandler, u(this, q));
  return (async () => {
    try {
      const l = await c(i);
      if (!l.finalized)
        throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");
      return l.res;
    } catch (l) {
      return b(this, D, et).call(this, l, i);
    }
  })();
}, "tt"), nr);
var it = "[^/]+";
var Me = ".*";
var Le = "(?:|/.*)";
var Re = Symbol();
var La = new Set(".\\+*[^]$()");
function Ha(e, t) {
  return e.length === 1 ? t.length === 1 ? e < t ? -1 : 1 : -1 : t.length === 1 || e === Me || e === Le ? 1 : t === Me || t === Le ? -1 : e === it ? 1 : t === it ? -1 : e.length === t.length ? e < t ? -1 : 1 : t.length - e.length;
}
__name(Ha, "Ha");
var ue;
var fe;
var F;
var or;
var Ot = (or = /* @__PURE__ */ __name(class {
  constructor() {
    R(this, ue);
    R(this, fe);
    R(this, F, /* @__PURE__ */ Object.create(null));
  }
  insert(t, r, a, s, n) {
    if (t.length === 0) {
      if (u(this, ue) !== void 0)
        throw Re;
      if (n)
        return;
      y(this, ue, r);
      return;
    }
    const [o, ...i] = t, c = o === "*" ? i.length === 0 ? ["", "", Me] : ["", "", it] : o === "/*" ? ["", "", Le] : o.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let l;
    if (c) {
      const d = c[1];
      let p = c[2] || it;
      if (d && c[2] && (p === ".*" || (p = p.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(p))))
        throw Re;
      if (l = u(this, F)[p], !l) {
        if (Object.keys(u(this, F)).some((f) => f !== Me && f !== Le))
          throw Re;
        if (n)
          return;
        l = u(this, F)[p] = new Ot(), d !== "" && y(l, fe, s.varIndex++);
      }
      !n && d !== "" && a.push([d, u(l, fe)]);
    } else if (l = u(this, F)[o], !l) {
      if (Object.keys(u(this, F)).some((d) => d.length > 1 && d !== Me && d !== Le))
        throw Re;
      if (n)
        return;
      l = u(this, F)[o] = new Ot();
    }
    l.insert(i, r, a, s, n);
  }
  buildRegExpStr() {
    const r = Object.keys(u(this, F)).sort(Ha).map((a) => {
      const s = u(this, F)[a];
      return (typeof u(s, fe) == "number" ? `(${a})@${u(s, fe)}` : La.has(a) ? `\\${a}` : a) + s.buildRegExpStr();
    });
    return typeof u(this, ue) == "number" && r.unshift(`#${u(this, ue)}`), r.length === 0 ? "" : r.length === 1 ? r[0] : "(?:" + r.join("|") + ")";
  }
}, "or"), ue = /* @__PURE__ */ new WeakMap(), fe = /* @__PURE__ */ new WeakMap(), F = /* @__PURE__ */ new WeakMap(), or);
var ct;
var We;
var ir;
var Pa = (ir = /* @__PURE__ */ __name(class {
  constructor() {
    R(this, ct, { varIndex: 0 });
    R(this, We, new Ot());
  }
  insert(e, t, r) {
    const a = [], s = [];
    for (let o = 0; ; ) {
      let i = false;
      if (e = e.replace(/\{[^}]+\}/g, (c) => {
        const l = `@\\${o}`;
        return s[o] = [l, c], o++, i = true, l;
      }), !i)
        break;
    }
    const n = e.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let o = s.length - 1; o >= 0; o--) {
      const [i] = s[o];
      for (let c = n.length - 1; c >= 0; c--)
        if (n[c].indexOf(i) !== -1) {
          n[c] = n[c].replace(i, s[o][1]);
          break;
        }
    }
    return u(this, We).insert(n, t, a, u(this, ct), r), a;
  }
  buildRegExp() {
    let e = u(this, We).buildRegExpStr();
    if (e === "")
      return [/^$/, [], []];
    let t = 0;
    const r = [], a = [];
    return e = e.replace(/#(\d+)|@(\d+)|\.\*\$/g, (s, n, o) => n !== void 0 ? (r[++t] = Number(n), "$()") : (o !== void 0 && (a[Number(o)] = ++t), "")), [new RegExp(`^${e}`), r, a];
  }
}, "ir"), ct = /* @__PURE__ */ new WeakMap(), We = /* @__PURE__ */ new WeakMap(), ir);
var Mr = [];
var Ba = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var rt = /* @__PURE__ */ Object.create(null);
function Lr(e) {
  return rt[e] ?? (rt[e] = new RegExp(e === "*" ? "" : `^${e.replace(/\/\*$|([.\\+*[^\]$()])/g, (t, r) => r ? `\\${r}` : "(?:|/.*)")}$`));
}
__name(Lr, "Lr");
function Ua() {
  rt = /* @__PURE__ */ Object.create(null);
}
__name(Ua, "Ua");
function qa(e) {
  var l;
  const t = new Pa(), r = [];
  if (e.length === 0)
    return Ba;
  const a = e.map((d) => [!/\*|\/:/.test(d[0]), ...d]).sort(([d, p], [f, E]) => d ? 1 : f ? -1 : p.length - E.length), s = /* @__PURE__ */ Object.create(null);
  for (let d = 0, p = -1, f = a.length; d < f; d++) {
    const [E, v, h] = a[d];
    E ? s[v] = [h.map(([_]) => [_, /* @__PURE__ */ Object.create(null)]), Mr] : p++;
    let m;
    try {
      m = t.insert(v, p, E);
    } catch (_) {
      throw _ === Re ? new Ar(v) : _;
    }
    E || (r[p] = h.map(([_, T]) => {
      const O = /* @__PURE__ */ Object.create(null);
      for (T -= 1; T >= 0; T--) {
        const [w, x] = m[T];
        O[w] = x;
      }
      return [_, O];
    }));
  }
  const [n, o, i] = t.buildRegExp();
  for (let d = 0, p = r.length; d < p; d++)
    for (let f = 0, E = r[d].length; f < E; f++) {
      const v = (l = r[d][f]) == null ? void 0 : l[1];
      if (!v)
        continue;
      const h = Object.keys(v);
      for (let m = 0, _ = h.length; m < _; m++)
        v[h[m]] = i[v[h[m]]];
    }
  const c = [];
  for (const d in o)
    c[d] = r[o[d]];
  return [n, c, s];
}
__name(qa, "qa");
function ge(e, t) {
  if (e) {
    for (const r of Object.keys(e).sort((a, s) => s.length - a.length))
      if (Lr(r).test(t))
        return [...e[r]];
  }
}
__name(ge, "ge");
var ee;
var te;
var je;
var Hr;
var Pr;
var cr;
var Fa = (cr = /* @__PURE__ */ __name(class {
  constructor() {
    R(this, je);
    g(this, "name", "RegExpRouter");
    R(this, ee);
    R(this, te);
    y(this, ee, { [C]: /* @__PURE__ */ Object.create(null) }), y(this, te, { [C]: /* @__PURE__ */ Object.create(null) });
  }
  add(e, t, r) {
    var i;
    const a = u(this, ee), s = u(this, te);
    if (!a || !s)
      throw new Error(jr);
    a[e] || [a, s].forEach((c) => {
      c[e] = /* @__PURE__ */ Object.create(null), Object.keys(c[C]).forEach((l) => {
        c[e][l] = [...c[C][l]];
      });
    }), t === "/*" && (t = "*");
    const n = (t.match(/\/:/g) || []).length;
    if (/\*$/.test(t)) {
      const c = Lr(t);
      e === C ? Object.keys(a).forEach((l) => {
        var d;
        (d = a[l])[t] || (d[t] = ge(a[l], t) || ge(a[C], t) || []);
      }) : (i = a[e])[t] || (i[t] = ge(a[e], t) || ge(a[C], t) || []), Object.keys(a).forEach((l) => {
        (e === C || e === l) && Object.keys(a[l]).forEach((d) => {
          c.test(d) && a[l][d].push([r, n]);
        });
      }), Object.keys(s).forEach((l) => {
        (e === C || e === l) && Object.keys(s[l]).forEach((d) => c.test(d) && s[l][d].push([r, n]));
      });
      return;
    }
    const o = Or(t) || [t];
    for (let c = 0, l = o.length; c < l; c++) {
      const d = o[c];
      Object.keys(s).forEach((p) => {
        var f;
        (e === C || e === p) && ((f = s[p])[d] || (f[d] = [...ge(a[p], d) || ge(a[C], d) || []]), s[p][d].push([r, n - l + c + 1]));
      });
    }
  }
  match(e, t) {
    Ua();
    const r = b(this, je, Hr).call(this);
    return this.match = (a, s) => {
      const n = r[a] || r[C], o = n[2][s];
      if (o)
        return o;
      const i = s.match(n[0]);
      if (!i)
        return [[], Mr];
      const c = i.indexOf("", 1);
      return [n[1][c], i];
    }, this.match(e, t);
  }
}, "cr"), ee = /* @__PURE__ */ new WeakMap(), te = /* @__PURE__ */ new WeakMap(), je = /* @__PURE__ */ new WeakSet(), Hr = /* @__PURE__ */ __name(function() {
  const e = /* @__PURE__ */ Object.create(null);
  return Object.keys(u(this, te)).concat(Object.keys(u(this, ee))).forEach((t) => {
    e[t] || (e[t] = b(this, je, Pr).call(this, t));
  }), y(this, ee, y(this, te, void 0)), e;
}, "Hr"), Pr = /* @__PURE__ */ __name(function(e) {
  const t = [];
  let r = e === C;
  return [u(this, ee), u(this, te)].forEach((a) => {
    const s = a[e] ? Object.keys(a[e]).map((n) => [n, a[e][n]]) : [];
    s.length !== 0 ? (r || (r = true), t.push(...s)) : e !== C && t.push(...Object.keys(a[C]).map((n) => [n, a[C][n]]));
  }), r ? qa(t) : null;
}, "Pr"), cr);
var re;
var J;
var lr;
var ka = (lr = /* @__PURE__ */ __name(class {
  constructor(e) {
    g(this, "name", "SmartRouter");
    R(this, re, []);
    R(this, J, []);
    y(this, re, e.routers);
  }
  add(e, t, r) {
    if (!u(this, J))
      throw new Error(jr);
    u(this, J).push([e, t, r]);
  }
  match(e, t) {
    if (!u(this, J))
      throw new Error("Fatal error");
    const r = u(this, re), a = u(this, J), s = r.length;
    let n = 0, o;
    for (; n < s; n++) {
      const i = r[n];
      try {
        for (let c = 0, l = a.length; c < l; c++)
          i.add(...a[c]);
        o = i.match(e, t);
      } catch (c) {
        if (c instanceof Ar)
          continue;
        throw c;
      }
      this.match = i.match.bind(i), y(this, re, [i]), y(this, J, void 0);
      break;
    }
    if (n === s)
      throw new Error("Fatal error");
    return this.name = `SmartRouter + ${this.activeRouter.name}`, o;
  }
  get activeRouter() {
    if (u(this, J) || u(this, re).length !== 1)
      throw new Error("No active router has been determined yet.");
    return u(this, re)[0];
  }
}, "lr"), re = /* @__PURE__ */ new WeakMap(), J = /* @__PURE__ */ new WeakMap(), lr);
var Ie = /* @__PURE__ */ Object.create(null);
var ae;
var M;
var pe;
var Ne;
var A;
var G;
var ce;
var dr;
var Br = (dr = /* @__PURE__ */ __name(class {
  constructor(e, t, r) {
    R(this, G);
    R(this, ae);
    R(this, M);
    R(this, pe);
    R(this, Ne, 0);
    R(this, A, Ie);
    if (y(this, M, r || /* @__PURE__ */ Object.create(null)), y(this, ae, []), e && t) {
      const a = /* @__PURE__ */ Object.create(null);
      a[e] = { handler: t, possibleKeys: [], score: 0 }, y(this, ae, [a]);
    }
    y(this, pe, []);
  }
  insert(e, t, r) {
    y(this, Ne, ++Pt(this, Ne)._);
    let a = this;
    const s = Ta(t), n = [];
    for (let o = 0, i = s.length; o < i; o++) {
      const c = s[o], l = s[o + 1], d = wa(c, l), p = Array.isArray(d) ? d[0] : c;
      if (p in u(a, M)) {
        a = u(a, M)[p], d && n.push(d[1]);
        continue;
      }
      u(a, M)[p] = new Br(), d && (u(a, pe).push(d), n.push(d[1])), a = u(a, M)[p];
    }
    return u(a, ae).push({ [e]: { handler: r, possibleKeys: n.filter((o, i, c) => c.indexOf(o) === i), score: u(this, Ne) } }), a;
  }
  search(e, t) {
    var i;
    const r = [];
    y(this, A, Ie);
    let s = [this];
    const n = Sr(t), o = [];
    for (let c = 0, l = n.length; c < l; c++) {
      const d = n[c], p = c === l - 1, f = [];
      for (let E = 0, v = s.length; E < v; E++) {
        const h = s[E], m = u(h, M)[d];
        m && (y(m, A, u(h, A)), p ? (u(m, M)["*"] && r.push(...b(this, G, ce).call(this, u(m, M)["*"], e, u(h, A))), r.push(...b(this, G, ce).call(this, m, e, u(h, A)))) : f.push(m));
        for (let _ = 0, T = u(h, pe).length; _ < T; _++) {
          const O = u(h, pe)[_], w = u(h, A) === Ie ? {} : { ...u(h, A) };
          if (O === "*") {
            const X = u(h, M)["*"];
            X && (r.push(...b(this, G, ce).call(this, X, e, u(h, A))), y(X, A, w), f.push(X));
            continue;
          }
          const [x, ve, oe] = O;
          if (!d && !(oe instanceof RegExp))
            continue;
          const W = u(h, M)[x], Kr = n.slice(c).join("/");
          if (oe instanceof RegExp) {
            const X = oe.exec(Kr);
            if (X) {
              if (w[ve] = X[0], r.push(...b(this, G, ce).call(this, W, e, u(h, A), w)), Object.keys(u(W, M)).length) {
                y(W, A, w);
                const dt = ((i = X[0].match(/\//)) == null ? void 0 : i.length) ?? 0;
                (o[dt] || (o[dt] = [])).push(W);
              }
              continue;
            }
          }
          (oe === true || oe.test(d)) && (w[ve] = d, p ? (r.push(...b(this, G, ce).call(this, W, e, w, u(h, A))), u(W, M)["*"] && r.push(...b(this, G, ce).call(this, u(W, M)["*"], e, w, u(h, A)))) : (y(W, A, w), f.push(W)));
        }
      }
      s = f.concat(o.shift() ?? []);
    }
    return r.length > 1 && r.sort((c, l) => c.score - l.score), [r.map(({ handler: c, params: l }) => [c, l])];
  }
}, "dr"), ae = /* @__PURE__ */ new WeakMap(), M = /* @__PURE__ */ new WeakMap(), pe = /* @__PURE__ */ new WeakMap(), Ne = /* @__PURE__ */ new WeakMap(), A = /* @__PURE__ */ new WeakMap(), G = /* @__PURE__ */ new WeakSet(), ce = /* @__PURE__ */ __name(function(e, t, r, a) {
  const s = [];
  for (let n = 0, o = u(e, ae).length; n < o; n++) {
    const i = u(e, ae)[n], c = i[t] || i[C], l = {};
    if (c !== void 0 && (c.params = /* @__PURE__ */ Object.create(null), s.push(c), r !== Ie || a && a !== Ie))
      for (let d = 0, p = c.possibleKeys.length; d < p; d++) {
        const f = c.possibleKeys[d], E = l[c.score];
        c.params[f] = a != null && a[f] && !E ? a[f] : r[f] ?? (a == null ? void 0 : a[f]), l[c.score] = true;
      }
  }
  return s;
}, "ce"), dr);
var he;
var ur;
var $a = (ur = /* @__PURE__ */ __name(class {
  constructor() {
    g(this, "name", "TrieRouter");
    R(this, he);
    y(this, he, new Br());
  }
  add(e, t, r) {
    const a = Or(t);
    if (a) {
      for (let s = 0, n = a.length; s < n; s++)
        u(this, he).insert(e, a[s], r);
      return;
    }
    u(this, he).insert(e, t, r);
  }
  match(e, t) {
    return u(this, he).search(e, t);
  }
}, "ur"), he = /* @__PURE__ */ new WeakMap(), ur);
var me = /* @__PURE__ */ __name(class extends Ir {
  constructor(e = {}) {
    super(e), this.router = e.router ?? new ka({ routers: [new Fa(), new $a()] });
  }
}, "me");
var Wa = /* @__PURE__ */ __name((e) => {
  const r = { ...{ origin: "*", allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"], allowHeaders: [], exposeHeaders: [] }, ...e }, a = ((n) => typeof n == "string" ? n === "*" ? () => n : (o) => n === o ? o : null : typeof n == "function" ? n : (o) => n.includes(o) ? o : null)(r.origin), s = ((n) => typeof n == "function" ? n : Array.isArray(n) ? () => n : () => [])(r.allowMethods);
  return async function(o, i) {
    var d;
    function c(p, f) {
      o.res.headers.set(p, f);
    }
    __name(c, "c");
    const l = await a(o.req.header("origin") || "", o);
    if (l && c("Access-Control-Allow-Origin", l), r.origin !== "*") {
      const p = o.req.header("Vary");
      p ? c("Vary", p) : c("Vary", "Origin");
    }
    if (r.credentials && c("Access-Control-Allow-Credentials", "true"), (d = r.exposeHeaders) != null && d.length && c("Access-Control-Expose-Headers", r.exposeHeaders.join(",")), o.req.method === "OPTIONS") {
      r.maxAge != null && c("Access-Control-Max-Age", r.maxAge.toString());
      const p = await s(o.req.header("origin") || "", o);
      p.length && c("Access-Control-Allow-Methods", p.join(","));
      let f = r.allowHeaders;
      if (!(f != null && f.length)) {
        const E = o.req.header("Access-Control-Request-Headers");
        E && (f = E.split(/\s*,\s*/));
      }
      return f != null && f.length && (c("Access-Control-Allow-Headers", f.join(",")), o.res.headers.append("Vary", "Access-Control-Request-Headers")), o.res.headers.delete("Content-Length"), o.res.headers.delete("Content-Type"), new Response(null, { headers: o.res.headers, status: 204, statusText: "No Content" });
    }
    await i();
  };
}, "Wa");
var za = /^\s*(?:text\/(?!event-stream(?:[;\s]|$))[^;\s]+|application\/(?:javascript|json|xml|xml-dtd|ecmascript|dart|postscript|rtf|tar|toml|vnd\.dart|vnd\.ms-fontobject|vnd\.ms-opentype|wasm|x-httpd-php|x-javascript|x-ns-proxy-autoconfig|x-sh|x-tar|x-virtualbox-hdd|x-virtualbox-ova|x-virtualbox-ovf|x-virtualbox-vbox|x-virtualbox-vdi|x-virtualbox-vhd|x-virtualbox-vmdk|x-www-form-urlencoded)|font\/(?:otf|ttf)|image\/(?:bmp|vnd\.adobe\.photoshop|vnd\.microsoft\.icon|vnd\.ms-dds|x-icon|x-ms-bmp)|message\/rfc822|model\/gltf-binary|x-shader\/x-fragment|x-shader\/x-vertex|[^;\s]+?\+(?:json|text|xml|yaml))(?:[;\s]|$)/i;
var Vt = /* @__PURE__ */ __name((e, t = Ya) => {
  const r = /\.([a-zA-Z0-9]+?)$/, a = e.match(r);
  if (!a)
    return;
  let s = t[a[1]];
  return s && s.startsWith("text") && (s += "; charset=utf-8"), s;
}, "Vt");
var Va = { aac: "audio/aac", avi: "video/x-msvideo", avif: "image/avif", av1: "video/av1", bin: "application/octet-stream", bmp: "image/bmp", css: "text/css", csv: "text/csv", eot: "application/vnd.ms-fontobject", epub: "application/epub+zip", gif: "image/gif", gz: "application/gzip", htm: "text/html", html: "text/html", ico: "image/x-icon", ics: "text/calendar", jpeg: "image/jpeg", jpg: "image/jpeg", js: "text/javascript", json: "application/json", jsonld: "application/ld+json", map: "application/json", mid: "audio/x-midi", midi: "audio/x-midi", mjs: "text/javascript", mp3: "audio/mpeg", mp4: "video/mp4", mpeg: "video/mpeg", oga: "audio/ogg", ogv: "video/ogg", ogx: "application/ogg", opus: "audio/opus", otf: "font/otf", pdf: "application/pdf", png: "image/png", rtf: "application/rtf", svg: "image/svg+xml", tif: "image/tiff", tiff: "image/tiff", ts: "video/mp2t", ttf: "font/ttf", txt: "text/plain", wasm: "application/wasm", webm: "video/webm", weba: "audio/webm", webmanifest: "application/manifest+json", webp: "image/webp", woff: "font/woff", woff2: "font/woff2", xhtml: "application/xhtml+xml", xml: "application/xml", zip: "application/zip", "3gp": "video/3gpp", "3g2": "video/3gpp2", gltf: "model/gltf+json", glb: "model/gltf-binary" };
var Ya = Va;
var Ja = /* @__PURE__ */ __name((...e) => {
  let t = e.filter((s) => s !== "").join("/");
  t = t.replace(new RegExp("(?<=\\/)\\/+", "g"), "");
  const r = t.split("/"), a = [];
  for (const s of r)
    s === ".." && a.length > 0 && a.at(-1) !== ".." ? a.pop() : s !== "." && a.push(s);
  return a.join("/") || ".";
}, "Ja");
var Ur = { br: ".br", zstd: ".zst", gzip: ".gz" };
var Ga = Object.keys(Ur);
var Ka = "index.html";
var Xa = /* @__PURE__ */ __name((e) => {
  const t = e.root ?? "./", r = e.path, a = e.join ?? Ja;
  return async (s, n) => {
    var d, p, f, E;
    if (s.finalized)
      return n();
    let o;
    if (e.path)
      o = e.path;
    else
      try {
        if (o = decodeURIComponent(s.req.path), /(?:^|[\/\\])\.\.(?:$|[\/\\])/.test(o))
          throw new Error();
      } catch {
        return await ((d = e.onNotFound) == null ? void 0 : d.call(e, s.req.path, s)), n();
      }
    let i = a(t, !r && e.rewriteRequestPath ? e.rewriteRequestPath(o) : o);
    e.isDir && await e.isDir(i) && (i = a(i, Ka));
    const c = e.getContent;
    let l = await c(i, s);
    if (l instanceof Response)
      return s.newResponse(l.body, l);
    if (l) {
      const v = e.mimes && Vt(i, e.mimes) || Vt(i);
      if (s.header("Content-Type", v || "application/octet-stream"), e.precompressed && (!v || za.test(v))) {
        const h = new Set((p = s.req.header("Accept-Encoding")) == null ? void 0 : p.split(",").map((m) => m.trim()));
        for (const m of Ga) {
          if (!h.has(m))
            continue;
          const _ = await c(i + Ur[m], s);
          if (_) {
            l = _, s.header("Content-Encoding", m), s.header("Vary", "Accept-Encoding", { append: true });
            break;
          }
        }
      }
      return await ((f = e.onFound) == null ? void 0 : f.call(e, i, s)), s.body(l);
    }
    await ((E = e.onNotFound) == null ? void 0 : E.call(e, i, s)), await n();
  };
}, "Xa");
var Za = /* @__PURE__ */ __name(async (e, t) => {
  let r;
  t && t.manifest ? typeof t.manifest == "string" ? r = JSON.parse(t.manifest) : r = t.manifest : typeof __STATIC_CONTENT_MANIFEST == "string" ? r = JSON.parse(__STATIC_CONTENT_MANIFEST) : r = __STATIC_CONTENT_MANIFEST;
  let a;
  t && t.namespace ? a = t.namespace : a = __STATIC_CONTENT;
  const s = r[e] || e;
  if (!s)
    return null;
  const n = await a.get(s, { type: "stream" });
  return n || null;
}, "Za");
var Qa = /* @__PURE__ */ __name((e) => async function(r, a) {
  return Xa({ ...e, getContent: async (n) => Za(n, { manifest: e.manifest, namespace: e.namespace ? e.namespace : r.env ? r.env.__STATIC_CONTENT : void 0 }) })(r, a);
}, "Qa");
var es = /* @__PURE__ */ __name((e) => Qa(e), "es");
var Pe = "_hp";
var ts = { Change: "Input", DoubleClick: "DblClick" };
var rs = { svg: "2000/svg", math: "1998/Math/MathML" };
var Be = [];
var bt = /* @__PURE__ */ new WeakMap();
var De = void 0;
var as = /* @__PURE__ */ __name(() => De, "as");
var z = /* @__PURE__ */ __name((e) => "t" in e, "z");
var Et = { onClick: ["click", false] };
var Yt = /* @__PURE__ */ __name((e) => {
  if (!e.startsWith("on"))
    return;
  if (Et[e])
    return Et[e];
  const t = e.match(/^on([A-Z][a-zA-Z]+?(?:PointerCapture)?)(Capture)?$/);
  if (t) {
    const [, r, a] = t;
    return Et[e] = [(ts[r] || r).toLowerCase(), !!a];
  }
}, "Yt");
var Jt = /* @__PURE__ */ __name((e, t) => De && e instanceof SVGElement && /[A-Z]/.test(t) && (t in e.style || t.match(/^(?:o|pai|str|u|ve)/)) ? t.replace(/([A-Z])/g, "-$1").toLowerCase() : t, "Jt");
var ss = /* @__PURE__ */ __name((e, t, r) => {
  var a;
  t || (t = {});
  for (let s in t) {
    const n = t[s];
    if (s !== "children" && (!r || r[s] !== n)) {
      s = ot(s);
      const o = Yt(s);
      if (o) {
        if ((r == null ? void 0 : r[s]) !== n && (r && e.removeEventListener(o[0], r[s], o[1]), n != null)) {
          if (typeof n != "function")
            throw new Error(`Event handler for "${s}" is not a function`);
          e.addEventListener(o[0], n, o[1]);
        }
      } else if (s === "dangerouslySetInnerHTML" && n)
        e.innerHTML = n.__html;
      else if (s === "ref") {
        let i;
        typeof n == "function" ? i = n(e) || (() => n(null)) : n && "current" in n && (n.current = e, i = /* @__PURE__ */ __name(() => n.current = null, "i")), bt.set(e, i);
      } else if (s === "style") {
        const i = e.style;
        typeof n == "string" ? i.cssText = n : (i.cssText = "", n != null && Tr(n, i.setProperty.bind(i)));
      } else {
        if (s === "value") {
          const c = e.nodeName;
          if (c === "INPUT" || c === "TEXTAREA" || c === "SELECT") {
            if (e.value = n == null || n === false ? null : n, c === "TEXTAREA") {
              e.textContent = n;
              continue;
            } else if (c === "SELECT") {
              e.selectedIndex === -1 && (e.selectedIndex = 0);
              continue;
            }
          }
        } else
          (s === "checked" && e.nodeName === "INPUT" || s === "selected" && e.nodeName === "OPTION") && (e[s] = n);
        const i = Jt(e, s);
        n == null || n === false ? e.removeAttribute(i) : n === true ? e.setAttribute(i, "") : typeof n == "string" || typeof n == "number" ? e.setAttribute(i, n) : e.setAttribute(i, n.toString());
      }
    }
  }
  if (r)
    for (let s in r) {
      const n = r[s];
      if (s !== "children" && !(s in t)) {
        s = ot(s);
        const o = Yt(s);
        o ? e.removeEventListener(o[0], n, o[1]) : s === "ref" ? (a = bt.get(e)) == null || a() : e.removeAttribute(Jt(e, s));
      }
    }
}, "ss");
var ns = /* @__PURE__ */ __name((e, t) => {
  t[N][0] = 0, Be.push([e, t]);
  const r = t.tag[Ct] || t.tag, a = r.defaultProps ? { ...r.defaultProps, ...t.props } : t.props;
  try {
    return [r.call(null, a)];
  } finally {
    Be.pop();
  }
}, "ns");
var qr = /* @__PURE__ */ __name((e, t, r, a, s) => {
  var n, o;
  (n = e.vR) != null && n.length && (a.push(...e.vR), delete e.vR), typeof e.tag == "function" && ((o = e[N][1][Wr]) == null || o.forEach((i) => s.push(i))), e.vC.forEach((i) => {
    var c;
    if (z(i))
      r.push(i);
    else if (typeof i.tag == "function" || i.tag === "") {
      i.c = t;
      const l = r.length;
      if (qr(i, t, r, a, s), i.s) {
        for (let d = l; d < r.length; d++)
          r[d].s = true;
        i.s = false;
      }
    } else
      r.push(i), (c = i.vR) != null && c.length && (a.push(...i.vR), delete i.vR);
  });
}, "qr");
var os = /* @__PURE__ */ __name((e) => {
  for (; ; e = e.tag === Pe || !e.vC || !e.pP ? e.nN : e.vC[0]) {
    if (!e)
      return null;
    if (e.tag !== Pe && e.e)
      return e.e;
  }
}, "os");
var Fr = /* @__PURE__ */ __name((e) => {
  var t, r, a, s, n, o;
  z(e) || ((r = (t = e[N]) == null ? void 0 : t[1][Wr]) == null || r.forEach((i) => {
    var c;
    return (c = i[2]) == null ? void 0 : c.call(i);
  }), (a = bt.get(e.e)) == null || a(), e.p === 2 && ((s = e.vC) == null || s.forEach((i) => i.p = 2)), (n = e.vC) == null || n.forEach(Fr)), e.p || ((o = e.e) == null || o.remove(), delete e.e), typeof e.tag == "function" && (xe.delete(e), at.delete(e), delete e[N][3], e.a = true);
}, "Fr");
var kr = /* @__PURE__ */ __name((e, t, r) => {
  e.c = t, $r(e, t, r);
}, "kr");
var Gt = /* @__PURE__ */ __name((e, t) => {
  if (t) {
    for (let r = 0, a = e.length; r < a; r++)
      if (e[r] === t)
        return r;
  }
}, "Gt");
var Kt = Symbol();
var $r = /* @__PURE__ */ __name((e, t, r) => {
  var l;
  const a = [], s = [], n = [];
  qr(e, t, a, s, n), s.forEach(Fr);
  const o = r ? void 0 : t.childNodes;
  let i, c = null;
  if (r)
    i = -1;
  else if (!o.length)
    i = 0;
  else {
    const d = Gt(o, os(e.nN));
    d !== void 0 ? (c = o[d], i = d) : i = Gt(o, (l = a.find((p) => p.tag !== Pe && p.e)) == null ? void 0 : l.e) ?? -1, i === -1 && (r = true);
  }
  for (let d = 0, p = a.length; d < p; d++, i++) {
    const f = a[d];
    let E;
    if (f.s && f.e)
      E = f.e, f.s = false;
    else {
      const v = r || !f.e;
      z(f) ? (f.e && f.d && (f.e.textContent = f.t), f.d = false, E = f.e || (f.e = document.createTextNode(f.t))) : (E = f.e || (f.e = f.n ? document.createElementNS(f.n, f.tag) : document.createElement(f.tag)), ss(E, f.props, f.pP), $r(f, E, v));
    }
    f.tag === Pe ? i-- : r ? E.parentNode || t.appendChild(E) : o[i] !== E && o[i - 1] !== E && (o[i + 1] === E ? t.appendChild(o[i]) : t.insertBefore(E, c || o[i] || null));
  }
  if (e.pP && delete e.pP, n.length) {
    const d = [], p = [];
    n.forEach(([, f, , E, v]) => {
      f && d.push(f), E && p.push(E), v == null || v();
    }), d.forEach((f) => f()), p.length && requestAnimationFrame(() => {
      p.forEach((f) => f());
    });
  }
}, "$r");
var is = /* @__PURE__ */ __name((e, t) => !!(e && e.length === t.length && e.every((r, a) => r[1] === t[a][1])), "is");
var at = /* @__PURE__ */ new WeakMap();
var Nt = /* @__PURE__ */ __name((e, t, r) => {
  var n, o, i, c, l, d;
  const a = !r && t.pC;
  r && (t.pC || (t.pC = t.vC));
  let s;
  try {
    r || (r = typeof t.tag == "function" ? ns(e, t) : ze(t.props.children)), ((n = r[0]) == null ? void 0 : n.tag) === "" && r[0][Rt] && (s = r[0][Rt], e[5].push([e, s, t]));
    const p = a ? [...t.pC] : t.vC ? [...t.vC] : void 0, f = [];
    let E;
    for (let v = 0; v < r.length; v++) {
      Array.isArray(r[v]) && r.splice(v, 1, ...r[v].flat());
      let h = cs(r[v]);
      if (h) {
        typeof h.tag == "function" && !h.tag[Er] && (Ce.length > 0 && (h[N][2] = Ce.map((_) => [_, _.values.at(-1)])), (o = e[5]) != null && o.length && (h[N][3] = e[5].at(-1)));
        let m;
        if (p && p.length) {
          const _ = p.findIndex(z(h) ? (T) => z(T) : h.key !== void 0 ? (T) => T.key === h.key && T.tag === h.tag : (T) => T.tag === h.tag);
          _ !== -1 && (m = p[_], p.splice(_, 1));
        }
        if (m)
          if (z(h))
            m.t !== h.t && (m.t = h.t, m.d = true), h = m;
          else {
            const _ = m.pP = m.props;
            if (m.props = h.props, m.f || (m.f = h.f || t.f), typeof h.tag == "function") {
              const T = m[N][2];
              m[N][2] = h[N][2] || [], m[N][3] = h[N][3], !m.f && ((m.o || m) === h.o || (c = (i = m.tag)[ta]) != null && c.call(i, _, m.props)) && is(T, m[N][2]) && (m.s = true);
            }
            h = m;
          }
        else if (!z(h) && De) {
          const _ = Ae(De);
          _ && (h.n = _);
        }
        if (!z(h) && !h.s && (Nt(e, h), delete h.f), f.push(h), E && !E.s && !h.s)
          for (let _ = E; _ && !z(_); _ = (l = _.vC) == null ? void 0 : l.at(-1))
            _.nN = h;
        E = h;
      }
    }
    t.vR = a ? [...t.vC, ...p || []] : p || [], t.vC = f, a && delete t.pC;
  } catch (p) {
    if (t.f = true, p === Kt) {
      if (s)
        return;
      throw p;
    }
    const [f, E, v] = ((d = t[N]) == null ? void 0 : d[3]) || [];
    if (E) {
      const h = /* @__PURE__ */ __name(() => st([0, false, e[2]], v), "h"), m = at.get(v) || [];
      m.push(h), at.set(v, m);
      const _ = E(p, () => {
        const T = at.get(v);
        if (T) {
          const O = T.indexOf(h);
          if (O !== -1)
            return T.splice(O, 1), h();
        }
      });
      if (_) {
        if (e[0] === 1)
          e[1] = true;
        else if (Nt(e, v, [_]), (E.length === 1 || e !== f) && v.c) {
          kr(v, v.c, false);
          return;
        }
        throw Kt;
      }
    }
    throw p;
  } finally {
    s && e[5].pop();
  }
}, "Nt");
var cs = /* @__PURE__ */ __name((e) => {
  if (!(e == null || typeof e == "boolean")) {
    if (typeof e == "string" || typeof e == "number")
      return { t: e.toString(), d: true };
    if ("vR" in e && (e = { tag: e.tag, props: e.props, key: e.key, f: e.f, type: e.tag, ref: e.props.ref, o: e.o || e }), typeof e.tag == "function")
      e[N] = [0, []];
    else {
      const t = rs[e.tag];
      t && (De || (De = gr("")), e.props.children = [{ tag: De, props: { value: e.n = `http://www.w3.org/${t}`, children: e.props.children } }]);
    }
    return e;
  }
}, "cs");
var Xt = /* @__PURE__ */ __name((e, t) => {
  var r, a;
  (r = t[N][2]) == null || r.forEach(([s, n]) => {
    s.values.push(n);
  });
  try {
    Nt(e, t, void 0);
  } catch {
    return;
  }
  if (t.a) {
    delete t.a;
    return;
  }
  (a = t[N][2]) == null || a.forEach(([s]) => {
    s.values.pop();
  }), (e[0] !== 1 || !e[1]) && kr(t, t.c, false);
}, "Xt");
var xe = /* @__PURE__ */ new WeakMap();
var Zt = [];
var st = /* @__PURE__ */ __name(async (e, t) => {
  e[5] || (e[5] = []);
  const r = xe.get(t);
  r && r[0](void 0);
  let a;
  const s = new Promise((n) => a = n);
  if (xe.set(t, [a, () => {
    e[2] ? e[2](e, t, (n) => {
      Xt(n, t);
    }).then(() => a(t)) : (Xt(e, t), a(t));
  }]), Zt.length)
    Zt.at(-1).add(t);
  else {
    await Promise.resolve();
    const n = xe.get(t);
    n && (xe.delete(t), n[1]());
  }
  return s;
}, "st");
var ls = /* @__PURE__ */ __name((e, t, r) => ({ tag: Pe, props: { children: e }, key: r, e: t, p: 1 }), "ls");
var vt = 0;
var Wr = 1;
var gt = 2;
var _t = 3;
var yt = /* @__PURE__ */ new WeakMap();
var zr = /* @__PURE__ */ __name((e, t) => !e || !t || e.length !== t.length || t.some((r, a) => r !== e[a]), "zr");
var ds = void 0;
var Qt = [];
var us = /* @__PURE__ */ __name((e) => {
  var o;
  const t = /* @__PURE__ */ __name(() => typeof e == "function" ? e() : e, "t"), r = Be.at(-1);
  if (!r)
    return [t(), () => {
    }];
  const [, a] = r, s = (o = a[N][1])[vt] || (o[vt] = []), n = a[N][0]++;
  return s[n] || (s[n] = [t(), (i) => {
    const c = ds, l = s[n];
    if (typeof i == "function" && (i = i(l[0])), !Object.is(i, l[0]))
      if (l[0] = i, Qt.length) {
        const [d, p] = Qt.at(-1);
        Promise.all([d === 3 ? a : st([d, false, c], a), p]).then(([f]) => {
          if (!f || !(d === 2 || d === 3))
            return;
          const E = f.vC;
          requestAnimationFrame(() => {
            setTimeout(() => {
              E === f.vC && st([d === 3 ? 1 : 0, false, c], f);
            });
          });
        });
      } else
        st([0, false, c], a);
  }]);
}, "us");
var xt = /* @__PURE__ */ __name((e, t) => {
  var i;
  const r = Be.at(-1);
  if (!r)
    return e;
  const [, a] = r, s = (i = a[N][1])[gt] || (i[gt] = []), n = a[N][0]++, o = s[n];
  return zr(o == null ? void 0 : o[1], t) ? s[n] = [e, t] : e = s[n][0], e;
}, "xt");
var fs = /* @__PURE__ */ __name((e) => {
  const t = yt.get(e);
  if (t) {
    if (t.length === 2)
      throw t[1];
    return t[0];
  }
  throw e.then((r) => yt.set(e, [r]), (r) => yt.set(e, [void 0, r])), e;
}, "fs");
var ps = /* @__PURE__ */ __name((e, t) => {
  var i;
  const r = Be.at(-1);
  if (!r)
    return e();
  const [, a] = r, s = (i = a[N][1])[_t] || (i[_t] = []), n = a[N][0]++, o = s[n];
  return zr(o == null ? void 0 : o[1], t) && (s[n] = [e(), t]), s[n][0];
}, "ps");
var hs = gr({ pending: false, data: null, method: null, action: null });
var er = /* @__PURE__ */ new Set();
var ms = /* @__PURE__ */ __name((e) => {
  er.add(e), e.finally(() => er.delete(e));
}, "ms");
var Mt = /* @__PURE__ */ __name((e, t) => ps(() => (r) => {
  let a;
  e && (typeof e == "function" ? a = e(r) || (() => {
    e(null);
  }) : e && "current" in e && (e.current = r, a = /* @__PURE__ */ __name(() => {
    e.current = null;
  }, "a")));
  const s = t(r);
  return () => {
    s == null || s(), a == null || a();
  };
}, [e]), "Mt");
var _e = /* @__PURE__ */ Object.create(null);
var Ke = /* @__PURE__ */ Object.create(null);
var Je = /* @__PURE__ */ __name((e, t, r, a, s) => {
  if (t != null && t.itemProp)
    return { tag: e, props: t, type: e, ref: t.ref };
  const n = document.head;
  let { onLoad: o, onError: i, precedence: c, blocking: l, ...d } = t, p = null, f = false;
  const E = Xe[e];
  let v;
  if (E.length > 0) {
    const T = n.querySelectorAll(e);
    e:
      for (const O of T)
        for (const w of Xe[e])
          if (O.getAttribute(w) === t[w]) {
            p = O;
            break e;
          }
    if (!p) {
      const O = E.reduce((w, x) => t[x] === void 0 ? w : `${w}-${x}-${t[x]}`, e);
      f = !Ke[O], p = Ke[O] || (Ke[O] = (() => {
        const w = document.createElement(e);
        for (const x of E)
          t[x] !== void 0 && w.setAttribute(x, t[x]), t.rel && w.setAttribute("rel", t.rel);
        return w;
      })());
    }
  } else
    v = n.querySelectorAll(e);
  c = a ? c ?? "" : void 0, a && (d[Ze] = c);
  const h = xt((T) => {
    if (E.length > 0) {
      let O = false;
      for (const w of n.querySelectorAll(e)) {
        if (O && w.getAttribute(Ze) !== c) {
          n.insertBefore(T, w);
          return;
        }
        w.getAttribute(Ze) === c && (O = true);
      }
      n.appendChild(T);
    } else if (v) {
      let O = false;
      for (const w of v)
        if (w === T) {
          O = true;
          break;
        }
      O || n.insertBefore(T, n.contains(v[0]) ? v[0] : n.querySelector(e)), v = void 0;
    }
  }, [c]), m = Mt(t.ref, (T) => {
    var x;
    const O = E[0];
    if (r === 2 && (T.innerHTML = ""), (f || v) && h(T), !i && !o)
      return;
    let w = _e[x = T.getAttribute(O)] || (_e[x] = new Promise((ve, oe) => {
      T.addEventListener("load", ve), T.addEventListener("error", oe);
    }));
    o && (w = w.then(o)), i && (w = w.catch(i)), w.catch(() => {
    });
  });
  if (s && l === "render") {
    const T = Xe[e][0];
    if (t[T]) {
      const O = t[T], w = _e[O] || (_e[O] = new Promise((x, ve) => {
        h(p), p.addEventListener("load", x), p.addEventListener("error", ve);
      }));
      fs(w);
    }
  }
  const _ = { tag: e, type: e, props: { ...d, ref: m }, ref: m };
  return _.p = r, p && (_.e = p), ls(_, n);
}, "Je");
var Es = /* @__PURE__ */ __name((e) => {
  const t = as(), r = t && Ae(t);
  return r != null && r.endsWith("svg") ? { tag: "title", props: e, type: "title", ref: e.ref } : Je("title", e, void 0, false, false);
}, "Es");
var vs = /* @__PURE__ */ __name((e) => !e || ["src", "async"].some((t) => !e[t]) ? { tag: "script", props: e, type: "script", ref: e.ref } : Je("script", e, 1, false, true), "vs");
var gs = /* @__PURE__ */ __name((e) => !e || !["href", "precedence"].every((t) => t in e) ? { tag: "style", props: e, type: "style", ref: e.ref } : (e["data-href"] = e.href, delete e.href, Je("style", e, 2, true, true)), "gs");
var _s = /* @__PURE__ */ __name((e) => !e || ["onLoad", "onError"].some((t) => t in e) || e.rel === "stylesheet" && (!("precedence" in e) || "disabled" in e) ? { tag: "link", props: e, type: "link", ref: e.ref } : Je("link", e, 1, "precedence" in e, true), "_s");
var ys = /* @__PURE__ */ __name((e) => Je("meta", e, void 0, false, false), "ys");
var Vr = Symbol();
var Ts = /* @__PURE__ */ __name((e) => {
  const { action: t, ...r } = e;
  typeof t != "function" && (r.action = t);
  const [a, s] = us([null, false]), n = xt(async (l) => {
    const d = l.isTrusted ? t : l.detail[Vr];
    if (typeof d != "function")
      return;
    l.preventDefault();
    const p = new FormData(l.target);
    s([p, true]);
    const f = d(p);
    f instanceof Promise && (ms(f), await f), s([null, true]);
  }, []), o = Mt(e.ref, (l) => (l.addEventListener("submit", n), () => {
    l.removeEventListener("submit", n);
  })), [i, c] = a;
  return a[1] = false, { tag: hs, props: { value: { pending: i !== null, data: i, method: i ? "post" : null, action: i ? t : null }, children: { tag: "form", props: { ...r, ref: o }, type: "form", ref: o } }, f: c };
}, "Ts");
var Yr = /* @__PURE__ */ __name((e, { formAction: t, ...r }) => {
  if (typeof t == "function") {
    const a = xt((s) => {
      s.preventDefault(), s.currentTarget.form.dispatchEvent(new CustomEvent("submit", { detail: { [Vr]: t } }));
    }, []);
    r.ref = Mt(r.ref, (s) => (s.addEventListener("click", a), () => {
      s.removeEventListener("click", a);
    }));
  }
  return { tag: e, props: r, type: e, ref: r.ref };
}, "Yr");
var Rs = /* @__PURE__ */ __name((e) => Yr("input", e), "Rs");
var Ss = /* @__PURE__ */ __name((e) => Yr("button", e), "Ss");
Object.assign(St, { title: Es, script: vs, style: gs, link: _s, meta: ys, form: Ts, input: Rs, button: Ss });
Dt(null);
new TextEncoder();
var ws = Dt(null);
var Os = /* @__PURE__ */ __name((e, t, r, a) => (s, n) => {
  const o = "<!DOCTYPE html>", i = r ? Ft((l) => r(l, e), { Layout: t, ...n }, s) : s, c = ea`${B(o)}${Ft(ws.Provider, { value: e }, i)}`;
  return e.html(c);
}, "Os");
var bs = /* @__PURE__ */ __name((e, t) => function(a, s) {
  const n = a.getLayout() ?? ha;
  return e && a.setLayout((o) => e({ ...o, Layout: n }, a)), a.setRenderer(Os(a, n, e)), s();
}, "bs");
var Ns = bs(({ children: e }) => S("html", { lang: "es", children: [S("head", { children: [S("meta", { charset: "UTF-8" }), S("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }), S("title", { children: "Yo Decreto - Gustavo Adolfo Guerrero Casta\xF1os" }), S("link", { rel: "icon", href: "/static/logo-yo-decreto.png", type: "image/png" }), S("link", { href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap", rel: "stylesheet" }), S("script", { src: "https://cdn.tailwindcss.com" }), S("link", { href: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css", rel: "stylesheet" }), S("script", { src: "https://cdn.jsdelivr.net/npm/chart.js" }), S("script", { src: "https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js" }), S("script", { src: "https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/customParseFormat.js" }), S("script", { src: "https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/isSameOrAfter.js" }), S("script", { src: "https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/isSameOrBefore.js" }), S("script", { src: "https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js" }), S("link", { href: "/static/styles.css", rel: "stylesheet" }), S("script", { dangerouslySetInnerHTML: { __html: `
            tailwind.config = {
              theme: {
                extend: {
                  fontFamily: {
                    'sans': ['Inter', 'system-ui', 'sans-serif'],
                  },
                  colors: {
                    primary: {
                      50: '#f0f9ff',
                      100: '#e0f2fe',
                      200: '#bae6fd',
                      300: '#7dd3fc',
                      400: '#38bdf8',
                      500: '#0ea5e9',
                      600: '#0284c7',
                      700: '#0369a1',
                      800: '#075985',
                      900: '#0c4a6e',
                    },
                    accent: {
                      green: '#10b981',
                      purple: '#8b5cf6',
                      red: '#ef4444',
                      orange: '#f59e0b',
                      blue: '#3b82f6'
                    }
                  }
                }
              }
            }
          ` } })] }), S("body", { className: "bg-slate-900 text-white font-sans", children: [e, S("script", { src: `/static/auth.js?v=${Date.now()}&cb=${Math.random()}&t=${(/* @__PURE__ */ new Date()).getTime()}` }), S("script", { src: `/static/app.js?v=${Date.now()}&cb=${Math.random()}&t=${(/* @__PURE__ */ new Date()).getTime()}` }), S("script", { src: `/static/decretos.js?v=${Date.now()}&cb=${Math.random()}&t=${(/* @__PURE__ */ new Date()).getTime()}` }), S("script", { src: `/static/agenda.js?v=${Date.now()}&cb=${Math.random()}&t=${(/* @__PURE__ */ new Date()).getTime()}` }), S("script", { src: `/static/progreso.js?v=${Date.now()}&cb=${Math.random()}&t=${(/* @__PURE__ */ new Date()).getTime()}` }), S("script", { src: `/static/practica.js?v=${Date.now()}&cb=${Math.random()}&t=${(/* @__PURE__ */ new Date()).getTime()}` }), S("script", { src: `/static/acerca.js?v=${Date.now()}&cb=${Math.random()}&t=${(/* @__PURE__ */ new Date()).getTime()}` })] })] }));
async function tr(e, t, r, a, s, n, o) {
  try {
    o && await e.prepare(`
        INSERT INTO agenda_eventos (
          id, titulo, descripcion, fecha_inicio, tipo, accion_id
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).bind(crypto.randomUUID().replace(/-/g, "").substring(0, 32), r, `${a}${s ? " - " + s : ""}`, o, "accion", t).run();
  } catch (i) {
    console.log("Error al sincronizar con agenda:", i);
  }
}
__name(tr, "tr");
var I = new me();
I.get("/config", async (e) => {
  try {
    const t = await e.env.DB.prepare("SELECT * FROM configuracion WHERE id = ?").bind("main").first();
    return e.json({ success: true, data: t || { nombre_usuario: "Gustavo Adolfo Guerrero Casta\xF1os", frase_vida: "(Agregar frase de vida)" } });
  } catch {
    return e.json({ success: false, error: "Error al obtener configuraci\xF3n" }, 500);
  }
});
I.put("/config", async (e) => {
  try {
    const { nombre_usuario: t, frase_vida: r } = await e.req.json();
    return await e.env.DB.prepare("UPDATE configuracion SET nombre_usuario = ?, frase_vida = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(t, r, "main").run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al actualizar configuraci\xF3n" }, 500);
  }
});
I.get("/", async (e) => {
  try {
    const t = await e.env.DB.prepare("SELECT * FROM decretos ORDER BY created_at DESC").all(), r = { total: t.results.length, empresarial: t.results.filter((s) => s.area === "empresarial").length, material: t.results.filter((s) => s.area === "material").length, humano: t.results.filter((s) => s.area === "humano").length }, a = { empresarial: r.total > 0 ? Math.round(r.empresarial / r.total * 100) : 0, material: r.total > 0 ? Math.round(r.material / r.total * 100) : 0, humano: r.total > 0 ? Math.round(r.humano / r.total * 100) : 0 };
    return e.json({ success: true, data: { decretos: t.results, contadores: r, porcentajes: a } });
  } catch {
    return e.json({ success: false, error: "Error al obtener decretos" }, 500);
  }
});
I.get("/:id", async (e) => {
  try {
    const t = e.req.param("id"), r = await e.env.DB.prepare("SELECT * FROM decretos WHERE id = ?").bind(t).first();
    if (!r)
      return e.json({ success: false, error: "Decreto no encontrado" }, 404);
    const a = await e.env.DB.prepare("SELECT * FROM acciones WHERE decreto_id = ? ORDER BY created_at DESC").bind(t).all(), s = a.results.length, n = a.results.filter((c) => c.estado === "completada").length, o = s - n, i = s > 0 ? Math.round(n / s * 100) : 0;
    return await e.env.DB.prepare("UPDATE decretos SET progreso = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(i, t).run(), e.json({ success: true, data: { decreto: { ...r, progreso: i }, acciones: a.results, metricas: { total_acciones: s, completadas: n, pendientes: o, progreso: i } } });
  } catch {
    return e.json({ success: false, error: "Error al obtener decreto" }, 500);
  }
});
I.post("/", async (e) => {
  try {
    const { area: t, titulo: r, sueno_meta: a, descripcion: s } = await e.req.json();
    if (!t || !r || !a)
      return e.json({ success: false, error: "Campos requeridos: area, titulo, sueno_meta" }, 400);
    const n = await e.env.DB.prepare("INSERT INTO decretos (area, titulo, sueno_meta, descripcion) VALUES (?, ?, ?, ?)").bind(t, r, a, s || "").run();
    return e.json({ success: true, id: n.meta.last_row_id });
  } catch {
    return e.json({ success: false, error: "Error al crear decreto" }, 500);
  }
});
I.put("/:id", async (e) => {
  try {
    const t = e.req.param("id"), { area: r, titulo: a, sueno_meta: s, descripcion: n } = await e.req.json();
    return await e.env.DB.prepare("UPDATE decretos SET area = ?, titulo = ?, sueno_meta = ?, descripcion = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(r, a, s, n || "", t).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al actualizar decreto" }, 500);
  }
});
I.delete("/:id", async (e) => {
  try {
    const t = e.req.param("id");
    return await e.env.DB.prepare("DELETE FROM decretos WHERE id = ?").bind(t).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al eliminar decreto" }, 500);
  }
});
I.post("/:id/acciones", async (e) => {
  var t;
  try {
    const r = e.req.param("id"), a = await e.req.json();
    console.log("=== BACKEND: RECIBIENDO DATOS ===", { decretoId: r, requestDataKeys: Object.keys(a), hasSubtareas: "subtareas" in a, subtareasLength: ((t = a.subtareas) == null ? void 0 : t.length) || 0, subtareasData: a.subtareas });
    const { titulo: s, que_hacer: n, como_hacerlo: o, resultados: i, tareas_pendientes: c, tipo: l, proxima_revision: d, calificacion: p, subtareas: f = [] } = a;
    if (!s || !n)
      return e.json({ success: false, error: "Campos requeridos: titulo, que_hacer" }, 400);
    const E = crypto.randomUUID().replace(/-/g, "").substring(0, 32);
    await e.env.DB.prepare(`
      INSERT INTO acciones (
        id, decreto_id, titulo, que_hacer, como_hacerlo, resultados, 
        tareas_pendientes, tipo, proxima_revision, calificacion, origen
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'manual')
    `).bind(E, r, s, n, o || "", i || "", JSON.stringify(c || []), l || "secundaria", d || null, p || null).run(), await tr(e.env.DB, E, s, n, o, l, d);
    let v = 0;
    if (console.log("=== PROCESANDO SUB-TAREAS ===", { hasSubtareas: !!f, subtareasLength: (f == null ? void 0 : f.length) || 0, subtareasData: f }), f && f.length > 0) {
      console.log(`Procesando ${f.length} sub-tareas...`);
      for (let h = 0; h < f.length; h++) {
        const m = f[h];
        if (console.log(`Sub-tarea ${h + 1}:`, m), m.titulo) {
          const _ = crypto.randomUUID().replace(/-/g, "").substring(0, 32);
          let T = m.fecha_programada;
          !T && d && (T = d), console.log(`Creando sub-tarea ${h + 1} con ID: ${_}`, { titulo: m.titulo, queHacer: m.que_hacer, fecha: T, padreId: E });
          const O = await e.env.DB.prepare(`
            INSERT INTO acciones (
              id, decreto_id, titulo, que_hacer, como_hacerlo, resultados, 
              tipo, proxima_revision, origen, tarea_padre_id, nivel_jerarquia
            ) VALUES (?, ?, ?, ?, ?, '', 'secundaria', ?, 'subtarea', ?, 1)
          `).bind(_, r, m.titulo, m.que_hacer, m.como_hacerlo || "", T, E).run();
          console.log(`\u2705 Sub-tarea ${h + 1} creada en BD:`, { success: O.success, changes: O.changes }), T && (await tr(e.env.DB, _, `[Sub] ${m.titulo}`, m.que_hacer, m.como_hacerlo, "secundaria", T), console.log(`\u2705 Sub-tarea ${h + 1} sincronizada con agenda`)), v++;
        } else
          console.log(`\u23ED\uFE0F Sub-tarea ${h + 1} sin t\xEDtulo, saltando`);
      }
    } else
      console.log("No hay sub-tareas para procesar");
    return console.log(`=== SUB-TAREAS COMPLETADAS: ${v} ===`), console.log("=== RESPUESTA FINAL ===", { success: true, accionId: E, subtareasCreadas: v }), e.json({ success: true, id: E, data: { subtareas_creadas: v } });
  } catch (r) {
    return console.error("Error creating action:", r), e.json({ success: false, error: `Error al crear acci\xF3n: ${r.message}` }, 500);
  }
});
I.get("/:decretoId/acciones/:accionId", async (e) => {
  try {
    const t = e.req.param("decretoId"), r = e.req.param("accionId"), a = await e.env.DB.prepare(`
      SELECT 
        a.*,
        d.titulo as decreto_titulo,
        d.sueno_meta,
        d.descripcion as decreto_descripcion,
        d.area
      FROM acciones a
      JOIN decretos d ON a.decreto_id = d.id
      WHERE a.id = ? AND a.decreto_id = ?
    `).bind(r, t).first();
    if (!a)
      return e.json({ success: false, error: "Acci\xF3n no encontrada" }, 404);
    if (a.tareas_pendientes)
      try {
        a.tareas_pendientes = JSON.parse(a.tareas_pendientes);
      } catch {
        a.tareas_pendientes = [];
      }
    return e.json({ success: true, data: a });
  } catch {
    return e.json({ success: false, error: "Error al obtener detalles de la acci\xF3n" }, 500);
  }
});
I.put("/:decretoId/acciones/:accionId", async (e) => {
  try {
    const t = e.req.param("decretoId"), r = e.req.param("accionId"), { titulo: a, que_hacer: s, como_hacerlo: n, resultados: o, tipo: i, proxima_revision: c, calificacion: l } = await e.req.json();
    if (!a || !s)
      return e.json({ success: false, error: "Campos requeridos: titulo, que_hacer" }, 400);
    if (await e.env.DB.prepare(`
      UPDATE acciones SET 
        titulo = ?,
        que_hacer = ?,
        como_hacerlo = ?,
        resultados = ?,
        tipo = ?,
        proxima_revision = ?,
        calificacion = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND decreto_id = ?
    `).bind(a, s, n || "", o || "", i || "secundaria", c || null, l || null, r, t).run(), await e.env.DB.prepare("SELECT id FROM agenda_eventos WHERE accion_id = ?").bind(r).first() && c) {
      const p = c.split("T")[0], f = c.split("T")[1] || "09:00";
      await e.env.DB.prepare(`
        UPDATE agenda_eventos SET 
          titulo = ?,
          fecha_evento = ?,
          hora_evento = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE accion_id = ?
      `).bind(`[Decreto] ${a}`, p, f, r).run();
    }
    return e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al editar acci\xF3n" }, 500);
  }
});
I.put("/:decretoId/acciones/:accionId/completar", async (e) => {
  try {
    const t = e.req.param("accionId");
    return await e.env.DB.prepare('UPDATE acciones SET estado = "completada", fecha_cierre = date("now"), updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(t).run(), await e.env.DB.prepare('UPDATE agenda_eventos SET estado = "completada", updated_at = CURRENT_TIMESTAMP WHERE accion_id = ?').bind(t).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al completar acci\xF3n" }, 500);
  }
});
I.put("/:decretoId/acciones/:accionId/pendiente", async (e) => {
  try {
    const t = e.req.param("accionId");
    return await e.env.DB.prepare('UPDATE acciones SET estado = "pendiente", fecha_cierre = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(t).run(), await e.env.DB.prepare('UPDATE agenda_eventos SET estado = "pendiente", updated_at = CURRENT_TIMESTAMP WHERE accion_id = ?').bind(t).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al marcar acci\xF3n como pendiente" }, 500);
  }
});
I.delete("/:decretoId/acciones/:accionId", async (e) => {
  try {
    const t = e.req.param("accionId");
    return await e.env.DB.prepare("DELETE FROM acciones WHERE id = ?").bind(t).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al eliminar acci\xF3n" }, 500);
  }
});
I.post("/:decretoId/acciones/:accionId/seguimientos", async (e) => {
  try {
    const t = e.req.param("accionId"), { que_se_hizo: r, como_se_hizo: a, resultados_obtenidos: s, tareas_pendientes: n, proxima_revision: o, calificacion: i } = await e.req.json();
    if (!r || !a || !s)
      return e.json({ success: false, error: "Campos requeridos: que_se_hizo, como_se_hizo, resultados_obtenidos" }, 400);
    await e.env.DB.prepare(`
      INSERT INTO seguimientos (
        accion_id, que_se_hizo, como_se_hizo, resultados_obtenidos, 
        tareas_pendientes, proxima_revision, calificacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(t, r, a, s, JSON.stringify(n || []), o || null, i || null).run(), await e.env.DB.prepare(`
      UPDATE acciones SET 
        resultados = ?, 
        tareas_pendientes = ?, 
        proxima_revision = ?,
        calificacion = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(s, JSON.stringify(n || []), o || null, i || null, t).run();
    let c = 0;
    if (n && Array.isArray(n)) {
      for (const l of n)
        if (typeof l == "string" && l.trim()) {
          let d = l.trim(), p = "secundaria", f = null;
          (d.startsWith("[P]") || d.includes("#primaria")) && (p = "primaria", d = d.replace(/\[P\]|#primaria/g, "").trim()), d.includes("#diaria") && (p = "secundaria", d = d.replace(/#diaria/g, "").trim());
          const E = d.match(/@(\d{4}-\d{2}-\d{2})/);
          E && (f = E[1] + "T09:00", d = d.replace(/@\d{4}-\d{2}-\d{2}/g, "").trim());
          const v = await e.env.DB.prepare("SELECT decreto_id FROM acciones WHERE id = ?").bind(t).first();
          if (v) {
            const h = await e.env.DB.prepare(`
              INSERT INTO acciones (
                decreto_id, titulo, que_hacer, como_hacerlo, tipo, 
                proxima_revision, origen
              ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `).bind(v.decreto_id, d, "Tarea generada desde seguimiento", `Completar: ${d}`, p, f, `seguimiento:${t}`).run();
            let m = null;
            if (p === "secundaria") {
              const _ = f ? f.split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0], T = f ? f.split("T")[1] : "09:00";
              m = (await e.env.DB.prepare(`
                INSERT INTO agenda_eventos (accion_id, titulo, descripcion, fecha_evento, hora_evento)
                VALUES (?, ?, ?, ?, ?)
              `).bind(h.meta.last_row_id, d, `[Auto-generada] ${d}`, _, T).run()).meta.last_row_id;
            } else
              p === "primaria" && f && (m = (await e.env.DB.prepare(`
                INSERT INTO agenda_eventos (accion_id, titulo, descripcion, fecha_evento, hora_evento)
                VALUES (?, ?, ?, date(?), time(?))
              `).bind(h.meta.last_row_id, `[Semanal] ${d}`, "Tarea generada desde seguimiento", f.split("T")[0], f.split("T")[1]).run()).meta.last_row_id);
            m && await e.env.DB.prepare(`
                UPDATE acciones SET agenda_event_id = ? WHERE id = ?
              `).bind(m, h.meta.last_row_id).run(), c++;
          }
        }
    }
    return e.json({ success: true, message: `Seguimiento guardado. ${c} tareas nuevas creadas.` });
  } catch {
    return e.json({ success: false, error: "Error al crear seguimiento" }, 500);
  }
});
I.get("/:id/sugerencias", async (e) => {
  try {
    const t = e.req.param("id"), r = await e.env.DB.prepare("SELECT * FROM decretos WHERE id = ?").bind(t).first();
    if (!r)
      return e.json({ success: false, error: "Decreto no encontrado" }, 404);
    let a = [];
    switch (r.area) {
      case "empresarial":
        a = ["Analizar competencia directa y ventajas competitivas", "Definir m\xE9tricas clave de rendimiento (KPIs)", "Desarrollar plan de marketing digital", "Establecer alianzas estrat\xE9gicas", "Optimizar procesos operativos"];
        break;
      case "material":
        a = ["Revisar y optimizar presupuesto mensual", "Investigar nuevas oportunidades de inversi\xF3n", "Crear fondo de emergencia", "Diversificar fuentes de ingresos", "Consultar con asesor financiero"];
        break;
      case "humano":
        a = ["Establecer rutina de ejercicio diario", "Practicar meditaci\xF3n mindfulness", "Fortalecer relaciones familiares", "Desarrollar nuevas habilidades", "Cultivar h\xE1bitos de sue\xF1o saludables"];
        break;
      default:
        a = ["Definir objetivos espec\xEDficos y medibles", "Crear plan de acci\xF3n detallado", "Establecer fechas l\xEDmite realistas", "Buscar recursos y herramientas necesarias", "Programar revisiones de progreso"];
    }
    return e.json({ success: true, data: a.map((s, n) => ({ id: `sugerencia_${n + 1}`, texto: s, categoria: r.area })) });
  } catch {
    return e.json({ success: false, error: "Error al generar sugerencias" }, 500);
  }
});
I.get("/:decretoId/acciones/:accionId/arbol", async (e) => {
  try {
    const t = e.req.param("decretoId"), r = e.req.param("accionId"), a = await e.env.DB.prepare(`
      WITH RECURSIVE arbol_completo AS (
        -- Tarea ra\xEDz
        SELECT 
          a.id, a.titulo, a.que_hacer, a.estado, a.nivel_jerarquia,
          a.tarea_padre_id, a.proxima_revision, a.tiene_derivadas,
          0 as profundidad, CAST(a.id AS TEXT) as path
        FROM acciones a
        WHERE a.id = ? AND a.decreto_id = ?
        
        UNION ALL
        
        -- Tareas derivadas
        SELECT 
          a.id, a.titulo, a.que_hacer, a.estado, a.nivel_jerarquia,
          a.tarea_padre_id, a.proxima_revision, a.tiene_derivadas,
          ac.profundidad + 1, ac.path || '/' || CAST(a.id AS TEXT)
        FROM acciones a
        JOIN arbol_completo ac ON a.tarea_padre_id = ac.id
        WHERE a.nivel_jerarquia <= 2
      )
      SELECT ac.*, td.dias_offset, td.orden, td.tipo_relacion
      FROM arbol_completo ac
      LEFT JOIN tareas_derivadas td ON td.tarea_hija_id = ac.id
      ORDER BY ac.profundidad, td.orden
    `).bind(r, t).all();
    return e.json({ success: true, data: { arbol: a.results, total_tareas: a.results.length } });
  } catch {
    return e.json({ success: false, error: "Error al obtener \xE1rbol de tareas" }, 500);
  }
});
var H = new me();
H.get("/metricas/:fecha", async (e) => {
  try {
    const t = e.req.param("fecha"), r = await e.env.DB.prepare(`
      SELECT ae.*, a.titulo as accion_titulo, d.area, d.titulo as decreto_titulo
      FROM agenda_eventos ae
      LEFT JOIN acciones a ON ae.accion_id = a.id
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE ae.fecha_evento = ?
      ORDER BY ae.hora_evento ASC
    `).bind(t).all(), a = r.results.length, s = r.results.filter((i) => i.estado === "completada").length, n = a - s, o = a > 0 ? Math.round(s / a * 100) : 0;
    return e.json({ success: true, data: { total: a, completadas: s, pendientes: n, progreso: o, tareas: r.results } });
  } catch {
    return e.json({ success: false, error: "Error al obtener m\xE9tricas del d\xEDa" }, 500);
  }
});
H.get("/calendario/:year/:month", async (e) => {
  try {
    const t = e.req.param("year"), r = e.req.param("month"), a = `${t}-${r.padStart(2, "0")}-01`, s = `${t}-${r.padStart(2, "0")}-31`, n = await e.env.DB.prepare(`
      SELECT 
        fecha_evento,
        COUNT(*) as total,
        COUNT(CASE WHEN estado = 'completada' THEN 1 END) as completadas,
        COUNT(CASE WHEN estado = 'pendiente' AND fecha_evento < date('now') THEN 1 END) as vencidas
      FROM agenda_eventos 
      WHERE fecha_evento BETWEEN ? AND ?
      GROUP BY fecha_evento
    `).bind(a, s).all(), o = {};
    for (const i of n.results) {
      const { fecha_evento: c, total: l, completadas: d, vencidas: p } = i;
      d === l ? o[c] = "completado" : p > 0 ? o[c] = "vencido" : l > d && (o[c] = "pendiente");
    }
    return e.json({ success: true, data: { eventos: n.results, estados: o } });
  } catch {
    return e.json({ success: false, error: "Error al obtener calendario" }, 500);
  }
});
H.get("/timeline/:fecha", async (e) => {
  try {
    const t = e.req.param("fecha"), r = await e.env.DB.prepare(`
      SELECT 
        ae.*,
        a.titulo as accion_titulo,
        a.que_hacer,
        a.tipo,
        d.area,
        d.titulo as decreto_titulo,
        d.id as decreto_id
      FROM agenda_eventos ae
      LEFT JOIN acciones a ON ae.accion_id = a.id
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE ae.fecha_evento = ?
      ORDER BY ae.hora_evento ASC, ae.created_at ASC
    `).bind(t).all();
    return e.json({ success: true, data: r.results });
  } catch {
    return e.json({ success: false, error: "Error al obtener timeline" }, 500);
  }
});
H.get("/enfoque/:fecha", async (e) => {
  try {
    const t = e.req.param("fecha"), r = await e.env.DB.prepare(`
      SELECT 
        ae.*,
        a.titulo as accion_titulo,
        d.titulo as decreto_titulo,
        d.area
      FROM agenda_eventos ae
      LEFT JOIN acciones a ON ae.accion_id = a.id
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE ae.fecha_evento = ? AND ae.es_enfoque_dia = 1
      LIMIT 1
    `).bind(t).first();
    return e.json({ success: true, data: r });
  } catch {
    return e.json({ success: false, error: "Error al obtener enfoque del d\xEDa" }, 500);
  }
});
H.put("/enfoque/:fecha", async (e) => {
  try {
    const t = e.req.param("fecha"), { tarea_id: r } = await e.req.json();
    return await e.env.DB.prepare("UPDATE agenda_eventos SET es_enfoque_dia = 0 WHERE fecha_evento = ?").bind(t).run(), r && await e.env.DB.prepare("UPDATE agenda_eventos SET es_enfoque_dia = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(r).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al establecer enfoque" }, 500);
  }
});
H.post("/tareas", async (e) => {
  try {
    const { decreto_id: t, nombre: r, descripcion: a, fecha_hora: s, tipo: n } = await e.req.json();
    if (!t || !r || !s)
      return e.json({ success: false, error: "Campos requeridos: decreto_id, nombre, fecha_hora" }, 400);
    const o = await e.env.DB.prepare(`
      INSERT INTO acciones (
        decreto_id, titulo, que_hacer, como_hacerlo, tipo, 
        proxima_revision, origen
      ) VALUES (?, ?, ?, ?, ?, ?, 'agenda')
    `).bind(t, r, a || "Tarea creada desde agenda", "Completar seg\xFAn se planific\xF3", n || "secundaria", s).run(), i = s.split("T")[0], c = s.split("T")[1] || "09:00";
    return await e.env.DB.prepare(`
      INSERT INTO agenda_eventos (accion_id, titulo, descripcion, fecha_evento, hora_evento)
      VALUES (?, ?, ?, ?, ?)
    `).bind(o.meta.last_row_id, `[Agenda] ${r}`, a || "", i, c).run(), e.json({ success: true, id: o.meta.last_row_id });
  } catch {
    return e.json({ success: false, error: "Error al crear tarea" }, 500);
  }
});
H.put("/tareas/:id/completar", async (e) => {
  try {
    const t = e.req.param("id");
    return await e.env.DB.prepare('UPDATE agenda_eventos SET estado = "completada", updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(t).run(), await e.env.DB.prepare(`
      UPDATE acciones SET 
        estado = "completada", 
        fecha_cierre = date("now"),
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = (
        SELECT accion_id FROM agenda_eventos WHERE id = ?
      )
    `).bind(t).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al completar tarea" }, 500);
  }
});
H.put("/tareas/:id/pendiente", async (e) => {
  try {
    const t = e.req.param("id");
    return await e.env.DB.prepare('UPDATE agenda_eventos SET estado = "pendiente", updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(t).run(), await e.env.DB.prepare(`
      UPDATE acciones SET 
        estado = "pendiente", 
        fecha_cierre = NULL,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = (
        SELECT accion_id FROM agenda_eventos WHERE id = ?
      )
    `).bind(t).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al marcar tarea como pendiente" }, 500);
  }
});
H.delete("/tareas/:id", async (e) => {
  try {
    const t = e.req.param("id"), r = await e.env.DB.prepare("SELECT accion_id FROM agenda_eventos WHERE id = ?").bind(t).first();
    if (await e.env.DB.prepare("DELETE FROM agenda_eventos WHERE id = ?").bind(t).run(), r != null && r.accion_id) {
      const a = await e.env.DB.prepare("SELECT origen FROM acciones WHERE id = ?").bind(r.accion_id).first();
      (a == null ? void 0 : a.origen) === "agenda" && await e.env.DB.prepare("DELETE FROM acciones WHERE id = ?").bind(r.accion_id).run();
    }
    return e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al eliminar tarea" }, 500);
  }
});
H.get("/pendientes/:fecha", async (e) => {
  try {
    const t = e.req.param("fecha"), r = await e.env.DB.prepare(`
      SELECT 
        ae.id,
        ae.titulo,
        ae.hora_evento,
        a.titulo as accion_titulo,
        d.titulo as decreto_titulo,
        d.area
      FROM agenda_eventos ae
      LEFT JOIN acciones a ON ae.accion_id = a.id
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE ae.fecha_evento = ? AND ae.estado = 'pendiente'
      ORDER BY ae.hora_evento ASC
    `).bind(t).all();
    return e.json({ success: true, data: r.results });
  } catch {
    return e.json({ success: false, error: "Error al obtener tareas pendientes" }, 500);
  }
});
H.get("/tareas/:id", async (e) => {
  try {
    const t = e.req.param("id"), r = await e.env.DB.prepare(`
      SELECT 
        ae.*,
        a.titulo as accion_titulo,
        a.que_hacer,
        a.como_hacerlo,
        a.resultados,
        a.tipo,
        a.calificacion,
        a.proxima_revision,
        a.tareas_pendientes,
        d.titulo as decreto_titulo,
        d.sueno_meta,
        d.descripcion as decreto_descripcion,
        d.area,
        d.id as decreto_id
      FROM agenda_eventos ae
      LEFT JOIN acciones a ON ae.accion_id = a.id
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE ae.id = ?
    `).bind(t).first();
    if (!r)
      return e.json({ success: false, error: "Tarea no encontrada" }, 404);
    if (r.tareas_pendientes)
      try {
        r.tareas_pendientes = JSON.parse(r.tareas_pendientes);
      } catch {
        r.tareas_pendientes = [];
      }
    return e.json({ success: true, data: r });
  } catch {
    return e.json({ success: false, error: "Error al obtener detalles de la tarea" }, 500);
  }
});
H.put("/tareas/:id", async (e) => {
  try {
    const t = e.req.param("id"), { titulo: r, descripcion: a, fecha_hora: s, que_hacer: n, como_hacerlo: o, resultados: i, tipo: c, calificacion: l } = await e.req.json();
    if (!r || !s)
      return e.json({ success: false, error: "Campos requeridos: titulo, fecha_hora" }, 400);
    const d = s.split("T")[0], p = s.split("T")[1] || "09:00";
    await e.env.DB.prepare(`
      UPDATE agenda_eventos SET 
        titulo = ?,
        descripcion = ?,
        fecha_evento = ?,
        hora_evento = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(r, a || "", d, p, t).run();
    const f = await e.env.DB.prepare("SELECT accion_id FROM agenda_eventos WHERE id = ?").bind(t).first();
    return f != null && f.accion_id && await e.env.DB.prepare(`
        UPDATE acciones SET 
          titulo = ?,
          que_hacer = ?,
          como_hacerlo = ?,
          resultados = ?,
          tipo = ?,
          proxima_revision = ?,
          calificacion = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(r, n || "", o || "", i || "", c || "secundaria", s, l || null, f.accion_id).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al editar tarea" }, 500);
  }
});
H.get("/filtros", async (e) => {
  try {
    const { fecha_desde: t, fecha_hasta: r, incluir_hoy: a, incluir_futuras: s, incluir_completadas: n, incluir_pendientes: o, decreto_id: i, area: c } = e.req.query();
    let l = `
      SELECT 
        ae.*,
        a.titulo as accion_titulo,
        a.tipo,
        d.titulo as decreto_titulo,
        d.area,
        d.id as decreto_id
      FROM agenda_eventos ae
      LEFT JOIN acciones a ON ae.accion_id = a.id
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE 1=1
    `;
    const d = [];
    a === "true" && (l += " AND ae.fecha_evento = date('now')"), s === "true" && (l += " AND ae.fecha_evento > date('now')"), t && r && (l += " AND ae.fecha_evento BETWEEN ? AND ?", d.push(t, r));
    const p = [];
    n === "true" && p.push("completada"), o === "true" && p.push("pendiente"), p.length > 0 && (l += ` AND ae.estado IN (${p.map(() => "?").join(",")})`, d.push(...p)), i && i !== "todos" && (l += " AND d.id = ?", d.push(i)), c && c !== "todos" && (l += " AND d.area = ?", d.push(c)), l += " ORDER BY ae.fecha_evento DESC, ae.hora_evento ASC";
    const f = await e.env.DB.prepare(l).bind(...d).all();
    return e.json({ success: true, data: f.results });
  } catch {
    return e.json({ success: false, error: "Error al filtrar tareas" }, 500);
  }
});
H.post("/tareas/:id/seguimiento", async (e) => {
  try {
    const t = e.req.param("id"), r = await e.req.json(), a = await e.env.DB.prepare("SELECT accion_id FROM agenda_eventos WHERE id = ?").bind(t).first();
    if (!(a != null && a.accion_id))
      return e.json({ success: false, error: "No se encontr\xF3 acci\xF3n asociada" }, 404);
    const { que_se_hizo: s, como_se_hizo: n, resultados_obtenidos: o, tareas_pendientes: i, proxima_revision: c, calificacion: l } = r;
    return await e.env.DB.prepare(`
      INSERT INTO seguimientos (
        accion_id, que_se_hizo, como_se_hizo, resultados_obtenidos, 
        tareas_pendientes, proxima_revision, calificacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(a.accion_id, s, n, o, JSON.stringify(i || []), c || null, l || null).run(), await e.env.DB.prepare(`
      UPDATE acciones SET 
        resultados = ?, 
        tareas_pendientes = ?, 
        proxima_revision = ?,
        calificacion = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(o, JSON.stringify(i || []), c || null, l || null, a.accion_id).run(), e.json({ success: true, message: "Seguimiento guardado desde agenda" });
  } catch {
    return e.json({ success: false, error: "Error al crear seguimiento" }, 500);
  }
});
var ne = new me();
ne.get("/metricas", async (e) => {
  try {
    const t = await e.env.DB.prepare("SELECT COUNT(*) as total FROM acciones").first(), r = await e.env.DB.prepare('SELECT COUNT(*) as total FROM acciones WHERE estado = "completada"').first(), a = await e.env.DB.prepare('SELECT COUNT(*) as total FROM acciones WHERE estado IN ("pendiente", "en_progreso")').first(), s = (t == null ? void 0 : t.total) || 0, n = (r == null ? void 0 : r.total) || 0, o = (a == null ? void 0 : a.total) || 0, i = s > 0 ? Math.round(n / s * 100) : 0;
    return e.json({ success: true, data: { total_tareas: s, completadas: n, pendientes: o, progreso_global: i } });
  } catch {
    return e.json({ success: false, error: "Error al obtener m\xE9tricas" }, 500);
  }
});
ne.get("/por-decreto", async (e) => {
  try {
    const t = await e.env.DB.prepare(`
      SELECT 
        d.id,
        d.titulo,
        d.area,
        COUNT(a.id) as total_acciones,
        COUNT(CASE WHEN a.estado = 'completada' THEN 1 END) as completadas,
        COUNT(CASE WHEN a.estado IN ('pendiente', 'en_progreso') THEN 1 END) as pendientes,
        CASE 
          WHEN COUNT(a.id) > 0 
          THEN ROUND((COUNT(CASE WHEN a.estado = 'completada' THEN 1 END) * 100.0) / COUNT(a.id))
          ELSE 0 
        END as progreso_porcentaje
      FROM decretos d
      LEFT JOIN acciones a ON d.id = a.decreto_id
      GROUP BY d.id, d.titulo, d.area
      ORDER BY d.area, d.created_at
    `).all(), r = { empresarial: [], material: [], humano: [] };
    for (const s of t.results)
      r[s.area] && r[s.area].push(s);
    const a = { empresarial: { total_acciones: r.empresarial.reduce((s, n) => s + n.total_acciones, 0), completadas: r.empresarial.reduce((s, n) => s + n.completadas, 0), progreso: 0 }, material: { total_acciones: r.material.reduce((s, n) => s + n.total_acciones, 0), completadas: r.material.reduce((s, n) => s + n.completadas, 0), progreso: 0 }, humano: { total_acciones: r.humano.reduce((s, n) => s + n.total_acciones, 0), completadas: r.humano.reduce((s, n) => s + n.completadas, 0), progreso: 0 } };
    return Object.keys(a).forEach((s) => {
      const n = a[s];
      n.progreso = n.total_acciones > 0 ? Math.round(n.completadas / n.total_acciones * 100) : 0;
    }), e.json({ success: true, data: { decretos: t.results, por_area: r, totales_por_area: a } });
  } catch {
    return e.json({ success: false, error: "Error al obtener progreso por decreto" }, 500);
  }
});
ne.get("/timeline", async (e) => {
  try {
    const { periodo: t } = e.req.query();
    let r = "";
    const a = [];
    switch (t) {
      case "dia":
        r = 'WHERE a.fecha_cierre = date("now")';
        break;
      case "semana":
        r = 'WHERE a.fecha_cierre >= date("now", "-7 days")';
        break;
      case "mes":
        r = 'WHERE a.fecha_cierre >= date("now", "-30 days")';
        break;
      default:
        break;
    }
    const s = await e.env.DB.prepare(`
      SELECT 
        a.titulo,
        a.fecha_cierre,
        a.tipo,
        a.calificacion,
        d.titulo as decreto_titulo,
        d.area,
        s.que_se_hizo,
        s.resultados_obtenidos
      FROM acciones a
      JOIN decretos d ON a.decreto_id = d.id
      LEFT JOIN seguimientos s ON a.id = s.accion_id
      ${r}
      AND a.estado = 'completada'
      ORDER BY a.fecha_cierre DESC, a.updated_at DESC
      LIMIT 50
    `).bind(...a).all();
    return e.json({ success: true, data: s.results });
  } catch {
    return e.json({ success: false, error: "Error al obtener timeline" }, 500);
  }
});
ne.get("/evolucion", async (e) => {
  try {
    const { dias: t = 30 } = e.req.query(), r = await e.env.DB.prepare(`
      SELECT 
        fecha_cierre,
        COUNT(*) as completadas_dia,
        SUM(COUNT(*)) OVER (ORDER BY fecha_cierre) as acumuladas
      FROM acciones
      WHERE estado = 'completada' 
        AND fecha_cierre >= date('now', '-' || ? || ' days')
        AND fecha_cierre IS NOT NULL
      GROUP BY fecha_cierre
      ORDER BY fecha_cierre
    `).bind(t).all();
    return e.json({ success: true, data: r.results });
  } catch {
    return e.json({ success: false, error: "Error al obtener evoluci\xF3n" }, 500);
  }
});
ne.get("/distribucion", async (e) => {
  try {
    const t = await e.env.DB.prepare(`
      SELECT 
        d.area,
        COUNT(a.id) as total_acciones,
        COUNT(CASE WHEN a.estado = 'completada' THEN 1 END) as completadas
      FROM decretos d
      LEFT JOIN acciones a ON d.id = a.decreto_id
      GROUP BY d.area
    `).all();
    return e.json({ success: true, data: t.results });
  } catch {
    return e.json({ success: false, error: "Error al obtener distribuci\xF3n" }, 500);
  }
});
ne.get("/reporte", async (e) => {
  try {
    const t = await e.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_tareas,
        COUNT(CASE WHEN estado = 'completada' THEN 1 END) as completadas,
        COUNT(CASE WHEN estado IN ('pendiente', 'en_progreso') THEN 1 END) as pendientes,
        COUNT(DISTINCT decreto_id) as total_decretos
      FROM acciones
    `).first(), r = await e.env.DB.prepare(`
      SELECT 
        d.titulo,
        d.area,
        d.sueno_meta,
        COUNT(a.id) as total_acciones,
        COUNT(CASE WHEN a.estado = 'completada' THEN 1 END) as completadas,
        CASE 
          WHEN COUNT(a.id) > 0 
          THEN ROUND((COUNT(CASE WHEN a.estado = 'completada' THEN 1 END) * 100.0) / COUNT(a.id))
          ELSE 0 
        END as progreso
      FROM decretos d
      LEFT JOIN acciones a ON d.id = a.decreto_id
      GROUP BY d.id, d.titulo, d.area, d.sueno_meta
      ORDER BY progreso DESC
    `).all(), a = await e.env.DB.prepare(`
      SELECT 
        a.titulo,
        a.fecha_cierre,
        d.titulo as decreto_titulo,
        d.area,
        s.resultados_obtenidos
      FROM acciones a
      JOIN decretos d ON a.decreto_id = d.id
      LEFT JOIN seguimientos s ON a.id = s.accion_id
      WHERE a.estado = 'completada'
      ORDER BY a.fecha_cierre DESC
      LIMIT 10
    `).all(), s = await e.env.DB.prepare("SELECT * FROM configuracion WHERE id = ?").bind("main").first(), n = (/* @__PURE__ */ new Date()).toISOString().split("T")[0], o = (t == null ? void 0 : t.total_tareas) > 0 ? Math.round(((t == null ? void 0 : t.completadas) || 0) / t.total_tareas * 100) : 0;
    return e.json({ success: true, data: { fecha_reporte: n, usuario: s || { nombre_usuario: "Usuario", frase_vida: "" }, metricas: { ...t, progreso_global: o }, decretos: r.results, ultimos_logros: a.results } });
  } catch {
    return e.json({ success: false, error: "Error al generar reporte" }, 500);
  }
});
ne.get("/estadisticas", async (e) => {
  try {
    const t = await e.env.DB.prepare("SELECT AVG(calificacion) as promedio FROM acciones WHERE calificacion IS NOT NULL").first(), r = await e.env.DB.prepare(`
      SELECT 
        tipo,
        COUNT(*) as cantidad,
        COUNT(CASE WHEN estado = 'completada' THEN 1 END) as completadas
      FROM acciones
      GROUP BY tipo
    `).all(), a = await e.env.DB.prepare(`
      SELECT 
        fecha_cierre,
        COUNT(*) as tareas_completadas
      FROM acciones
      WHERE estado = 'completada' AND fecha_cierre IS NOT NULL
      GROUP BY fecha_cierre
      ORDER BY tareas_completadas DESC
      LIMIT 5
    `).all();
    return e.json({ success: true, data: { promedio_calificacion: (t == null ? void 0 : t.promedio) || 0, por_tipo: r.results, dias_mas_productivos: a.results } });
  } catch {
    return e.json({ success: false, error: "Error al obtener estad\xEDsticas" }, 500);
  }
});
var j = new me();
j.get("/rutinas", async (e) => {
  try {
    const t = await e.env.DB.prepare(`
      SELECT * FROM rutinas_matutinas 
      WHERE activa = 1 
      ORDER BY orden_display ASC
    `).all(), r = e.req.query("fecha_simulada"), a = r || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    console.log(`\u{1F4C5} Verificando rutinas para fecha: ${a}${r ? " (SIMULADA)" : ""}`);
    const s = [];
    for (const n of t.results) {
      const o = await e.env.DB.prepare(`
        SELECT * FROM rutinas_completadas 
        WHERE rutina_id = ? AND fecha_completada = ?
      `).bind(n.id, a).first();
      s.push({ ...n, completada_hoy: !!o, detalle_hoy: o || null });
    }
    return e.json({ success: true, data: s });
  } catch {
    return e.json({ success: false, error: "Error al obtener rutinas" }, 500);
  }
});
j.post("/rutinas/:id/completar", async (e) => {
  try {
    const t = e.req.param("id"), { tiempo_invertido: r, notas: a } = await e.req.json(), s = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    return await e.env.DB.prepare(`
      INSERT OR REPLACE INTO rutinas_completadas 
      (rutina_id, fecha_completada, tiempo_invertido, notas)
      VALUES (?, ?, ?, ?)
    `).bind(t, s, r || null, a || "").run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al completar rutina" }, 500);
  }
});
j.delete("/rutinas/:id/completar", async (e) => {
  try {
    const t = e.req.param("id"), r = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    return await e.env.DB.prepare(`
      DELETE FROM rutinas_completadas 
      WHERE rutina_id = ? AND fecha_completada = ?
    `).bind(t, r).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al desmarcar rutina" }, 500);
  }
});
j.get("/rutinas/progreso", async (e) => {
  try {
    const { dias: t = 7 } = e.req.query(), r = await e.env.DB.prepare(`
      SELECT 
        rm.nombre,
        rm.icono,
        COUNT(rc.id) as dias_completados,
        ? as dias_totales,
        ROUND((COUNT(rc.id) * 100.0) / ?, 1) as porcentaje_completado
      FROM rutinas_matutinas rm
      LEFT JOIN rutinas_completadas rc ON rm.id = rc.rutina_id
        AND rc.fecha_completada >= date('now', '-' || ? || ' days')
      WHERE rm.activa = 1
      GROUP BY rm.id, rm.nombre, rm.icono
      ORDER BY porcentaje_completado DESC
    `).bind(t, t, t).all();
    return e.json({ success: true, data: r.results });
  } catch {
    return e.json({ success: false, error: "Error al obtener progreso de rutinas" }, 500);
  }
});
j.get("/rutinas/progreso-dia", async (e) => {
  try {
    const t = (/* @__PURE__ */ new Date()).toISOString().split("T")[0], r = await e.env.DB.prepare("SELECT COUNT(*) as total FROM rutinas_matutinas WHERE activa = 1").first(), a = await e.env.DB.prepare(`
      SELECT COUNT(*) as completadas 
      FROM rutinas_completadas rc
      JOIN rutinas_matutinas rm ON rc.rutina_id = rm.id
      WHERE rc.fecha_completada = ? AND rm.activa = 1
    `).bind(t).first(), s = (r == null ? void 0 : r.total) || 0, n = (a == null ? void 0 : a.completadas) || 0, o = s > 0 ? Math.round(n / s * 100) : 0;
    return e.json({ success: true, data: { total_rutinas: s, completadas_hoy: n, porcentaje_progreso: o, fecha: t } });
  } catch {
    return e.json({ success: false, error: "Error al obtener progreso del d\xEDa" }, 500);
  }
});
j.get("/rutinas/progreso-dia/:fecha", async (e) => {
  try {
    const t = e.req.param("fecha") || (/* @__PURE__ */ new Date()).toISOString().split("T")[0], r = await e.env.DB.prepare("SELECT COUNT(*) as total FROM rutinas_matutinas WHERE activa = 1").first(), a = await e.env.DB.prepare(`
      SELECT COUNT(*) as completadas 
      FROM rutinas_completadas rc
      JOIN rutinas_matutinas rm ON rc.rutina_id = rm.id
      WHERE rc.fecha_completada = ? AND rm.activa = 1
    `).bind(t).first(), s = (r == null ? void 0 : r.total) || 0, n = (a == null ? void 0 : a.completadas) || 0, o = s > 0 ? Math.round(n / s * 100) : 0;
    return e.json({ success: true, data: { total_rutinas: s, completadas_hoy: n, porcentaje_progreso: o, fecha: t } });
  } catch {
    return e.json({ success: false, error: "Error al obtener progreso del d\xEDa" }, 500);
  }
});
j.get("/afirmaciones", async (e) => {
  try {
    const { categoria: t, favoritas: r } = e.req.query();
    let a = "SELECT * FROM afirmaciones WHERE 1=1";
    const s = [];
    t && t !== "todas" && (a += " AND categoria = ?", s.push(t)), r === "true" && (a += " AND es_favorita = 1"), a += " ORDER BY es_favorita DESC, veces_usada DESC, created_at DESC";
    const n = await e.env.DB.prepare(a).bind(...s).all();
    return e.json({ success: true, data: n.results });
  } catch {
    return e.json({ success: false, error: "Error al obtener afirmaciones" }, 500);
  }
});
j.post("/afirmaciones", async (e) => {
  try {
    const { texto: t, categoria: r } = await e.req.json();
    if (!t || !r)
      return e.json({ success: false, error: "Texto y categor\xEDa son requeridos" }, 400);
    const a = await e.env.DB.prepare(`
      INSERT INTO afirmaciones (texto, categoria, es_favorita, veces_usada)
      VALUES (?, ?, 0, 0)
    `).bind(t, r).run();
    return e.json({ success: true, id: a.meta.last_row_id });
  } catch {
    return e.json({ success: false, error: "Error al crear afirmaci\xF3n" }, 500);
  }
});
j.put("/afirmaciones/:id/favorita", async (e) => {
  try {
    const t = e.req.param("id"), { es_favorita: r } = await e.req.json();
    return await e.env.DB.prepare(`
      UPDATE afirmaciones SET 
        es_favorita = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(r ? 1 : 0, t).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al actualizar favorita" }, 500);
  }
});
j.post("/afirmaciones/:id/usar", async (e) => {
  try {
    const t = e.req.param("id");
    return await e.env.DB.prepare(`
      UPDATE afirmaciones SET 
        veces_usada = veces_usada + 1,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(t).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al marcar como usada" }, 500);
  }
});
j.delete("/afirmaciones/:id", async (e) => {
  try {
    const t = e.req.param("id");
    return await e.env.DB.prepare("DELETE FROM afirmaciones WHERE id = ?").bind(t).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al eliminar afirmaci\xF3n" }, 500);
  }
});
j.get("/afirmaciones/del-dia", async (e) => {
  try {
    const t = await e.env.DB.prepare(`
      SELECT * FROM afirmaciones 
      WHERE es_favorita = 1 
      ORDER BY RANDOM() 
      LIMIT 2
    `).all(), r = await e.env.DB.prepare(`
      SELECT * FROM afirmaciones 
      WHERE es_favorita = 0 
      ORDER BY RANDOM() 
      LIMIT 3
    `).all(), a = [...t.results, ...r.results];
    return e.json({ success: true, data: a });
  } catch {
    return e.json({ success: false, error: "Error al obtener afirmaciones del d\xEDa" }, 500);
  }
});
j.post("/afirmaciones/generar", async (e) => {
  try {
    const { categoria: t = "general" } = await e.req.json(), r = { empresarial: ["Soy un l\xEDder natural que inspira confianza y respeto en mi equipo", "Mis ideas innovadoras transforman mi empresa y generan abundantes resultados", "Tengo la capacidad de tomar decisiones sabias que impulsan mi \xE9xito empresarial", "Mi negocio crece exponencialmente mientras mantengo mi integridad y valores", "Soy un im\xE1n para las oportunidades de negocio perfectas en el momento ideal", "Mi visi\xF3n empresarial se materializa con facilidad y genera impacto positivo", "Lidero con sabidur\xEDa y compasi\xF3n, creando un ambiente de trabajo pr\xF3spero", "Mis habilidades de comunicaci\xF3n abren puertas a alianzas estrat\xE9gicas valiosas"], material: ["La abundancia fluye hacia m\xED desde m\xFAltiples fuentes de manera constante", "Soy un canal abierto para recibir prosperidad en todas sus formas", "Mi relaci\xF3n con el dinero es saludable, positiva y equilibrada", "Tengo todo lo que necesito y m\xE1s para vivir una vida plena y pr\xF3spera", "Las oportunidades de generar ingresos aparecen naturalmente en mi camino", "Merece vivir en abundancia y celebro cada manifestaci\xF3n de prosperidad", "Mi valor y talento se compensan generosamente en el mercado", "Creo riqueza mientras contribuyo positivamente al bienestar de otros"], humano: ["Soy digno/a de amor incondicional y atraigo relaciones armoniosas a mi vida", "Mi coraz\xF3n est\xE1 abierto para dar y recibir amor en todas sus formas", "Cultivo relaciones basadas en el respeto mutuo, la comprensi\xF3n y la alegr\xEDa", "Me rodeo de personas que me apoyan y celebran mi crecimiento personal", "Comunico mis sentimientos con claridad, compasi\xF3n y autenticidad", "Mi presencia inspira calma, alegr\xEDa y confianza en quienes me rodean", "Perdono f\xE1cilmente y libero cualquier resentimiento que no me sirve", "Cada d\xEDa fortalezco los v\xEDnculos importantes en mi vida con amor y gratitud"], general: ["Cada d\xEDa me convierto en la mejor versi\xF3n de m\xED mismo/a con alegr\xEDa y gratitud", "Conf\xEDo plenamente en mi sabidur\xEDa interior para guiar mis decisiones", "Soy resiliente y transformo cada desaf\xEDo en una oportunidad de crecimiento", "Mi vida est\xE1 llena de prop\xF3sito, significado y experiencias enriquecedoras", "Irradio paz, amor y luz positiva donde quiera que vaya", "Soy el/la arquitecto/a consciente de mi realidad y creo con intenci\xF3n clara", "Mi mente es clara, mi coraz\xF3n est\xE1 abierto y mi esp\xEDritu es libre", "Celebro mis logros y aprendo valiosas lecciones de cada experiencia"] }, a = r[t] || r.general, s = a[Math.floor(Math.random() * a.length)], n = await e.env.DB.prepare(`
      INSERT INTO afirmaciones (texto, categoria, es_favorita, veces_usada)
      VALUES (?, ?, 0, 0)
    `).bind(s, t).run(), o = await e.env.DB.prepare(`
      SELECT * FROM afirmaciones WHERE rowid = ?
    `).bind(n.meta.last_row_id).first();
    return e.json({ success: true, data: o });
  } catch (t) {
    return console.error("Error al generar afirmaci\xF3n:", t), e.json({ success: false, error: "Error al generar afirmaci\xF3n" }, 500);
  }
});
j.get("/rutinas/:id/preguntas", async (e) => {
  try {
    const t = e.req.param("id"), r = await e.env.DB.prepare(`
      SELECT * FROM rutinas_preguntas 
      WHERE rutina_id = ? AND activa = 1
      ORDER BY orden ASC
    `).bind(t).all();
    return e.json({ success: true, data: r.results });
  } catch {
    return e.json({ success: false, error: "Error al obtener preguntas de rutina" }, 500);
  }
});
j.post("/rutinas/:id/completar-detallado", async (e) => {
  try {
    const t = e.req.param("id"), { tiempo_invertido: r, notas: a, respuestas: s, estado_animo_antes: n, estado_animo_despues: o, calidad_percibida: i, ubicacion: c } = await e.req.json(), l = (/* @__PURE__ */ new Date()).toISOString().split("T")[0], d = (/* @__PURE__ */ new Date()).toISOString();
    return await e.env.DB.prepare(`
      INSERT OR REPLACE INTO rutinas_completadas 
      (rutina_id, fecha_completada, tiempo_invertido, notas, respuestas_json, 
       estado_animo_antes, estado_animo_despues, calidad_percibida, ubicacion, 
       tiempo_inicio, tiempo_fin)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(t, l, r || null, a || "", JSON.stringify(s || {}), n || null, o || null, i || null, c || null, d, (/* @__PURE__ */ new Date()).toISOString()).run(), await e.env.DB.prepare(`
      INSERT OR REPLACE INTO rutinas_estadisticas_diarias 
      (fecha, rutinas_completadas, rutinas_totales, porcentaje_completado, tiempo_total_minutos)
      SELECT 
        ?,
        COUNT(DISTINCT rc.rutina_id) as completadas,
        (SELECT COUNT(*) FROM rutinas_matutinas WHERE activa = 1) as totales,
        ROUND((COUNT(DISTINCT rc.rutina_id) * 100.0) / 
              (SELECT COUNT(*) FROM rutinas_matutinas WHERE activa = 1), 2) as porcentaje,
        COALESCE(SUM(rc.tiempo_invertido), 0) as tiempo_total
      FROM rutinas_completadas rc
      WHERE rc.fecha_completada = ?
    `).bind(l, l).run(), e.json({ success: true });
  } catch (t) {
    return console.error("Error al completar rutina detallada:", t), e.json({ success: false, error: "Error al completar rutina" }, 500);
  }
});
j.get("/rutinas/analytics", async (e) => {
  try {
    const { dias: t = 30 } = e.req.query(), r = await e.env.DB.prepare(`
      SELECT 
        rm.nombre,
        rm.icono,
        COUNT(rc.id) as veces_completada,
        AVG(rc.tiempo_invertido) as tiempo_promedio,
        AVG(rc.calidad_percibida) as calidad_promedio,
        AVG(rc.estado_animo_despues) as animo_promedio_despues
      FROM rutinas_matutinas rm
      LEFT JOIN rutinas_completadas rc ON rm.id = rc.rutina_id
        AND rc.fecha_completada >= date('now', '-' || ? || ' days')
      WHERE rm.activa = 1
      GROUP BY rm.id, rm.nombre, rm.icono
      ORDER BY veces_completada DESC
    `).bind(t).all(), a = await e.env.DB.prepare(`
      SELECT 
        fecha,
        rutinas_completadas,
        rutinas_totales,
        porcentaje_completado,
        tiempo_total_minutos
      FROM rutinas_estadisticas_diarias
      WHERE fecha >= date('now', '-' || ? || ' days')
      ORDER BY fecha DESC
    `).bind(t).all(), s = await e.env.DB.prepare(`
      WITH fechas_consecutivas AS (
        SELECT fecha, 
               LAG(fecha) OVER (ORDER BY fecha DESC) as fecha_anterior
        FROM rutinas_estadisticas_diarias
        WHERE fecha <= date('now') 
          AND rutinas_completadas > 0
        ORDER BY fecha DESC
      )
      SELECT COUNT(*) as racha
      FROM fechas_consecutivas
      WHERE fecha_anterior IS NULL 
         OR date(fecha, '+1 day') = fecha_anterior
         OR fecha = date('now')
    `).first();
    return e.json({ success: true, data: { tendencias_por_rutina: r.results, progreso_diario: a.results, racha_actual: (s == null ? void 0 : s.racha) || 0, resumen: { dias_analizados: t, fecha_inicio: new Date(Date.now() - t * 24 * 60 * 60 * 1e3).toISOString().split("T")[0], fecha_fin: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] } } });
  } catch (t) {
    return console.error("Error al obtener analytics:", t), e.json({ success: false, error: "Error al obtener analytics" }, 500);
  }
});
j.get("/rutinas/progreso-dia/:fecha", async (e) => {
  try {
    const t = e.req.param("fecha"), r = await e.env.DB.prepare(`
      SELECT COUNT(*) as total
      FROM rutinas_matutinas
      WHERE activa = 1
    `).first(), a = await e.env.DB.prepare(`
      SELECT COUNT(*) as completadas
      FROM rutinas_completadas
      WHERE fecha_completada = ?
    `).bind(t).first(), s = (r == null ? void 0 : r.total) || 0, n = (a == null ? void 0 : a.completadas) || 0, o = s > 0 ? Math.round(n / s * 100) : 0;
    return e.json({ success: true, data: { fecha: t, total_rutinas: s, rutinas_completadas: n, rutinas_pendientes: s - n, porcentaje_progreso: o } });
  } catch {
    return e.json({ success: false, error: "Error al obtener progreso del d\xEDa" }, 500);
  }
});
j.get("/estadisticas", async (e) => {
  try {
    const t = await e.env.DB.prepare(`
      WITH RECURSIVE fecha_serie AS (
        SELECT date('now') as fecha
        UNION ALL
        SELECT date(fecha, '-1 day')
        FROM fecha_serie
        WHERE fecha >= date('now', '-30 days')
      ),
      dias_con_rutinas AS (
        SELECT DISTINCT fecha_completada
        FROM rutinas_completadas
        WHERE fecha_completada >= date('now', '-30 days')
      )
      SELECT COUNT(*) as racha
      FROM fecha_serie fs
      WHERE fs.fecha IN (SELECT fecha_completada FROM dias_con_rutinas)
      AND NOT EXISTS (
        SELECT 1 FROM fecha_serie fs2
        WHERE fs2.fecha > fs.fecha 
        AND fs2.fecha NOT IN (SELECT fecha_completada FROM dias_con_rutinas)
      )
    `).first(), r = await e.env.DB.prepare(`
      SELECT categoria, COUNT(*) as cantidad
      FROM afirmaciones
      GROUP BY categoria
      ORDER BY cantidad DESC
    `).all(), a = await e.env.DB.prepare(`
      SELECT 
        rm.nombre,
        rm.icono,
        COUNT(rc.id) as veces_completada
      FROM rutinas_matutinas rm
      LEFT JOIN rutinas_completadas rc ON rm.id = rc.rutina_id
      WHERE rm.activa = 1
      GROUP BY rm.id, rm.nombre, rm.icono
      ORDER BY veces_completada DESC
      LIMIT 1
    `).first(), s = await e.env.DB.prepare(`
      SELECT 
        fecha_completada,
        COUNT(DISTINCT rutina_id) as rutinas_completadas
      FROM rutinas_completadas
      WHERE fecha_completada >= date('now', '-7 days')
      GROUP BY fecha_completada
      ORDER BY fecha_completada
    `).all();
    return e.json({ success: true, data: { racha_actual: (t == null ? void 0 : t.racha) || 0, afirmaciones_por_categoria: r.results, rutina_mas_completada: a, progreso_semanal: s.results } });
  } catch {
    return e.json({ success: false, error: "Error al obtener estad\xEDsticas" }, 500);
  }
});
var Cs = /^[\w!#$%&'*.^`|~+-]+$/;
var Ds = /^[ !#-:<-[\]-~]*$/;
var js = /* @__PURE__ */ __name((e, t) => {
  if (e.indexOf(t) === -1)
    return {};
  const r = e.trim().split(";"), a = {};
  for (let s of r) {
    s = s.trim();
    const n = s.indexOf("=");
    if (n === -1)
      continue;
    const o = s.substring(0, n).trim();
    if (t !== o || !Cs.test(o))
      continue;
    let i = s.substring(n + 1).trim();
    if (i.startsWith('"') && i.endsWith('"') && (i = i.slice(1, -1)), Ds.test(i)) {
      a[o] = i.indexOf("%") !== -1 ? lt(i, It) : i;
      break;
    }
  }
  return a;
}, "js");
var As = /* @__PURE__ */ __name((e, t, r = {}) => {
  let a = `${e}=${t}`;
  if (e.startsWith("__Secure-") && !r.secure)
    throw new Error("__Secure- Cookie must have Secure attributes");
  if (e.startsWith("__Host-")) {
    if (!r.secure)
      throw new Error("__Host- Cookie must have Secure attributes");
    if (r.path !== "/")
      throw new Error('__Host- Cookie must have Path attributes with "/"');
    if (r.domain)
      throw new Error("__Host- Cookie must not have Domain attributes");
  }
  if (r && typeof r.maxAge == "number" && r.maxAge >= 0) {
    if (r.maxAge > 3456e4)
      throw new Error("Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration.");
    a += `; Max-Age=${r.maxAge | 0}`;
  }
  if (r.domain && r.prefix !== "host" && (a += `; Domain=${r.domain}`), r.path && (a += `; Path=${r.path}`), r.expires) {
    if (r.expires.getTime() - Date.now() > 3456e7)
      throw new Error("Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future.");
    a += `; Expires=${r.expires.toUTCString()}`;
  }
  if (r.httpOnly && (a += "; HttpOnly"), r.secure && (a += "; Secure"), r.sameSite && (a += `; SameSite=${r.sameSite.charAt(0).toUpperCase() + r.sameSite.slice(1)}`), r.priority && (a += `; Priority=${r.priority.charAt(0).toUpperCase() + r.priority.slice(1)}`), r.partitioned) {
    if (!r.secure)
      throw new Error("Partitioned Cookie must have Secure attributes");
    a += "; Partitioned";
  }
  return a;
}, "As");
var Tt = /* @__PURE__ */ __name((e, t, r) => (t = encodeURIComponent(t), As(e, t, r)), "Tt");
var Lt = /* @__PURE__ */ __name((e, t, r) => {
  const a = e.req.raw.headers.get("Cookie");
  {
    if (!a)
      return;
    let s = t;
    return js(a, s)[s];
  }
}, "Lt");
var Is = /* @__PURE__ */ __name((e, t, r) => {
  let a;
  return (r == null ? void 0 : r.prefix) === "secure" ? a = Tt("__Secure-" + e, t, { path: "/", ...r, secure: true }) : (r == null ? void 0 : r.prefix) === "host" ? a = Tt("__Host-" + e, t, { ...r, path: "/", secure: true, domain: void 0 }) : a = Tt(e, t, { path: "/", ...r }), a;
}, "Is");
var Jr = /* @__PURE__ */ __name((e, t, r, a) => {
  const s = Is(t, r, a);
  e.header("Set-Cookie", s, { append: true });
}, "Jr");
var Ee = new me();
var le = { generateToken() {
  return Math.random().toString(36).substr(2) + Date.now().toString(36);
}, verifyPassword(e, t) {
  return e === t;
}, hashPassword(e) {
  return "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";
}, isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}, async createSession(e, t, r) {
  const a = this.generateToken(), s = /* @__PURE__ */ new Date(), n = r ? 30 * 24 : 24;
  return s.setHours(s.getHours() + n), await e.prepare(`
      INSERT INTO auth_sessions (user_id, session_token, expires_at)
      VALUES (?, ?, ?)
    `).bind(t, a, s.toISOString()).run(), a;
}, async validateSession(e, t) {
  const r = await e.prepare(`
      SELECT s.*, u.id, u.email, u.name, u.is_active
      FROM auth_sessions s
      JOIN auth_users u ON s.user_id = u.id
      WHERE s.session_token = ? AND s.expires_at > datetime('now')
    `).bind(t).first();
  return !r || !r.is_active ? null : { id: r.id, email: r.email, name: r.name, password_hash: "", is_active: r.is_active, last_login: r.last_login };
}, async cleanExpiredSessions(e) {
  await e.prepare(`
      DELETE FROM auth_sessions 
      WHERE expires_at <= datetime('now')
    `).run();
} };
Ee.post("/register", async (e) => {
  try {
    const { name: t, email: r, password: a } = await e.req.json();
    if (!t || !r || !a)
      return e.json({ error: "Nombre, email y contrase\xF1a son requeridos" }, 400);
    if (!le.isValidEmail(r))
      return e.json({ error: "Formato de email inv\xE1lido" }, 400);
    if (a.length < 6)
      return e.json({ error: "La contrase\xF1a debe tener al menos 6 caracteres" }, 400);
    if (await e.env.DB.prepare(`
      SELECT id FROM auth_users WHERE email = ?
    `).bind(r).first())
      return e.json({ error: "Ya existe una cuenta con este email" }, 409);
    const n = await e.env.DB.prepare(`
      INSERT INTO auth_users (email, password_hash, name, is_active)
      VALUES (?, ?, ?, 1)
    `).bind(r, a, t).run();
    return n.success ? e.json({ success: true, message: "Cuenta creada exitosamente", user: { id: n.meta.last_row_id, email: r, name: t } }) : e.json({ error: "Error al crear la cuenta" }, 500);
  } catch (t) {
    return console.error("Error en registro:", t), e.json({ error: "Error interno del servidor" }, 500);
  }
});
Ee.post("/login", async (e) => {
  try {
    const { email: t, password: r, remember: a = false } = await e.req.json();
    if (!t || !r)
      return e.json({ error: "Email y contrase\xF1a son requeridos" }, 400);
    if (!le.isValidEmail(t))
      return e.json({ error: "Formato de email inv\xE1lido" }, 400);
    const s = await e.env.DB.prepare(`
      SELECT id, email, name, password_hash, is_active, last_login
      FROM auth_users 
      WHERE email = ?
    `).bind(t).first();
    if (!s || !s.is_active)
      return e.json({ error: "Credenciales incorrectas" }, 401);
    if (!le.verifyPassword(r, s.password_hash))
      return e.json({ error: "Credenciales incorrectas" }, 401);
    await e.env.DB.prepare(`
      UPDATE auth_users 
      SET last_login = datetime('now')
      WHERE id = ?
    `).bind(s.id).run();
    const n = await le.createSession(e.env.DB, s.id, a);
    return await le.cleanExpiredSessions(e.env.DB), a && Jr(e, "yo-decreto-token", n, { maxAge: 30 * 24 * 60 * 60, httpOnly: false, secure: false, sameSite: "Lax" }), e.json({ success: true, token: n, user: { id: s.id, email: s.email, name: s.name, last_login: s.last_login } });
  } catch (t) {
    return console.error("Error en login:", t), e.json({ error: "Error interno del servidor" }, 500);
  }
});
Ee.get("/validate", async (e) => {
  try {
    const t = e.req.header("Authorization"), r = Lt(e, "yo-decreto-token");
    let a = null;
    if (t && t.startsWith("Bearer ") ? a = t.substring(7) : r && (a = r), !a)
      return e.json({ error: "Token no proporcionado" }, 401);
    const s = await le.validateSession(e.env.DB, a);
    return s ? e.json({ success: true, user: { id: s.id, email: s.email, name: s.name, last_login: s.last_login } }) : e.json({ error: "Sesi\xF3n inv\xE1lida o expirada" }, 401);
  } catch (t) {
    return console.error("Error validando sesi\xF3n:", t), e.json({ error: "Error interno del servidor" }, 500);
  }
});
Ee.post("/logout", async (e) => {
  try {
    const t = e.req.header("Authorization"), r = Lt(e, "yo-decreto-token");
    let a = null;
    return t && t.startsWith("Bearer ") ? a = t.substring(7) : r && (a = r), a && (await e.env.DB.prepare(`
        DELETE FROM auth_sessions 
        WHERE session_token = ?
      `).bind(a).run(), Jr(e, "yo-decreto-token", "", { maxAge: 0 })), e.json({ success: true, message: "Sesi\xF3n cerrada correctamente" });
  } catch (t) {
    return console.error("Error en logout:", t), e.json({ error: "Error interno del servidor" }, 500);
  }
});
Ee.get("/me", async (e) => {
  try {
    const t = e.req.header("Authorization"), r = Lt(e, "yo-decreto-token");
    let a = null;
    if (t && t.startsWith("Bearer ") ? a = t.substring(7) : r && (a = r), !a)
      return e.json({ error: "Token no proporcionado" }, 401);
    const s = await le.validateSession(e.env.DB, a);
    return s ? e.json({ success: true, user: { id: s.id, email: s.email, name: s.name, last_login: s.last_login } }) : e.json({ error: "Sesi\xF3n inv\xE1lida" }, 401);
  } catch (t) {
    return console.error("Error obteniendo usuario:", t), e.json({ error: "Error interno del servidor" }, 500);
  }
});
Ee.get("/stats", async (e) => {
  try {
    const t = await e.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN expires_at > datetime('now') THEN 1 END) as active_sessions,
        COUNT(CASE WHEN expires_at <= datetime('now') THEN 1 END) as expired_sessions
      FROM auth_sessions
    `).first(), r = await e.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_users
      FROM auth_users
    `).first();
    return e.json({ success: true, stats: { sessions: t, users: r } });
  } catch (t) {
    return console.error("Error obteniendo estad\xEDsticas:", t), e.json({ error: "Error interno del servidor" }, 500);
  }
});
var $ = new me();
$.use(Ns);
$.use("/api/*", Wa());
$.use("/static/*", es());
$.route("/api/auth", Ee);
$.route("/api/decretos", I);
$.route("/api/agenda", H);
$.route("/api/progreso", ne);
$.route("/api/practica", j);
$.get("/", (e) => e.render(S("div", { children: S("div", { id: "app", children: S("div", { className: "loading-screen", children: [S("img", { src: "/static/logo-yo-decreto.png", alt: "Yo Decreto", className: "logo-yo-decreto logo-lg w-auto mx-auto mb-4" }), S("div", { className: "loader" }), S("h2", { children: "Cargando..." })] }) }) })));
$.get("*", (e) => e.render(S("div", { children: S("div", { id: "app", children: S("div", { className: "loading-screen", children: [S("img", { src: "/static/logo-yo-decreto.png", alt: "Yo Decreto", className: "logo-yo-decreto logo-lg w-auto mx-auto mb-4" }), S("div", { className: "loader" }), S("h2", { children: "Cargando..." })] }) }) })));
var rr = new me();
var xs = Object.assign({ "/src/index.tsx": $ });
var Gr = false;
for (const [, e] of Object.entries(xs))
  e && (rr.route("/", e), rr.notFound(e.notFoundHandler), Gr = true);
if (!Gr)
  throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");

// ../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-oogNgg/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = rr;

// ../node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-oogNgg/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=bundledWorker-0.27609499077958954.mjs.map
