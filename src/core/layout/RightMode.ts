import { Topic } from "../Topic/vt";
import { LayoutModeEnum, BRANCH_BETWEEN, ROOT_SPACE, IMLayoutMindBorder } from ".";
import { Mind } from "../Mind/vm";
import { whileFor } from "../../utils/tools";
import { centerRoot } from "../../utils/layout";

export class RightMode {
  mode = "right";
  /**
   * set topic direction width current mode
   */
  direction(topic: Topic) {
    _direction(topic);
  }
  position(vm: Mind) {
    return _position(vm);
  }
  layout(vm: Mind, force: boolean = false): IMLayoutMindBorder {
    // force redirection
    if (force === true) {
      _direction(vm.rootTopic);
      // 画布窗口居中
      vm.layout.centerCanvas();
    }
    // 根节点画布居中
    centerRoot(vm);

    // reposition
    return _position(vm);
  }
}
function _direction(topic: Topic) {
  let dir = LayoutModeEnum.center;
  // root topic has no direction at all
  if (topic.isBranch) dir = LayoutModeEnum.right;
  else if (topic.branch) dir = topic.branch.direction;
  topic.direction = dir;
  whileFor(topic.children, child => _direction(child));
}
function _position(vm: Mind): IMLayoutMindBorder {
  const root = vm.rootTopic;
  const branches: Topic[] = [];
  const frees: Topic[] = [];
  whileFor(root.children, topic => {
    if (topic.direction === LayoutModeEnum.right) {
      if (topic.isBranch) branches.push(topic);
      if (topic.isFree) frees.push(topic);
    }
  });
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
  // asc[min->max]
  let beginX = rootPosition.left + rootSize.width + ROOT_SPACE;
  // asc[min->max]
  let beginY = rootPosition.top + rootSize.height / 2 - totalHeight / 2;
  let mnx = rootPosition.left - rootSize.width / 2;
  let mny = Math.min(beginY, rootPosition.top - rootSize.height / 2);
  let mxx = beginX;
  let mxy = beginY;

  whileFor(branches, bch => {
    const _cont = bch.view.getEleRect("container");
    const xw = _cont.width + beginX;

    bch.view.setPosition({
      top: beginY,
      left: beginX
    });
    beginY += _cont.height + BRANCH_BETWEEN;
    mxy = Math.max(beginY, mxy);
    mxx = Math.max(mxx, xw);
  });

  return {
    leftTop: [mnx, mny],
    rightBottom: [mxx, mxy]
  };
}
