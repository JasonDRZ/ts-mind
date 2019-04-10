import { MindProvider } from "./../core/Mind/defs";
import { throttle } from "../utils/tools";
export class MindDrag extends MindProvider {
  static typeId = "mind-drag";
  mounted() {
    this.supportPC();
    console.info(`mounted drag`);
  }
  supportPC() {
    console.info("SUPPORT PC", this.vm);
    const { container, canvas } = this.vm.view.$el;
    let lastOffsetX: number;
    let lastOffsetY: number;
    let flag = false;
    canvas.onmousedown = () => {
      flag = true;
    };
    window.onmousemove = throttle(e => {
      if (!flag) return;
      const { clientX, clientY } = e;
      const diffX = lastOffsetX ? lastOffsetX - clientX : 0;
      const diffY = lastOffsetY ? lastOffsetY - clientY : 0;
      container.scrollLeft += diffX;
      container.scrollTop += diffY;
      lastOffsetX = clientX;
      lastOffsetY = clientY;
    }, 1000 / 60);
    window.onmouseup = () => {
      flag = false;
      lastOffsetX = 0;
      lastOffsetY = 0;
    };
    // container.onmouseleave = () => {
    //   // flag = false;a
    //   lastOffsetX = 0;
    //   lastOffsetY = 0;
    // };
  }
}
