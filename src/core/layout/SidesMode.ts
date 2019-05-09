import { Topic } from "../Topic/vt";
import { LayoutModeEnum, IMLayoutMindBorder } from ".";
import { Mind } from "../Mind/vm";
import { centerRoot } from "../../utils/layout";
import { objValues, whileFor } from '../../utils/tools';

export class SidesMode {
  mode = "sides";
  /**
   * set topic direction width current mode
   */
  direction(topic: Topic) {
    _direction(topic);
  }
  position(vm: Mind): IMLayoutMindBorder {
    return _position(vm);
  }
  layout(vm: Mind, force: boolean = false): IMLayoutMindBorder {
    if (force === true) {
      // 强制进行方向计算
      _direction(vm.rootTopic, true);
      // 画布窗口居中
      vm.layout.centerCanvas();
    }
    // 根节点画布居中
    centerRoot(vm);
    // 基于根节点位置计算其他节点位置
    return this.position(vm);
  }
}
function _calcCurrentDirection(rootTopic: Topic) {
  // 对比法进行下一个Topic方向确认
  const left = rootTopic.children.filter(_topic => _topic.direction === LayoutModeEnum.left);
  const right = rootTopic.children.filter(_topic => _topic.direction === LayoutModeEnum.right);
  return left.length > right.length ? LayoutModeEnum.right : LayoutModeEnum.left;
}
function _direction(topic: Topic, redirectionAll: boolean = false) {
  const rootTopic = topic.vm.rootTopic;
  let dir = LayoutModeEnum.center;
  if (redirectionAll) {
    // 重新计算所有分支的方向
    rootTopic.direction = dir;
    whileFor(rootTopic.children, child => child.direction = dir);
    objValues<Topic>(rootTopic.children, branch => {
      branch.direction = _calcCurrentDirection(rootTopic);
      // 同步子节点
      whileFor(topic.children, child => _direction(child));
    });
  } else {
    if (topic.isBranch) {
      dir = _calcCurrentDirection(rootTopic);
    } else if (!!topic.branch) {
      // 更新Topic的direction属性
      dir = topic.branch.direction;
    } else
      topic.direction = dir;
  }
}
function _position(vm: Mind): IMLayoutMindBorder {
  // 分别调用左右布局的方法进行位置计算
  const { leftTop: l_tl, rightBottom: l_rb } = vm.layout.getModeLayout(LayoutModeEnum.left).layout(vm);
  const { leftTop: r_tl, rightBottom: r_rb } = vm.layout.getModeLayout(LayoutModeEnum.right).layout(vm);
  return {
    leftTop: [Math.min(l_tl[0], r_tl[0]), Math.min(l_tl[1], r_tl[1])],
    rightBottom: [Math.max(l_rb[0], r_rb[0]), Math.max(l_rb[1], r_rb[1])]
  };
}
