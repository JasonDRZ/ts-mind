import { doc } from "utils/dom";
import { cvsBezierto, cvsClear } from "utils/canvas";
import { Canvas } from "./canvas";
import TSMind from "core.2";

export class Line {
  element: HTMLCanvasElement = doc.createElement("canvas");
  context: CanvasRenderingContext2D = this.element.getContext("2d") as CanvasRenderingContext2D;
  canvas: Canvas;
  mind: TSMind;

  constructor(mind: TSMind, canvas: Canvas) {
    this.canvas = canvas;
    this.mind = mind;
  }

  clearLines = () => {
    cvsClear(this.context, 0, 0, this.canvas.size.w, this.canvas.size.h);
  };

  showLines = () => {
    this.clearLines();
    const nodes = this.mind.vm.nodesMap;
    let node = null;
    let pin = null;
    let pout = null;
    const _offset = this.get_view_offset();
    for (const nodeId in nodes) {
      if (!nodeId) continue;
      node = nodes[nodeId];
      if (!!node.isRoot) {
        continue;
      }
      if (!node.expanded) {
        continue;
      }
      pin = this.layout.get_node_point_in(node);
      pout = this.layout.get_node_point_out(node.parent);
      this.drawLine(pout, pin, _offset);
    }
  };

  drawLine = (pin: IM2DAxisData, pout: IM2DAxisData, offset: IM2DAxisData) => {
    const context = this.context;
    context.strokeStyle = this.mind.options.view.line_color;
    context.lineWidth = this.mind.options.view.line_width;
    context.lineCap = "round";
    cvsBezierto(context, pin.x + offset.x, pin.y + offset.y, pout.x + offset.x, pout.y + offset.y);
  };
}
