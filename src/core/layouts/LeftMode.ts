import { Topic } from "../Topic";
import { LayoutModeEnum, BRANCH_BETWEEN, ROOT_SPACE } from ".";
import { Mind } from "../Mind";
import { whileFor } from "../../utils/tools";
import { eleAbsolute } from "../../utils/view";
import { IMLayoutMindBorder } from "../Mind/layout";
import { centerCanvas, centerRoot } from "../../utils/layout";

export class LeftMode {
  mode = "left";
  /**
   * set topic direction width current mode
   */
  direction(topic: Topic) {
    // root topic has no direction at all
    if (topic.isRoot) return;
    topic.attr("direction", LayoutModeEnum.left);
  }
  layout(vm: Mind, force: boolean = true) {
    centerCanvas(vm, force);
    centerRoot(vm, force);
    return this._layout(vm, force);
  }
  private _layout(vm: Mind, force: boolean) {
    const root = vm.rootTopic;
    const branches: Topic[] = [];
    const frees: Topic[] = [];
    whileFor(root.children, topic => {
      if (topic.direction === LayoutModeEnum.left) {
        if (topic.isBranch) branches.push(topic);
        if (topic.isFree) frees.push(topic);
      }
    });
    // TODO: compare view coordinates width free topics
    return this.layoutBranches(root, branches);
  }
  private layoutBranches(root: Topic, branches: Topic[]): IMLayoutMindBorder {
    const rootPosition = root.view.getPosition();
    const rootSize = root.view.getSize().container;
    // to balance center position
    let totalHeight = BRANCH_BETWEEN;
    whileFor(branches, bch => {
      eleAbsolute(bch.view.$els.container);
      const _cont = bch.view.getSize().container;
      totalHeight += _cont.h + BRANCH_BETWEEN;
    });
    // desc[max->min]
    let beginX = rootPosition.x - (rootSize.w / 2 + ROOT_SPACE);
    // asc[min->max]
    let beginY = rootPosition.y - (rootSize.h / 2 + totalHeight / 2 + BRANCH_BETWEEN);
    let mnx = 0;
    let mny = beginY;
    let mxx = rootPosition.x + rootSize.w / 2;
    let mxy = rootPosition.y + rootSize.h / 2;
    console.info(beginX, beginY, mnx, mny, mxx, mxy);
    whileFor(branches, bch => {
      const _cont = bch.view.getSize().container;
      const x = beginX - _cont.w;
      mnx = Math.min(mnx, x);
      eleAbsolute(bch.view.$els.container);
      console.info(beginX, beginY, x, _cont);
      bch.view.setPosition({
        y: beginY,
        x
      });
      mxy = Math.max(beginY, mxy);
      beginY += _cont.h + BRANCH_BETWEEN;
    });

    return {
      leftTop: [mnx, mny],
      rightBottom: [mxx, mxy]
    };
  }
}
