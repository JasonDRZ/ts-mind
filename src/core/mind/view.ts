import { Mind } from ".";
import { createDivElement } from "../../utils/view";

const CANVAS_SIZE = 5;

export class MindView {
  $el: {
    canvas: HTMLDivElement;
    container: HTMLDivElement;
  };
  vm: Mind;
  constructor(vm: Mind) {
    this.vm = vm;

    const root = typeof vm.options.container === "string" ? document.getElementById(vm.options.container) : vm.options.container;
    if (!root) {
      throw Error(`The basic container element is not found!`);
    }
    this.initElement(root);
  }
  initElement(root: HTMLElement) {
    this.$el = {
      canvas: createDivElement(),
      container: createDivElement()
    };
    this.$el.canvas.className = this.vm.options.classNames.canvas;
    this.$el.container.className = this.vm.options.classNames.container;
    this.$el.container.append(this.$el.canvas);
    // set container's style
    this.$el.container.style.width = "100%";
    this.$el.container.style.height = "100%";
    this.$el.container.style.overflow = "hidden";
    // mount container to root node
    root.appendChild(this.$el.container);
    this.setSize();
  }
  addNode = (el: Node) => {
    this.$el.canvas.append(el);
  };
  getSize = () => {
    const el = this.$el.canvas;
    console.info(el.clientWidth, el.clientHeight);
    return {
      w: el.clientWidth,
      h: el.clientHeight
    };
  };
  setSize = (
    size: { w: number; h: number } = { w: this.$el.container.clientWidth * CANVAS_SIZE, h: this.$el.container.clientHeight * CANVAS_SIZE }
  ) => {
    const { w, h } = size;
    const el = this.$el.canvas;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
  };
  // 保持画布为有效脑图区域的2.5倍大小
  updateSize = (
    size: { width: number; height: number } = { width: this.$el.container.clientWidth, height: this.$el.container.clientHeight },
    call = () => {}
  ) => {
    const { w, h } = this.getSize();
    const { clientWidth, clientHeight } = this.$el.container;
    //
    const view = {
      width: Math.max(size.width, clientWidth),
      height: Math.max(size.height, clientHeight)
    };
    const newSize = {
      w,
      h
    };
    let shouldUpdate = false;
    if (view.width > w / CANVAS_SIZE) {
      newSize.w = view.width * CANVAS_SIZE;
      shouldUpdate = true;
    }
    if (view.height > h / CANVAS_SIZE) {
      newSize.h = view.height * CANVAS_SIZE;
      shouldUpdate = true;
    }
    if (shouldUpdate) {
      this.setSize(newSize);
      call();
    }
  };
}
