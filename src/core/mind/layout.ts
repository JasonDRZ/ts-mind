import { Mind } from ".";
import { precision } from "../../utils/tools";
// import { LayoutMode } from "../layouts";
import { eleAbsolute } from "../../utils/view";

export interface IMLayoutMindBorder {
  leftTop: [number, number];
  rightBottom: [number, number];
}

export class MindLayout {
  vm: Mind;
  data = {
    // recoder the max border of view-port.
    /**
     * border position
     * [*(mnx,mny)        ]
     * |                  |
     * |       Mind       |
     * |                  |
     * [        (mxx,mxy)*]
     */
    border: {
      leftTop: [0, 0],
      rightBottom: [0, 0]
    }
  };
  constructor(vm: Mind) {
    this.vm = vm;
  }
  layout = (force: boolean = false) => {
    console.warn("LAYOUT!!");
    this.positionBranches(force);
    // 只有在root节点居中后才能获取正确的坐标
    this.centerRoot(force);
    this.centerCanvas(force);
  };
  // set root topic to center position
  centerRoot = (force: boolean = false) => {
    const { w: cw, h: ch } = this.vm.view.getSize();
    const {
      topicBox: { w: rcw, h: rch }
    } = this.vm.rootTopic.view.getSize();
    const position = {
      x: precision(cw / 2 - rcw / 2),
      y: precision(ch / 2 - rch / 2)
    };
    eleAbsolute(this.vm.rootTopic.view.$els.container);
    this.vm.rootTopic.view.setPosition(position);
  };
  // center scroll position
  centerCanvas = (force: boolean = false) => {
    if (!force) return;
    const { container } = this.vm.view.$el;
    container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;
    container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
  };
  // layout branches
  positionBranches = (force: boolean = false) => {
    // const mode = this.vm.options.mode;
    // const branches = this.vm.rootTopic.children.filter(bc => bc.isBranch);
    // setTimeout(() => {
    //   const border = mode in LayoutMode ? LayoutMode[mode](this.vm, branches, force) : LayoutMode.right.layout(this.vm);
    //   this.updateBorder(border, force);
    // }, 0);
  };
  // private updateBorder = (border: IMLayoutMindBorder, force: boolean = false) => {
  //   this.data.border = border;
  //   this.vm.view.updateSize(
  //     {
  //       width: border.leftTop[0] - border.rightBottom[0],
  //       height: border.leftTop[1] - border.rightBottom[1]
  //     },
  //     this.layout.bind(this, force)
  //   );
  // };
}
