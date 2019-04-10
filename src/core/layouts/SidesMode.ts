import { Topic } from "../Topic";
import { LayoutModeEnum } from ".";
import { Mind } from "../Mind";
import { IMLayoutMindBorder } from "../Mind/layout";

export class SidesMode {
  mode = "sides";
  /**
   * set topic direction width current mode
   */
  direction(topic: Topic) {
    if (topic.isRoot) return;
    // just update branches's direction,no changes for free topic
    if (topic.isBranch) {
      const left = topic.root.children.filter(topic => topic.direction === LayoutModeEnum.left);
      const right = topic.root.children.filter(topic => topic.direction === LayoutModeEnum.right);
      console.info(left, right);
      topic.attr("direction", left.length > right.length ? LayoutModeEnum.right : LayoutModeEnum.left);
    } else if (topic.branch) topic.attr("direction", topic.branch.direction);
  }
  layout(vm: Mind, force: boolean = false): IMLayoutMindBorder {
    const { leftTop: l_tl, rightBottom: l_rb } = vm.layout.getLayoutMode(LayoutModeEnum.left).layout(vm, true);
    const { leftTop: r_tl, rightBottom: r_rb } = vm.layout.getLayoutMode(LayoutModeEnum.right).layout(vm, true);
    return {
      leftTop: [Math.min(l_tl[0], r_tl[0]), Math.min(l_tl[1], r_tl[1])],
      rightBottom: [Math.max(l_rb[0], r_rb[0]), Math.max(l_rb[1], r_rb[1])]
    };
  }
}
