// import { Topic } from "../core/Topic";
// import { Mind } from "../core/Mind";

export const _slice = Array.prototype.slice;

export const _noop = function(...arg: any[]): any {};

function _loggerHandler(method: string) {
  return (action: string, msg: string, ...oth: any[]) => console[method].apply(null, `[ACTION: ${action}]`, msg, ...oth);
}

export class Logger {
  // let _handler: any = () => $noop;
  // if (mode === "debug") _handler = _loggerHandler;
  _handler: (s: string) => (action: string, ...msg: any[]) => void;
  constructor(isDebug: boolean) {
    this._handler = isDebug ? _loggerHandler : () => _noop;
  }
  log(...args: any[]) {
    this._handler.apply("log", args);
  }
  debug(...args: any[]) {
    this._handler.apply("debug", args);
  }
  error(...args: any[]) {
    this._handler.apply("error", args);
  }
  warn(...args: any[]) {
    this._handler.apply("warn", args);
  }
  info(...args: any[]) {
    this._handler.apply("info", args);
  }
}

export function str(str: string, beg: string) {
  return {
    // To determine whether a string starting with [beg].
    beginWith(beg: string) {
      return str.slice(0, beg.length) === beg;
    },
    // To determine whether a string ending with [beg].
    endWidth(end: string) {
      return str.slice(str.length - beg.length, str.length) === beg;
    }
  };
}

// Object keys maping
export function objKeys(obj: object, cb?: IMAnyCall<[string, number, string[]]>) {
  return Object.keys(obj).map((key, idx, keyArr) => (cb ? cb(key, idx, keyArr) : key));
}
export function objValues<Item = any>(obj: object, cb?: IMAnyCall<[Item, number, string, Item[]]>) {
  let values: any[];
  return Object.keys(obj).map((key, idx, keyArr) => (cb ? cb(obj[key], idx, key, values ? values : (values = keyArr.map(_k => obj[_k]))) : obj[key]));
}

// To determine whether a target is a Function.
export function isFunction(tar: any) {
  return typeof tar === "function";
}

// The abbreviation of hasOwnProperty method.
export const hasOwnProp = Object.prototype.hasOwnProperty;
// To determine the plain-object.
export function isPlainObject(obj: any) {
  // Must be an Object.
  // Because of IE, we also have to check the presence of the constructor property.
  // Make sure that DOM nodes and window objects don't pass through, as well
  if (!obj || toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval) {
    return false;
  }

  // Not own constructor property must be Object
  if (obj.constructor && !hasOwnProp.call(obj, "constructor") && !hasOwnProp.call(obj.constructor.prototype, "isPrototypeOf")) {
    return false;
  }

  // Own properties are enumerated firstly, so to speed up,
  // if last one is own, then all properties are own.

  let key;
  for (key in obj) {
  }

  return key === undefined || hasOwnProp.call(obj, key);
}

