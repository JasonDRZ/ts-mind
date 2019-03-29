import { Mind } from ".";
import { createDivElement } from "utils/view";

export class MindView {
  $el: HTMLDivElement;
  vm: Mind;
  constructor(vm: Mind) {
    this.vm = vm;
  }
  initElement() {
    this.$el = createDivElement();
    this.$el.className = this.vm.options.mind.className;
  }
  addNode = (el: Node) => {
    this.$el.append(el);
  };
  getSize = () => {
    const el = this.$el;
    return {
      w: el.clientWidth,
      h: el.clientHeight
    };
  };
  setSize = (size: { w: number; h: number }) => {
    const { w, h } = size;
    const el = this.$el;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    return size;
  };
}
