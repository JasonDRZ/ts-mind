import { Mind } from ".";
import { precision } from "utils/tools";
import { LayoutMode } from "core/layouts";

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
      mnx: 0,
      mny: 0,
      mxx: 0,
      mxy: 0
    }
  };
  constructor(vm: Mind) {
    this.vm = vm;
  }
  layout = (force: boolean = false) => {
    this.centerRoot();
  };
  // set root topic to center position
  centerRoot = () => {
    const { w: cw, h: ch } = this.vm.view.getSize();
    const {
      container: { w: rcw, h: rch }
    } = this.vm.rootTopic.view.getSize();
    const position = {
      x: precision(cw / 2 - rcw / 2),
      y: precision(ch / 2 - rch / 2)
    };
    this.vm.rootTopic.view.setPosition(position);
  };
  // layout branches
  positionBranches = (force: boolean) => {
    const mode = this.vm.options.mode;
    const branches = this.vm.rootTopic.children.filter(bc => bc.isBranch);
    if (mode in LayoutMode) {
      LayoutMode[mode](this.vm, branches, force);
    } else LayoutMode.right(this.vm, branches, true);
  };
}