// object [deep optional] assign method
export function extend<T extends object = {}>(deep: boolean, ...arg: object[]): T;
export function extend<T extends object = {}>(this: any, ...arg: object[]): T;
export function extend(this: any) {
  let options: any;
  let name: string;
  let src: object;
  let copy: object;
  let copyIsArray: boolean;
  let clone: object;
  let target = arguments[0] || {};
  let i = 1;
  const length: number = arguments.length;
  let deep: boolean = false;

  // Handle a deep copy situation
  if (typeof target === "boolean") {
    deep = target;

    // Skip the boolean and the target
    target = arguments[i] || {};
    i++;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== "object" && !isFunction(target)) {
    target = {};
  }

  // Extend jQuery itself if only one argument is passed
  if (i === length) {
    target = this || {};
    i--;
  }

  for (; i < length; i++) {
    options = arguments[i];
    // Only deal with non-null/undefined values
    if (options !== null) {
      // Extend the base object
      for (name in options) {
        if (!!name) {
          copy = options[name];

          // Prevent never-ending loop
          if (target === copy) {
            continue;
          }
          copyIsArray = Array.isArray(copy);
          // Recurse if we're merging plain objects or arrays
          if (deep && copy && (isPlainObject(copy) || copyIsArray)) {
            src = target[name];

            // Ensure proper type for the source value
            if (copyIsArray && !Array.isArray(src)) {
              clone = [];
            } else if (!copyIsArray && !isPlainObject(src)) {
              clone = {};
            } else {
              clone = src;
            }
            copyIsArray = false;

            // Never move original objects, clone them
            target[name] = extend(deep, clone, copy);

            // Don't bring in undefined values
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
  }

  // Return the modified object
  return target;
}

// debounce method
export function debounce<T extends any[] = any[]>(handler: IMAnyCall<T, void>, tick: number = 10) {
  let _timer: any = null;
  function _dbce(this: any, ...args: T): void {
    const _ctx = this;
    if (_timer) {
      clearTimeout(_timer);
    }
    _timer = setTimeout(() => {
      handler.apply(_ctx, args);
      _timer = null;
    }, tick);
  }
  // clear debounce
  _dbce.clear = () => {
    clearTimeout(_timer);
    _timer = null;
  };
  return _dbce;
}

export function throttle<T extends any[] = any[]>(handler: IMAnyCall<T, void>, tick: number = 10) {
  let _lastTime: any = 0;
  let _timer: any;
  function _throte(this: any, ...args: T): void {
    const _ctx = this;
    const _now = Date.now();
    if (_now >= _lastTime + tick) {
      handler.apply(_ctx, args);
      _lastTime = _now;
    } else {
      //执行最后一次
      if (_timer) {
        clearTimeout(_timer);
      }
      _timer = setTimeout(() => {
        handler.apply(_ctx, args);
        _timer = null;
      }, _now - _lastTime);
    }
  }
  _throte.clear = () => {
    clearTimeout(_timer);
    _timer = null;
  };
  return _throte;
}

// whether str is empty,including space char;
export function isEmptyStr(s: any) {
  if (!s) {
    return true;
  }
  return s.replace(/\s*/, "").length === 0;
}

// destroy an class instance object
export function destroyObject(obj: { _destroyed: boolean; [k: string]: any }) {
  // delete all own properties
  objKeys(obj, key => {
    delete obj[key];
  });
  // destroy the prototype chain
  obj.__proto__ = null;
}

// compare difference between two objects, and export differences.
export function diffObject<A = object>(obj1: A, obj2: A) {
  const _mks = Object.keys(obj2);
  const len = _mks.length;
  const diffs = {};
  let i = 0;
  let diffCounter = 0;
  while (i < len) {
    const _mk = _mks[i];
    if (obj1.hasOwnProperty(_mk)) {
      if (obj1[_mk] !== obj2[_mk]) {
        diffs[_mk] = obj2[_mk];
        diffCounter++;
      }
    } else {
      diffs[_mk] = obj2[_mk];
      diffCounter++;
    }
    i++;
  }
  return diffCounter > 0 ? diffs : null;
}

/**
 * merge objects to target,return differences.
 * @param target
 * @param args
 * @returns null|object
 */
export function mergeObject<A = object>(target: A, ...args: A[]) {
  const diff = {};
  let counter = 0;
  args.map(obj => {
    const _diff = diffObject(target, obj);
    if (_diff) {
      Object.assign(diff, _diff);
      counter++;
    }
  });
  if (counter > 0) {
    Object.assign(target, diff);
    return diff;
  }
  return null;
}

export function randomId() {
  return (
    new Date().getTime().toString(16) +
    Math.random()
      .toString(16)
      .substr(2)
  ).substr(2, 16);
}

export function initAnyProviders<CTX extends { providers: Array<any> }, Provider extends { data?: object | (() => object) }>(
  ctx: CTX,
  providers: IMKeyValue<IMProviderCustom<CTX, Provider>>,
  store: IMKeyValue
) {
  // provider data bank
  objKeys(providers, _tid => {
    const provider = providers[_tid];
    // data must be an object
    const _provider = new provider(ctx as any);
    console.info(_provider);
    store[_tid] = store[_tid] || {};
    // get provider initial data
    let _defData = _provider.data || {};
    _defData = typeof _defData === "function" ? _defData() : _defData;
    // assign initial provider data
    Object.assign(store[_tid], _defData);
    // redefined data attr
    Object.defineProperty(_provider, "data", {
      enumerable: true,
      configurable: false,
      get() {
        const _bid = _tid;
        return store[_bid];
      },
      set(v: any) {
        throw Error(`Provider data can not be replaced,please use Object.assign() instead.`);
      }
    });
    ctx.providers[_tid] = _provider;
    ctx.providers.push(_provider as any);
  });
}

export function precision(num: number, fixed: number = 2) {
  return +num.toFixed(fixed);
}

export function whileMap<RItem = any, Item = any>(arr: Item[], cb: (item: Item, idx: number, arr: Item[]) => RItem) {
  const ret: RItem[] = [];
  whileFor(arr, (...arg) => {
    ret.push(cb(...arg));
  });
  arr = null as any;
  cb = null as any;
  return ret;
}

export function whileFor<Item = any>(arr: Item[], cb: (item: Item, idx: number, arr: Item[]) => void): void {
  if (arr.length === 0) return;
  let _slen = arr.length - 1;
  let _len = _slen;
  let idx;
  while (_len >= 0) {
    idx = _slen - _len;
    cb(arr[idx], idx, arr);
    _len--;
  }
  // 清理缓存
  _len = null as any;
  _slen = null as any;
  arr = null as any;
  cb = null as any;
  idx = null as any;
}
