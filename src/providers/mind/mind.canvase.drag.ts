import { MindProvider } from "../../core/Mind/defs";
import { throttle, precision } from "../../utils/tools";
import { createElement } from "../../utils/view";
function isTouchEvent(e: any): e is TouchEvent {
  return Object.prototype.hasOwnProperty.call(e, "touches");
}
const ZoomSpeed = 0.01;
const MaxZoomSize = 3;
const MinZoomSize = 0.5;
export class CanvasDrag extends MindProvider {
  dragArea: HTMLDivElement;
  mounted() {
    this.dragArea = createElement("div");
    this.dragArea.style.display = "table";
    this.dragArea.appendChild(this.vm.view.$els.canvas);
    this.vm.view.$els.stage.appendChild(this.dragArea);
    this.mouseDrag();
    this.wheelScroll();
    this.wheelZoom();
  }
  currentZoom: number = 1;
  zoom = (size: number, origin: { x: number | string; y: number | string } = { x: "50%", y: "50%" }) => {
    const { canvas } = this.vm.view.$els;
    canvas.style.transformOrigin = `${typeof origin.x === "number" ? `${origin.x}px` : origin.x} ${
      typeof origin.y === "number" ? `${origin.y}px` : origin.y
    }`;
    canvas.style.transform = `scale3d(${size},${size},${size})`;
    this.currentZoom = size;
  };
  private wheelZoom() {
    // let origin: any;
    // this.dragArea.addEventListener("mousemove", e => {
    //   const { offsetX, offsetY } = e;
    //   origin = {
    //     x: Math.abs(precision(offsetX, 1)),
    //     y: Math.abs(precision(offsetY, 1))
    //   };
    //   console.info(e, origin);
    // });
    this.dragArea.addEventListener("wheel", e => {
      const { ctrlKey, deltaY } = e;
      if (ctrlKey) {
        const zoomSize = Math.min(MaxZoomSize, Math.max(MinZoomSize, precision(this.currentZoom - deltaY * ZoomSpeed)));
        if (zoomSize === this.currentZoom) return;
        this.zoom(zoomSize);
        // clearOrigin();
      }
    });
    // const clearOrigin = debounce(function() {
    //   console.info("====clearOrigin====");
    //   origin = undefined;
    // }, 50);
  }
  private mouseDrag() {
    const { stage } = this.vm.view.$els;
    let lastOffsetX: number;
    let lastOffsetY: number;
    let touchStartX: number;
    let touchStartY: number;
    let beginScrollLeft: number;
    let beginScrollTop: number;
    let flag = false;
    const dragBegin = (e: MouseEvent | TouchEvent) => {
      // 触屏
      if (isTouchEvent(e) && e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        flag = true;
      } else if (!e.ctrlKey) {
        flag = true;
      }
      beginScrollTop = stage.scrollTop;
      beginScrollLeft = stage.scrollLeft;
    };
    const draging = throttle((e: MouseEvent | TouchEvent) => {
      if (!flag) return;
      let clientX = 0;
      let clientY = 0;
      let diffX = 0;
      let diffY = 0;
      if (!isTouchEvent(e)) {
        clientX = e.clientX;
        clientY = e.clientY;
        diffX = lastOffsetX ? lastOffsetX - clientX : 0;
        diffY = lastOffsetY ? lastOffsetY - clientY : 0;
        lastOffsetX = clientX;
        lastOffsetY = clientY;
        stage.scrollLeft += diffX;
        stage.scrollTop += diffY;
      } else if (e.touches.length === 1) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
        diffX = touchStartX - clientX;
        diffY = touchStartY - clientY;
        stage.scrollLeft = beginScrollLeft + diffX;
        stage.scrollTop = beginScrollTop + diffY;
      }
    }, 1000 / 60);
    const dragEnd = () => {
      flag = false;
      lastOffsetX = 0;
      lastOffsetY = 0;
      beginScrollLeft = 0;
      beginScrollTop = 0;
      touchStartX = 0;
      touchStartY = 0;
    };
    // mobile
    this.dragArea.addEventListener("touchstart", dragBegin);
    window.addEventListener("touchmove", draging);
    window.addEventListener("touchend", dragEnd);
    // PC
    this.dragArea.addEventListener("mousedown", dragBegin);
    window.addEventListener("mousemove", draging);
    window.addEventListener("mouseup", dragEnd);
  }
  private wheelScroll() {
    const { stage } = this.vm.view.$els;
    stage.addEventListener(
      "wheel",
      throttle(e => {
        const { ctrlKey, deltaX, deltaY } = e;
        if (!ctrlKey) {
          stage.scrollLeft += deltaX;
          stage.scrollTop += deltaY;
        }
      }, 1000 / 60)
    );
  }
}
