import { Topic } from "../Topic";
import { LayoutModeEnum, BRANCH_BETWEEN, ROOT_SPACE } from ".";
import { Mind } from "../Mind";
import { whileFor } from "../../utils/tools";
import { eleAbsolute } from "../../utils/view";
import { IMLayoutMindBorder } from "../Mind/layout";
import { centerCanvas, centerRoot } from "../../utils/layout";

export class RightMode {
  mode = "right";
  /**
   * set topic direction width current mode
   */
  direction(topic: Topic) {
    if (topic.isRoot) return;
    topic.attr("direction", LayoutModeEnum.right);
  }
  layout(vm: Mind, force: boolean = true): IMLayoutMindBorder {
    centerCanvas(vm, force);
    centerRoot(vm, force);
    return this._layout(vm, force);
  }
  private _layout(vm: Mind, force: boolean): IMLayoutMindBorder {
    const root = vm.rootTopic;
    const branches: Topic[] = [];
    const frees: Topic[] = [];
    whileFor(root.children, topic => {
      if (topic.direction === LayoutModeEnum.right) {
        if (topic.isBranch) branches.push(topic);
        if (topic.isFree) frees.push(topic);
      }
    });
    return this._layoutBranches(root, branches);
  }
  private _layoutBranches(root: Topic, branches: Topic[]): IMLayoutMindBorder {
    const rootPosition = root.view.getPosition();
    const rootSize = root.view.getSize().container;
    // to balance center position
    let totalHeight = BRANCH_BETWEEN;

    whileFor(branches, bch => {
      eleAbsolute(bch.view.$els.container);
      const _cont = bch.view.getSize().container;
      totalHeight += _cont.h + BRANCH_BETWEEN;
    });
    // asc[min->max]
    let beginX = rootPosition.x + rootSize.w / 2 + ROOT_SPACE;
    // asc[min->max]
    let beginY = rootPosition.y + rootSize.h / 2 - totalHeight / 2 + BRANCH_BETWEEN;
    let mnx = rootPosition.x - rootSize.w / 2;
    let mny = Math.min(beginY, rootPosition.y - rootSize.h / 2);
    let mxx = beginX;
    let mxy = beginY;

    whileFor(branches, bch => {
      const _cont = bch.view.getSize().container;
      const xw = _cont.w + beginX;

      bch.view.setPosition({
        y: beginY,
        x: beginX
      });
      beginY += _cont.h + BRANCH_BETWEEN;
      mxy = Math.max(beginY, mxy);
      mxx = Math.max(mxx, xw);
    });

    return {
      leftTop: [mnx, mny],
      rightBottom: [mxx, mxy]
    };
  }
}
