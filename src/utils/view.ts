import { objValues } from "./tools";

export function createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K] {
  return document.createElement(tagName, options);
}

export function createElementWidthClassName<K extends keyof HTMLElementTagNameMap>(className: string, tagName: K): HTMLElementTagNameMap[K] {
  const el = createElement(tagName);
  el.className = className;
  return el;
}

export function applyElementStyle(el: HTMLElement, style: IMCSSStyleMap) {
  Object.keys(style).map(sn => (el.style[sn] = style[sn]));
}

export function updateElePosition(ele: HTMLElement, position: IMPositionDefect) {
  return fastDom.mutate(() =>
    objValues(position, (v, k) => {
      ele.style[k] = `${v}px`;
    })
  );
}

export function eleAbsolute(ele: HTMLElement) {
  ele.style.position !== "absolute" && (ele.style.position = "absolute");
}

export function emptyRect() {
  return new (DOMRect || ClientRect)();
}

/**
 * FastDom
 */
const _requestAnimationFrame = (cb: IMAnyCall) => Promise.resolve().then(cb) ||
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window["mozRequestAnimationFrame"] ||
  window["msRequestAnimationFrame"] ||
  function (cb: IMAnyCall) {
    return setTimeout(cb, 16);
  };
const runTasks = (tasks: IMAnyCall[]) => {
  let task;
  // 先进先出
  while ((task = tasks.shift())) {
    task();
  }
};
const scheduleFlush = (fastDom: FastDom) => {
  if (!fastDom.scheduleFlag) {
    fastDom.scheduleFlag = true;
    _requestAnimationFrame(() => flush(fastDom));
  }
};
const flush = (fastDom: FastDom) => {
  try {
    // 优先执行写入操作
    runTasks(fastDom.writes);
    // 随后进行读取操作
    runTasks(fastDom.reads);
  } catch (error) {
    console.error(error);
  }
  fastDom.scheduleFlag = false;
  // 避免漏掉
  if (fastDom.reads.length || fastDom.writes.length) scheduleFlush(fastDom);
};
function remove(tasks: IMAnyCall[], cb: IMAnyCall) {
  var index = tasks.indexOf(cb);
  return !!~index && !!tasks.splice(index, 1);
}
function taskPromise<RET = any>(fastDom: FastDom, cb: IMAnyCall<[], RET>, tasks: IMAnyCall[]) {
  return new Promise((resolve, reject) => {
    tasks.push(() => {
      let res: RET;
      try {
        res = cb();
      } catch (error) {
        return reject(error);
      }
      resolve(res);
    });
    scheduleFlush(fastDom);
  });
}
class FastDom {
  reads: IMAnyCall[] = [];
  writes: IMAnyCall[] = [];
  scheduleFlag: boolean = false;
  measure = <RET = any>(cb: IMAnyCall<[], RET>) => {
    return taskPromise(this, cb, this.reads);
  };
  mutate = <RET = any>(cb: IMAnyCall<[], RET>) => {
    return taskPromise(this, cb, this.writes);
  };
  clear = <RET = any>(cb: IMAnyCall<[], RET>) => {
    return remove(this.reads, cb) || remove(this.writes, cb);
  };
}

export const fastDom = new FastDom();
