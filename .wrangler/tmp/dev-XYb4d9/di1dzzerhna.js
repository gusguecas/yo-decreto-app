var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// .wrangler/tmp/bundle-3DX99C/strip-cf-connecting-ip-header.js
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

// node_modules/unenv/dist/runtime/_internal/utils.mjs
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

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
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

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// node_modules/unenv/dist/runtime/node/console.mjs
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

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
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

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
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

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
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

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
import { Socket as Socket2 } from "node:net";
var WriteStream = class extends Socket2 {
  fd;
  constructor(fd) {
    super();
    this.fd = fd;
  }
  clearLine(dir4, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x2, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env3) {
    return 1;
  }
  hasColors(count4, env3) {
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

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
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
  chdir(cwd3) {
    this.#cwd = cwd3;
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

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
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

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// .wrangler/tmp/pages-Bdu4yP/bundledWorker-0.3586651497003114.mjs
import { Writable as Writable2 } from "node:stream";
import { EventEmitter as EventEmitter2 } from "node:events";
import { Socket as Socket3 } from "node:net";
import { Socket as Socket22 } from "node:net";
var __defProp2 = Object.defineProperty;
var __defNormalProp2 = /* @__PURE__ */ __name((obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value, "__defNormalProp");
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __publicField2 = /* @__PURE__ */ __name((obj, key, value) => {
  __defNormalProp2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
}, "__publicField");
function stripCfConnectingIPHeader2(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader2, "stripCfConnectingIPHeader");
__name2(stripCfConnectingIPHeader2, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader2.apply(null, argArray)
    ]);
  }
});
function createNotImplementedError2(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError2, "createNotImplementedError");
__name2(createNotImplementedError2, "createNotImplementedError");
function notImplemented2(name) {
  const fn = /* @__PURE__ */ __name2(() => {
    throw createNotImplementedError2(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented2, "notImplemented");
__name2(notImplemented2, "notImplemented");
function notImplementedClass2(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass2, "notImplementedClass");
__name2(notImplementedClass2, "notImplementedClass");
var _timeOrigin2 = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow2 = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin2;
var nodeTiming2 = {
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
var PerformanceEntry2 = /* @__PURE__ */ __name(class {
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow2();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow2() - this.startTime;
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
}, "PerformanceEntry");
__name2(PerformanceEntry2, "PerformanceEntry");
var PerformanceMark3 = /* @__PURE__ */ __name2(/* @__PURE__ */ __name(class PerformanceMark22 extends PerformanceEntry2 {
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
}, "PerformanceMark2"), "PerformanceMark");
var PerformanceMeasure2 = /* @__PURE__ */ __name(class extends PerformanceEntry2 {
  entryType = "measure";
}, "PerformanceMeasure");
__name2(PerformanceMeasure2, "PerformanceMeasure");
var PerformanceResourceTiming2 = /* @__PURE__ */ __name(class extends PerformanceEntry2 {
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
}, "PerformanceResourceTiming");
__name2(PerformanceResourceTiming2, "PerformanceResourceTiming");
var PerformanceObserverEntryList2 = /* @__PURE__ */ __name(class {
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
}, "PerformanceObserverEntryList");
__name2(PerformanceObserverEntryList2, "PerformanceObserverEntryList");
var Performance2 = /* @__PURE__ */ __name(class {
  __unenv__ = true;
  timeOrigin = _timeOrigin2;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError2("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming2;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming2("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin2) {
      return _performanceNow2();
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
    const entry = new PerformanceMark3(name, options);
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
    const entry = new PerformanceMeasure2(measureName, {
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
    throw createNotImplementedError2("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError2("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError2("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
}, "Performance");
__name2(Performance2, "Performance");
var PerformanceObserver2 = /* @__PURE__ */ __name(class {
  __unenv__ = true;
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError2("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError2("PerformanceObserver.observe");
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
}, "PerformanceObserver");
__name2(PerformanceObserver2, "PerformanceObserver");
__publicField2(PerformanceObserver2, "supportedEntryTypes", []);
var performance2 = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance2();
globalThis.performance = performance2;
globalThis.Performance = Performance2;
globalThis.PerformanceEntry = PerformanceEntry2;
globalThis.PerformanceMark = PerformanceMark3;
globalThis.PerformanceMeasure = PerformanceMeasure2;
globalThis.PerformanceObserver = PerformanceObserver2;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList2;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming2;
var noop_default2 = Object.assign(() => {
}, { __unenv__: true });
var _console2 = globalThis.console;
var _ignoreErrors2 = true;
var _stderr2 = new Writable2();
var _stdout2 = new Writable2();
var log3 = _console2?.log ?? noop_default2;
var info3 = _console2?.info ?? log3;
var trace3 = _console2?.trace ?? info3;
var debug3 = _console2?.debug ?? log3;
var table3 = _console2?.table ?? log3;
var error3 = _console2?.error ?? log3;
var warn3 = _console2?.warn ?? error3;
var createTask3 = _console2?.createTask ?? /* @__PURE__ */ notImplemented2("console.createTask");
var clear3 = _console2?.clear ?? noop_default2;
var count3 = _console2?.count ?? noop_default2;
var countReset3 = _console2?.countReset ?? noop_default2;
var dir3 = _console2?.dir ?? noop_default2;
var dirxml3 = _console2?.dirxml ?? noop_default2;
var group3 = _console2?.group ?? noop_default2;
var groupEnd3 = _console2?.groupEnd ?? noop_default2;
var groupCollapsed3 = _console2?.groupCollapsed ?? noop_default2;
var profile3 = _console2?.profile ?? noop_default2;
var profileEnd3 = _console2?.profileEnd ?? noop_default2;
var time3 = _console2?.time ?? noop_default2;
var timeEnd3 = _console2?.timeEnd ?? noop_default2;
var timeLog3 = _console2?.timeLog ?? noop_default2;
var timeStamp3 = _console2?.timeStamp ?? noop_default2;
var Console2 = _console2?.Console ?? /* @__PURE__ */ notImplementedClass2("console.Console");
var _times2 = /* @__PURE__ */ new Map();
var _stdoutErrorHandler2 = noop_default2;
var _stderrErrorHandler2 = noop_default2;
var workerdConsole2 = globalThis["console"];
var {
  assert: assert3,
  clear: clear22,
  // @ts-expect-error undocumented public API
  context: context2,
  count: count22,
  countReset: countReset22,
  // @ts-expect-error undocumented public API
  createTask: createTask22,
  debug: debug22,
  dir: dir22,
  dirxml: dirxml22,
  error: error22,
  group: group22,
  groupCollapsed: groupCollapsed22,
  groupEnd: groupEnd22,
  info: info22,
  log: log22,
  profile: profile22,
  profileEnd: profileEnd22,
  table: table22,
  time: time22,
  timeEnd: timeEnd22,
  timeLog: timeLog22,
  timeStamp: timeStamp22,
  trace: trace22,
  warn: warn22
} = workerdConsole2;
Object.assign(workerdConsole2, {
  Console: Console2,
  _ignoreErrors: _ignoreErrors2,
  _stderr: _stderr2,
  _stderrErrorHandler: _stderrErrorHandler2,
  _stdout: _stdout2,
  _stdoutErrorHandler: _stdoutErrorHandler2,
  _times: _times2
});
var console_default2 = workerdConsole2;
globalThis.console = console_default2;
var hrtime4 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name2(/* @__PURE__ */ __name(function hrtime22(startTime) {
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
}, "hrtime2"), "hrtime"), { bigint: /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function bigint2() {
  return BigInt(Date.now() * 1e6);
}, "bigint"), "bigint") });
var ReadStream2 = /* @__PURE__ */ __name(class extends Socket3 {
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
}, "ReadStream");
__name2(ReadStream2, "ReadStream");
var WriteStream2 = /* @__PURE__ */ __name(class extends Socket22 {
  fd;
  constructor(fd) {
    super();
    this.fd = fd;
  }
  clearLine(dir32, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x2, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env22) {
    return 1;
  }
  hasColors(count32, env22) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  columns = 80;
  rows = 24;
  isTTY = false;
}, "WriteStream");
__name2(WriteStream2, "WriteStream");
var Process2 = /* @__PURE__ */ __name(class extends EventEmitter2 {
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(Process2.prototype), ...Object.getOwnPropertyNames(EventEmitter2.prototype)]) {
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
    return this.#stdin ??= new ReadStream2(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream2(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream2(2);
  }
  #cwd = "/";
  chdir(cwd22) {
    this.#cwd = cwd22;
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
    throw createNotImplementedError2("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError2("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError2("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError2("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError2("process.kill");
  }
  abort() {
    throw createNotImplementedError2("process.abort");
  }
  dlopen() {
    throw createNotImplementedError2("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError2("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError2("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError2("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError2("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError2("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError2("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError2("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError2("process.openStdin");
  }
  assert() {
    throw createNotImplementedError2("process.assert");
  }
  binding() {
    throw createNotImplementedError2("process.binding");
  }
  permission = { has: /* @__PURE__ */ notImplemented2("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented2("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented2("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented2("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented2("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented2("process.finalization.registerBeforeExit")
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
}, "Process");
__name2(Process2, "Process");
var globalProcess2 = globalThis["process"];
var getBuiltinModule2 = globalProcess2.getBuiltinModule;
var { exit: exit2, platform: platform2, nextTick: nextTick2 } = getBuiltinModule2(
  "node:process"
);
var unenvProcess2 = new Process2({
  env: globalProcess2.env,
  hrtime: hrtime4,
  nextTick: nextTick2
});
var {
  abort: abort2,
  addListener: addListener2,
  allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags2,
  hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback2,
  setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback2,
  loadEnvFile: loadEnvFile2,
  sourceMapsEnabled: sourceMapsEnabled2,
  arch: arch2,
  argv: argv2,
  argv0: argv02,
  chdir: chdir2,
  config: config2,
  connected: connected2,
  constrainedMemory: constrainedMemory2,
  availableMemory: availableMemory2,
  cpuUsage: cpuUsage2,
  cwd: cwd2,
  debugPort: debugPort2,
  dlopen: dlopen2,
  disconnect: disconnect2,
  emit: emit2,
  emitWarning: emitWarning2,
  env: env2,
  eventNames: eventNames2,
  execArgv: execArgv2,
  execPath: execPath2,
  finalization: finalization2,
  features: features2,
  getActiveResourcesInfo: getActiveResourcesInfo2,
  getMaxListeners: getMaxListeners2,
  hrtime: hrtime32,
  kill: kill2,
  listeners: listeners2,
  listenerCount: listenerCount2,
  memoryUsage: memoryUsage2,
  on: on2,
  off: off2,
  once: once2,
  pid: pid2,
  ppid: ppid2,
  prependListener: prependListener2,
  prependOnceListener: prependOnceListener2,
  rawListeners: rawListeners2,
  release: release2,
  removeAllListeners: removeAllListeners2,
  removeListener: removeListener2,
  report: report2,
  resourceUsage: resourceUsage2,
  setMaxListeners: setMaxListeners2,
  setSourceMapsEnabled: setSourceMapsEnabled2,
  stderr: stderr2,
  stdin: stdin2,
  stdout: stdout2,
  title: title2,
  throwDeprecation: throwDeprecation2,
  traceDeprecation: traceDeprecation2,
  umask: umask2,
  uptime: uptime2,
  version: version2,
  versions: versions2,
  domain: domain2,
  initgroups: initgroups2,
  moduleLoadList: moduleLoadList2,
  reallyExit: reallyExit2,
  openStdin: openStdin2,
  assert: assert22,
  binding: binding2,
  send: send2,
  exitCode: exitCode2,
  channel: channel2,
  getegid: getegid2,
  geteuid: geteuid2,
  getgid: getgid2,
  getgroups: getgroups2,
  getuid: getuid2,
  setegid: setegid2,
  seteuid: seteuid2,
  setgid: setgid2,
  setgroups: setgroups2,
  setuid: setuid2,
  permission: permission2,
  mainModule: mainModule2,
  _events: _events2,
  _eventsCount: _eventsCount2,
  _exiting: _exiting2,
  _maxListeners: _maxListeners2,
  _debugEnd: _debugEnd2,
  _debugProcess: _debugProcess2,
  _fatalException: _fatalException2,
  _getActiveHandles: _getActiveHandles2,
  _getActiveRequests: _getActiveRequests2,
  _kill: _kill2,
  _preload_modules: _preload_modules2,
  _rawDebug: _rawDebug2,
  _startProfilerIdleNotifier: _startProfilerIdleNotifier2,
  _stopProfilerIdleNotifier: _stopProfilerIdleNotifier2,
  _tickCallback: _tickCallback2,
  _disconnect: _disconnect2,
  _handleQueue: _handleQueue2,
  _pendingMessage: _pendingMessage2,
  _channel: _channel2,
  _send: _send2,
  _linkedBinding: _linkedBinding2
} = unenvProcess2;
var _process2 = {
  abort: abort2,
  addListener: addListener2,
  allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags2,
  hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback2,
  setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback2,
  loadEnvFile: loadEnvFile2,
  sourceMapsEnabled: sourceMapsEnabled2,
  arch: arch2,
  argv: argv2,
  argv0: argv02,
  chdir: chdir2,
  config: config2,
  connected: connected2,
  constrainedMemory: constrainedMemory2,
  availableMemory: availableMemory2,
  cpuUsage: cpuUsage2,
  cwd: cwd2,
  debugPort: debugPort2,
  dlopen: dlopen2,
  disconnect: disconnect2,
  emit: emit2,
  emitWarning: emitWarning2,
  env: env2,
  eventNames: eventNames2,
  execArgv: execArgv2,
  execPath: execPath2,
  exit: exit2,
  finalization: finalization2,
  features: features2,
  getBuiltinModule: getBuiltinModule2,
  getActiveResourcesInfo: getActiveResourcesInfo2,
  getMaxListeners: getMaxListeners2,
  hrtime: hrtime32,
  kill: kill2,
  listeners: listeners2,
  listenerCount: listenerCount2,
  memoryUsage: memoryUsage2,
  nextTick: nextTick2,
  on: on2,
  off: off2,
  once: once2,
  pid: pid2,
  platform: platform2,
  ppid: ppid2,
  prependListener: prependListener2,
  prependOnceListener: prependOnceListener2,
  rawListeners: rawListeners2,
  release: release2,
  removeAllListeners: removeAllListeners2,
  removeListener: removeListener2,
  report: report2,
  resourceUsage: resourceUsage2,
  setMaxListeners: setMaxListeners2,
  setSourceMapsEnabled: setSourceMapsEnabled2,
  stderr: stderr2,
  stdin: stdin2,
  stdout: stdout2,
  title: title2,
  throwDeprecation: throwDeprecation2,
  traceDeprecation: traceDeprecation2,
  umask: umask2,
  uptime: uptime2,
  version: version2,
  versions: versions2,
  // @ts-expect-error old API
  domain: domain2,
  initgroups: initgroups2,
  moduleLoadList: moduleLoadList2,
  reallyExit: reallyExit2,
  openStdin: openStdin2,
  assert: assert22,
  binding: binding2,
  send: send2,
  exitCode: exitCode2,
  channel: channel2,
  getegid: getegid2,
  geteuid: geteuid2,
  getgid: getgid2,
  getgroups: getgroups2,
  getuid: getuid2,
  setegid: setegid2,
  seteuid: seteuid2,
  setgid: setgid2,
  setgroups: setgroups2,
  setuid: setuid2,
  permission: permission2,
  mainModule: mainModule2,
  _events: _events2,
  _eventsCount: _eventsCount2,
  _exiting: _exiting2,
  _maxListeners: _maxListeners2,
  _debugEnd: _debugEnd2,
  _debugProcess: _debugProcess2,
  _fatalException: _fatalException2,
  _getActiveHandles: _getActiveHandles2,
  _getActiveRequests: _getActiveRequests2,
  _kill: _kill2,
  _preload_modules: _preload_modules2,
  _rawDebug: _rawDebug2,
  _startProfilerIdleNotifier: _startProfilerIdleNotifier2,
  _stopProfilerIdleNotifier: _stopProfilerIdleNotifier2,
  _tickCallback: _tickCallback2,
  _disconnect: _disconnect2,
  _handleQueue: _handleQueue2,
  _pendingMessage: _pendingMessage2,
  _channel: _channel2,
  _send: _send2,
  _linkedBinding: _linkedBinding2
};
var process_default2 = _process2;
globalThis.process = process_default2;
var Qt = Object.defineProperty;
var Ha = /* @__PURE__ */ __name2((e) => {
  throw TypeError(e);
}, "Ha");
var er = /* @__PURE__ */ __name2((e, a, t) => a in e ? Qt(e, a, { enumerable: true, configurable: true, writable: true, value: t }) : e[a] = t, "er");
var T = /* @__PURE__ */ __name2((e, a, t) => er(e, typeof a != "symbol" ? a + "" : a, t), "T");
var fa = /* @__PURE__ */ __name2((e, a, t) => a.has(e) || Ha("Cannot " + t), "fa");
var u = /* @__PURE__ */ __name2((e, a, t) => (fa(e, a, "read from private field"), t ? t.call(e) : a.get(e)), "u");
var O = /* @__PURE__ */ __name2((e, a, t) => a.has(e) ? Ha("Cannot add the same private member more than once") : a instanceof WeakSet ? a.add(e) : a.set(e, t), "O");
var S = /* @__PURE__ */ __name2((e, a, t, r) => (fa(e, a, "write to private field"), r ? r.call(e, t) : a.set(e, t), t), "S");
var C = /* @__PURE__ */ __name2((e, a, t) => (fa(e, a, "access private method"), t), "C");
var Ua = /* @__PURE__ */ __name2((e, a, t, r) => ({ set _(s) {
  S(e, a, s, t);
}, get _() {
  return u(e, a, r);
} }), "Ua");
var pt = { Stringify: 1 };
var B = /* @__PURE__ */ __name2((e, a) => {
  const t = new String(e);
  return t.isEscaped = true, t.callbacks = a, t;
}, "B");
var ar = /[&<>'"]/;
var Et = /* @__PURE__ */ __name2(async (e, a) => {
  let t = "";
  a || (a = []);
  const r = await Promise.all(e);
  for (let s = r.length - 1; t += r[s], s--, !(s < 0); s--) {
    let o = r[s];
    typeof o == "object" && a.push(...o.callbacks || []);
    const n = o.isEscaped;
    if (o = await (typeof o == "object" ? o.toString() : o), typeof o == "object" && a.push(...o.callbacks || []), o.isEscaped ?? n)
      t += o;
    else {
      const i = [t];
      oe(o, i), t = i[0];
    }
  }
  return B(t, a);
}, "Et");
var oe = /* @__PURE__ */ __name2((e, a) => {
  const t = e.search(ar);
  if (t === -1) {
    a[0] += e;
    return;
  }
  let r, s, o = 0;
  for (s = t; s < e.length; s++) {
    switch (e.charCodeAt(s)) {
      case 34:
        r = "&quot;";
        break;
      case 39:
        r = "&#39;";
        break;
      case 38:
        r = "&amp;";
        break;
      case 60:
        r = "&lt;";
        break;
      case 62:
        r = "&gt;";
        break;
      default:
        continue;
    }
    a[0] += e.substring(o, s) + r, o = s + 1;
  }
  a[0] += e.substring(o, s);
}, "oe");
var ht = /* @__PURE__ */ __name2((e) => {
  const a = e.callbacks;
  if (!(a != null && a.length))
    return e;
  const t = [e], r = {};
  return a.forEach((s) => s({ phase: pt.Stringify, buffer: t, context: r })), t[0];
}, "ht");
var mt = /* @__PURE__ */ __name2(async (e, a, t, r, s) => {
  typeof e == "object" && !(e instanceof String) && (e instanceof Promise || (e = e.toString()), e instanceof Promise && (e = await e));
  const o = e.callbacks;
  return o != null && o.length ? (s ? s[0] += e : s = [e], Promise.all(o.map((i) => i({ phase: a, buffer: s, context: r }))).then((i) => Promise.all(i.filter(Boolean).map((c) => mt(c, a, false, r, s))).then(() => s[0]))) : Promise.resolve(e);
}, "mt");
var tr = /* @__PURE__ */ __name2((e, ...a) => {
  const t = [""];
  for (let r = 0, s = e.length - 1; r < s; r++) {
    t[0] += e[r];
    const o = Array.isArray(a[r]) ? a[r].flat(1 / 0) : [a[r]];
    for (let n = 0, i = o.length; n < i; n++) {
      const c = o[n];
      if (typeof c == "string")
        oe(c, t);
      else if (typeof c == "number")
        t[0] += c;
      else {
        if (typeof c == "boolean" || c === null || c === void 0)
          continue;
        if (typeof c == "object" && c.isEscaped)
          if (c.callbacks)
            t.unshift("", c);
          else {
            const l = c.toString();
            l instanceof Promise ? t.unshift("", l) : t[0] += l;
          }
        else
          c instanceof Promise ? t.unshift("", c) : oe(c.toString(), t);
      }
    }
  }
  return t[0] += e.at(-1), t.length === 1 ? "callbacks" in t ? B(ht(B(t[0], t.callbacks))) : B(t[0]) : Et(t, t.callbacks);
}, "tr");
var wa = Symbol("RENDERER");
var Ra = Symbol("ERROR_HANDLER");
var D = Symbol("STASH");
var gt = Symbol("INTERNAL");
var rr = Symbol("MEMO");
var oa = Symbol("PERMALINK");
var Ba = /* @__PURE__ */ __name2((e) => (e[gt] = true, e), "Ba");
var _t = /* @__PURE__ */ __name2((e) => ({ value: a, children: t }) => {
  if (!t)
    return;
  const r = { children: [{ tag: Ba(() => {
    e.push(a);
  }), props: {} }] };
  Array.isArray(t) ? r.children.push(...t.flat()) : r.children.push(t), r.children.push({ tag: Ba(() => {
    e.pop();
  }), props: {} });
  const s = { tag: "", props: r, type: "" };
  return s[Ra] = (o) => {
    throw e.pop(), o;
  }, s;
}, "_t");
var vt = /* @__PURE__ */ __name2((e) => {
  const a = [e], t = _t(a);
  return t.values = a, t.Provider = t, be.push(t), t;
}, "vt");
var be = [];
var Aa = /* @__PURE__ */ __name2((e) => {
  const a = [e], t = /* @__PURE__ */ __name2((r) => {
    a.push(r.value);
    let s;
    try {
      s = r.children ? (Array.isArray(r.children) ? new Rt("", {}, r.children) : r.children).toString() : "";
    } finally {
      a.pop();
    }
    return s instanceof Promise ? s.then((o) => B(o, o.callbacks)) : B(s);
  }, "t");
  return t.values = a, t.Provider = t, t[wa] = _t(a), be.push(t), t;
}, "Aa");
var Ae = /* @__PURE__ */ __name2((e) => e.values.at(-1), "Ae");
var Xe = { title: [], script: ["src"], style: ["data-href"], link: ["href"], meta: ["name", "httpEquiv", "charset", "itemProp"] };
var Oa = {};
var Ze = "data-precedence";
var ze = /* @__PURE__ */ __name2((e) => Array.isArray(e) ? e : [e], "ze");
var qa = /* @__PURE__ */ new WeakMap();
var Fa = /* @__PURE__ */ __name2((e, a, t, r) => ({ buffer: s, context: o }) => {
  if (!s)
    return;
  const n = qa.get(o) || {};
  qa.set(o, n);
  const i = n[e] || (n[e] = []);
  let c = false;
  const l = Xe[e];
  if (l.length > 0) {
    e:
      for (const [, d] of i)
        for (const f of l)
          if (((d == null ? void 0 : d[f]) ?? null) === (t == null ? void 0 : t[f])) {
            c = true;
            break e;
          }
  }
  if (c ? s[0] = s[0].replaceAll(a, "") : l.length > 0 ? i.push([a, t, r]) : i.unshift([a, t, r]), s[0].indexOf("</head>") !== -1) {
    let d;
    if (r === void 0)
      d = i.map(([f]) => f);
    else {
      const f = [];
      d = i.map(([p, , h]) => {
        let m = f.indexOf(h);
        return m === -1 && (f.push(h), m = f.length - 1), [p, m];
      }).sort((p, h) => p[1] - h[1]).map(([p]) => p);
    }
    d.forEach((f) => {
      s[0] = s[0].replaceAll(f, "");
    }), s[0] = s[0].replace(/(?=<\/head>)/, d.join(""));
  }
}, "Fa");
var Ve = /* @__PURE__ */ __name2((e, a, t) => B(new W(e, t, ze(a ?? [])).toString()), "Ve");
var Ye = /* @__PURE__ */ __name2((e, a, t, r) => {
  if ("itemProp" in t)
    return Ve(e, a, t);
  let { precedence: s, blocking: o, ...n } = t;
  s = r ? s ?? "" : void 0, r && (n[Ze] = s);
  const i = new W(e, n, ze(a || [])).toString();
  return i instanceof Promise ? i.then((c) => B(i, [...c.callbacks || [], Fa(e, c, n, s)])) : B(i, [Fa(e, i, n, s)]);
}, "Ye");
var sr = /* @__PURE__ */ __name2(({ children: e, ...a }) => {
  const t = Ia();
  if (t) {
    const r = Ae(t);
    if (r === "svg" || r === "head")
      return new W("title", a, ze(e ?? []));
  }
  return Ye("title", e, a, false);
}, "sr");
var or = /* @__PURE__ */ __name2(({ children: e, ...a }) => {
  const t = Ia();
  return ["src", "async"].some((r) => !a[r]) || t && Ae(t) === "head" ? Ve("script", e, a) : Ye("script", e, a, false);
}, "or");
var nr = /* @__PURE__ */ __name2(({ children: e, ...a }) => ["href", "precedence"].every((t) => t in a) ? (a["data-href"] = a.href, delete a.href, Ye("style", e, a, true)) : Ve("style", e, a), "nr");
var ir = /* @__PURE__ */ __name2(({ children: e, ...a }) => ["onLoad", "onError"].some((t) => t in a) || a.rel === "stylesheet" && (!("precedence" in a) || "disabled" in a) ? Ve("link", e, a) : Ye("link", e, a, "precedence" in a), "ir");
var cr = /* @__PURE__ */ __name2(({ children: e, ...a }) => {
  const t = Ia();
  return t && Ae(t) === "head" ? Ve("meta", e, a) : Ye("meta", e, a, false);
}, "cr");
var Tt = /* @__PURE__ */ __name2((e, { children: a, ...t }) => new W(e, t, ze(a ?? [])), "Tt");
var lr = /* @__PURE__ */ __name2((e) => (typeof e.action == "function" && (e.action = oa in e.action ? e.action[oa] : void 0), Tt("form", e)), "lr");
var St = /* @__PURE__ */ __name2((e, a) => (typeof a.formAction == "function" && (a.formAction = oa in a.formAction ? a.formAction[oa] : void 0), Tt(e, a)), "St");
var dr = /* @__PURE__ */ __name2((e) => St("input", e), "dr");
var ur = /* @__PURE__ */ __name2((e) => St("button", e), "ur");
var pa = Object.freeze(Object.defineProperty({ __proto__: null, button: ur, form: lr, input: dr, link: ir, meta: cr, script: or, style: nr, title: sr }, Symbol.toStringTag, { value: "Module" }));
var fr = /* @__PURE__ */ new Map([["className", "class"], ["htmlFor", "for"], ["crossOrigin", "crossorigin"], ["httpEquiv", "http-equiv"], ["itemProp", "itemprop"], ["fetchPriority", "fetchpriority"], ["noModule", "nomodule"], ["formAction", "formaction"]]);
var na = /* @__PURE__ */ __name2((e) => fr.get(e) || e, "na");
var yt = /* @__PURE__ */ __name2((e, a) => {
  for (const [t, r] of Object.entries(e)) {
    const s = t[0] === "-" || !/[A-Z]/.test(t) ? t : t.replace(/[A-Z]/g, (o) => `-${o.toLowerCase()}`);
    a(s, r == null ? null : typeof r == "number" ? s.match(/^(?:a|border-im|column(?:-c|s)|flex(?:$|-[^b])|grid-(?:ar|[^a])|font-w|li|or|sca|st|ta|wido|z)|ty$/) ? `${r}` : `${r}px` : r);
  }
}, "yt");
var Pe = void 0;
var Ia = /* @__PURE__ */ __name2(() => Pe, "Ia");
var pr = /* @__PURE__ */ __name2((e) => /[A-Z]/.test(e) && e.match(/^(?:al|basel|clip(?:Path|Rule)$|co|do|fill|fl|fo|gl|let|lig|i|marker[EMS]|o|pai|pointe|sh|st[or]|text[^L]|tr|u|ve|w)/) ? e.replace(/([A-Z])/g, "-$1").toLowerCase() : e, "pr");
var Er = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"];
var hr = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "defer", "disabled", "download", "formnovalidate", "hidden", "inert", "ismap", "itemscope", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "selected"];
var ja = /* @__PURE__ */ __name2((e, a) => {
  for (let t = 0, r = e.length; t < r; t++) {
    const s = e[t];
    if (typeof s == "string")
      oe(s, a);
    else {
      if (typeof s == "boolean" || s === null || s === void 0)
        continue;
      s instanceof W ? s.toStringToBuffer(a) : typeof s == "number" || s.isEscaped ? a[0] += s : s instanceof Promise ? a.unshift("", s) : ja(s, a);
    }
  }
}, "ja");
var W = /* @__PURE__ */ __name2(class {
  constructor(e, a, t) {
    T(this, "tag");
    T(this, "props");
    T(this, "key");
    T(this, "children");
    T(this, "isEscaped", true);
    T(this, "localContexts");
    this.tag = e, this.props = a, this.children = t;
  }
  get type() {
    return this.tag;
  }
  get ref() {
    return this.props.ref || null;
  }
  toString() {
    var a, t;
    const e = [""];
    (a = this.localContexts) == null || a.forEach(([r, s]) => {
      r.values.push(s);
    });
    try {
      this.toStringToBuffer(e);
    } finally {
      (t = this.localContexts) == null || t.forEach(([r]) => {
        r.values.pop();
      });
    }
    return e.length === 1 ? "callbacks" in e ? ht(B(e[0], e.callbacks)).toString() : e[0] : Et(e, e.callbacks);
  }
  toStringToBuffer(e) {
    const a = this.tag, t = this.props;
    let { children: r } = this;
    e[0] += `<${a}`;
    const s = Pe && Ae(Pe) === "svg" ? (o) => pr(na(o)) : (o) => na(o);
    for (let [o, n] of Object.entries(t))
      if (o = s(o), o !== "children") {
        if (o === "style" && typeof n == "object") {
          let i = "";
          yt(n, (c, l) => {
            l != null && (i += `${i ? ";" : ""}${c}:${l}`);
          }), e[0] += ' style="', oe(i, e), e[0] += '"';
        } else if (typeof n == "string")
          e[0] += ` ${o}="`, oe(n, e), e[0] += '"';
        else if (n != null)
          if (typeof n == "number" || n.isEscaped)
            e[0] += ` ${o}="${n}"`;
          else if (typeof n == "boolean" && hr.includes(o))
            n && (e[0] += ` ${o}=""`);
          else if (o === "dangerouslySetInnerHTML") {
            if (r.length > 0)
              throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
            r = [B(n.__html)];
          } else if (n instanceof Promise)
            e[0] += ` ${o}="`, e.unshift('"', n);
          else if (typeof n == "function") {
            if (!o.startsWith("on") && o !== "ref")
              throw new Error(`Invalid prop '${o}' of type 'function' supplied to '${a}'.`);
          } else
            e[0] += ` ${o}="`, oe(n.toString(), e), e[0] += '"';
      }
    if (Er.includes(a) && r.length === 0) {
      e[0] += "/>";
      return;
    }
    e[0] += ">", ja(r, e), e[0] += `</${a}>`;
  }
}, "W");
var Ea = /* @__PURE__ */ __name2(class extends W {
  toStringToBuffer(e) {
    const { children: a } = this, t = this.tag.call(null, { ...this.props, children: a.length <= 1 ? a[0] : a });
    if (!(typeof t == "boolean" || t == null))
      if (t instanceof Promise)
        if (be.length === 0)
          e.unshift("", t);
        else {
          const r = be.map((s) => [s, s.values.at(-1)]);
          e.unshift("", t.then((s) => (s instanceof W && (s.localContexts = r), s)));
        }
      else
        t instanceof W ? t.toStringToBuffer(e) : typeof t == "number" || t.isEscaped ? (e[0] += t, t.callbacks && (e.callbacks || (e.callbacks = []), e.callbacks.push(...t.callbacks))) : oe(t, e);
  }
}, "Ea");
var Rt = /* @__PURE__ */ __name2(class extends W {
  toStringToBuffer(e) {
    ja(this.children, e);
  }
}, "Rt");
var $a = /* @__PURE__ */ __name2((e, a, ...t) => {
  a ?? (a = {}), t.length && (a.children = t.length === 1 ? t[0] : t);
  const r = a.key;
  delete a.key;
  const s = Qe(e, a, t);
  return s.key = r, s;
}, "$a");
var Wa = false;
var Qe = /* @__PURE__ */ __name2((e, a, t) => {
  if (!Wa) {
    for (const r in Oa)
      pa[r][wa] = Oa[r];
    Wa = true;
  }
  return typeof e == "function" ? new Ea(e, a, t) : pa[e] ? new Ea(pa[e], a, t) : e === "svg" || e === "head" ? (Pe || (Pe = Aa("")), new W(e, a, [new Ea(Pe, { value: e }, t)])) : new W(e, a, t);
}, "Qe");
var mr = /* @__PURE__ */ __name2(({ children: e }) => new Rt("", { children: e }, Array.isArray(e) ? e : e ? [e] : []), "mr");
function R(e, a, t) {
  let r;
  if (!a || !("children" in a))
    r = Qe(e, a, []);
  else {
    const s = a.children;
    r = Array.isArray(s) ? Qe(e, a, s) : Qe(e, a, [s]);
  }
  return r.key = t, r;
}
__name(R, "R");
__name2(R, "R");
var ka = /* @__PURE__ */ __name2((e, a, t) => (r, s) => {
  let o = -1;
  return n(0);
  async function n(i) {
    if (i <= o)
      throw new Error("next() called multiple times");
    o = i;
    let c, l = false, d;
    if (e[i] ? (d = e[i][0][0], r.req.routeIndex = i) : d = i === e.length && s || void 0, d)
      try {
        c = await d(r, () => n(i + 1));
      } catch (f) {
        if (f instanceof Error && a)
          r.error = f, c = await a(f, r), l = true;
        else
          throw f;
      }
    else
      r.finalized === false && t && (c = await t(r));
    return c && (r.finalized === false || l) && (r.res = c), r;
  }
  __name(n, "n");
  __name2(n, "n");
}, "ka");
var gr = Symbol();
var _r = /* @__PURE__ */ __name2(async (e, a = /* @__PURE__ */ Object.create(null)) => {
  const { all: t = false, dot: r = false } = a, o = (e instanceof bt ? e.raw.headers : e.headers).get("Content-Type");
  return o != null && o.startsWith("multipart/form-data") || o != null && o.startsWith("application/x-www-form-urlencoded") ? vr(e, { all: t, dot: r }) : {};
}, "_r");
async function vr(e, a) {
  const t = await e.formData();
  return t ? Tr(t, a) : {};
}
__name(vr, "vr");
__name2(vr, "vr");
function Tr(e, a) {
  const t = /* @__PURE__ */ Object.create(null);
  return e.forEach((r, s) => {
    a.all || s.endsWith("[]") ? Sr(t, s, r) : t[s] = r;
  }), a.dot && Object.entries(t).forEach(([r, s]) => {
    r.includes(".") && (yr(t, r, s), delete t[r]);
  }), t;
}
__name(Tr, "Tr");
__name2(Tr, "Tr");
var Sr = /* @__PURE__ */ __name2((e, a, t) => {
  e[a] !== void 0 ? Array.isArray(e[a]) ? e[a].push(t) : e[a] = [e[a], t] : a.endsWith("[]") ? e[a] = [t] : e[a] = t;
}, "Sr");
var yr = /* @__PURE__ */ __name2((e, a, t) => {
  let r = e;
  const s = a.split(".");
  s.forEach((o, n) => {
    n === s.length - 1 ? r[o] = t : ((!r[o] || typeof r[o] != "object" || Array.isArray(r[o]) || r[o] instanceof File) && (r[o] = /* @__PURE__ */ Object.create(null)), r = r[o]);
  });
}, "yr");
var Ot = /* @__PURE__ */ __name2((e) => {
  const a = e.split("/");
  return a[0] === "" && a.shift(), a;
}, "Ot");
var Rr = /* @__PURE__ */ __name2((e) => {
  const { groups: a, path: t } = Or(e), r = Ot(t);
  return Nr(r, a);
}, "Rr");
var Or = /* @__PURE__ */ __name2((e) => {
  const a = [];
  return e = e.replace(/\{[^}]+\}/g, (t, r) => {
    const s = `@${r}`;
    return a.push([s, t]), s;
  }), { groups: a, path: e };
}, "Or");
var Nr = /* @__PURE__ */ __name2((e, a) => {
  for (let t = a.length - 1; t >= 0; t--) {
    const [r] = a[t];
    for (let s = e.length - 1; s >= 0; s--)
      if (e[s].includes(r)) {
        e[s] = e[s].replace(r, a[t][1]);
        break;
      }
  }
  return e;
}, "Nr");
var Je = {};
var Cr = /* @__PURE__ */ __name2((e, a) => {
  if (e === "*")
    return "*";
  const t = e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (t) {
    const r = `${e}#${a}`;
    return Je[r] || (t[2] ? Je[r] = a && a[0] !== ":" && a[0] !== "*" ? [r, t[1], new RegExp(`^${t[2]}(?=/${a})`)] : [e, t[1], new RegExp(`^${t[2]}$`)] : Je[r] = [e, t[1], true]), Je[r];
  }
  return null;
}, "Cr");
var da = /* @__PURE__ */ __name2((e, a) => {
  try {
    return a(e);
  } catch {
    return e.replace(/(?:%[0-9A-Fa-f]{2})+/g, (t) => {
      try {
        return a(t);
      } catch {
        return t;
      }
    });
  }
}, "da");
var Dr = /* @__PURE__ */ __name2((e) => da(e, decodeURI), "Dr");
var Nt = /* @__PURE__ */ __name2((e) => {
  const a = e.url, t = a.indexOf("/", a.indexOf(":") + 4);
  let r = t;
  for (; r < a.length; r++) {
    const s = a.charCodeAt(r);
    if (s === 37) {
      const o = a.indexOf("?", r), n = a.slice(t, o === -1 ? void 0 : o);
      return Dr(n.includes("%25") ? n.replace(/%25/g, "%2525") : n);
    } else if (s === 63)
      break;
  }
  return a.slice(t, r);
}, "Nt");
var br = /* @__PURE__ */ __name2((e) => {
  const a = Nt(e);
  return a.length > 1 && a.at(-1) === "/" ? a.slice(0, -1) : a;
}, "br");
var Te = /* @__PURE__ */ __name2((e, a, ...t) => (t.length && (a = Te(a, ...t)), `${(e == null ? void 0 : e[0]) === "/" ? "" : "/"}${e}${a === "/" ? "" : `${(e == null ? void 0 : e.at(-1)) === "/" ? "" : "/"}${(a == null ? void 0 : a[0]) === "/" ? a.slice(1) : a}`}`), "Te");
var Ct = /* @__PURE__ */ __name2((e) => {
  if (e.charCodeAt(e.length - 1) !== 63 || !e.includes(":"))
    return null;
  const a = e.split("/"), t = [];
  let r = "";
  return a.forEach((s) => {
    if (s !== "" && !/\:/.test(s))
      r += "/" + s;
    else if (/\:/.test(s))
      if (/\?/.test(s)) {
        t.length === 0 && r === "" ? t.push("/") : t.push(r);
        const o = s.replace("?", "");
        r += "/" + o, t.push(r);
      } else
        r += "/" + s;
  }), t.filter((s, o, n) => n.indexOf(s) === o);
}, "Ct");
var ha = /* @__PURE__ */ __name2((e) => /[%+]/.test(e) ? (e.indexOf("+") !== -1 && (e = e.replace(/\+/g, " ")), e.indexOf("%") !== -1 ? da(e, La) : e) : e, "ha");
var Dt = /* @__PURE__ */ __name2((e, a, t) => {
  let r;
  if (!t && a && !/[%+]/.test(a)) {
    let n = e.indexOf(`?${a}`, 8);
    for (n === -1 && (n = e.indexOf(`&${a}`, 8)); n !== -1; ) {
      const i = e.charCodeAt(n + a.length + 1);
      if (i === 61) {
        const c = n + a.length + 2, l = e.indexOf("&", c);
        return ha(e.slice(c, l === -1 ? void 0 : l));
      } else if (i == 38 || isNaN(i))
        return "";
      n = e.indexOf(`&${a}`, n + 1);
    }
    if (r = /[%+]/.test(e), !r)
      return;
  }
  const s = {};
  r ?? (r = /[%+]/.test(e));
  let o = e.indexOf("?", 8);
  for (; o !== -1; ) {
    const n = e.indexOf("&", o + 1);
    let i = e.indexOf("=", o);
    i > n && n !== -1 && (i = -1);
    let c = e.slice(o + 1, i === -1 ? n === -1 ? void 0 : n : i);
    if (r && (c = ha(c)), o = n, c === "")
      continue;
    let l;
    i === -1 ? l = "" : (l = e.slice(i + 1, n === -1 ? void 0 : n), r && (l = ha(l))), t ? (s[c] && Array.isArray(s[c]) || (s[c] = []), s[c].push(l)) : s[c] ?? (s[c] = l);
  }
  return a ? s[a] : s;
}, "Dt");
var wr = Dt;
var Ar = /* @__PURE__ */ __name2((e, a) => Dt(e, a, true), "Ar");
var La = decodeURIComponent;
var za = /* @__PURE__ */ __name2((e) => da(e, La), "za");
var Re;
var U;
var K;
var wt;
var At;
var Na;
var Q;
var st;
var bt = (st = /* @__PURE__ */ __name2(class {
  constructor(e, a = "/", t = [[]]) {
    O(this, K);
    T(this, "raw");
    O(this, Re);
    O(this, U);
    T(this, "routeIndex", 0);
    T(this, "path");
    T(this, "bodyCache", {});
    O(this, Q, (e2) => {
      const { bodyCache: a2, raw: t2 } = this, r = a2[e2];
      if (r)
        return r;
      const s = Object.keys(a2)[0];
      return s ? a2[s].then((o) => (s === "json" && (o = JSON.stringify(o)), new Response(o)[e2]())) : a2[e2] = t2[e2]();
    });
    this.raw = e, this.path = a, S(this, U, t), S(this, Re, {});
  }
  param(e) {
    return e ? C(this, K, wt).call(this, e) : C(this, K, At).call(this);
  }
  query(e) {
    return wr(this.url, e);
  }
  queries(e) {
    return Ar(this.url, e);
  }
  header(e) {
    if (e)
      return this.raw.headers.get(e) ?? void 0;
    const a = {};
    return this.raw.headers.forEach((t, r) => {
      a[r] = t;
    }), a;
  }
  async parseBody(e) {
    var a;
    return (a = this.bodyCache).parsedBody ?? (a.parsedBody = await _r(this, e));
  }
  json() {
    return u(this, Q).call(this, "text").then((e) => JSON.parse(e));
  }
  text() {
    return u(this, Q).call(this, "text");
  }
  arrayBuffer() {
    return u(this, Q).call(this, "arrayBuffer");
  }
  blob() {
    return u(this, Q).call(this, "blob");
  }
  formData() {
    return u(this, Q).call(this, "formData");
  }
  addValidatedData(e, a) {
    u(this, Re)[e] = a;
  }
  valid(e) {
    return u(this, Re)[e];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [gr]() {
    return u(this, U);
  }
  get matchedRoutes() {
    return u(this, U)[0].map(([[, e]]) => e);
  }
  get routePath() {
    return u(this, U)[0].map(([[, e]]) => e)[this.routeIndex].path;
  }
}, "st"), Re = /* @__PURE__ */ new WeakMap(), U = /* @__PURE__ */ new WeakMap(), K = /* @__PURE__ */ new WeakSet(), wt = /* @__PURE__ */ __name2(function(e) {
  const a = u(this, U)[0][this.routeIndex][1][e], t = C(this, K, Na).call(this, a);
  return t && /\%/.test(t) ? za(t) : t;
}, "wt"), At = /* @__PURE__ */ __name2(function() {
  const e = {}, a = Object.keys(u(this, U)[0][this.routeIndex][1]);
  for (const t of a) {
    const r = C(this, K, Na).call(this, u(this, U)[0][this.routeIndex][1][t]);
    r !== void 0 && (e[t] = /\%/.test(r) ? za(r) : r);
  }
  return e;
}, "At"), Na = /* @__PURE__ */ __name2(function(e) {
  return u(this, U)[1] ? u(this, U)[1][e] : e;
}, "Na"), Q = /* @__PURE__ */ new WeakMap(), st);
var Ir = "text/plain; charset=UTF-8";
var ma = /* @__PURE__ */ __name2((e, a) => ({ "Content-Type": e, ...a }), "ma");
var Be;
var qe;
var V;
var Oe;
var Y;
var H;
var Fe;
var Ne;
var Ce;
var ue;
var $e;
var We;
var ee;
var Se;
var ot;
var jr = (ot = /* @__PURE__ */ __name2(class {
  constructor(e, a) {
    O(this, ee);
    O(this, Be);
    O(this, qe);
    T(this, "env", {});
    O(this, V);
    T(this, "finalized", false);
    T(this, "error");
    O(this, Oe);
    O(this, Y);
    O(this, H);
    O(this, Fe);
    O(this, Ne);
    O(this, Ce);
    O(this, ue);
    O(this, $e);
    O(this, We);
    T(this, "render", (...e2) => (u(this, Ne) ?? S(this, Ne, (a2) => this.html(a2)), u(this, Ne).call(this, ...e2)));
    T(this, "setLayout", (e2) => S(this, Fe, e2));
    T(this, "getLayout", () => u(this, Fe));
    T(this, "setRenderer", (e2) => {
      S(this, Ne, e2);
    });
    T(this, "header", (e2, a2, t) => {
      this.finalized && S(this, H, new Response(u(this, H).body, u(this, H)));
      const r = u(this, H) ? u(this, H).headers : u(this, ue) ?? S(this, ue, new Headers());
      a2 === void 0 ? r.delete(e2) : t != null && t.append ? r.append(e2, a2) : r.set(e2, a2);
    });
    T(this, "status", (e2) => {
      S(this, Oe, e2);
    });
    T(this, "set", (e2, a2) => {
      u(this, V) ?? S(this, V, /* @__PURE__ */ new Map()), u(this, V).set(e2, a2);
    });
    T(this, "get", (e2) => u(this, V) ? u(this, V).get(e2) : void 0);
    T(this, "newResponse", (...e2) => C(this, ee, Se).call(this, ...e2));
    T(this, "body", (e2, a2, t) => C(this, ee, Se).call(this, e2, a2, t));
    T(this, "text", (e2, a2, t) => !u(this, ue) && !u(this, Oe) && !a2 && !t && !this.finalized ? new Response(e2) : C(this, ee, Se).call(this, e2, a2, ma(Ir, t)));
    T(this, "json", (e2, a2, t) => C(this, ee, Se).call(this, JSON.stringify(e2), a2, ma("application/json", t)));
    T(this, "html", (e2, a2, t) => {
      const r = /* @__PURE__ */ __name2((s) => C(this, ee, Se).call(this, s, a2, ma("text/html; charset=UTF-8", t)), "r");
      return typeof e2 == "object" ? mt(e2, pt.Stringify, false, {}).then(r) : r(e2);
    });
    T(this, "redirect", (e2, a2) => {
      const t = String(e2);
      return this.header("Location", /[^\x00-\xFF]/.test(t) ? encodeURI(t) : t), this.newResponse(null, a2 ?? 302);
    });
    T(this, "notFound", () => (u(this, Ce) ?? S(this, Ce, () => new Response()), u(this, Ce).call(this, this)));
    S(this, Be, e), a && (S(this, Y, a.executionCtx), this.env = a.env, S(this, Ce, a.notFoundHandler), S(this, We, a.path), S(this, $e, a.matchResult));
  }
  get req() {
    return u(this, qe) ?? S(this, qe, new bt(u(this, Be), u(this, We), u(this, $e))), u(this, qe);
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
    return u(this, H) || S(this, H, new Response(null, { headers: u(this, ue) ?? S(this, ue, new Headers()) }));
  }
  set res(e) {
    if (u(this, H) && e) {
      e = new Response(e.body, e);
      for (const [a, t] of u(this, H).headers.entries())
        if (a !== "content-type")
          if (a === "set-cookie") {
            const r = u(this, H).headers.getSetCookie();
            e.headers.delete("set-cookie");
            for (const s of r)
              e.headers.append("set-cookie", s);
          } else
            e.headers.set(a, t);
    }
    S(this, H, e), this.finalized = true;
  }
  get var() {
    return u(this, V) ? Object.fromEntries(u(this, V)) : {};
  }
}, "ot"), Be = /* @__PURE__ */ new WeakMap(), qe = /* @__PURE__ */ new WeakMap(), V = /* @__PURE__ */ new WeakMap(), Oe = /* @__PURE__ */ new WeakMap(), Y = /* @__PURE__ */ new WeakMap(), H = /* @__PURE__ */ new WeakMap(), Fe = /* @__PURE__ */ new WeakMap(), Ne = /* @__PURE__ */ new WeakMap(), Ce = /* @__PURE__ */ new WeakMap(), ue = /* @__PURE__ */ new WeakMap(), $e = /* @__PURE__ */ new WeakMap(), We = /* @__PURE__ */ new WeakMap(), ee = /* @__PURE__ */ new WeakSet(), Se = /* @__PURE__ */ __name2(function(e, a, t) {
  const r = u(this, H) ? new Headers(u(this, H).headers) : u(this, ue) ?? new Headers();
  if (typeof a == "object" && "headers" in a) {
    const o = a.headers instanceof Headers ? a.headers : new Headers(a.headers);
    for (const [n, i] of o)
      n.toLowerCase() === "set-cookie" ? r.append(n, i) : r.set(n, i);
  }
  if (t)
    for (const [o, n] of Object.entries(t))
      if (typeof n == "string")
        r.set(o, n);
      else {
        r.delete(o);
        for (const i of n)
          r.append(o, i);
      }
  const s = typeof a == "number" ? a : (a == null ? void 0 : a.status) ?? u(this, Oe);
  return new Response(e, { status: s, headers: r });
}, "Se"), ot);
var w = "ALL";
var Lr = "all";
var Mr = ["get", "post", "put", "delete", "options", "patch"];
var It = "Can not add a route since the matcher is already built.";
var jt = /* @__PURE__ */ __name2(class extends Error {
}, "jt");
var xr = "__COMPOSED_HANDLER";
var Pr = /* @__PURE__ */ __name2((e) => e.text("404 Not Found", 404), "Pr");
var Va = /* @__PURE__ */ __name2((e, a) => {
  if ("getResponse" in e) {
    const t = e.getResponse();
    return a.newResponse(t.body, t);
  }
  return console.error(e), a.text("Internal Server Error", 500);
}, "Va");
var q;
var A;
var Mt;
var F;
var ce;
var ea;
var aa;
var nt;
var Lt = (nt = /* @__PURE__ */ __name2(class {
  constructor(a = {}) {
    O(this, A);
    T(this, "get");
    T(this, "post");
    T(this, "put");
    T(this, "delete");
    T(this, "options");
    T(this, "patch");
    T(this, "all");
    T(this, "on");
    T(this, "use");
    T(this, "router");
    T(this, "getPath");
    T(this, "_basePath", "/");
    O(this, q, "/");
    T(this, "routes", []);
    O(this, F, Pr);
    T(this, "errorHandler", Va);
    T(this, "onError", (a2) => (this.errorHandler = a2, this));
    T(this, "notFound", (a2) => (S(this, F, a2), this));
    T(this, "fetch", (a2, ...t) => C(this, A, aa).call(this, a2, t[1], t[0], a2.method));
    T(this, "request", (a2, t, r2, s2) => a2 instanceof Request ? this.fetch(t ? new Request(a2, t) : a2, r2, s2) : (a2 = a2.toString(), this.fetch(new Request(/^https?:\/\//.test(a2) ? a2 : `http://localhost${Te("/", a2)}`, t), r2, s2)));
    T(this, "fire", () => {
      addEventListener("fetch", (a2) => {
        a2.respondWith(C(this, A, aa).call(this, a2.request, a2, void 0, a2.request.method));
      });
    });
    [...Mr, Lr].forEach((o) => {
      this[o] = (n, ...i) => (typeof n == "string" ? S(this, q, n) : C(this, A, ce).call(this, o, u(this, q), n), i.forEach((c) => {
        C(this, A, ce).call(this, o, u(this, q), c);
      }), this);
    }), this.on = (o, n, ...i) => {
      for (const c of [n].flat()) {
        S(this, q, c);
        for (const l of [o].flat())
          i.map((d) => {
            C(this, A, ce).call(this, l.toUpperCase(), u(this, q), d);
          });
      }
      return this;
    }, this.use = (o, ...n) => (typeof o == "string" ? S(this, q, o) : (S(this, q, "*"), n.unshift(o)), n.forEach((i) => {
      C(this, A, ce).call(this, w, u(this, q), i);
    }), this);
    const { strict: r, ...s } = a;
    Object.assign(this, s), this.getPath = r ?? true ? a.getPath ?? Nt : br;
  }
  route(a, t) {
    const r = this.basePath(a);
    return t.routes.map((s) => {
      var n;
      let o;
      t.errorHandler === Va ? o = s.handler : (o = /* @__PURE__ */ __name2(async (i, c) => (await ka([], t.errorHandler)(i, () => s.handler(i, c))).res, "o"), o[xr] = s.handler), C(n = r, A, ce).call(n, s.method, s.path, o);
    }), this;
  }
  basePath(a) {
    const t = C(this, A, Mt).call(this);
    return t._basePath = Te(this._basePath, a), t;
  }
  mount(a, t, r) {
    let s, o;
    r && (typeof r == "function" ? o = r : (o = r.optionHandler, r.replaceRequest === false ? s = /* @__PURE__ */ __name2((c) => c, "s") : s = r.replaceRequest));
    const n = o ? (c) => {
      const l = o(c);
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
      const c = Te(this._basePath, a), l = c === "/" ? 0 : c.length;
      return (d) => {
        const f = new URL(d.url);
        return f.pathname = f.pathname.slice(l) || "/", new Request(f, d);
      };
    })());
    const i = /* @__PURE__ */ __name2(async (c, l) => {
      const d = await t(s(c.req.raw), ...n(c));
      if (d)
        return d;
      await l();
    }, "i");
    return C(this, A, ce).call(this, w, Te(a, "*"), i), this;
  }
}, "nt"), q = /* @__PURE__ */ new WeakMap(), A = /* @__PURE__ */ new WeakSet(), Mt = /* @__PURE__ */ __name2(function() {
  const a = new Lt({ router: this.router, getPath: this.getPath });
  return a.errorHandler = this.errorHandler, S(a, F, u(this, F)), a.routes = this.routes, a;
}, "Mt"), F = /* @__PURE__ */ new WeakMap(), ce = /* @__PURE__ */ __name2(function(a, t, r) {
  a = a.toUpperCase(), t = Te(this._basePath, t);
  const s = { basePath: this._basePath, path: t, method: a, handler: r };
  this.router.add(a, t, [r, s]), this.routes.push(s);
}, "ce"), ea = /* @__PURE__ */ __name2(function(a, t) {
  if (a instanceof Error)
    return this.errorHandler(a, t);
  throw a;
}, "ea"), aa = /* @__PURE__ */ __name2(function(a, t, r, s) {
  if (s === "HEAD")
    return (async () => new Response(null, await C(this, A, aa).call(this, a, t, r, "GET")))();
  const o = this.getPath(a, { env: r }), n = this.router.match(s, o), i = new jr(a, { path: o, matchResult: n, env: r, executionCtx: t, notFoundHandler: u(this, F) });
  if (n[0].length === 1) {
    let l;
    try {
      l = n[0][0][0][0](i, async () => {
        i.res = await u(this, F).call(this, i);
      });
    } catch (d) {
      return C(this, A, ea).call(this, d, i);
    }
    return l instanceof Promise ? l.then((d) => d || (i.finalized ? i.res : u(this, F).call(this, i))).catch((d) => C(this, A, ea).call(this, d, i)) : l ?? u(this, F).call(this, i);
  }
  const c = ka(n[0], this.errorHandler, u(this, F));
  return (async () => {
    try {
      const l = await c(i);
      if (!l.finalized)
        throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");
      return l.res;
    } catch (l) {
      return C(this, A, ea).call(this, l, i);
    }
  })();
}, "aa"), nt);
var xt = [];
function Hr(e, a) {
  const t = this.buildAllMatchers(), r = /* @__PURE__ */ __name2((s, o) => {
    const n = t[s] || t[w], i = n[2][o];
    if (i)
      return i;
    const c = o.match(n[0]);
    if (!c)
      return [[], xt];
    const l = c.indexOf("", 1);
    return [n[1][l], c];
  }, "r");
  return this.match = r, r(e, a);
}
__name(Hr, "Hr");
__name2(Hr, "Hr");
var ia = "[^/]+";
var Me = ".*";
var xe = "(?:|/.*)";
var ye = Symbol();
var Ur = new Set(".\\+*[^]$()");
function Br(e, a) {
  return e.length === 1 ? a.length === 1 ? e < a ? -1 : 1 : -1 : a.length === 1 || e === Me || e === xe ? 1 : a === Me || a === xe ? -1 : e === ia ? 1 : a === ia ? -1 : e.length === a.length ? e < a ? -1 : 1 : a.length - e.length;
}
__name(Br, "Br");
__name2(Br, "Br");
var fe;
var pe;
var $;
var it;
var Ca = (it = /* @__PURE__ */ __name2(class {
  constructor() {
    O(this, fe);
    O(this, pe);
    O(this, $, /* @__PURE__ */ Object.create(null));
  }
  insert(a, t, r, s, o) {
    if (a.length === 0) {
      if (u(this, fe) !== void 0)
        throw ye;
      if (o)
        return;
      S(this, fe, t);
      return;
    }
    const [n, ...i] = a, c = n === "*" ? i.length === 0 ? ["", "", Me] : ["", "", ia] : n === "/*" ? ["", "", xe] : n.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let l;
    if (c) {
      const d = c[1];
      let f = c[2] || ia;
      if (d && c[2] && (f === ".*" || (f = f.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(f))))
        throw ye;
      if (l = u(this, $)[f], !l) {
        if (Object.keys(u(this, $)).some((p) => p !== Me && p !== xe))
          throw ye;
        if (o)
          return;
        l = u(this, $)[f] = new Ca(), d !== "" && S(l, pe, s.varIndex++);
      }
      !o && d !== "" && r.push([d, u(l, pe)]);
    } else if (l = u(this, $)[n], !l) {
      if (Object.keys(u(this, $)).some((d) => d.length > 1 && d !== Me && d !== xe))
        throw ye;
      if (o)
        return;
      l = u(this, $)[n] = new Ca();
    }
    l.insert(i, t, r, s, o);
  }
  buildRegExpStr() {
    const t = Object.keys(u(this, $)).sort(Br).map((r) => {
      const s = u(this, $)[r];
      return (typeof u(s, pe) == "number" ? `(${r})@${u(s, pe)}` : Ur.has(r) ? `\\${r}` : r) + s.buildRegExpStr();
    });
    return typeof u(this, fe) == "number" && t.unshift(`#${u(this, fe)}`), t.length === 0 ? "" : t.length === 1 ? t[0] : "(?:" + t.join("|") + ")";
  }
}, "it"), fe = /* @__PURE__ */ new WeakMap(), pe = /* @__PURE__ */ new WeakMap(), $ = /* @__PURE__ */ new WeakMap(), it);
var ca;
var ke;
var ct;
var qr = (ct = /* @__PURE__ */ __name2(class {
  constructor() {
    O(this, ca, { varIndex: 0 });
    O(this, ke, new Ca());
  }
  insert(e, a, t) {
    const r = [], s = [];
    for (let n = 0; ; ) {
      let i = false;
      if (e = e.replace(/\{[^}]+\}/g, (c) => {
        const l = `@\\${n}`;
        return s[n] = [l, c], n++, i = true, l;
      }), !i)
        break;
    }
    const o = e.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let n = s.length - 1; n >= 0; n--) {
      const [i] = s[n];
      for (let c = o.length - 1; c >= 0; c--)
        if (o[c].indexOf(i) !== -1) {
          o[c] = o[c].replace(i, s[n][1]);
          break;
        }
    }
    return u(this, ke).insert(o, a, r, u(this, ca), t), r;
  }
  buildRegExp() {
    let e = u(this, ke).buildRegExpStr();
    if (e === "")
      return [/^$/, [], []];
    let a = 0;
    const t = [], r = [];
    return e = e.replace(/#(\d+)|@(\d+)|\.\*\$/g, (s, o, n) => o !== void 0 ? (t[++a] = Number(o), "$()") : (n !== void 0 && (r[Number(n)] = ++a), "")), [new RegExp(`^${e}`), t, r];
  }
}, "ct"), ca = /* @__PURE__ */ new WeakMap(), ke = /* @__PURE__ */ new WeakMap(), ct);
var Fr = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var ta = /* @__PURE__ */ Object.create(null);
function Pt(e) {
  return ta[e] ?? (ta[e] = new RegExp(e === "*" ? "" : `^${e.replace(/\/\*$|([.\\+*[^\]$()])/g, (a, t) => t ? `\\${t}` : "(?:|/.*)")}$`));
}
__name(Pt, "Pt");
__name2(Pt, "Pt");
function $r() {
  ta = /* @__PURE__ */ Object.create(null);
}
__name($r, "$r");
__name2($r, "$r");
function Wr(e) {
  var l;
  const a = new qr(), t = [];
  if (e.length === 0)
    return Fr;
  const r = e.map((d) => [!/\*|\/:/.test(d[0]), ...d]).sort(([d, f], [p, h]) => d ? 1 : p ? -1 : f.length - h.length), s = /* @__PURE__ */ Object.create(null);
  for (let d = 0, f = -1, p = r.length; d < p; d++) {
    const [h, m, E] = r[d];
    h ? s[m] = [E.map(([_]) => [_, /* @__PURE__ */ Object.create(null)]), xt] : f++;
    let g;
    try {
      g = a.insert(m, f, h);
    } catch (_) {
      throw _ === ye ? new jt(m) : _;
    }
    h || (t[f] = E.map(([_, v]) => {
      const N = /* @__PURE__ */ Object.create(null);
      for (v -= 1; v >= 0; v--) {
        const [y, b] = g[v];
        N[y] = b;
      }
      return [_, N];
    }));
  }
  const [o, n, i] = a.buildRegExp();
  for (let d = 0, f = t.length; d < f; d++)
    for (let p = 0, h = t[d].length; p < h; p++) {
      const m = (l = t[d][p]) == null ? void 0 : l[1];
      if (!m)
        continue;
      const E = Object.keys(m);
      for (let g = 0, _ = E.length; g < _; g++)
        m[E[g]] = i[m[E[g]]];
    }
  const c = [];
  for (const d in n)
    c[d] = t[n[d]];
  return [o, c, s];
}
__name(Wr, "Wr");
__name2(Wr, "Wr");
function _e(e, a) {
  if (e) {
    for (const t of Object.keys(e).sort((r, s) => s.length - r.length))
      if (Pt(t).test(a))
        return [...e[t]];
  }
}
__name(_e, "_e");
__name2(_e, "_e");
var ae;
var te;
var la;
var Ht;
var lt;
var kr = (lt = /* @__PURE__ */ __name2(class {
  constructor() {
    O(this, la);
    T(this, "name", "RegExpRouter");
    O(this, ae);
    O(this, te);
    T(this, "match", Hr);
    S(this, ae, { [w]: /* @__PURE__ */ Object.create(null) }), S(this, te, { [w]: /* @__PURE__ */ Object.create(null) });
  }
  add(e, a, t) {
    var i;
    const r = u(this, ae), s = u(this, te);
    if (!r || !s)
      throw new Error(It);
    r[e] || [r, s].forEach((c) => {
      c[e] = /* @__PURE__ */ Object.create(null), Object.keys(c[w]).forEach((l) => {
        c[e][l] = [...c[w][l]];
      });
    }), a === "/*" && (a = "*");
    const o = (a.match(/\/:/g) || []).length;
    if (/\*$/.test(a)) {
      const c = Pt(a);
      e === w ? Object.keys(r).forEach((l) => {
        var d;
        (d = r[l])[a] || (d[a] = _e(r[l], a) || _e(r[w], a) || []);
      }) : (i = r[e])[a] || (i[a] = _e(r[e], a) || _e(r[w], a) || []), Object.keys(r).forEach((l) => {
        (e === w || e === l) && Object.keys(r[l]).forEach((d) => {
          c.test(d) && r[l][d].push([t, o]);
        });
      }), Object.keys(s).forEach((l) => {
        (e === w || e === l) && Object.keys(s[l]).forEach((d) => c.test(d) && s[l][d].push([t, o]));
      });
      return;
    }
    const n = Ct(a) || [a];
    for (let c = 0, l = n.length; c < l; c++) {
      const d = n[c];
      Object.keys(s).forEach((f) => {
        var p;
        (e === w || e === f) && ((p = s[f])[d] || (p[d] = [..._e(r[f], d) || _e(r[w], d) || []]), s[f][d].push([t, o - l + c + 1]));
      });
    }
  }
  buildAllMatchers() {
    const e = /* @__PURE__ */ Object.create(null);
    return Object.keys(u(this, te)).concat(Object.keys(u(this, ae))).forEach((a) => {
      e[a] || (e[a] = C(this, la, Ht).call(this, a));
    }), S(this, ae, S(this, te, void 0)), $r(), e;
  }
}, "lt"), ae = /* @__PURE__ */ new WeakMap(), te = /* @__PURE__ */ new WeakMap(), la = /* @__PURE__ */ new WeakSet(), Ht = /* @__PURE__ */ __name2(function(e) {
  const a = [];
  let t = e === w;
  return [u(this, ae), u(this, te)].forEach((r) => {
    const s = r[e] ? Object.keys(r[e]).map((o) => [o, r[e][o]]) : [];
    s.length !== 0 ? (t || (t = true), a.push(...s)) : e !== w && a.push(...Object.keys(r[w]).map((o) => [o, r[w][o]]));
  }), t ? Wr(a) : null;
}, "Ht"), lt);
var re;
var G;
var dt;
var zr = (dt = /* @__PURE__ */ __name2(class {
  constructor(e) {
    T(this, "name", "SmartRouter");
    O(this, re, []);
    O(this, G, []);
    S(this, re, e.routers);
  }
  add(e, a, t) {
    if (!u(this, G))
      throw new Error(It);
    u(this, G).push([e, a, t]);
  }
  match(e, a) {
    if (!u(this, G))
      throw new Error("Fatal error");
    const t = u(this, re), r = u(this, G), s = t.length;
    let o = 0, n;
    for (; o < s; o++) {
      const i = t[o];
      try {
        for (let c = 0, l = r.length; c < l; c++)
          i.add(...r[c]);
        n = i.match(e, a);
      } catch (c) {
        if (c instanceof jt)
          continue;
        throw c;
      }
      this.match = i.match.bind(i), S(this, re, [i]), S(this, G, void 0);
      break;
    }
    if (o === s)
      throw new Error("Fatal error");
    return this.name = `SmartRouter + ${this.activeRouter.name}`, n;
  }
  get activeRouter() {
    if (u(this, G) || u(this, re).length !== 1)
      throw new Error("No active router has been determined yet.");
    return u(this, re)[0];
  }
}, "dt"), re = /* @__PURE__ */ new WeakMap(), G = /* @__PURE__ */ new WeakMap(), dt);
var je = /* @__PURE__ */ Object.create(null);
var se;
var x;
var Ee;
var De;
var M;
var J;
var le;
var ut;
var Ut = (ut = /* @__PURE__ */ __name2(class {
  constructor(e, a, t) {
    O(this, J);
    O(this, se);
    O(this, x);
    O(this, Ee);
    O(this, De, 0);
    O(this, M, je);
    if (S(this, x, t || /* @__PURE__ */ Object.create(null)), S(this, se, []), e && a) {
      const r = /* @__PURE__ */ Object.create(null);
      r[e] = { handler: a, possibleKeys: [], score: 0 }, S(this, se, [r]);
    }
    S(this, Ee, []);
  }
  insert(e, a, t) {
    S(this, De, ++Ua(this, De)._);
    let r = this;
    const s = Rr(a), o = [];
    for (let n = 0, i = s.length; n < i; n++) {
      const c = s[n], l = s[n + 1], d = Cr(c, l), f = Array.isArray(d) ? d[0] : c;
      if (f in u(r, x)) {
        r = u(r, x)[f], d && o.push(d[1]);
        continue;
      }
      u(r, x)[f] = new Ut(), d && (u(r, Ee).push(d), o.push(d[1])), r = u(r, x)[f];
    }
    return u(r, se).push({ [e]: { handler: t, possibleKeys: o.filter((n, i, c) => c.indexOf(n) === i), score: u(this, De) } }), r;
  }
  search(e, a) {
    var i;
    const t = [];
    S(this, M, je);
    let s = [this];
    const o = Ot(a), n = [];
    for (let c = 0, l = o.length; c < l; c++) {
      const d = o[c], f = c === l - 1, p = [];
      for (let h = 0, m = s.length; h < m; h++) {
        const E = s[h], g = u(E, x)[d];
        g && (S(g, M, u(E, M)), f ? (u(g, x)["*"] && t.push(...C(this, J, le).call(this, u(g, x)["*"], e, u(E, M))), t.push(...C(this, J, le).call(this, g, e, u(E, M)))) : p.push(g));
        for (let _ = 0, v = u(E, Ee).length; _ < v; _++) {
          const N = u(E, Ee)[_], y = u(E, M) === je ? {} : { ...u(E, M) };
          if (N === "*") {
            const Z = u(E, x)["*"];
            Z && (t.push(...C(this, J, le).call(this, Z, e, u(E, M))), S(Z, M, y), p.push(Z));
            continue;
          }
          const [b, ge, ie] = N;
          if (!d && !(ie instanceof RegExp))
            continue;
          const k = u(E, x)[b], Zt = o.slice(c).join("/");
          if (ie instanceof RegExp) {
            const Z = ie.exec(Zt);
            if (Z) {
              if (y[ge] = Z[0], t.push(...C(this, J, le).call(this, k, e, u(E, M), y)), Object.keys(u(k, x)).length) {
                S(k, M, y);
                const ua = ((i = Z[0].match(/\//)) == null ? void 0 : i.length) ?? 0;
                (n[ua] || (n[ua] = [])).push(k);
              }
              continue;
            }
          }
          (ie === true || ie.test(d)) && (y[ge] = d, f ? (t.push(...C(this, J, le).call(this, k, e, y, u(E, M))), u(k, x)["*"] && t.push(...C(this, J, le).call(this, u(k, x)["*"], e, y, u(E, M)))) : (S(k, M, y), p.push(k)));
        }
      }
      s = p.concat(n.shift() ?? []);
    }
    return t.length > 1 && t.sort((c, l) => c.score - l.score), [t.map(({ handler: c, params: l }) => [c, l])];
  }
}, "ut"), se = /* @__PURE__ */ new WeakMap(), x = /* @__PURE__ */ new WeakMap(), Ee = /* @__PURE__ */ new WeakMap(), De = /* @__PURE__ */ new WeakMap(), M = /* @__PURE__ */ new WeakMap(), J = /* @__PURE__ */ new WeakSet(), le = /* @__PURE__ */ __name2(function(e, a, t, r) {
  const s = [];
  for (let o = 0, n = u(e, se).length; o < n; o++) {
    const i = u(e, se)[o], c = i[a] || i[w], l = {};
    if (c !== void 0 && (c.params = /* @__PURE__ */ Object.create(null), s.push(c), t !== je || r && r !== je))
      for (let d = 0, f = c.possibleKeys.length; d < f; d++) {
        const p = c.possibleKeys[d], h = l[c.score];
        c.params[p] = r != null && r[p] && !h ? r[p] : t[p] ?? (r == null ? void 0 : r[p]), l[c.score] = true;
      }
  }
  return s;
}, "le"), ut);
var he;
var ft;
var Vr = (ft = /* @__PURE__ */ __name2(class {
  constructor() {
    T(this, "name", "TrieRouter");
    O(this, he);
    S(this, he, new Ut());
  }
  add(e, a, t) {
    const r = Ct(a);
    if (r) {
      for (let s = 0, o = r.length; s < o; s++)
        u(this, he).insert(e, r[s], t);
      return;
    }
    u(this, he).insert(e, a, t);
  }
  match(e, a) {
    return u(this, he).search(e, a);
  }
}, "ft"), he = /* @__PURE__ */ new WeakMap(), ft);
var X = /* @__PURE__ */ __name2(class extends Lt {
  constructor(e = {}) {
    super(e), this.router = e.router ?? new zr({ routers: [new kr(), new Vr()] });
  }
}, "X");
var Yr = /* @__PURE__ */ __name2((e) => {
  const t = { ...{ origin: "*", allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"], allowHeaders: [], exposeHeaders: [] }, ...e }, r = ((o) => typeof o == "string" ? o === "*" ? () => o : (n) => o === n ? n : null : typeof o == "function" ? o : (n) => o.includes(n) ? n : null)(t.origin), s = ((o) => typeof o == "function" ? o : Array.isArray(o) ? () => o : () => [])(t.allowMethods);
  return async function(n, i) {
    var d;
    function c(f, p) {
      n.res.headers.set(f, p);
    }
    __name(c, "c");
    __name2(c, "c");
    const l = await r(n.req.header("origin") || "", n);
    if (l && c("Access-Control-Allow-Origin", l), t.origin !== "*") {
      const f = n.req.header("Vary");
      f ? c("Vary", f) : c("Vary", "Origin");
    }
    if (t.credentials && c("Access-Control-Allow-Credentials", "true"), (d = t.exposeHeaders) != null && d.length && c("Access-Control-Expose-Headers", t.exposeHeaders.join(",")), n.req.method === "OPTIONS") {
      t.maxAge != null && c("Access-Control-Max-Age", t.maxAge.toString());
      const f = await s(n.req.header("origin") || "", n);
      f.length && c("Access-Control-Allow-Methods", f.join(","));
      let p = t.allowHeaders;
      if (!(p != null && p.length)) {
        const h = n.req.header("Access-Control-Request-Headers");
        h && (p = h.split(/\s*,\s*/));
      }
      return p != null && p.length && (c("Access-Control-Allow-Headers", p.join(",")), n.res.headers.append("Vary", "Access-Control-Request-Headers")), n.res.headers.delete("Content-Length"), n.res.headers.delete("Content-Type"), new Response(null, { headers: n.res.headers, status: 204, statusText: "No Content" });
    }
    await i();
  };
}, "Yr");
var Gr = /^\s*(?:text\/(?!event-stream(?:[;\s]|$))[^;\s]+|application\/(?:javascript|json|xml|xml-dtd|ecmascript|dart|postscript|rtf|tar|toml|vnd\.dart|vnd\.ms-fontobject|vnd\.ms-opentype|wasm|x-httpd-php|x-javascript|x-ns-proxy-autoconfig|x-sh|x-tar|x-virtualbox-hdd|x-virtualbox-ova|x-virtualbox-ovf|x-virtualbox-vbox|x-virtualbox-vdi|x-virtualbox-vhd|x-virtualbox-vmdk|x-www-form-urlencoded)|font\/(?:otf|ttf)|image\/(?:bmp|vnd\.adobe\.photoshop|vnd\.microsoft\.icon|vnd\.ms-dds|x-icon|x-ms-bmp)|message\/rfc822|model\/gltf-binary|x-shader\/x-fragment|x-shader\/x-vertex|[^;\s]+?\+(?:json|text|xml|yaml))(?:[;\s]|$)/i;
var Ya = /* @__PURE__ */ __name2((e, a = Kr) => {
  const t = /\.([a-zA-Z0-9]+?)$/, r = e.match(t);
  if (!r)
    return;
  let s = a[r[1]];
  return s && s.startsWith("text") && (s += "; charset=utf-8"), s;
}, "Ya");
var Jr = { aac: "audio/aac", avi: "video/x-msvideo", avif: "image/avif", av1: "video/av1", bin: "application/octet-stream", bmp: "image/bmp", css: "text/css", csv: "text/csv", eot: "application/vnd.ms-fontobject", epub: "application/epub+zip", gif: "image/gif", gz: "application/gzip", htm: "text/html", html: "text/html", ico: "image/x-icon", ics: "text/calendar", jpeg: "image/jpeg", jpg: "image/jpeg", js: "text/javascript", json: "application/json", jsonld: "application/ld+json", map: "application/json", mid: "audio/x-midi", midi: "audio/x-midi", mjs: "text/javascript", mp3: "audio/mpeg", mp4: "video/mp4", mpeg: "video/mpeg", oga: "audio/ogg", ogv: "video/ogg", ogx: "application/ogg", opus: "audio/opus", otf: "font/otf", pdf: "application/pdf", png: "image/png", rtf: "application/rtf", svg: "image/svg+xml", tif: "image/tiff", tiff: "image/tiff", ts: "video/mp2t", ttf: "font/ttf", txt: "text/plain", wasm: "application/wasm", webm: "video/webm", weba: "audio/webm", webmanifest: "application/manifest+json", webp: "image/webp", woff: "font/woff", woff2: "font/woff2", xhtml: "application/xhtml+xml", xml: "application/xml", zip: "application/zip", "3gp": "video/3gpp", "3g2": "video/3gpp2", gltf: "model/gltf+json", glb: "model/gltf-binary" };
var Kr = Jr;
var Xr = /* @__PURE__ */ __name2((...e) => {
  let a = e.filter((s) => s !== "").join("/");
  a = a.replace(new RegExp("(?<=\\/)\\/+", "g"), "");
  const t = a.split("/"), r = [];
  for (const s of t)
    s === ".." && r.length > 0 && r.at(-1) !== ".." ? r.pop() : s !== "." && r.push(s);
  return r.join("/") || ".";
}, "Xr");
var Bt = { br: ".br", zstd: ".zst", gzip: ".gz" };
var Zr = Object.keys(Bt);
var Qr = "index.html";
var es = /* @__PURE__ */ __name2((e) => {
  const a = e.root ?? "./", t = e.path, r = e.join ?? Xr;
  return async (s, o) => {
    var d, f, p, h;
    if (s.finalized)
      return o();
    let n;
    if (e.path)
      n = e.path;
    else
      try {
        if (n = decodeURIComponent(s.req.path), /(?:^|[\/\\])\.\.(?:$|[\/\\])/.test(n))
          throw new Error();
      } catch {
        return await ((d = e.onNotFound) == null ? void 0 : d.call(e, s.req.path, s)), o();
      }
    let i = r(a, !t && e.rewriteRequestPath ? e.rewriteRequestPath(n) : n);
    e.isDir && await e.isDir(i) && (i = r(i, Qr));
    const c = e.getContent;
    let l = await c(i, s);
    if (l instanceof Response)
      return s.newResponse(l.body, l);
    if (l) {
      const m = e.mimes && Ya(i, e.mimes) || Ya(i);
      if (s.header("Content-Type", m || "application/octet-stream"), e.precompressed && (!m || Gr.test(m))) {
        const E = new Set((f = s.req.header("Accept-Encoding")) == null ? void 0 : f.split(",").map((g) => g.trim()));
        for (const g of Zr) {
          if (!E.has(g))
            continue;
          const _ = await c(i + Bt[g], s);
          if (_) {
            l = _, s.header("Content-Encoding", g), s.header("Vary", "Accept-Encoding", { append: true });
            break;
          }
        }
      }
      return await ((p = e.onFound) == null ? void 0 : p.call(e, i, s)), s.body(l);
    }
    await ((h = e.onNotFound) == null ? void 0 : h.call(e, i, s)), await o();
  };
}, "es");
var as = /* @__PURE__ */ __name2(async (e, a) => {
  let t;
  a && a.manifest ? typeof a.manifest == "string" ? t = JSON.parse(a.manifest) : t = a.manifest : typeof __STATIC_CONTENT_MANIFEST == "string" ? t = JSON.parse(__STATIC_CONTENT_MANIFEST) : t = __STATIC_CONTENT_MANIFEST;
  let r;
  a && a.namespace ? r = a.namespace : r = __STATIC_CONTENT;
  const s = t[e] || e;
  if (!s)
    return null;
  const o = await r.get(s, { type: "stream" });
  return o || null;
}, "as");
var ts = /* @__PURE__ */ __name2((e) => async function(t, r) {
  return es({ ...e, getContent: async (o) => as(o, { manifest: e.manifest, namespace: e.namespace ? e.namespace : t.env ? t.env.__STATIC_CONTENT : void 0 }) })(t, r);
}, "ts");
var rs = /* @__PURE__ */ __name2((e) => ts(e), "rs");
var He = "_hp";
var ss = { Change: "Input", DoubleClick: "DblClick" };
var os = { svg: "2000/svg", math: "1998/Math/MathML" };
var Ue = [];
var Da = /* @__PURE__ */ new WeakMap();
var we = void 0;
var ns = /* @__PURE__ */ __name2(() => we, "ns");
var z = /* @__PURE__ */ __name2((e) => "t" in e, "z");
var ga = { onClick: ["click", false] };
var Ga = /* @__PURE__ */ __name2((e) => {
  if (!e.startsWith("on"))
    return;
  if (ga[e])
    return ga[e];
  const a = e.match(/^on([A-Z][a-zA-Z]+?(?:PointerCapture)?)(Capture)?$/);
  if (a) {
    const [, t, r] = a;
    return ga[e] = [(ss[t] || t).toLowerCase(), !!r];
  }
}, "Ga");
var Ja = /* @__PURE__ */ __name2((e, a) => we && e instanceof SVGElement && /[A-Z]/.test(a) && (a in e.style || a.match(/^(?:o|pai|str|u|ve)/)) ? a.replace(/([A-Z])/g, "-$1").toLowerCase() : a, "Ja");
var is = /* @__PURE__ */ __name2((e, a, t) => {
  var r;
  a || (a = {});
  for (let s in a) {
    const o = a[s];
    if (s !== "children" && (!t || t[s] !== o)) {
      s = na(s);
      const n = Ga(s);
      if (n) {
        if ((t == null ? void 0 : t[s]) !== o && (t && e.removeEventListener(n[0], t[s], n[1]), o != null)) {
          if (typeof o != "function")
            throw new Error(`Event handler for "${s}" is not a function`);
          e.addEventListener(n[0], o, n[1]);
        }
      } else if (s === "dangerouslySetInnerHTML" && o)
        e.innerHTML = o.__html;
      else if (s === "ref") {
        let i;
        typeof o == "function" ? i = o(e) || (() => o(null)) : o && "current" in o && (o.current = e, i = /* @__PURE__ */ __name2(() => o.current = null, "i")), Da.set(e, i);
      } else if (s === "style") {
        const i = e.style;
        typeof o == "string" ? i.cssText = o : (i.cssText = "", o != null && yt(o, i.setProperty.bind(i)));
      } else {
        if (s === "value") {
          const c = e.nodeName;
          if (c === "INPUT" || c === "TEXTAREA" || c === "SELECT") {
            if (e.value = o == null || o === false ? null : o, c === "TEXTAREA") {
              e.textContent = o;
              continue;
            } else if (c === "SELECT") {
              e.selectedIndex === -1 && (e.selectedIndex = 0);
              continue;
            }
          }
        } else
          (s === "checked" && e.nodeName === "INPUT" || s === "selected" && e.nodeName === "OPTION") && (e[s] = o);
        const i = Ja(e, s);
        o == null || o === false ? e.removeAttribute(i) : o === true ? e.setAttribute(i, "") : typeof o == "string" || typeof o == "number" ? e.setAttribute(i, o) : e.setAttribute(i, o.toString());
      }
    }
  }
  if (t)
    for (let s in t) {
      const o = t[s];
      if (s !== "children" && !(s in a)) {
        s = na(s);
        const n = Ga(s);
        n ? e.removeEventListener(n[0], o, n[1]) : s === "ref" ? (r = Da.get(e)) == null || r() : e.removeAttribute(Ja(e, s));
      }
    }
}, "is");
var cs = /* @__PURE__ */ __name2((e, a) => {
  a[D][0] = 0, Ue.push([e, a]);
  const t = a.tag[wa] || a.tag, r = t.defaultProps ? { ...t.defaultProps, ...a.props } : a.props;
  try {
    return [t.call(null, r)];
  } finally {
    Ue.pop();
  }
}, "cs");
var qt = /* @__PURE__ */ __name2((e, a, t, r, s) => {
  var o, n;
  (o = e.vR) != null && o.length && (r.push(...e.vR), delete e.vR), typeof e.tag == "function" && ((n = e[D][1][kt]) == null || n.forEach((i) => s.push(i))), e.vC.forEach((i) => {
    var c;
    if (z(i))
      t.push(i);
    else if (typeof i.tag == "function" || i.tag === "") {
      i.c = a;
      const l = t.length;
      if (qt(i, a, t, r, s), i.s) {
        for (let d = l; d < t.length; d++)
          t[d].s = true;
        i.s = false;
      }
    } else
      t.push(i), (c = i.vR) != null && c.length && (r.push(...i.vR), delete i.vR);
  });
}, "qt");
var ls = /* @__PURE__ */ __name2((e) => {
  for (; ; e = e.tag === He || !e.vC || !e.pP ? e.nN : e.vC[0]) {
    if (!e)
      return null;
    if (e.tag !== He && e.e)
      return e.e;
  }
}, "ls");
var Ft = /* @__PURE__ */ __name2((e) => {
  var a, t, r, s, o, n;
  z(e) || ((t = (a = e[D]) == null ? void 0 : a[1][kt]) == null || t.forEach((i) => {
    var c;
    return (c = i[2]) == null ? void 0 : c.call(i);
  }), (r = Da.get(e.e)) == null || r(), e.p === 2 && ((s = e.vC) == null || s.forEach((i) => i.p = 2)), (o = e.vC) == null || o.forEach(Ft)), e.p || ((n = e.e) == null || n.remove(), delete e.e), typeof e.tag == "function" && (Le.delete(e), ra.delete(e), delete e[D][3], e.a = true);
}, "Ft");
var $t = /* @__PURE__ */ __name2((e, a, t) => {
  e.c = a, Wt(e, a, t);
}, "$t");
var Ka = /* @__PURE__ */ __name2((e, a) => {
  if (a) {
    for (let t = 0, r = e.length; t < r; t++)
      if (e[t] === a)
        return t;
  }
}, "Ka");
var Xa = Symbol();
var Wt = /* @__PURE__ */ __name2((e, a, t) => {
  var l;
  const r = [], s = [], o = [];
  qt(e, a, r, s, o), s.forEach(Ft);
  const n = t ? void 0 : a.childNodes;
  let i, c = null;
  if (t)
    i = -1;
  else if (!n.length)
    i = 0;
  else {
    const d = Ka(n, ls(e.nN));
    d !== void 0 ? (c = n[d], i = d) : i = Ka(n, (l = r.find((f) => f.tag !== He && f.e)) == null ? void 0 : l.e) ?? -1, i === -1 && (t = true);
  }
  for (let d = 0, f = r.length; d < f; d++, i++) {
    const p = r[d];
    let h;
    if (p.s && p.e)
      h = p.e, p.s = false;
    else {
      const m = t || !p.e;
      z(p) ? (p.e && p.d && (p.e.textContent = p.t), p.d = false, h = p.e || (p.e = document.createTextNode(p.t))) : (h = p.e || (p.e = p.n ? document.createElementNS(p.n, p.tag) : document.createElement(p.tag)), is(h, p.props, p.pP), Wt(p, h, m));
    }
    p.tag === He ? i-- : t ? h.parentNode || a.appendChild(h) : n[i] !== h && n[i - 1] !== h && (n[i + 1] === h ? a.appendChild(n[i]) : a.insertBefore(h, c || n[i] || null));
  }
  if (e.pP && delete e.pP, o.length) {
    const d = [], f = [];
    o.forEach(([, p, , h, m]) => {
      p && d.push(p), h && f.push(h), m == null || m();
    }), d.forEach((p) => p()), f.length && requestAnimationFrame(() => {
      f.forEach((p) => p());
    });
  }
}, "Wt");
var ds = /* @__PURE__ */ __name2((e, a) => !!(e && e.length === a.length && e.every((t, r) => t[1] === a[r][1])), "ds");
var ra = /* @__PURE__ */ new WeakMap();
var ba = /* @__PURE__ */ __name2((e, a, t) => {
  var o, n, i, c, l, d;
  const r = !t && a.pC;
  t && (a.pC || (a.pC = a.vC));
  let s;
  try {
    t || (t = typeof a.tag == "function" ? cs(e, a) : ze(a.props.children)), ((o = t[0]) == null ? void 0 : o.tag) === "" && t[0][Ra] && (s = t[0][Ra], e[5].push([e, s, a]));
    const f = r ? [...a.pC] : a.vC ? [...a.vC] : void 0, p = [];
    let h;
    for (let m = 0; m < t.length; m++) {
      Array.isArray(t[m]) && t.splice(m, 1, ...t[m].flat());
      let E = us(t[m]);
      if (E) {
        typeof E.tag == "function" && !E.tag[gt] && (be.length > 0 && (E[D][2] = be.map((_) => [_, _.values.at(-1)])), (n = e[5]) != null && n.length && (E[D][3] = e[5].at(-1)));
        let g;
        if (f && f.length) {
          const _ = f.findIndex(z(E) ? (v) => z(v) : E.key !== void 0 ? (v) => v.key === E.key && v.tag === E.tag : (v) => v.tag === E.tag);
          _ !== -1 && (g = f[_], f.splice(_, 1));
        }
        if (g)
          if (z(E))
            g.t !== E.t && (g.t = E.t, g.d = true), E = g;
          else {
            const _ = g.pP = g.props;
            if (g.props = E.props, g.f || (g.f = E.f || a.f), typeof E.tag == "function") {
              const v = g[D][2];
              g[D][2] = E[D][2] || [], g[D][3] = E[D][3], !g.f && ((g.o || g) === E.o || (c = (i = g.tag)[rr]) != null && c.call(i, _, g.props)) && ds(v, g[D][2]) && (g.s = true);
            }
            E = g;
          }
        else if (!z(E) && we) {
          const _ = Ae(we);
          _ && (E.n = _);
        }
        if (!z(E) && !E.s && (ba(e, E), delete E.f), p.push(E), h && !h.s && !E.s)
          for (let _ = h; _ && !z(_); _ = (l = _.vC) == null ? void 0 : l.at(-1))
            _.nN = E;
        h = E;
      }
    }
    a.vR = r ? [...a.vC, ...f || []] : f || [], a.vC = p, r && delete a.pC;
  } catch (f) {
    if (a.f = true, f === Xa) {
      if (s)
        return;
      throw f;
    }
    const [p, h, m] = ((d = a[D]) == null ? void 0 : d[3]) || [];
    if (h) {
      const E = /* @__PURE__ */ __name2(() => sa([0, false, e[2]], m), "E"), g = ra.get(m) || [];
      g.push(E), ra.set(m, g);
      const _ = h(f, () => {
        const v = ra.get(m);
        if (v) {
          const N = v.indexOf(E);
          if (N !== -1)
            return v.splice(N, 1), E();
        }
      });
      if (_) {
        if (e[0] === 1)
          e[1] = true;
        else if (ba(e, m, [_]), (h.length === 1 || e !== p) && m.c) {
          $t(m, m.c, false);
          return;
        }
        throw Xa;
      }
    }
    throw f;
  } finally {
    s && e[5].pop();
  }
}, "ba");
var us = /* @__PURE__ */ __name2((e) => {
  if (!(e == null || typeof e == "boolean")) {
    if (typeof e == "string" || typeof e == "number")
      return { t: e.toString(), d: true };
    if ("vR" in e && (e = { tag: e.tag, props: e.props, key: e.key, f: e.f, type: e.tag, ref: e.props.ref, o: e.o || e }), typeof e.tag == "function")
      e[D] = [0, []];
    else {
      const a = os[e.tag];
      a && (we || (we = vt("")), e.props.children = [{ tag: we, props: { value: e.n = `http://www.w3.org/${a}`, children: e.props.children } }]);
    }
    return e;
  }
}, "us");
var Za = /* @__PURE__ */ __name2((e, a) => {
  var t, r;
  (t = a[D][2]) == null || t.forEach(([s, o]) => {
    s.values.push(o);
  });
  try {
    ba(e, a, void 0);
  } catch {
    return;
  }
  if (a.a) {
    delete a.a;
    return;
  }
  (r = a[D][2]) == null || r.forEach(([s]) => {
    s.values.pop();
  }), (e[0] !== 1 || !e[1]) && $t(a, a.c, false);
}, "Za");
var Le = /* @__PURE__ */ new WeakMap();
var Qa = [];
var sa = /* @__PURE__ */ __name2(async (e, a) => {
  e[5] || (e[5] = []);
  const t = Le.get(a);
  t && t[0](void 0);
  let r;
  const s = new Promise((o) => r = o);
  if (Le.set(a, [r, () => {
    e[2] ? e[2](e, a, (o) => {
      Za(o, a);
    }).then(() => r(a)) : (Za(e, a), r(a));
  }]), Qa.length)
    Qa.at(-1).add(a);
  else {
    await Promise.resolve();
    const o = Le.get(a);
    o && (Le.delete(a), o[1]());
  }
  return s;
}, "sa");
var fs = /* @__PURE__ */ __name2((e, a, t) => ({ tag: He, props: { children: e }, key: t, e: a, p: 1 }), "fs");
var _a = 0;
var kt = 1;
var va = 2;
var Ta = 3;
var Sa = /* @__PURE__ */ new WeakMap();
var zt = /* @__PURE__ */ __name2((e, a) => !e || !a || e.length !== a.length || a.some((t, r) => t !== e[r]), "zt");
var ps = void 0;
var et = [];
var Es = /* @__PURE__ */ __name2((e) => {
  var n;
  const a = /* @__PURE__ */ __name2(() => typeof e == "function" ? e() : e, "a"), t = Ue.at(-1);
  if (!t)
    return [a(), () => {
    }];
  const [, r] = t, s = (n = r[D][1])[_a] || (n[_a] = []), o = r[D][0]++;
  return s[o] || (s[o] = [a(), (i) => {
    const c = ps, l = s[o];
    if (typeof i == "function" && (i = i(l[0])), !Object.is(i, l[0]))
      if (l[0] = i, et.length) {
        const [d, f] = et.at(-1);
        Promise.all([d === 3 ? r : sa([d, false, c], r), f]).then(([p]) => {
          if (!p || !(d === 2 || d === 3))
            return;
          const h = p.vC;
          requestAnimationFrame(() => {
            setTimeout(() => {
              h === p.vC && sa([d === 3 ? 1 : 0, false, c], p);
            });
          });
        });
      } else
        sa([0, false, c], r);
  }]);
}, "Es");
var Ma = /* @__PURE__ */ __name2((e, a) => {
  var i;
  const t = Ue.at(-1);
  if (!t)
    return e;
  const [, r] = t, s = (i = r[D][1])[va] || (i[va] = []), o = r[D][0]++, n = s[o];
  return zt(n == null ? void 0 : n[1], a) ? s[o] = [e, a] : e = s[o][0], e;
}, "Ma");
var hs = /* @__PURE__ */ __name2((e) => {
  const a = Sa.get(e);
  if (a) {
    if (a.length === 2)
      throw a[1];
    return a[0];
  }
  throw e.then((t) => Sa.set(e, [t]), (t) => Sa.set(e, [void 0, t])), e;
}, "hs");
var ms = /* @__PURE__ */ __name2((e, a) => {
  var i;
  const t = Ue.at(-1);
  if (!t)
    return e();
  const [, r] = t, s = (i = r[D][1])[Ta] || (i[Ta] = []), o = r[D][0]++, n = s[o];
  return zt(n == null ? void 0 : n[1], a) && (s[o] = [e(), a]), s[o][0];
}, "ms");
var gs = vt({ pending: false, data: null, method: null, action: null });
var at = /* @__PURE__ */ new Set();
var _s = /* @__PURE__ */ __name2((e) => {
  at.add(e), e.finally(() => at.delete(e));
}, "_s");
var xa = /* @__PURE__ */ __name2((e, a) => ms(() => (t) => {
  let r;
  e && (typeof e == "function" ? r = e(t) || (() => {
    e(null);
  }) : e && "current" in e && (e.current = t, r = /* @__PURE__ */ __name2(() => {
    e.current = null;
  }, "r")));
  const s = a(t);
  return () => {
    s == null || s(), r == null || r();
  };
}, [e]), "xa");
var ve = /* @__PURE__ */ Object.create(null);
var Ke = /* @__PURE__ */ Object.create(null);
var Ge = /* @__PURE__ */ __name2((e, a, t, r, s) => {
  if (a != null && a.itemProp)
    return { tag: e, props: a, type: e, ref: a.ref };
  const o = document.head;
  let { onLoad: n, onError: i, precedence: c, blocking: l, ...d } = a, f = null, p = false;
  const h = Xe[e];
  let m;
  if (h.length > 0) {
    const v = o.querySelectorAll(e);
    e:
      for (const N of v)
        for (const y of Xe[e])
          if (N.getAttribute(y) === a[y]) {
            f = N;
            break e;
          }
    if (!f) {
      const N = h.reduce((y, b) => a[b] === void 0 ? y : `${y}-${b}-${a[b]}`, e);
      p = !Ke[N], f = Ke[N] || (Ke[N] = (() => {
        const y = document.createElement(e);
        for (const b of h)
          a[b] !== void 0 && y.setAttribute(b, a[b]), a.rel && y.setAttribute("rel", a.rel);
        return y;
      })());
    }
  } else
    m = o.querySelectorAll(e);
  c = r ? c ?? "" : void 0, r && (d[Ze] = c);
  const E = Ma((v) => {
    if (h.length > 0) {
      let N = false;
      for (const y of o.querySelectorAll(e)) {
        if (N && y.getAttribute(Ze) !== c) {
          o.insertBefore(v, y);
          return;
        }
        y.getAttribute(Ze) === c && (N = true);
      }
      o.appendChild(v);
    } else if (m) {
      let N = false;
      for (const y of m)
        if (y === v) {
          N = true;
          break;
        }
      N || o.insertBefore(v, o.contains(m[0]) ? m[0] : o.querySelector(e)), m = void 0;
    }
  }, [c]), g = xa(a.ref, (v) => {
    var b;
    const N = h[0];
    if (t === 2 && (v.innerHTML = ""), (p || m) && E(v), !i && !n)
      return;
    let y = ve[b = v.getAttribute(N)] || (ve[b] = new Promise((ge, ie) => {
      v.addEventListener("load", ge), v.addEventListener("error", ie);
    }));
    n && (y = y.then(n)), i && (y = y.catch(i)), y.catch(() => {
    });
  });
  if (s && l === "render") {
    const v = Xe[e][0];
    if (a[v]) {
      const N = a[v], y = ve[N] || (ve[N] = new Promise((b, ge) => {
        E(f), f.addEventListener("load", b), f.addEventListener("error", ge);
      }));
      hs(y);
    }
  }
  const _ = { tag: e, type: e, props: { ...d, ref: g }, ref: g };
  return _.p = t, f && (_.e = f), fs(_, o);
}, "Ge");
var vs = /* @__PURE__ */ __name2((e) => {
  const a = ns(), t = a && Ae(a);
  return t != null && t.endsWith("svg") ? { tag: "title", props: e, type: "title", ref: e.ref } : Ge("title", e, void 0, false, false);
}, "vs");
var Ts = /* @__PURE__ */ __name2((e) => !e || ["src", "async"].some((a) => !e[a]) ? { tag: "script", props: e, type: "script", ref: e.ref } : Ge("script", e, 1, false, true), "Ts");
var Ss = /* @__PURE__ */ __name2((e) => !e || !["href", "precedence"].every((a) => a in e) ? { tag: "style", props: e, type: "style", ref: e.ref } : (e["data-href"] = e.href, delete e.href, Ge("style", e, 2, true, true)), "Ss");
var ys = /* @__PURE__ */ __name2((e) => !e || ["onLoad", "onError"].some((a) => a in e) || e.rel === "stylesheet" && (!("precedence" in e) || "disabled" in e) ? { tag: "link", props: e, type: "link", ref: e.ref } : Ge("link", e, 1, "precedence" in e, true), "ys");
var Rs = /* @__PURE__ */ __name2((e) => Ge("meta", e, void 0, false, false), "Rs");
var Vt = Symbol();
var Os = /* @__PURE__ */ __name2((e) => {
  const { action: a, ...t } = e;
  typeof a != "function" && (t.action = a);
  const [r, s] = Es([null, false]), o = Ma(async (l) => {
    const d = l.isTrusted ? a : l.detail[Vt];
    if (typeof d != "function")
      return;
    l.preventDefault();
    const f = new FormData(l.target);
    s([f, true]);
    const p = d(f);
    p instanceof Promise && (_s(p), await p), s([null, true]);
  }, []), n = xa(e.ref, (l) => (l.addEventListener("submit", o), () => {
    l.removeEventListener("submit", o);
  })), [i, c] = r;
  return r[1] = false, { tag: gs, props: { value: { pending: i !== null, data: i, method: i ? "post" : null, action: i ? a : null }, children: { tag: "form", props: { ...t, ref: n }, type: "form", ref: n } }, f: c };
}, "Os");
var Yt = /* @__PURE__ */ __name2((e, { formAction: a, ...t }) => {
  if (typeof a == "function") {
    const r = Ma((s) => {
      s.preventDefault(), s.currentTarget.form.dispatchEvent(new CustomEvent("submit", { detail: { [Vt]: a } }));
    }, []);
    t.ref = xa(t.ref, (s) => (s.addEventListener("click", r), () => {
      s.removeEventListener("click", r);
    }));
  }
  return { tag: e, props: t, type: e, ref: t.ref };
}, "Yt");
var Ns = /* @__PURE__ */ __name2((e) => Yt("input", e), "Ns");
var Cs = /* @__PURE__ */ __name2((e) => Yt("button", e), "Cs");
Object.assign(Oa, { title: vs, script: Ts, style: Ss, link: ys, meta: Rs, form: Os, input: Ns, button: Cs });
Aa(null);
new TextEncoder();
var Ds = Aa(null);
var bs = /* @__PURE__ */ __name2((e, a, t, r) => (s, o) => {
  const n = "<!DOCTYPE html>", i = t ? $a((l) => t(l, e), { Layout: a, ...o }, s) : s, c = tr`${B(n)}${$a(Ds.Provider, { value: e }, i)}`;
  return e.html(c);
}, "bs");
var ws = /* @__PURE__ */ __name2((e, a) => function(r, s) {
  const o = r.getLayout() ?? mr;
  return e && r.setLayout((n) => e({ ...n, Layout: o }, r)), r.setRenderer(bs(r, o, e)), s();
}, "ws");
var As = ws(({ children: e }) => R("html", { lang: "es", children: [R("head", { children: [R("meta", { charset: "UTF-8" }), R("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }), R("title", { children: "Yo Decreto - Gustavo Adolfo Guerrero Casta\xF1os" }), R("link", { rel: "icon", href: "/static/logo-yo-decreto.png", type: "image/png" }), R("link", { href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap", rel: "stylesheet" }), R("script", { src: "https://cdn.tailwindcss.com" }), R("link", { href: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css", rel: "stylesheet" }), R("script", { src: "https://cdn.jsdelivr.net/npm/chart.js" }), R("script", { src: "https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js" }), R("script", { src: "https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/customParseFormat.js" }), R("script", { src: "https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/isSameOrAfter.js" }), R("script", { src: "https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/isSameOrBefore.js" }), R("script", { src: "https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js" }), R("link", { href: `/static/styles.css?v=${Date.now()}&cb=${Math.random()}&t=${(/* @__PURE__ */ new Date()).getTime()}`, rel: "stylesheet" }), R("script", { dangerouslySetInnerHTML: { __html: `
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
          ` } })] }), R("body", { className: "bg-slate-900 text-white font-sans", children: [e, R("script", { src: `/static/auth.js?v=${Date.now()}&cb=${Math.random()}&t=${(/* @__PURE__ */ new Date()).getTime()}` }), R("script", { src: `/static/app.js?v=${Date.now()}&cb=${Math.random()}&t=${(/* @__PURE__ */ new Date()).getTime()}` }), R("script", { src: `/static/decretos.js?v=${Date.now()}&cb=${Math.random()}&t=${(/* @__PURE__ */ new Date()).getTime()}` }), R("script", { src: `/static/agenda.js?v=${Date.now()}&cb=${Math.random()}&t=${(/* @__PURE__ */ new Date()).getTime()}` }), R("script", { src: `/static/progreso.js?v=${Date.now()}&cb=${Math.random()}&t=${(/* @__PURE__ */ new Date()).getTime()}` }), R("script", { src: `/static/practica.js?v=${Date.now()}&cb=${Math.random()}&t=${(/* @__PURE__ */ new Date()).getTime()}` }), R("script", { src: `/static/ritual-spec.js?v=${Date.now()}&cb=${Math.random()}&t=${(/* @__PURE__ */ new Date()).getTime()}` }), R("script", { src: `/static/acerca.js?v=${Date.now()}&cb=${Math.random()}&t=${(/* @__PURE__ */ new Date()).getTime()}` }), R("script", { src: `/static/ai-chat-widget.js?v=${Date.now()}&cb=${Math.random()}&t=${(/* @__PURE__ */ new Date()).getTime()}` })] })] }));
async function Gt(e, a, t, r, s, o, n) {
  try {
    if (console.log("\u{1F4C5} Sincronizando con agenda:", { accionId: a, titulo: t, proximaRevision: n }), n) {
      const i = n.split("T")[0], c = n.split("T")[1] || "09:00";
      console.log("\u{1F4C5} Creando evento agenda:", { fechaParte: i, horaParte: c });
      const l = await e.prepare(`
        INSERT INTO agenda_eventos (
          accion_id, titulo, descripcion, fecha_evento, hora_evento, prioridad, estado,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'pendiente', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(a, `[Decreto] ${t}`, `${r}${s ? " - " + s : ""}`, i, c, "media").run();
      console.log("\u2705 Evento agenda creado:", l.meta.last_row_id);
    } else
      console.log("\u23ED\uFE0F Sin fecha programada, no se crea evento agenda");
  } catch (i) {
    console.error("\u274C Error al sincronizar con agenda:", i);
  }
}
__name(Gt, "Gt");
__name2(Gt, "Gt");
var j = new X();
j.post("/sincronizar-agenda", async (e) => {
  try {
    console.log("\u{1F504} Iniciando sincronizaci\xF3n completa de agenda...");
    const a = await e.env.DB.prepare(`
      SELECT a.*, d.titulo as decreto_titulo 
      FROM acciones a 
      LEFT JOIN decretos d ON a.decreto_id = d.id
      LEFT JOIN agenda_eventos ae ON a.id = ae.accion_id
      WHERE ae.id IS NULL
    `).all();
    console.log(`\u{1F4CB} Encontradas ${a.results.length} acciones sin sincronizar`);
    let t = 0;
    for (const r of a.results) {
      let s = r.proxima_revision;
      if (!s) {
        const o = /* @__PURE__ */ new Date();
        o.setDate(o.getDate() + 1), s = `${o.toISOString().split("T")[0]}T09:00`, await e.env.DB.prepare(`
          UPDATE acciones SET proxima_revision = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
        `).bind(s, r.id).run();
      }
      await Gt(e.env.DB, r.id, r.titulo, r.que_hacer, r.como_hacerlo, r.tipo, s), t++;
    }
    return console.log(`\u2705 Sincronizaci\xF3n completa: ${t} acciones sincronizadas`), e.json({ success: true, message: `Sincronizaci\xF3n completa: ${t} acciones sincronizadas con agenda`, sincronizadas: t });
  } catch (a) {
    return console.error("\u274C Error en sincronizaci\xF3n:", a), e.json({ success: false, error: "Error al sincronizar agenda", details: a.message }, 500);
  }
});
j.get("/config", async (e) => {
  try {
    const a = await e.env.DB.prepare("SELECT * FROM configuracion WHERE id = ?").bind("main").first();
    return e.json({ success: true, data: a || { nombre_usuario: "Gustavo Adolfo Guerrero Casta\xF1os", frase_vida: "(Agregar frase de vida)" } });
  } catch {
    return e.json({ success: false, error: "Error al obtener configuraci\xF3n" }, 500);
  }
});
j.put("/config", async (e) => {
  try {
    const { nombre_usuario: a, frase_vida: t } = await e.req.json();
    return await e.env.DB.prepare("UPDATE configuracion SET nombre_usuario = ?, frase_vida = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(a, t, "main").run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al actualizar configuraci\xF3n" }, 500);
  }
});
j.get("/", async (e) => {
  try {
    const a = await e.env.DB.prepare("SELECT * FROM decretos ORDER BY created_at DESC").all(), t = { total: a.results.length, empresarial: a.results.filter((s) => s.area === "empresarial").length, material: a.results.filter((s) => s.area === "material").length, humano: a.results.filter((s) => s.area === "humano").length }, r = { empresarial: t.total > 0 ? Math.round(t.empresarial / t.total * 100) : 0, material: t.total > 0 ? Math.round(t.material / t.total * 100) : 0, humano: t.total > 0 ? Math.round(t.humano / t.total * 100) : 0 };
    return e.json({ success: true, data: { decretos: a.results, contadores: t, porcentajes: r } });
  } catch {
    return e.json({ success: false, error: "Error al obtener decretos" }, 500);
  }
});
j.get("/:id", async (e) => {
  try {
    const a = e.req.param("id"), t = await e.env.DB.prepare("SELECT * FROM decretos WHERE id = ?").bind(a).first();
    if (!t)
      return e.json({ success: false, error: "Decreto no encontrado" }, 404);
    const r = await e.env.DB.prepare("SELECT * FROM acciones WHERE decreto_id = ? ORDER BY created_at DESC").bind(a).all(), s = r.results.length, o = r.results.filter((l) => l.estado === "completada").length, n = r.results.filter((l) => l.estado === "en_progreso").length, i = r.results.filter((l) => l.estado === "pendiente").length, c = s > 0 ? Math.round(o / s * 100) : 0;
    return await e.env.DB.prepare("UPDATE decretos SET progreso = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(c, a).run(), e.json({ success: true, data: { decreto: { ...t, progreso: c }, acciones: r.results, metricas: { total_acciones: s, completadas: o, en_progreso: n, pendientes: i, progreso: c } } });
  } catch {
    return e.json({ success: false, error: "Error al obtener decreto" }, 500);
  }
});
j.post("/", async (e) => {
  try {
    const { area: a, titulo: t, sueno_meta: r, descripcion: s, empresa_nombre: o, logo_url: n, imagen_visualizacion: i } = await e.req.json();
    if (!a || !t || !r)
      return e.json({ success: false, error: "Campos requeridos: area, titulo, sueno_meta" }, 400);
    const c = await e.env.DB.prepare("INSERT INTO decretos (area, titulo, sueno_meta, descripcion, empresa_nombre, logo_url, imagen_visualizacion) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(a, t, r, s || "", o || null, n || null, i || null).run();
    return e.json({ success: true, id: c.meta.last_row_id });
  } catch {
    return e.json({ success: false, error: "Error al crear decreto" }, 500);
  }
});
j.put("/:id", async (e) => {
  try {
    const a = e.req.param("id"), { area: t, titulo: r, sueno_meta: s, descripcion: o, empresa_nombre: n, logo_url: i, imagen_visualizacion: c } = await e.req.json();
    return await e.env.DB.prepare("UPDATE decretos SET area = ?, titulo = ?, sueno_meta = ?, descripcion = ?, empresa_nombre = ?, logo_url = ?, imagen_visualizacion = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(t, r, s, o || "", n || null, i || null, c || null, a).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al actualizar decreto" }, 500);
  }
});
j.delete("/:id", async (e) => {
  try {
    const a = e.req.param("id");
    return await e.env.DB.prepare("DELETE FROM decretos WHERE id = ?").bind(a).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al eliminar decreto" }, 500);
  }
});
j.post("/:id/acciones", async (e) => {
  var a;
  try {
    const t = e.req.param("id"), r = await e.req.json();
    console.log("=== BACKEND: RECIBIENDO DATOS ===", { decretoId: t, requestDataKeys: Object.keys(r), hasSubtareas: "subtareas" in r, subtareasLength: ((a = r.subtareas) == null ? void 0 : a.length) || 0, subtareasData: r.subtareas });
    const { titulo: s, que_hacer: o, como_hacerlo: n, resultados: i, tareas_pendientes: c, tipo: l, proxima_revision: d, calificacion: f, decreto_tipo: p, subtareas: h = [] } = r;
    if (console.log("\u{1F3AF} VALIDANDO TIPO DE DECRETO:", { decreto_tipo: p, decretoId: t }), !s || !o)
      return e.json({ success: false, error: "Campos requeridos: titulo, que_hacer" }, 400);
    if (!p || !["Empresarial", "Humano", "Material"].includes(p))
      return e.json({ success: false, error: "El tipo de decreto es obligatorio. Debe ser: Empresarial, Humano o Material" }, 400);
    let m = t;
    if (!t || t === "sin-decreto" || t === "undefined") {
      console.log("\u{1F3AF} Creando decreto autom\xE1tico tipo:", p);
      const _ = await e.env.DB.prepare(`
        SELECT id FROM decretos 
        WHERE area = ? AND titulo LIKE '%[Decreto General]%'
        LIMIT 1
      `).bind(p.toLowerCase()).first();
      _ ? (m = _.id, console.log("\u2705 Usando decreto existente:", m)) : (m = crypto.randomUUID().replace(/-/g, "").substring(0, 32), await e.env.DB.prepare(`
          INSERT INTO decretos (id, area, titulo, sueno_meta, descripcion)
          VALUES (?, ?, ?, ?, ?)
        `).bind(m, p.toLowerCase(), `[Decreto General] ${p}`, `Mi meta es alcanzar el \xE9xito en el \xE1rea ${p.toLowerCase()}`, `Decreto autom\xE1tico para acciones del \xE1rea ${p.toLowerCase()}`).run(), console.log("\u2705 Decreto autom\xE1tico creado:", m));
    }
    const E = crypto.randomUUID().replace(/-/g, "").substring(0, 32);
    if (await e.env.DB.prepare(`
      INSERT INTO acciones (
        id, decreto_id, titulo, que_hacer, como_hacerlo, resultados, 
        tareas_pendientes, tipo, proxima_revision, calificacion, origen
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'manual')
    `).bind(E, m, s, o, n || "", i || "", JSON.stringify(c || []), l || "secundaria", d || null, f || null).run(), console.log("\u2705 Acci\xF3n creada:", E), d) {
      console.log("\u{1F525} FORZANDO creaci\xF3n en agenda para:", { accionId: E, titulo: s, proxima_revision: d });
      const _ = d.split("T")[0], v = d.split("T")[1] || "09:00";
      try {
        const N = await e.env.DB.prepare(`
          INSERT INTO agenda_eventos (
            accion_id, titulo, descripcion, fecha_evento, hora_evento, prioridad, estado,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, 'pendiente', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).bind(E, `[Decreto] ${s}`, `${o}${n ? " - " + n : ""}`, _, v, "media").run();
        console.log("\u{1F680} AGENDA EVENTO CREADO EXITOSAMENTE:", N.meta.last_row_id);
      } catch (N) {
        console.error("\u{1F4A5} ERROR CREANDO AGENDA EVENTO:", N);
      }
    } else
      console.log("\u26A0\uFE0F NO HAY FECHA DE REVISI\xD3N - NO SE CREA EVENTO AGENDA");
    let g = 0;
    if (console.log("=== PROCESANDO SUB-TAREAS ===", { hasSubtareas: !!h, subtareasLength: (h == null ? void 0 : h.length) || 0, subtareasData: h }), h && h.length > 0) {
      console.log(`Procesando ${h.length} sub-tareas...`);
      for (let _ = 0; _ < h.length; _++) {
        const v = h[_];
        if (console.log(`Sub-tarea ${_ + 1}:`, v), v.titulo) {
          const N = crypto.randomUUID().replace(/-/g, "").substring(0, 32);
          let y = v.fecha_programada;
          !y && d && (y = d), console.log(`Creando sub-tarea ${_ + 1} con ID: ${N}`, { titulo: v.titulo, queHacer: v.que_hacer, fecha: y, padreId: E });
          const b = await e.env.DB.prepare(`
            INSERT INTO acciones (
              id, decreto_id, titulo, que_hacer, como_hacerlo, resultados, 
              tipo, proxima_revision, origen, tarea_padre_id, nivel_jerarquia
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(N, t, v.titulo, v.que_hacer, v.como_hacerlo || "", "", "secundaria", y, "subtarea", E, 1).run();
          console.log(`\u2705 Sub-tarea ${_ + 1} creada en BD:`, { success: b.success, changes: b.changes }), y && (await Gt(e.env.DB, N, `[Sub] ${v.titulo}`, v.que_hacer, v.como_hacerlo, "secundaria", y), console.log(`\u2705 Sub-tarea ${_ + 1} sincronizada con agenda`)), g++;
        } else
          console.log(`\u23ED\uFE0F Sub-tarea ${_ + 1} sin t\xEDtulo, saltando`);
      }
    } else
      console.log("No hay sub-tareas para procesar");
    return console.log(`=== SUB-TAREAS COMPLETADAS: ${g} ===`), console.log("=== RESPUESTA FINAL ===", { success: true, accionId: E, subtareasCreadas: g }), e.json({ success: true, id: E, data: { subtareas_creadas: g } });
  } catch (t) {
    return console.error("Error creating action:", t), e.json({ success: false, error: `Error al crear acci\xF3n: ${t.message}` }, 500);
  }
});
j.get("/:decretoId/acciones/:accionId", async (e) => {
  try {
    const a = e.req.param("decretoId"), t = e.req.param("accionId"), r = await e.env.DB.prepare(`
      SELECT 
        a.*,
        d.titulo as decreto_titulo,
        d.sueno_meta,
        d.descripcion as decreto_descripcion,
        d.area
      FROM acciones a
      JOIN decretos d ON a.decreto_id = d.id
      WHERE a.id = ? AND a.decreto_id = ?
    `).bind(t, a).first();
    if (!r)
      return e.json({ success: false, error: "Acci\xF3n no encontrada" }, 404);
    if (r.tareas_pendientes)
      try {
        r.tareas_pendientes = JSON.parse(r.tareas_pendientes);
      } catch {
        r.tareas_pendientes = [];
      }
    return e.json({ success: true, data: r });
  } catch {
    return e.json({ success: false, error: "Error al obtener detalles de la acci\xF3n" }, 500);
  }
});
j.put("/:decretoId/acciones/:accionId", async (e) => {
  try {
    const a = e.req.param("decretoId"), t = e.req.param("accionId"), { titulo: r, que_hacer: s, como_hacerlo: o, resultados: n, tipo: i, proxima_revision: c, calificacion: l } = await e.req.json();
    if (!r || !s)
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
    `).bind(r, s, o || "", n || "", i || "secundaria", c || null, l || null, t, a).run(), await e.env.DB.prepare("SELECT id FROM agenda_eventos WHERE accion_id = ?").bind(t).first() && c) {
      const f = c.split("T")[0], p = c.split("T")[1] || "09:00";
      await e.env.DB.prepare(`
        UPDATE agenda_eventos SET 
          titulo = ?,
          fecha_evento = ?,
          hora_evento = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE accion_id = ?
      `).bind(`[Decreto] ${r}`, f, p, t).run();
    }
    return e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al editar acci\xF3n" }, 500);
  }
});
j.put("/:decretoId/acciones/:accionId/completar", async (e) => {
  try {
    const a = e.req.param("accionId");
    return await e.env.DB.prepare('UPDATE acciones SET estado = "completada", fecha_cierre = date("now"), updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(a).run(), await e.env.DB.prepare('UPDATE agenda_eventos SET estado = "completada", updated_at = CURRENT_TIMESTAMP WHERE accion_id = ?').bind(a).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al completar acci\xF3n" }, 500);
  }
});
j.put("/:decretoId/acciones/:accionId/pendiente", async (e) => {
  try {
    const a = e.req.param("accionId");
    return await e.env.DB.prepare('UPDATE acciones SET estado = "pendiente", fecha_cierre = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(a).run(), await e.env.DB.prepare('UPDATE agenda_eventos SET estado = "pendiente", updated_at = CURRENT_TIMESTAMP WHERE accion_id = ?').bind(a).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al marcar acci\xF3n como pendiente" }, 500);
  }
});
j.put("/:decretoId/acciones/:accionId/iniciar", async (e) => {
  try {
    const a = e.req.param("accionId");
    return await e.env.DB.prepare('UPDATE acciones SET estado = "en_progreso", fecha_cierre = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(a).run(), await e.env.DB.prepare('UPDATE agenda_eventos SET estado = "pendiente", updated_at = CURRENT_TIMESTAMP WHERE accion_id = ?').bind(a).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al iniciar acci\xF3n" }, 500);
  }
});
j.delete("/:decretoId/acciones/:accionId", async (e) => {
  try {
    const a = e.req.param("accionId");
    return await e.env.DB.prepare("DELETE FROM acciones WHERE id = ?").bind(a).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al eliminar acci\xF3n" }, 500);
  }
});
j.get("/:id/sugerencias", async (e) => {
  try {
    const a = e.req.param("id"), t = await e.env.DB.prepare("SELECT * FROM decretos WHERE id = ?").bind(a).first();
    if (!t)
      return e.json({ success: false, error: "Decreto no encontrado" }, 404);
    let r = [];
    switch (t.area) {
      case "empresarial":
        r = ["Analizar competencia directa y ventajas competitivas", "Definir m\xE9tricas clave de rendimiento (KPIs)", "Desarrollar plan de marketing digital", "Establecer alianzas estrat\xE9gicas", "Optimizar procesos operativos"];
        break;
      case "material":
        r = ["Revisar y optimizar presupuesto mensual", "Investigar nuevas oportunidades de inversi\xF3n", "Crear fondo de emergencia", "Diversificar fuentes de ingresos", "Consultar con asesor financiero"];
        break;
      case "humano":
        r = ["Establecer rutina de ejercicio diario", "Practicar meditaci\xF3n mindfulness", "Fortalecer relaciones familiares", "Desarrollar nuevas habilidades", "Cultivar h\xE1bitos de sue\xF1o saludables"];
        break;
      default:
        r = ["Definir objetivos espec\xEDficos y medibles", "Crear plan de acci\xF3n detallado", "Establecer fechas l\xEDmite realistas", "Buscar recursos y herramientas necesarias", "Programar revisiones de progreso"];
    }
    return e.json({ success: true, data: r.map((s, o) => ({ id: `sugerencia_${o + 1}`, texto: s, categoria: t.area })) });
  } catch {
    return e.json({ success: false, error: "Error al generar sugerencias" }, 500);
  }
});
j.get("/:decretoId/acciones/:accionId/arbol", async (e) => {
  try {
    const a = e.req.param("decretoId"), t = e.req.param("accionId"), r = await e.env.DB.prepare(`
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
    `).bind(t, a).all();
    return e.json({ success: true, data: { arbol: r.results, total_tareas: r.results.length } });
  } catch {
    return e.json({ success: false, error: "Error al obtener \xE1rbol de tareas" }, 500);
  }
});
var Jt = new X();
Jt.post("/:decretoId/acciones/:accionId/seguimientos", async (e) => {
  try {
    const a = e.req.param("accionId"), { que_se_hizo: t, como_se_hizo: r, resultados_obtenidos: s, tareas_pendientes: o, proxima_revision: n, calificacion: i } = await e.req.json();
    if (!t || t.trim() === "")
      return e.json({ success: false, error: "Campo requerido: \xBFQu\xE9 se hizo exactamente?" }, 400);
    await e.env.DB.prepare(`
      INSERT INTO seguimientos (
        accion_id, que_se_hizo, como_se_hizo, resultados_obtenidos, 
        tareas_pendientes, proxima_revision, calificacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(a, t, r || "", s || "", JSON.stringify(o || "[]"), n || null, i || 5).run();
    let c = 0;
    if (o && Array.isArray(o) && o.length > 0) {
      for (const l of o)
        if (typeof l == "string" && l.trim()) {
          const d = l.trim(), f = await e.env.DB.prepare("SELECT decreto_id FROM acciones WHERE id = ?").bind(a).first();
          if (f) {
            let p;
            if (n)
              p = n;
            else {
              const m = /* @__PURE__ */ new Date();
              m.setDate(m.getDate() + 1), p = m.toISOString();
            }
            const h = await e.env.DB.prepare(`
              INSERT INTO acciones (
                decreto_id, titulo, que_hacer, como_hacerlo, tipo, 
                proxima_revision, origen
              ) VALUES (?, ?, ?, ?, ?, ?, ?)
              RETURNING id
            `).bind(f.decreto_id, d, "Tarea generada desde seguimiento", `Completar: ${d}`, "secundaria", p, `seguimiento:${a}`).first();
            if (h) {
              const m = h.id;
              let E, g;
              if (n) {
                const v = new Date(n);
                E = v.toISOString().split("T")[0], g = v.toTimeString().split(" ")[0].slice(0, 5);
              } else {
                const v = /* @__PURE__ */ new Date();
                v.setDate(v.getDate() + 1), E = v.toISOString().split("T")[0], g = "09:00";
              }
              const _ = await e.env.DB.prepare(`
                INSERT INTO agenda_eventos (accion_id, titulo, descripcion, fecha_evento, hora_evento, prioridad)
                VALUES (?, ?, ?, ?, ?, ?)
                RETURNING id
              `).bind(m, d, `[Auto-generada] ${d}`, E, g, "media").first();
              _ && await e.env.DB.prepare(`
                  UPDATE acciones SET agenda_event_id = ? WHERE id = ?
                `).bind(_.id, m).run();
            }
            c++;
          }
        }
    }
    return e.json({ success: true, message: `Seguimiento guardado. ${c} tareas nuevas creadas.` });
  } catch (a) {
    return e.json({ success: false, error: "Error al crear seguimiento", details: a.message }, 500);
  }
});
var P = new X();
P.get("/metricas/:fecha", async (e) => {
  try {
    const a = e.req.param("fecha"), t = await e.env.DB.prepare(`
      SELECT 
        ae.*, 
        a.titulo as accion_titulo, 
        a.fecha_creacion as accion_fecha_creacion,
        a.fecha_cierre as accion_fecha_cierre,
        d.area, 
        d.titulo as decreto_titulo
      FROM agenda_eventos ae
      LEFT JOIN acciones a ON ae.accion_id = a.id
      LEFT JOIN decretos d ON a.decreto_id = d.id
      WHERE ae.fecha_evento = ?
      ORDER BY 
        CASE ae.prioridad 
          WHEN 'alta' THEN 1 
          WHEN 'media' THEN 2 
          WHEN 'baja' THEN 3 
          ELSE 2 
        END ASC, 
        ae.hora_evento ASC
    `).bind(a).all(), r = t.results.length, s = t.results.filter((i) => i.estado === "completada").length, o = r - s, n = r > 0 ? Math.round(s / r * 100) : 0;
    return e.json({ success: true, data: { total: r, completadas: s, pendientes: o, progreso: n, tareas: t.results } });
  } catch {
    return e.json({ success: false, error: "Error al obtener m\xE9tricas del d\xEDa" }, 500);
  }
});
P.get("/calendario/:year/:month", async (e) => {
  try {
    const a = e.req.param("year"), t = e.req.param("month"), r = `${a}-${t.padStart(2, "0")}-01`, s = `${a}-${t.padStart(2, "0")}-31`, o = await e.env.DB.prepare(`
      SELECT 
        fecha_evento,
        COUNT(*) as total,
        COUNT(CASE WHEN estado = 'completada' THEN 1 END) as completadas,
        COUNT(CASE WHEN estado = 'pendiente' AND fecha_evento < date('now') THEN 1 END) as vencidas
      FROM agenda_eventos 
      WHERE fecha_evento BETWEEN ? AND ?
      GROUP BY fecha_evento
    `).bind(r, s).all(), n = {};
    for (const i of o.results) {
      const { fecha_evento: c, total: l, completadas: d, vencidas: f } = i;
      d === l ? n[c] = "completado" : f > 0 ? n[c] = "vencido" : l > d && (n[c] = "pendiente");
    }
    return e.json({ success: true, data: { eventos: o.results, estados: n } });
  } catch {
    return e.json({ success: false, error: "Error al obtener calendario" }, 500);
  }
});
P.get("/timeline/:fecha", async (e) => {
  try {
    const a = e.req.param("fecha"), t = await e.env.DB.prepare(`
      SELECT 
        a.id as accion_id,
        a.titulo,
        a.que_hacer,
        a.tipo,
        a.proxima_revision,
        a.calificacion,
        a.estado,
        d.id as decreto_id,
        d.area,
        d.titulo as decreto_titulo,
        d.sueno_meta,
        ae.prioridad,
        ae.estado as agenda_estado,
        ae.hora_evento
      FROM acciones a
      LEFT JOIN decretos d ON a.decreto_id = d.id  
      LEFT JOIN agenda_eventos ae ON ae.accion_id = a.id
      WHERE date(a.proxima_revision) = ?
      ORDER BY 
        CASE COALESCE(ae.prioridad, 'media')
          WHEN 'alta' THEN 1 
          WHEN 'media' THEN 2 
          WHEN 'baja' THEN 3 
          ELSE 2 
        END ASC,
        COALESCE(ae.hora_evento, '09:00') ASC,
        a.created_at ASC
    `).bind(a).all();
    return e.json({ success: true, data: t.results });
  } catch {
    return e.json({ success: false, error: "Error al obtener timeline" }, 500);
  }
});
P.get("/enfoque/:fecha", async (e) => {
  try {
    const a = e.req.param("fecha"), t = await e.env.DB.prepare(`
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
    `).bind(a).first();
    return e.json({ success: true, data: t });
  } catch {
    return e.json({ success: false, error: "Error al obtener enfoque del d\xEDa" }, 500);
  }
});
P.put("/enfoque/:fecha", async (e) => {
  try {
    const a = e.req.param("fecha"), { tarea_id: t } = await e.req.json();
    return await e.env.DB.prepare("UPDATE agenda_eventos SET es_enfoque_dia = 0 WHERE fecha_evento = ?").bind(a).run(), t && await e.env.DB.prepare("UPDATE agenda_eventos SET es_enfoque_dia = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(t).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al establecer enfoque" }, 500);
  }
});
P.post("/tareas", async (e) => {
  try {
    const { decreto_id: a, nombre: t, descripcion: r, fecha_hora: s, tipo: o, prioridad: n } = await e.req.json();
    if (console.log("\u{1F4DD} Creando tarea agenda:", { decreto_id: a, nombre: t, fecha_hora: s, tipo: o, prioridad: n }), !t || !s)
      return e.json({ success: false, error: "Campos requeridos: nombre, fecha_hora" }, 400);
    const i = s.split("T")[0], c = s.split("T")[1] || "09:00", l = await e.env.DB.prepare(`
      INSERT INTO agenda_eventos (
        titulo, 
        descripcion, 
        fecha_evento, 
        hora_evento,
        prioridad,
        estado,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, 'pendiente', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(t, r || "", i, c, n || "media").run();
    return console.log("\u2705 Tarea agenda creada:", l.meta.last_row_id), e.json({ success: true, id: l.meta.last_row_id, message: "Tarea creada correctamente" });
  } catch (a) {
    return console.error("\u274C Error crear tarea:", a), e.json({ success: false, error: `Error al crear tarea: ${a.message}` }, 500);
  }
});
P.put("/tareas/:id/completar", async (e) => {
  try {
    const a = e.req.param("id"), t = (/* @__PURE__ */ new Date()).toISOString();
    return await e.env.DB.prepare(`
      UPDATE agenda_eventos SET 
        estado = "completada", 
        fecha_completada = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(t, a).run(), await e.env.DB.prepare(`
      UPDATE acciones SET 
        estado = "completada", 
        fecha_cierre = date("now"),
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = (
        SELECT accion_id FROM agenda_eventos WHERE id = ?
      )
    `).bind(a).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al completar tarea" }, 500);
  }
});
P.put("/tareas/:id/pendiente", async (e) => {
  try {
    const a = e.req.param("id");
    return await e.env.DB.prepare(`
      UPDATE agenda_eventos SET 
        estado = "pendiente", 
        fecha_completada = NULL,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(a).run(), await e.env.DB.prepare(`
      UPDATE acciones SET 
        estado = "pendiente", 
        fecha_cierre = NULL,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = (
        SELECT accion_id FROM agenda_eventos WHERE id = ?
      )
    `).bind(a).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al marcar tarea como pendiente" }, 500);
  }
});
P.delete("/tareas/:id", async (e) => {
  try {
    const a = e.req.param("id"), t = await e.env.DB.prepare("SELECT accion_id FROM agenda_eventos WHERE id = ?").bind(a).first();
    if (await e.env.DB.prepare("DELETE FROM agenda_eventos WHERE id = ?").bind(a).run(), t != null && t.accion_id) {
      const r = await e.env.DB.prepare("SELECT origen FROM acciones WHERE id = ?").bind(t.accion_id).first();
      (r == null ? void 0 : r.origen) === "agenda" && await e.env.DB.prepare("DELETE FROM acciones WHERE id = ?").bind(t.accion_id).run();
    }
    return e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al eliminar tarea" }, 500);
  }
});
P.get("/pendientes/:fecha", async (e) => {
  try {
    const a = e.req.param("fecha"), t = await e.env.DB.prepare(`
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
    `).bind(a).all();
    return e.json({ success: true, data: t.results });
  } catch {
    return e.json({ success: false, error: "Error al obtener tareas pendientes" }, 500);
  }
});
P.get("/tareas/:id", async (e) => {
  try {
    const a = e.req.param("id"), t = await e.env.DB.prepare(`
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
    `).bind(a).first();
    if (!t)
      return e.json({ success: false, error: "Tarea no encontrada" }, 404);
    if (t.tareas_pendientes)
      try {
        t.tareas_pendientes = JSON.parse(t.tareas_pendientes);
      } catch {
        t.tareas_pendientes = [];
      }
    return e.json({ success: true, data: t });
  } catch {
    return e.json({ success: false, error: "Error al obtener detalles de la tarea" }, 500);
  }
});
P.put("/tareas/:id", async (e) => {
  try {
    const a = e.req.param("id"), { titulo: t, descripcion: r, fecha_hora: s, que_hacer: o, como_hacerlo: n, resultados: i, tipo: c, calificacion: l, prioridad: d } = await e.req.json();
    if (!t || !s)
      return e.json({ success: false, error: "Campos requeridos: titulo, fecha_hora" }, 400);
    const f = s.split("T")[0], p = s.split("T")[1] || "09:00";
    await e.env.DB.prepare(`
      UPDATE agenda_eventos SET 
        titulo = ?,
        descripcion = ?,
        fecha_evento = ?,
        hora_evento = ?,
        prioridad = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(t, r || "", f, p, d || "media", a).run();
    const h = await e.env.DB.prepare("SELECT accion_id FROM agenda_eventos WHERE id = ?").bind(a).first();
    return h != null && h.accion_id && await e.env.DB.prepare(`
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
      `).bind(t, o || "", n || "", i || "", c || "secundaria", s, l || null, h.accion_id).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al editar tarea" }, 500);
  }
});
P.get("/filtros", async (e) => {
  try {
    const { fecha_desde: a, fecha_hasta: t, incluir_hoy: r, incluir_futuras: s, incluir_completadas: o, incluir_pendientes: n, decreto_id: i, area: c } = e.req.query();
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
    r === "true" && (l += " AND ae.fecha_evento = date('now')"), s === "true" && (l += " AND ae.fecha_evento > date('now')"), a && t && (l += " AND ae.fecha_evento BETWEEN ? AND ?", d.push(a, t));
    const f = [];
    o === "true" && f.push("completada"), n === "true" && f.push("pendiente"), f.length > 0 && (l += ` AND ae.estado IN (${f.map(() => "?").join(",")})`, d.push(...f)), i && i !== "todos" && (l += " AND d.id = ?", d.push(i)), c && c !== "todos" && (l += " AND d.area = ?", d.push(c)), l += " ORDER BY ae.fecha_evento DESC, ae.hora_evento ASC";
    const p = await e.env.DB.prepare(l).bind(...d).all();
    return e.json({ success: true, data: p.results });
  } catch {
    return e.json({ success: false, error: "Error al filtrar tareas" }, 500);
  }
});
P.post("/tareas/:id/seguimiento", async (e) => {
  try {
    const a = e.req.param("id"), t = await e.req.json(), r = await e.env.DB.prepare("SELECT accion_id FROM agenda_eventos WHERE id = ?").bind(a).first();
    if (!(r != null && r.accion_id))
      return e.json({ success: false, error: "No se encontr\xF3 acci\xF3n asociada" }, 404);
    const { que_se_hizo: s, como_se_hizo: o, resultados_obtenidos: n, tareas_pendientes: i, proxima_revision: c, calificacion: l } = t;
    return await e.env.DB.prepare(`
      INSERT INTO seguimientos (
        accion_id, que_se_hizo, como_se_hizo, resultados_obtenidos, 
        tareas_pendientes, proxima_revision, calificacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(r.accion_id, s, o, n, JSON.stringify(i || []), c || null, l || null).run(), await e.env.DB.prepare(`
      UPDATE acciones SET 
        resultados = ?, 
        tareas_pendientes = ?, 
        proxima_revision = ?,
        calificacion = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(n, JSON.stringify(i || []), c || null, l || null, r.accion_id).run(), e.json({ success: true, message: "Seguimiento guardado desde agenda" });
  } catch {
    return e.json({ success: false, error: "Error al crear seguimiento" }, 500);
  }
});
P.get("/panoramica-pendientes", async (e) => {
  try {
    const { area: a } = e.req.query();
    console.log("\u{1F50D} Obteniendo panor\xE1mica pendientes, \xE1rea:", a);
    let t = `
      SELECT 
        a.id,
        a.titulo,
        a.que_hacer,
        a.tipo,
        a.fecha_creacion,
        a.proxima_revision,
        a.calificacion,
        d.titulo as decreto_titulo,
        d.area,
        d.sueno_meta,
        d.id as decreto_id,
        -- Obtener informaci\xF3n del evento en agenda si existe
        ae.fecha_evento,
        ae.hora_evento,
        ae.prioridad,
        ae.estado as estado_agenda,
        ae.id as evento_agenda_id
      FROM acciones a
      LEFT JOIN decretos d ON a.decreto_id = d.id
      LEFT JOIN agenda_eventos ae ON a.id = ae.accion_id
      WHERE a.estado = 'pendiente'
    `;
    const r = [];
    a && a !== "todos" && (t += " AND d.area = ?", r.push(a)), t += `
      ORDER BY 
        a.fecha_creacion ASC,
        a.proxima_revision ASC NULLS LAST,
        a.created_at ASC
    `;
    const o = (await e.env.DB.prepare(t).bind(...r).all()).results.map((l) => ({ ...l, dias_desde_creacion: Math.floor((Date.now() - new Date(l.fecha_creacion).getTime()) / (1e3 * 60 * 60 * 24)), urgencia: Is(l), fecha_creacion_formatted: tt(l.fecha_creacion), proxima_revision_formatted: l.proxima_revision ? tt(l.proxima_revision) : null })), n = { total: o.length, por_area: {}, antiguedad_promedio: 0, con_revision_pendiente: 0, sin_revision: 0 }, i = {};
    let c = 0;
    return o.forEach((l) => {
      const d = l.area || "sin_area";
      i[d] = (i[d] || 0) + 1, c += l.dias_desde_creacion, l.proxima_revision ? n.con_revision_pendiente++ : n.sin_revision++;
    }), n.por_area = i, n.antiguedad_promedio = o.length > 0 ? Math.round(c / o.length) : 0, console.log("\u2705 Panor\xE1mica obtenida:", { total: n.total, areas: n.por_area }), e.json({ success: true, data: { acciones: o, estadisticas: n } });
  } catch (a) {
    return console.error("\u274C Error panor\xE1mica pendientes:", a), e.json({ success: false, error: `Error al obtener panor\xE1mica de pendientes: ${a.message}` }, 500);
  }
});
function Is(e) {
  const a = /* @__PURE__ */ new Date(), t = Math.floor((a.getTime() - new Date(e.fecha_creacion).getTime()) / (1e3 * 60 * 60 * 24));
  if (e.proxima_revision) {
    const r = new Date(e.proxima_revision), s = Math.floor((r.getTime() - a.getTime()) / (1e3 * 60 * 60 * 24));
    if (s < 0)
      return "vencida";
    if (s <= 1)
      return "urgente";
    if (s <= 3)
      return "importante";
  }
  return t > 14 ? "muy_antigua" : t > 7 ? "antigua" : "normal";
}
__name(Is, "Is");
__name2(Is, "Is");
function tt(e) {
  const a = new Date(e), t = { year: "numeric", month: "short", day: "numeric" };
  return a.toLocaleDateString("es-ES", t);
}
__name(tt, "tt");
__name2(tt, "tt");
var ne = new X();
ne.get("/metricas", async (e) => {
  try {
    const a = await e.env.DB.prepare("SELECT COUNT(*) as total FROM acciones").first(), t = await e.env.DB.prepare('SELECT COUNT(*) as total FROM acciones WHERE estado = "completada"').first(), r = await e.env.DB.prepare('SELECT COUNT(*) as total FROM acciones WHERE estado IN ("pendiente", "en_progreso")').first(), s = (a == null ? void 0 : a.total) || 0, o = (t == null ? void 0 : t.total) || 0, n = (r == null ? void 0 : r.total) || 0, i = s > 0 ? Math.round(o / s * 100) : 0;
    return e.json({ success: true, data: { total_tareas: s, completadas: o, pendientes: n, progreso_global: i } });
  } catch {
    return e.json({ success: false, error: "Error al obtener m\xE9tricas" }, 500);
  }
});
ne.get("/por-decreto", async (e) => {
  try {
    const a = await e.env.DB.prepare(`
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
    `).all(), t = { empresarial: [], material: [], humano: [] };
    for (const s of a.results)
      t[s.area] && t[s.area].push(s);
    const r = { empresarial: { total_acciones: t.empresarial.reduce((s, o) => s + o.total_acciones, 0), completadas: t.empresarial.reduce((s, o) => s + o.completadas, 0), progreso: 0 }, material: { total_acciones: t.material.reduce((s, o) => s + o.total_acciones, 0), completadas: t.material.reduce((s, o) => s + o.completadas, 0), progreso: 0 }, humano: { total_acciones: t.humano.reduce((s, o) => s + o.total_acciones, 0), completadas: t.humano.reduce((s, o) => s + o.completadas, 0), progreso: 0 } };
    return Object.keys(r).forEach((s) => {
      const o = r[s];
      o.progreso = o.total_acciones > 0 ? Math.round(o.completadas / o.total_acciones * 100) : 0;
    }), e.json({ success: true, data: { decretos: a.results, por_area: t, totales_por_area: r } });
  } catch {
    return e.json({ success: false, error: "Error al obtener progreso por decreto" }, 500);
  }
});
ne.get("/timeline", async (e) => {
  try {
    const { periodo: a } = e.req.query();
    let t = "";
    const r = [];
    switch (a) {
      case "dia":
        t = 'WHERE a.fecha_cierre = date("now")';
        break;
      case "semana":
        t = 'WHERE a.fecha_cierre >= date("now", "-7 days")';
        break;
      case "mes":
        t = 'WHERE a.fecha_cierre >= date("now", "-30 days")';
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
      ${t}
      AND a.estado = 'completada'
      ORDER BY a.fecha_cierre DESC, a.updated_at DESC
      LIMIT 50
    `).bind(...r).all();
    return e.json({ success: true, data: s.results });
  } catch {
    return e.json({ success: false, error: "Error al obtener timeline" }, 500);
  }
});
ne.get("/evolucion", async (e) => {
  try {
    const { dias: a = 30 } = e.req.query(), t = await e.env.DB.prepare(`
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
    `).bind(a).all();
    return e.json({ success: true, data: t.results });
  } catch {
    return e.json({ success: false, error: "Error al obtener evoluci\xF3n" }, 500);
  }
});
ne.get("/distribucion", async (e) => {
  try {
    const a = await e.env.DB.prepare(`
      SELECT 
        d.area,
        COUNT(a.id) as total_acciones,
        COUNT(CASE WHEN a.estado = 'completada' THEN 1 END) as completadas
      FROM decretos d
      LEFT JOIN acciones a ON d.id = a.decreto_id
      GROUP BY d.area
    `).all();
    return e.json({ success: true, data: a.results });
  } catch {
    return e.json({ success: false, error: "Error al obtener distribuci\xF3n" }, 500);
  }
});
ne.get("/reporte", async (e) => {
  try {
    const a = await e.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_tareas,
        COUNT(CASE WHEN estado = 'completada' THEN 1 END) as completadas,
        COUNT(CASE WHEN estado IN ('pendiente', 'en_progreso') THEN 1 END) as pendientes,
        COUNT(DISTINCT decreto_id) as total_decretos
      FROM acciones
    `).first(), t = await e.env.DB.prepare(`
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
    `).all(), r = await e.env.DB.prepare(`
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
    `).all(), s = await e.env.DB.prepare("SELECT * FROM configuracion WHERE id = ?").bind("main").first(), o = (/* @__PURE__ */ new Date()).toISOString().split("T")[0], n = (a == null ? void 0 : a.total_tareas) > 0 ? Math.round(((a == null ? void 0 : a.completadas) || 0) / a.total_tareas * 100) : 0;
    return e.json({ success: true, data: { fecha_reporte: o, usuario: s || { nombre_usuario: "Usuario", frase_vida: "" }, metricas: { ...a, progreso_global: n }, decretos: t.results, ultimos_logros: r.results } });
  } catch {
    return e.json({ success: false, error: "Error al generar reporte" }, 500);
  }
});
ne.get("/estadisticas", async (e) => {
  try {
    const a = await e.env.DB.prepare("SELECT AVG(calificacion) as promedio FROM acciones WHERE calificacion IS NOT NULL").first(), t = await e.env.DB.prepare(`
      SELECT 
        tipo,
        COUNT(*) as cantidad,
        COUNT(CASE WHEN estado = 'completada' THEN 1 END) as completadas
      FROM acciones
      GROUP BY tipo
    `).all(), r = await e.env.DB.prepare(`
      SELECT 
        fecha_cierre,
        COUNT(*) as tareas_completadas
      FROM acciones
      WHERE estado = 'completada' AND fecha_cierre IS NOT NULL
      GROUP BY fecha_cierre
      ORDER BY tareas_completadas DESC
      LIMIT 5
    `).all();
    return e.json({ success: true, data: { promedio_calificacion: (a == null ? void 0 : a.promedio) || 0, por_tipo: t.results, dias_mas_productivos: r.results } });
  } catch {
    return e.json({ success: false, error: "Error al obtener estad\xEDsticas" }, 500);
  }
});
var I = new X();
I.get("/rutinas", async (e) => {
  try {
    const a = await e.env.DB.prepare(`
      SELECT * FROM rutinas_matutinas 
      WHERE activa = 1 
      ORDER BY orden_display ASC
    `).all(), t = e.req.query("fecha_simulada"), r = t || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    console.log(`\u{1F4C5} Verificando rutinas para fecha: ${r}${t ? " (SIMULADA)" : ""}`);
    const s = [];
    for (const o of a.results) {
      const n = await e.env.DB.prepare(`
        SELECT * FROM rutinas_completadas 
        WHERE rutina_id = ? AND fecha_completada = ?
      `).bind(o.id, r).first();
      s.push({ ...o, completada_hoy: !!n, detalle_hoy: n || null });
    }
    return e.json({ success: true, data: s });
  } catch {
    return e.json({ success: false, error: "Error al obtener rutinas" }, 500);
  }
});
I.post("/rutinas/:id/completar", async (e) => {
  try {
    const a = e.req.param("id"), { tiempo_invertido: t, notas: r } = await e.req.json(), s = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    return await e.env.DB.prepare(`
      INSERT OR REPLACE INTO rutinas_completadas 
      (rutina_id, fecha_completada, tiempo_invertido, notas)
      VALUES (?, ?, ?, ?)
    `).bind(a, s, t || null, r || "").run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al completar rutina" }, 500);
  }
});
I.delete("/rutinas/:id/completar", async (e) => {
  try {
    const a = e.req.param("id"), t = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    return await e.env.DB.prepare(`
      DELETE FROM rutinas_completadas 
      WHERE rutina_id = ? AND fecha_completada = ?
    `).bind(a, t).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al desmarcar rutina" }, 500);
  }
});
I.get("/rutinas/progreso", async (e) => {
  try {
    const { dias: a = 7 } = e.req.query(), t = await e.env.DB.prepare(`
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
    `).bind(a, a, a).all();
    return e.json({ success: true, data: t.results });
  } catch {
    return e.json({ success: false, error: "Error al obtener progreso de rutinas" }, 500);
  }
});
I.get("/rutinas/progreso-dia", async (e) => {
  try {
    const a = (/* @__PURE__ */ new Date()).toISOString().split("T")[0], t = await e.env.DB.prepare("SELECT COUNT(*) as total FROM rutinas_matutinas WHERE activa = 1").first(), r = await e.env.DB.prepare(`
      SELECT COUNT(*) as completadas 
      FROM rutinas_completadas rc
      JOIN rutinas_matutinas rm ON rc.rutina_id = rm.id
      WHERE rc.fecha_completada = ? AND rm.activa = 1
    `).bind(a).first(), s = (t == null ? void 0 : t.total) || 0, o = (r == null ? void 0 : r.completadas) || 0, n = s > 0 ? Math.round(o / s * 100) : 0;
    return e.json({ success: true, data: { total_rutinas: s, completadas_hoy: o, porcentaje_progreso: n, fecha: a } });
  } catch {
    return e.json({ success: false, error: "Error al obtener progreso del d\xEDa" }, 500);
  }
});
I.get("/rutinas/progreso-dia/:fecha", async (e) => {
  try {
    const a = e.req.param("fecha") || (/* @__PURE__ */ new Date()).toISOString().split("T")[0], t = await e.env.DB.prepare("SELECT COUNT(*) as total FROM rutinas_matutinas WHERE activa = 1").first(), r = await e.env.DB.prepare(`
      SELECT COUNT(*) as completadas 
      FROM rutinas_completadas rc
      JOIN rutinas_matutinas rm ON rc.rutina_id = rm.id
      WHERE rc.fecha_completada = ? AND rm.activa = 1
    `).bind(a).first(), s = (t == null ? void 0 : t.total) || 0, o = (r == null ? void 0 : r.completadas) || 0, n = s > 0 ? Math.round(o / s * 100) : 0;
    return e.json({ success: true, data: { total_rutinas: s, completadas_hoy: o, porcentaje_progreso: n, fecha: a } });
  } catch {
    return e.json({ success: false, error: "Error al obtener progreso del d\xEDa" }, 500);
  }
});
I.get("/afirmaciones", async (e) => {
  try {
    const { categoria: a, favoritas: t } = e.req.query();
    let r = "SELECT * FROM afirmaciones WHERE 1=1";
    const s = [];
    a && a !== "todas" && (r += " AND categoria = ?", s.push(a)), t === "true" && (r += " AND es_favorita = 1"), r += " ORDER BY es_favorita DESC, veces_usada DESC, created_at DESC";
    const o = await e.env.DB.prepare(r).bind(...s).all();
    return e.json({ success: true, data: o.results });
  } catch {
    return e.json({ success: false, error: "Error al obtener afirmaciones" }, 500);
  }
});
I.post("/afirmaciones", async (e) => {
  try {
    const { texto: a, categoria: t } = await e.req.json();
    if (!a || !t)
      return e.json({ success: false, error: "Texto y categor\xEDa son requeridos" }, 400);
    const r = await e.env.DB.prepare(`
      INSERT INTO afirmaciones (texto, categoria, es_favorita, veces_usada)
      VALUES (?, ?, 0, 0)
    `).bind(a, t).run();
    return e.json({ success: true, id: r.meta.last_row_id });
  } catch {
    return e.json({ success: false, error: "Error al crear afirmaci\xF3n" }, 500);
  }
});
I.put("/afirmaciones/:id/favorita", async (e) => {
  try {
    const a = e.req.param("id"), { es_favorita: t } = await e.req.json();
    return await e.env.DB.prepare(`
      UPDATE afirmaciones SET 
        es_favorita = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(t ? 1 : 0, a).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al actualizar favorita" }, 500);
  }
});
I.post("/afirmaciones/:id/usar", async (e) => {
  try {
    const a = e.req.param("id");
    return await e.env.DB.prepare(`
      UPDATE afirmaciones SET 
        veces_usada = veces_usada + 1,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(a).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al marcar como usada" }, 500);
  }
});
I.delete("/afirmaciones/:id", async (e) => {
  try {
    const a = e.req.param("id");
    return await e.env.DB.prepare("DELETE FROM afirmaciones WHERE id = ?").bind(a).run(), e.json({ success: true });
  } catch {
    return e.json({ success: false, error: "Error al eliminar afirmaci\xF3n" }, 500);
  }
});
I.get("/afirmaciones/del-dia", async (e) => {
  try {
    const a = await e.env.DB.prepare(`
      SELECT * FROM afirmaciones 
      WHERE es_favorita = 1 
      ORDER BY RANDOM() 
      LIMIT 2
    `).all(), t = await e.env.DB.prepare(`
      SELECT * FROM afirmaciones 
      WHERE es_favorita = 0 
      ORDER BY RANDOM() 
      LIMIT 3
    `).all(), r = [...a.results, ...t.results];
    return e.json({ success: true, data: r });
  } catch {
    return e.json({ success: false, error: "Error al obtener afirmaciones del d\xEDa" }, 500);
  }
});
I.post("/afirmaciones/generar", async (e) => {
  try {
    const { categoria: a = "general" } = await e.req.json(), t = { empresarial: ["Soy un l\xEDder natural que inspira confianza y respeto en mi equipo", "Mis ideas innovadoras transforman mi empresa y generan abundantes resultados", "Tengo la capacidad de tomar decisiones sabias que impulsan mi \xE9xito empresarial", "Mi negocio crece exponencialmente mientras mantengo mi integridad y valores", "Soy un im\xE1n para las oportunidades de negocio perfectas en el momento ideal", "Mi visi\xF3n empresarial se materializa con facilidad y genera impacto positivo", "Lidero con sabidur\xEDa y compasi\xF3n, creando un ambiente de trabajo pr\xF3spero", "Mis habilidades de comunicaci\xF3n abren puertas a alianzas estrat\xE9gicas valiosas"], material: ["La abundancia fluye hacia m\xED desde m\xFAltiples fuentes de manera constante", "Soy un canal abierto para recibir prosperidad en todas sus formas", "Mi relaci\xF3n con el dinero es saludable, positiva y equilibrada", "Tengo todo lo que necesito y m\xE1s para vivir una vida plena y pr\xF3spera", "Las oportunidades de generar ingresos aparecen naturalmente en mi camino", "Merece vivir en abundancia y celebro cada manifestaci\xF3n de prosperidad", "Mi valor y talento se compensan generosamente en el mercado", "Creo riqueza mientras contribuyo positivamente al bienestar de otros"], humano: ["Soy digno/a de amor incondicional y atraigo relaciones armoniosas a mi vida", "Mi coraz\xF3n est\xE1 abierto para dar y recibir amor en todas sus formas", "Cultivo relaciones basadas en el respeto mutuo, la comprensi\xF3n y la alegr\xEDa", "Me rodeo de personas que me apoyan y celebran mi crecimiento personal", "Comunico mis sentimientos con claridad, compasi\xF3n y autenticidad", "Mi presencia inspira calma, alegr\xEDa y confianza en quienes me rodean", "Perdono f\xE1cilmente y libero cualquier resentimiento que no me sirve", "Cada d\xEDa fortalezco los v\xEDnculos importantes en mi vida con amor y gratitud"], general: ["Cada d\xEDa me convierto en la mejor versi\xF3n de m\xED mismo/a con alegr\xEDa y gratitud", "Conf\xEDo plenamente en mi sabidur\xEDa interior para guiar mis decisiones", "Soy resiliente y transformo cada desaf\xEDo en una oportunidad de crecimiento", "Mi vida est\xE1 llena de prop\xF3sito, significado y experiencias enriquecedoras", "Irradio paz, amor y luz positiva donde quiera que vaya", "Soy el/la arquitecto/a consciente de mi realidad y creo con intenci\xF3n clara", "Mi mente es clara, mi coraz\xF3n est\xE1 abierto y mi esp\xEDritu es libre", "Celebro mis logros y aprendo valiosas lecciones de cada experiencia"] }, r = t[a] || t.general, s = r[Math.floor(Math.random() * r.length)], o = await e.env.DB.prepare(`
      INSERT INTO afirmaciones (texto, categoria, es_favorita, veces_usada)
      VALUES (?, ?, 0, 0)
    `).bind(s, a).run(), n = await e.env.DB.prepare(`
      SELECT * FROM afirmaciones WHERE rowid = ?
    `).bind(o.meta.last_row_id).first();
    return e.json({ success: true, data: n });
  } catch (a) {
    return console.error("Error al generar afirmaci\xF3n:", a), e.json({ success: false, error: "Error al generar afirmaci\xF3n" }, 500);
  }
});
I.get("/rutinas/:id/preguntas", async (e) => {
  try {
    const a = e.req.param("id"), t = await e.env.DB.prepare(`
      SELECT * FROM rutinas_preguntas 
      WHERE rutina_id = ? AND activa = 1
      ORDER BY orden ASC
    `).bind(a).all();
    return e.json({ success: true, data: t.results });
  } catch {
    return e.json({ success: false, error: "Error al obtener preguntas de rutina" }, 500);
  }
});
I.post("/rutinas/:id/completar-detallado", async (e) => {
  try {
    const a = e.req.param("id"), { tiempo_invertido: t, notas: r, respuestas: s, estado_animo_antes: o, estado_animo_despues: n, calidad_percibida: i, ubicacion: c } = await e.req.json(), l = (/* @__PURE__ */ new Date()).toISOString().split("T")[0], d = (/* @__PURE__ */ new Date()).toISOString();
    return await e.env.DB.prepare(`
      INSERT OR REPLACE INTO rutinas_completadas 
      (rutina_id, fecha_completada, tiempo_invertido, notas, respuestas_json, 
       estado_animo_antes, estado_animo_despues, calidad_percibida, ubicacion, 
       tiempo_inicio, tiempo_fin)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(a, l, t || null, r || "", JSON.stringify(s || {}), o || null, n || null, i || null, c || null, d, (/* @__PURE__ */ new Date()).toISOString()).run(), await e.env.DB.prepare(`
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
  } catch (a) {
    return console.error("Error al completar rutina detallada:", a), e.json({ success: false, error: "Error al completar rutina" }, 500);
  }
});
I.get("/rutinas/analytics", async (e) => {
  try {
    const { dias: a = 30 } = e.req.query(), t = await e.env.DB.prepare(`
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
    `).bind(a).all(), r = await e.env.DB.prepare(`
      SELECT 
        fecha,
        rutinas_completadas,
        rutinas_totales,
        porcentaje_completado,
        tiempo_total_minutos
      FROM rutinas_estadisticas_diarias
      WHERE fecha >= date('now', '-' || ? || ' days')
      ORDER BY fecha DESC
    `).bind(a).all(), s = await e.env.DB.prepare(`
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
    return e.json({ success: true, data: { tendencias_por_rutina: t.results, progreso_diario: r.results, racha_actual: (s == null ? void 0 : s.racha) || 0, resumen: { dias_analizados: a, fecha_inicio: new Date(Date.now() - a * 24 * 60 * 60 * 1e3).toISOString().split("T")[0], fecha_fin: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] } } });
  } catch (a) {
    return console.error("Error al obtener analytics:", a), e.json({ success: false, error: "Error al obtener analytics" }, 500);
  }
});
I.get("/rutinas/progreso-dia/:fecha", async (e) => {
  try {
    const a = e.req.param("fecha"), t = await e.env.DB.prepare(`
      SELECT COUNT(*) as total
      FROM rutinas_matutinas
      WHERE activa = 1
    `).first(), r = await e.env.DB.prepare(`
      SELECT COUNT(*) as completadas
      FROM rutinas_completadas
      WHERE fecha_completada = ?
    `).bind(a).first(), s = (t == null ? void 0 : t.total) || 0, o = (r == null ? void 0 : r.completadas) || 0, n = s > 0 ? Math.round(o / s * 100) : 0;
    return e.json({ success: true, data: { fecha: a, total_rutinas: s, rutinas_completadas: o, rutinas_pendientes: s - o, porcentaje_progreso: n } });
  } catch {
    return e.json({ success: false, error: "Error al obtener progreso del d\xEDa" }, 500);
  }
});
I.get("/estadisticas", async (e) => {
  try {
    const a = await e.env.DB.prepare(`
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
    `).first(), t = await e.env.DB.prepare(`
      SELECT categoria, COUNT(*) as cantidad
      FROM afirmaciones
      GROUP BY categoria
      ORDER BY cantidad DESC
    `).all(), r = await e.env.DB.prepare(`
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
    return e.json({ success: true, data: { racha_actual: (a == null ? void 0 : a.racha) || 0, afirmaciones_por_categoria: t.results, rutina_mas_completada: r, progreso_semanal: s.results } });
  } catch {
    return e.json({ success: false, error: "Error al obtener estad\xEDsticas" }, 500);
  }
});
var Ie = new X();
Ie.get("/sesiones/:fecha", async (e) => {
  try {
    const a = e.req.param("fecha"), t = await e.env.DB.prepare(`
      SELECT r.*, d.titulo as decreto_titulo, d.logo_url
      FROM ritual_spec_sessions r
      LEFT JOIN decretos d ON r.decreto_id = d.id
      WHERE r.fecha = ?
      ORDER BY r.created_at DESC
    `).bind(a).all();
    return e.json({ success: true, data: t.results });
  } catch (a) {
    return console.error("Error fetching ritual sessions:", a), e.json({ success: false, error: "Error al obtener sesiones del ritual" }, 500);
  }
});
Ie.get("/estadisticas", async (e) => {
  try {
    const a = await e.env.DB.prepare(`
      SELECT
        COUNT(*) as total_sesiones,
        SUM(completado) as sesiones_completadas,
        SUM(CASE WHEN momento = 'manana' THEN 1 ELSE 0 END) as sesiones_manana,
        SUM(CASE WHEN momento = 'noche' THEN 1 ELSE 0 END) as sesiones_noche,
        AVG(duracion_segundos) as duracion_promedio
      FROM ritual_spec_sessions
      WHERE fecha >= date('now', '-30 days')
    `).first(), t = await e.env.DB.prepare(`
      SELECT DISTINCT fecha
      FROM ritual_spec_sessions
      WHERE fecha >= date('now', '-60 days') AND completado = 1
      ORDER BY fecha DESC
    `).all();
    let r = 0, o = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    for (const n of t.results)
      if (n.fecha === o) {
        r++;
        const i = new Date(o);
        i.setDate(i.getDate() - 1), o = i.toISOString().split("T")[0];
      } else
        break;
    return e.json({ success: true, data: { ...a, racha_dias: r } });
  } catch (a) {
    return console.error("Error fetching ritual stats:", a), e.json({ success: false, error: "Error al obtener estad\xEDsticas" }, 500);
  }
});
Ie.post("/sesiones", async (e) => {
  try {
    const { decreto_id: a, momento: t } = await e.req.json();
    if (!t || !["manana", "noche"].includes(t))
      return e.json({ success: false, error: 'Momento debe ser "manana" o "noche"' }, 400);
    const r = crypto.randomUUID().replace(/-/g, "").substring(0, 32), s = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    return await e.env.DB.prepare(`
      INSERT INTO ritual_spec_sessions (id, decreto_id, fecha, momento)
      VALUES (?, ?, ?, ?)
    `).bind(r, a || null, s, t).run(), e.json({ success: true, session_id: r });
  } catch (a) {
    return console.error("Error creating ritual session:", a), e.json({ success: false, error: "Error al crear sesi\xF3n del ritual" }, 500);
  }
});
Ie.put("/sesiones/:id", async (e) => {
  try {
    const a = e.req.param("id"), t = await e.req.json(), { respiracion_completada: r, escena_1: s, escena_2: o, frase_certeza: n, accion_cosecha: i, obstaculo: c, plan_if_then: l, duracion_segundos: d, completado: f } = t;
    return await e.env.DB.prepare(`
      UPDATE ritual_spec_sessions SET
        respiracion_completada = ?,
        escena_1 = ?,
        escena_2 = ?,
        frase_certeza = ?,
        accion_cosecha = ?,
        obstaculo = ?,
        plan_if_then = ?,
        duracion_segundos = ?,
        completado = ?
      WHERE id = ?
    `).bind(r || 0, s || null, o || null, n || null, i || null, c || null, l || null, d || 0, f || 0, a).run(), e.json({ success: true });
  } catch (a) {
    return console.error("Error updating ritual session:", a), e.json({ success: false, error: "Error al actualizar sesi\xF3n" }, 500);
  }
});
Ie.delete("/sesiones/:id", async (e) => {
  try {
    const a = e.req.param("id");
    return await e.env.DB.prepare("DELETE FROM ritual_spec_sessions WHERE id = ?").bind(a).run(), e.json({ success: true });
  } catch (a) {
    return console.error("Error deleting ritual session:", a), e.json({ success: false, error: "Error al eliminar sesi\xF3n" }, 500);
  }
});
var js = /^[\w!#$%&'*.^`|~+-]+$/;
var Ls = /^[ !#-:<-[\]-~]*$/;
var Ms = /* @__PURE__ */ __name2((e, a) => {
  if (e.indexOf(a) === -1)
    return {};
  const t = e.trim().split(";"), r = {};
  for (let s of t) {
    s = s.trim();
    const o = s.indexOf("=");
    if (o === -1)
      continue;
    const n = s.substring(0, o).trim();
    if (a !== n || !js.test(n))
      continue;
    let i = s.substring(o + 1).trim();
    if (i.startsWith('"') && i.endsWith('"') && (i = i.slice(1, -1)), Ls.test(i)) {
      r[n] = i.indexOf("%") !== -1 ? da(i, La) : i;
      break;
    }
  }
  return r;
}, "Ms");
var xs = /* @__PURE__ */ __name2((e, a, t = {}) => {
  let r = `${e}=${a}`;
  if (e.startsWith("__Secure-") && !t.secure)
    throw new Error("__Secure- Cookie must have Secure attributes");
  if (e.startsWith("__Host-")) {
    if (!t.secure)
      throw new Error("__Host- Cookie must have Secure attributes");
    if (t.path !== "/")
      throw new Error('__Host- Cookie must have Path attributes with "/"');
    if (t.domain)
      throw new Error("__Host- Cookie must not have Domain attributes");
  }
  if (t && typeof t.maxAge == "number" && t.maxAge >= 0) {
    if (t.maxAge > 3456e4)
      throw new Error("Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration.");
    r += `; Max-Age=${t.maxAge | 0}`;
  }
  if (t.domain && t.prefix !== "host" && (r += `; Domain=${t.domain}`), t.path && (r += `; Path=${t.path}`), t.expires) {
    if (t.expires.getTime() - Date.now() > 3456e7)
      throw new Error("Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future.");
    r += `; Expires=${t.expires.toUTCString()}`;
  }
  if (t.httpOnly && (r += "; HttpOnly"), t.secure && (r += "; Secure"), t.sameSite && (r += `; SameSite=${t.sameSite.charAt(0).toUpperCase() + t.sameSite.slice(1)}`), t.priority && (r += `; Priority=${t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}`), t.partitioned) {
    if (!t.secure)
      throw new Error("Partitioned Cookie must have Secure attributes");
    r += "; Partitioned";
  }
  return r;
}, "xs");
var ya = /* @__PURE__ */ __name2((e, a, t) => (a = encodeURIComponent(a), xs(e, a, t)), "ya");
var Pa = /* @__PURE__ */ __name2((e, a, t) => {
  const r = e.req.raw.headers.get("Cookie");
  {
    if (!r)
      return;
    let s = a;
    return Ms(r, s)[s];
  }
}, "Pa");
var Ps = /* @__PURE__ */ __name2((e, a, t) => {
  let r;
  return (t == null ? void 0 : t.prefix) === "secure" ? r = ya("__Secure-" + e, a, { path: "/", ...t, secure: true }) : (t == null ? void 0 : t.prefix) === "host" ? r = ya("__Host-" + e, a, { ...t, path: "/", secure: true, domain: void 0 }) : r = ya(e, a, { path: "/", ...t }), r;
}, "Ps");
var Kt = /* @__PURE__ */ __name2((e, a, t, r) => {
  const s = Ps(a, t, r);
  e.header("Set-Cookie", s, { append: true });
}, "Kt");
var me = new X();
var de = { generateToken() {
  return Math.random().toString(36).substr(2) + Date.now().toString(36);
}, verifyPassword(e, a) {
  return e === a;
}, hashPassword(e) {
  return "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";
}, isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}, async createSession(e, a, t) {
  const r = this.generateToken(), s = /* @__PURE__ */ new Date(), o = t ? 30 * 24 : 24;
  return s.setHours(s.getHours() + o), await e.prepare(`
      INSERT INTO auth_sessions (user_id, session_token, expires_at)
      VALUES (?, ?, ?)
    `).bind(a, r, s.toISOString()).run(), r;
}, async validateSession(e, a) {
  const t = await e.prepare(`
      SELECT s.*, u.id, u.email, u.name, u.is_active
      FROM auth_sessions s
      JOIN auth_users u ON s.user_id = u.id
      WHERE s.session_token = ? AND s.expires_at > datetime('now')
    `).bind(a).first();
  return !t || !t.is_active ? null : { id: t.id, email: t.email, name: t.name, password_hash: "", is_active: t.is_active, last_login: t.last_login };
}, async cleanExpiredSessions(e) {
  await e.prepare(`
      DELETE FROM auth_sessions 
      WHERE expires_at <= datetime('now')
    `).run();
} };
me.post("/register", async (e) => {
  try {
    const { name: a, email: t, password: r } = await e.req.json();
    if (!a || !t || !r)
      return e.json({ error: "Nombre, email y contrase\xF1a son requeridos" }, 400);
    if (!de.isValidEmail(t))
      return e.json({ error: "Formato de email inv\xE1lido" }, 400);
    if (r.length < 6)
      return e.json({ error: "La contrase\xF1a debe tener al menos 6 caracteres" }, 400);
    if (await e.env.DB.prepare(`
      SELECT id FROM auth_users WHERE email = ?
    `).bind(t).first())
      return e.json({ error: "Ya existe una cuenta con este email" }, 409);
    const o = await e.env.DB.prepare(`
      INSERT INTO auth_users (email, password_hash, name, is_active)
      VALUES (?, ?, ?, 1)
    `).bind(t, r, a).run();
    return o.success ? e.json({ success: true, message: "Cuenta creada exitosamente", user: { id: o.meta.last_row_id, email: t, name: a } }) : e.json({ error: "Error al crear la cuenta" }, 500);
  } catch (a) {
    return console.error("Error en registro:", a), e.json({ error: "Error interno del servidor" }, 500);
  }
});
me.post("/login", async (e) => {
  try {
    const { email: a, password: t, remember: r = false } = await e.req.json();
    if (!a || !t)
      return e.json({ error: "Email y contrase\xF1a son requeridos" }, 400);
    if (!de.isValidEmail(a))
      return e.json({ error: "Formato de email inv\xE1lido" }, 400);
    const s = await e.env.DB.prepare(`
      SELECT id, email, name, password_hash, is_active, last_login
      FROM auth_users 
      WHERE email = ?
    `).bind(a).first();
    if (!s || !s.is_active)
      return e.json({ error: "Credenciales incorrectas" }, 401);
    if (!de.verifyPassword(t, s.password_hash))
      return e.json({ error: "Credenciales incorrectas" }, 401);
    await e.env.DB.prepare(`
      UPDATE auth_users 
      SET last_login = datetime('now')
      WHERE id = ?
    `).bind(s.id).run();
    const o = await de.createSession(e.env.DB, s.id, r);
    return await de.cleanExpiredSessions(e.env.DB), r && Kt(e, "yo-decreto-token", o, { maxAge: 30 * 24 * 60 * 60, httpOnly: false, secure: false, sameSite: "Lax" }), e.json({ success: true, token: o, user: { id: s.id, email: s.email, name: s.name, last_login: s.last_login } });
  } catch (a) {
    return console.error("Error en login:", a), e.json({ error: "Error interno del servidor" }, 500);
  }
});
me.get("/validate", async (e) => {
  try {
    const a = e.req.header("Authorization"), t = Pa(e, "yo-decreto-token");
    let r = null;
    if (a && a.startsWith("Bearer ") ? r = a.substring(7) : t && (r = t), !r)
      return e.json({ error: "Token no proporcionado" }, 401);
    const s = await de.validateSession(e.env.DB, r);
    return s ? e.json({ success: true, user: { id: s.id, email: s.email, name: s.name, last_login: s.last_login } }) : e.json({ error: "Sesi\xF3n inv\xE1lida o expirada" }, 401);
  } catch (a) {
    return console.error("Error validando sesi\xF3n:", a), e.json({ error: "Error interno del servidor" }, 500);
  }
});
me.post("/logout", async (e) => {
  try {
    const a = e.req.header("Authorization"), t = Pa(e, "yo-decreto-token");
    let r = null;
    return a && a.startsWith("Bearer ") ? r = a.substring(7) : t && (r = t), r && (await e.env.DB.prepare(`
        DELETE FROM auth_sessions 
        WHERE session_token = ?
      `).bind(r).run(), Kt(e, "yo-decreto-token", "", { maxAge: 0 })), e.json({ success: true, message: "Sesi\xF3n cerrada correctamente" });
  } catch (a) {
    return console.error("Error en logout:", a), e.json({ error: "Error interno del servidor" }, 500);
  }
});
me.get("/me", async (e) => {
  try {
    const a = e.req.header("Authorization"), t = Pa(e, "yo-decreto-token");
    let r = null;
    if (a && a.startsWith("Bearer ") ? r = a.substring(7) : t && (r = t), !r)
      return e.json({ error: "Token no proporcionado" }, 401);
    const s = await de.validateSession(e.env.DB, r);
    return s ? e.json({ success: true, user: { id: s.id, email: s.email, name: s.name, last_login: s.last_login } }) : e.json({ error: "Sesi\xF3n inv\xE1lida" }, 401);
  } catch (a) {
    return console.error("Error obteniendo usuario:", a), e.json({ error: "Error interno del servidor" }, 500);
  }
});
me.get("/stats", async (e) => {
  try {
    const a = await e.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN expires_at > datetime('now') THEN 1 END) as active_sessions,
        COUNT(CASE WHEN expires_at <= datetime('now') THEN 1 END) as expired_sessions
      FROM auth_sessions
    `).first(), t = await e.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_users
      FROM auth_users
    `).first();
    return e.json({ success: true, stats: { sessions: a, users: t } });
  } catch (a) {
    return console.error("Error obteniendo estad\xEDsticas:", a), e.json({ error: "Error interno del servidor" }, 500);
  }
});
var Hs = {};
var L = new X();
L.use(As);
L.use("/api/*", Yr());
L.use("/static/*", rs());
L.route("/api/auth", me);
L.route("/api/decretos", j);
L.route("/api/decretos", Jt);
L.route("/api/agenda", P);
L.route("/api/progreso", ne);
L.route("/api/practica", I);
L.route("/api/ritual", Ie);
L.post("/api/upload-logo", async (e) => {
  try {
    const t = (await e.req.formData()).get("logo");
    if (!t || !(t instanceof File))
      return e.json({ success: false, error: "No se proporcion\xF3 archivo" }, 400);
    if (!t.type.startsWith("image/"))
      return e.json({ success: false, error: "El archivo debe ser una imagen" }, 400);
    if (t.size > 2 * 1024 * 1024)
      return e.json({ success: false, error: "La imagen no debe superar 2MB" }, 400);
    const r = t.name.split(".").pop(), s = `logo-${Date.now()}-${Math.random().toString(36).substring(7)}.${r}`, o = await t.arrayBuffer();
    await e.env.LOGOS.put(s, o, { httpMetadata: { contentType: t.type } });
    const n = `/api/logos/${s}`;
    return e.json({ success: true, logo_url: n });
  } catch (a) {
    return console.error("Error uploading logo:", a), e.json({ success: false, error: "Error al subir imagen" }, 500);
  }
});
L.get("/api/logos/:filename", async (e) => {
  try {
    const a = e.req.param("filename"), t = await e.env.LOGOS.get(a);
    if (!t)
      return e.notFound();
    const r = new Headers();
    return t.writeHttpMetadata(r), r.set("etag", t.httpEtag), r.set("cache-control", "public, max-age=31536000"), new Response(t.body, { headers: r });
  } catch (a) {
    return console.error("Error serving logo:", a), e.notFound();
  }
});
L.get("/", (e) => e.render(R("div", { children: R("div", { id: "app", children: R("div", { className: "loading-screen", children: [R("img", { src: "/static/logo-yo-decreto.png", alt: "Yo Decreto", className: "logo-yo-decreto logo-lg w-auto mx-auto mb-4" }), R("div", { className: "loader" }), R("h2", { children: "Cargando..." })] }) }) })));
L.get("*", (e) => e.render(R("div", { children: R("div", { id: "app", children: R("div", { className: "loading-screen", children: [R("img", { src: "/static/logo-yo-decreto.png", alt: "Yo Decreto", className: "logo-yo-decreto logo-lg w-auto mx-auto mb-4" }), R("div", { className: "loader" }), R("h2", { children: "Cargando..." })] }) }) })));
L.post("/api/ai/chat", async (e) => {
  try {
    const { message: a, includePortfolioContext: t, history: r } = await e.req.json();
    if (!a)
      return e.json({ error: "Message is required" }, 400);
    let s = "";
    if (t) {
      let f = "", p = "", h = "";
      try {
        f = (await e.env.DB.prepare(`
          SELECT d.*, COUNT(a.id) as total_acciones,
                 SUM(CASE WHEN a.estado = 'completada' THEN 1 ELSE 0 END) as acciones_completadas
          FROM decretos d
          LEFT JOIN acciones a ON d.id = a.decreto_id
          GROUP BY d.id
          ORDER BY d.created_at DESC
        `).all()).results.map((E) => {
          const g = E.total_acciones > 0 ? (E.acciones_completadas / E.total_acciones * 100).toFixed(0) : 0;
          return `${E.titulo}: ${E.total_acciones} acciones (${g}% completadas) - ${E.descripcion}`;
        }).join(`
`);
      } catch (m) {
        console.error("Error fetching decretos:", m), f = "Error loading decretos data";
      }
      try {
        const m = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        p = (await e.env.DB.prepare(`
          SELECT t.*, d.titulo as decreto_titulo
          FROM tareas t
          LEFT JOIN acciones a ON t.accion_id = a.id
          LEFT JOIN decretos d ON a.decreto_id = d.id
          WHERE t.fecha = ?
          ORDER BY t.prioridad DESC, t.created_at
        `).bind(m).all()).results.map((g) => `[${g.estado}] ${g.titulo} - ${g.decreto_titulo || "Tarea independiente"}`).join(`
`);
      } catch (m) {
        console.error("Error fetching agenda:", m), p = "Error loading agenda data";
      }
      try {
        const m = await e.env.DB.prepare(`
          SELECT
            COUNT(DISTINCT d.id) as total_decretos,
            COUNT(a.id) as total_acciones,
            SUM(CASE WHEN a.estado = 'completada' THEN 1 ELSE 0 END) as acciones_completadas,
            SUM(CASE WHEN a.estado = 'en_progreso' THEN 1 ELSE 0 END) as acciones_en_progreso
          FROM decretos d
          LEFT JOIN acciones a ON d.id = a.decreto_id
        `).first();
        h = `Total decretos: ${m.total_decretos || 0}
Total acciones: ${m.total_acciones || 0}
Acciones completadas: ${m.acciones_completadas || 0}
Acciones en progreso: ${m.acciones_en_progreso || 0}`;
      } catch (m) {
        console.error("Error fetching progress:", m), h = "Error loading progress data";
      }
      s = `
CONTEXTO DE LA APLICACI\xD3N - ACCESO COMPLETO:
=============================================

DECRETOS ACTIVOS:
${f || "Sin decretos"}

AGENDA DE HOY:
${p || "Sin tareas"}

PROGRESO GENERAL:
${h || "Sin datos"}
`;
    }
    const o = `Eres un asistente inteligente para la aplicaci\xF3n "Yo Decreto", basada en los principios del libro "Name It and Claim It" (WINeuvers for WISHcraft) de Helene Hadsell, la legendaria "Contest Queen".

=== PRINCIPIOS FUNDAMENTALES (Name It and Claim It) ===

1. LA MENTE DIRIGE LA REALIDAD DESEADA
   La combinaci\xF3n de intenci\xF3n, creencia y atenci\xF3n sostenida puede manifestar resultados concretos: premios, oportunidades, metas. Tu pensamiento + energ\xEDa personal = resultados f\xEDsicos.

2. CLARIDAD RADICAL ("Nombrarlo para Reclamarlo")
   Lo que no se define con precisi\xF3n rara vez llega. "Nombrar" = concretar QU\xC9, CU\xC1NTO, CU\xC1NDO y C\xD3MO lo quieres. No hay espacio para vaguedad.

3. VISUALIZACI\xD3N MULTISENSORIAL + EMOCI\xD3N
   No basta "pensarlo": hay que VERLO, SENTIRLO, VIVIRLO como hecho consumado. Incluye todos los sentidos (visual, auditivo, olfativo, t\xE1ctil) y las emociones asociadas.

4. EXPECTATIVA SIN DUDAS (de "Desear" a "Saber")
   - DESEAR = emoci\xF3n, impaciencia, dudas, ansiedad
   - SABER = certeza serena, confianza estable, sin contradicciones mentales
   Cuanto m\xE1s "sabes" que tu meta se cumplir\xE1, m\xE1s fluida ser\xE1 su manifestaci\xF3n.

5. RECEPCI\xD3N ACTIVA
   Estar listo para RECONOCER y TOMAR la oportunidad cuando aparezca (llamada, correo, contacto, regla de concurso). No esperar pasivamente.

6. ACTITUD EXPANSIVA / AMOR UNIVERSAL
   Alinearse con gratitud, buen \xE1nimo, apertura. Amar todo (personas, naturaleza, circunstancias) reduce la resistencia energ\xE9tica. Elevaci\xF3n emocional = menos bloqueos.

7. DISCIPLINA Y CONSTANCIA
   Repetici\xF3n deliberada (visualizaci\xF3n, afirmaciones, acciones peque\xF1as) hasta que el resultado se materialice. "No hay fracasos, s\xF3lo retrasos."

8. PERSISTENCIA + PACIENCIA
   Los resultados no siempre llegan instant\xE1neamente. Mantener la fe sin abandonar. Confiar en el timing perfecto.

=== M\xC9TODO SPEC (Tu Framework Principal) ===

SPEC es un BUCLE OPERATIVO que se aplica y se refuerza continuamente:

\u{1F3AF} S \u2014 SELECT IT (Selecciona)
   - Define EXACTAMENTE lo que quieres
   - Espec\xEDfico, medible, con ventana temporal
   - Escr\xEDbelo como "enunciado de deseo" claro
   - Ejemplo: "Cerrar 3 clientes Enterprise de 6 cifras antes del 31 de marzo"

\u{1F3AC} P \u2014 PROJECT IT (Proy\xE9ctalo)
   - Visualizaci\xF3n cinematogr\xE1fica: 3-5 minutos al despertar/antes de dormir
   - Micro-escenas con TODOS los sentidos
   - Emociones congruentes (alegr\xEDa, alivio, orgullo)
   - Ejemplo: Ver el contrato firmado, escuchar "felicidades", sentir el teclado al actualizar dashboard de ingresos

\u26A1 E \u2014 EXPECT IT (Esp\xE9ralo)
   - Mant\xE9n expectativa firme SIN obsesi\xF3n por el "c\xF3mo/cu\xE1ndo"
   - Higiene mental: reescribe dudas en evidencias futuras
   - Estado de SABER (no solo desear)
   - Evita autosabotajes o pensamientos contradictorios

\u{1F381} C \u2014 COLLECT IT (Rec\xEDbelo)
   - Act\xFAa cuando aparezcan "puentes de oportunidad"
   - 1 acci\xF3n diaria de cosecha (llamada, propuesta, seguimiento)
   - Reconoce se\xF1ales y aprov\xE9chalas
   - Completa inscripciones, responde llamadas, env\xEDa propuestas

=== TERMINOLOG\xCDA CLAVE ===

- "WINeuvers for WISHcraft": Maniobras (WIN-euvers) en el arte de desear (WISH-craft)
- "Contest Queen": Apodo de Hadsell por su historial de victorias
- "Actuar como si": Comportarte mental y emocionalmente como quien YA tiene el resultado
- "Energ\xEDa \xE1urica" / ESP: Proyecci\xF3n mental e intuici\xF3n (marco explicativo de Hadsell)
- "Visualizaci\xF3n cinematogr\xE1fica": Pel\xEDcula mental multisensorial del resultado
- "Disciplina f\xEDsica": Acciones o sacrificios concretos para demostrar compromiso al subconsciente
- "No hay fracasos, s\xF3lo retrasos": Si no llega a\xFAn, es cuesti\xF3n de timing, no de imposibilidad
- "El Juego de la Vida": La existencia como un juego donde t\xFA eres jugador y co-autor

=== EJEMPLOS HIST\xD3RICOS (Inspiraci\xF3n) ===

1. La Casa del World's Fair (Formica): Caso emblem\xE1tico - gan\xF3 concurso de la Feria Mundial de NY (1964-65) para construir casa-premio completa
2. Viajes, autos, premios varios: D\xE9cadas ganando concursos usando creatividad + rutina SPEC
3. Aplicaciones no azarosas: Proyectos, relaciones, trabajo, salud usando los mismos principios

=== TU FUNCI\xD3N COMO ASISTENTE ===

1. AYUDAR A CREAR DECRETOS siguiendo SPEC
   - Asegurar que sean ESPEC\xCDFICOS y CLAROS (nunca vagos)
   - Si un decreto est\xE1 vago, refinarlo usando las 4 etapas

2. GUIAR EN VISUALIZACI\xD3N EFECTIVA
   - Recordar incluir todos los sentidos
   - Agregar emoci\xF3n y detalles concretos
   - Sugerir ritual de 3-5 minutos AM/PM

3. MANTENER ESTADO DE "SABER"
   - Detectar lenguaje de duda ("ojal\xE1", "espero que", "si acaso")
   - Transformarlo en lenguaje de certeza ("s\xE9 que", "cuando llegue", "es inevitable")

4. ORGANIZAR ACCIONES CONCRETAS
   - Cada decreto debe tener acciones de "COLLECT" (cosecha)
   - M\xEDnimo 1 acci\xF3n diaria alineada con el resultado

5. MOTIVAR CON LENGUAJE DE MANIFESTACI\xD3N
   - Usar principios de Name It and Claim It
   - Reforzar: "No es fracaso, es retraso"
   - Recordar: disciplina + constancia = resultados

6. FORMATO DE DECRETOS
   - SIEMPRE en PRESENTE o PRESENTE PERFECTO
   - Como si ya fuera realidad
   - Ejemplo: "SOY el CEO m\xE1s exitoso de Colombia" (no "ser\xE9" o "quiero ser")

7. LENGUAJE CLAVE DE HADSELL
   - "Quita 'intentar' de tu vocabulario \u2014 \xA1viene, viene, y punto!"
   - "Puedes tener lo que quieras si sabes qu\xE9 es y te ves como si ya lo tuvieras"
   - Detectar y reemplazar: "intentar\xE9" \u2192 "lo hago", "espero" \u2192 "s\xE9 que"

=== RITUAL DIARIO (Recomienda cuando pregunten por rutina) ===

Cadencia de 7 minutos, 2 veces al d\xEDa (al despertar y antes de dormir):

\u23F1\uFE0F 00:00-01:00 \u2192 Respiraci\xF3n 4-4-6-2 (centrar sistema nervioso)
\u23F1\uFE0F 01:00-03:00 \u2192 P (Project): 2 micro-escenas multisensoriales
\u23F1\uFE0F 03:00-04:00 \u2192 E (Expect): frase de certeza + imagen breve
\u23F1\uFE0F 04:00-06:00 \u2192 C (Collect): escribir 1 acci\xF3n de cosecha y agendarla HOY
\u23F1\uFE0F 06:00-07:00 \u2192 If-Then: plan para el obst\xE1culo del d\xEDa

=== TROUBLESHOOTING (Cuando "no pasa nada") ===

Si el usuario dice "no veo avances" o "no funciona":

\u2705 Chequeo S (Select): \xBFEst\xE1 demasiado vago? \u2192 Reescribe con m\xE9trica y fecha espec\xEDfica
\u2705 Chequeo P (Project): \xBFVisualiza procesos Y resultado? (no solo el final)
\u2705 Chequeo E (Expect): \xBFTu di\xE1logo interno contradice el objetivo? \u2192 "Dieta mental" + detectar dudas
\u2705 Chequeo C (Collect): \xBFHay 1 acci\xF3n de cosecha DIARIA? Sin acci\xF3n = no hay cosecha
\u2705 Obst\xE1culo real: Nombrar el obst\xE1culo concreto + crear plan If-Then ("Si X, entonces har\xE9 Y")

RECORDAR SIEMPRE: "No hay fracasos, s\xF3lo retrasos. La realidad tiene la cortes\xEDa de corresponder."

=== CRITERIOS DE CALIDAD PARA DECRETOS ===

Un decreto EXCELENTE debe tener:

1. ESPEC\xCDFICO: Qu\xE9 exactamente + cantidades concretas
2. MEDIBLE: Puedes verificar si llegaste
3. TEMPORAL: Fecha l\xEDmite clara
4. EMOCIONAL: Conecta con un "por qu\xE9" profundo
5. PRESENTE/PRESENTE PERFECTO: "SOY", "TENGO", "HE LOGRADO" (nunca futuro)
6. IMAGEN DE VISUALIZACI\xD3N: Foto que representa el resultado (refuerza PROJECT)

Ejemplo MALO: "Quiero ser exitoso en mi empresa"
Ejemplo BUENO: "SOY el CEO de QuantikGeo que HA CERRADO 3 contratos enterprise de $100k+ antes del 15/12/2025. VEO el dashboard con $300k+ en ingresos nuevos, ESCUCHO las felicitaciones del equipo, SIENTO el orgullo de haberlo logrado."

=== RESPUESTAS Y ACCIONES ===

- Cuando el usuario pregunte sobre decretos/agenda/progreso, usa los datos de "CONTEXTO DE LA APLICACI\xD3N" abajo
- Responde en espa\xF1ol claro, motivador, alineado con Name It and Claim It
- Si detectas vaguedad, pregunta para refinar con SPEC
- Detecta lenguaje de duda ("intentar", "ojal\xE1", "espero") y transformalo en certeza
- Recuerda: los decretos son en PRESENTE (como si ya fueran realidad)
- Sugiere agregar imagen de visualizaci\xF3n a los decretos importantes
- Para ejecutar acciones (crear decreto, agregar tarea), responde con JSON:

\`\`\`json
{
  "action": "crear_decreto",
  "params": {
    "titulo": "SOY el CEO m\xE1s exitoso de Colombia",
    "descripcion": "He construido un equipo de 50+ personas, generamos $5M+ anuales, tengo 3 empresas rentables funcionando simult\xE1neamente. Veo el dashboard, escucho las felicitaciones, siento la satisfacci\xF3n del logro."
  }
}
\`\`\`

${s}`, n = [];
    if (r && r.length > 0)
      for (const f of r)
        n.push({ role: f.role === "assistant" ? "model" : "user", parts: [{ text: f.content }] });
    n.push({ role: "user", parts: [{ text: a }] });
    const i = e.env.GEMINI_API_KEY || Hs.GEMINI_API_KEY;
    if (!i)
      return e.json({ success: true, response: "\xA1Hola! Soy tu asistente de Yo Decreto. Por ahora estoy en modo de prueba. Pronto podr\xE9 ayudarte con tus decretos, agenda y seguimiento de progreso. \xBFEn qu\xE9 te gustar\xEDa que te ayude?" });
    const c = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${i}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system_instruction: { parts: [{ text: o }] }, contents: n, generationConfig: { temperature: 0.9, topK: 40, topP: 0.95, maxOutputTokens: 8192 } }) });
    if (!c.ok) {
      const f = await c.text();
      throw console.error("Gemini API Error:", f), new Error("Error al comunicarse con Gemini AI");
    }
    const d = (await c.json()).candidates[0].content.parts[0].text;
    return e.json({ success: true, response: d });
  } catch (a) {
    return console.error("Chat error:", a), e.json({ success: false, error: "Error al procesar tu mensaje. Por favor intenta de nuevo." }, 500);
  }
});
L.post("/api/ai/action", async (e) => {
  try {
    const { action: a, params: t } = await e.req.json();
    switch (console.log("AI Action:", a, t), a) {
      case "crear_decreto": {
        const { titulo: r, descripcion: s, area: o } = t, n = await e.env.DB.prepare(`
          INSERT INTO decretos (titulo, descripcion, area, created_at)
          VALUES (?, ?, ?, datetime('now'))
        `).bind(r, s || "", o || "personal").run();
        return e.json({ success: true, message: `\u2705 Decreto "${r}" creado exitosamente` });
      }
      case "agregar_tarea": {
        const { titulo: r, fecha: s, decreto_id: o } = t, n = await e.env.DB.prepare(`
          INSERT INTO tareas (titulo, fecha, estado, created_at)
          VALUES (?, ?, 'pendiente', datetime('now'))
        `).bind(r, s || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]).run();
        return e.json({ success: true, message: `\u2705 Tarea "${r}" agregada a tu agenda` });
      }
      default:
        return e.json({ success: false, error: `Acci\xF3n desconocida: ${a}` }, 400);
    }
  } catch (a) {
    return console.error("AI Action error:", a), e.json({ success: false, error: "Error al ejecutar la acci\xF3n" }, 500);
  }
});
L.get("/backup", async (e) => {
  const a = "./public/yo_decreto_hono_100_funcional_sept26.tar.gz";
  try {
    const r = await (await fetch("file://" + a)).arrayBuffer();
    return new Response(r, { headers: { "Content-Type": "application/gzip", "Content-Disposition": "attachment; filename=yo_decreto_hono_100_funcional_sept26.tar.gz", "Content-Length": r.byteLength.toString() } });
  } catch {
    return e.text("Archivo no encontrado", 404);
  }
});
var rt = new X();
var Us = Object.assign({ "/src/index.tsx": L });
var Xt = false;
for (const [, e] of Object.entries(Us))
  e && (rt.route("/", e), rt.notFound(e.notFoundHandler), Xt = true);
if (!Xt)
  throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");
var drainBody = /* @__PURE__ */ __name2(async (request, env22, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env22);
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
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env22, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env22);
  } catch (e) {
    const error32 = reduceError(e);
    return Response.json(error32, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = rt;
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env22, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env22, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env22, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env22, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = /* @__PURE__ */ __name(class {
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
}, "__Facade_ScheduledController__");
__name2(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env22, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env22, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env22, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env22, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env22, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env22, ctx) => {
      this.env = env22;
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
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// node_modules/wrangler/templates/pages-dev-util.ts
function isRoutingRuleMatch(pathname, routingRule) {
  if (!pathname) {
    throw new Error("Pathname is undefined.");
  }
  if (!routingRule) {
    throw new Error("Routing rule is undefined.");
  }
  const ruleRegExp = transformRoutingRuleToRegExp(routingRule);
  return pathname.match(ruleRegExp) !== null;
}
__name(isRoutingRuleMatch, "isRoutingRuleMatch");
function transformRoutingRuleToRegExp(rule) {
  let transformedRule;
  if (rule === "/" || rule === "/*") {
    transformedRule = rule;
  } else if (rule.endsWith("/*")) {
    transformedRule = `${rule.substring(0, rule.length - 2)}(/*)?`;
  } else if (rule.endsWith("/")) {
    transformedRule = `${rule.substring(0, rule.length - 1)}(/)?`;
  } else if (rule.endsWith("*")) {
    transformedRule = rule;
  } else {
    transformedRule = `${rule}(/)?`;
  }
  transformedRule = `^${transformedRule.replaceAll(/\./g, "\\.").replaceAll(/\*/g, ".*")}$`;
  return new RegExp(transformedRule);
}
__name(transformRoutingRuleToRegExp, "transformRoutingRuleToRegExp");

// .wrangler/tmp/pages-Bdu4yP/di1dzzerhna.js
var define_ROUTES_default = { version: 1, include: ["/*"], exclude: ["/download.html", "/static/*"] };
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env3, context3) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env3.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = middleware_loader_entry_default;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env3, context3);
      }
    }
    return env3.ASSETS.fetch(request);
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env3, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env3);
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
var middleware_ensure_req_body_drained_default2 = drainBody2;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError2(e.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env3, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env3);
  } catch (e) {
    const error4 = reduceError2(e);
    return Response.json(error4, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-3DX99C/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = pages_dev_pipeline_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env3, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env3, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env3, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env3, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-3DX99C/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__2, "__Facade_ScheduledController__");
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env3, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env3, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env3, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env3, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env3, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env3, ctx) => {
      this.env = env3;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
//# sourceMappingURL=di1dzzerhna.js.map
