import { Topic } from "../Topic/vt";
import { LayoutModeEnum, BRANCH_BETWEEN, ROOT_SPACE, IMLayoutMindBorder } from ".";
import { Mind } from "../Mind/vm";
import { whileFor } from "../../utils/tools";
import { centerRoot } from "../../utils/layout";

export class LeftMode {
  mode = "left";
  /**
   * set topic direction width current mode
   */
  direction(topic: Topic) {
    _direction(topic);
  }
  position(vm: Mind) {
    return _position(vm);
  }
  layout(vm: Mind, force: boolean = false) {
    // force redirection
    if (force === true) {
      _direction(vm.rootTopic);
      // 画布窗口居中
      vm.layout.centerCanvas();
    }
    // 根节点画布居中
    centerRoot(vm);
    // reposition
    return this.position(vm);
  }
}
function _direction(topic: Topic) {
  let dir = LayoutModeEnum.center;
  // root topic has no direction at all
  if (topic.isBranch) dir = LayoutModeEnum.left;
  else if (topic.branch) dir = topic.branch.direction;
  topic.direction = dir;
  whileFor(topic.children, child => _direction(child));
}
function _position(vm: Mind) {
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
  return _directionBranches(root, branches);
}
function _directionBranches(root: Topic, branches: Topic[]): IMLayoutMindBorder {
  const rootPosition = root.view.getPosition();
  const rootSize = root.view.getEleRect();
  // to balance center position
  let totalHeight = BRANCH_BETWEEN;
  whileFor(branches, bch => {
    const _cont = bch.view.getEleRect("container");
    totalHeight += _cont.height + BRANCH_BETWEEN;
  });
  // desc[max->min]
  let beginX = rootPosition.left - ROOT_SPACE;
  // asc[min->max]
  let beginY = rootPosition.top + rootSize.height / 2 - totalHeight / 2;
  let mnx = 0;
  let mny = beginY;
  let mxx = rootPosition.left + rootSize.width / 2;
  let mxy = rootPosition.top + rootSize.height / 2;
  whileFor(branches, bch => {
    const _cont = bch.view.getEleRect("container");
    const left = beginX - _cont.width;
    mnx = Math.min(mnx, left);
    bch.view.setPosition({
      top: beginY,
      left
    });
    mxy = Math.max(beginY, mxy);
    beginY += _cont.height + BRANCH_BETWEEN;
  });

  return {
    leftTop: [mnx, mny],
    rightBottom: [mxx, mxy]
  };
}
