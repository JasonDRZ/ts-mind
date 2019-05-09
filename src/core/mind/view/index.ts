import { Mind } from "../vm";
import { createElement, fastDom, emptyRect } from "../../../utils/view";
import { objValues, mergeObject } from "../../../utils/tools";
import { bindNodeEvents } from "./methods";

const classNames = {
  canvas: "tsm-canvas",
  stage: "tsm-stage"
};
interface IMMindViewEles {
  canvas: HTMLDivElement;
  stage: HTMLDivElement;
}
// 默认画布大小
const DEFAULT_CANVAS_SIZE = { width: 10600, height: 6000 };

export class MindView {
  root: Element;
  $els: IMMindViewEles;
  constructor(public vm: Mind) {
    this.vm = vm;

    const root = typeof vm.options.container === "string" ? document.getElementById(vm.options.container) : vm.options.container;
    if (!root) {
      throw Error(`The basic container element is not found!`);
    }
    this.root = root;
    this.createNodes();
  }
  createNodes = () => {
    this.$els = {
      canvas: createElement("div"),
      stage: createElement("div")
    };
    this.$els.canvas.className = classNames.canvas;
    this.$els.stage.className = classNames.stage;
    this.$els.stage.append(this.$els.canvas);
  };
  mount = () => {
    this.vm.$beforeMount();
    // mount container to root node
    this.root.appendChild(this.$els.stage);
    bindNodeEvents(this.vm);
    this.setCanvasSizeSync();
    this.vm.$mounted();
  };
  canvasSize: IMSize = { width: 0, height: 0 };
  setCanvasSizeSync = (size: IMSize = DEFAULT_CANVAS_SIZE) => {
    const update = mergeObject(this.canvasSize, size);
    if (update) {
      objValues(update, (v, k) => {
        this.$els.canvas.style[k] = `${v}px`;
      });
      // 立即更新元素布局数据，否则后续会出现clientRect未更新的问题
      this.updateEleRectSync();
    }
    return update;
  }
  setCanvasSize = (size: IMSize = DEFAULT_CANVAS_SIZE): Promise<IMSizeDefect | undefined> => {
    // 缓存设置的宽高，避免多次访问
    return new Promise((resolve, reject) => {
      fastDom
        .mutate(this.setCanvasSizeSync.bind(this, size))
        .then((update) => {
          if (update) {
            resolve();
          }
          else reject()
        })
    });
  };
  // 同步更新
  updateEleRectSync = () => {
    let modified = false;
    objValues<HTMLElement>(this.$els, ele => {
      const last = ele._clientRect;
      const latest = ele.getBoundingClientRect();
      if (!last || mergeObject(last, latest)) {
        modified = true;
      }
      console.info(ele, latest);
      ele._clientRect = latest;
    });
    return modified;
  };
  getEleRect = (ele: keyof IMMindViewEles = "canvas"): DOMRect | ClientRect => {
    const _ele = this.$els[ele];
    return !_ele ? emptyRect() : _ele._clientRect || emptyRect();
  };
  updateEleRect = (noLayout: boolean = false) => {
    return new Promise((res, rej) => {
      this.updateEleRectSync() ? res(true) : rej();
    }).then((modified) => {
      !noLayout && modified && this.vm.layout.layout();
      return modified;
    });
  };
}
