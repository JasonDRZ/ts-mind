import { addEvent } from "../../../utils/dom";
import { Topic } from "../../Topic/vt";
import { LayoutModeEnum } from "../../layout";
import { Mind } from "../vm";
export function bindNodeEvents(vm: Mind) {
  addEvent(window, "keydown", e => {
    vm.topicCurrentFocus = vm.topicCurrentFocus || vm.getSelectedTopics().pop() || vm.rootTopic;
    let moveTo;
    if (!vm.topicCurrentFocus) return;
    console.info(e.code);
    switch (e.code) {
      case "ArrowDown": {
        // 按“↓”方向键时要做的事。
        moveTo = selectUpDown(vm.topicCurrentFocus);
        break;
      }
      case "ArrowUp": {
        // 按“↑”方向键时要做的事。
        moveTo = selectUpDown(vm.topicCurrentFocus, true);
        break;
      }
      case "ArrowLeft": {
        // 按“←”方向键时要做的事。
        moveTo = selectLeftRight(vm.topicCurrentFocus, true);
        break;
      }
      case "ArrowRight": {
        // 按“→”方向键时要做的事。
        moveTo = selectLeftRight(vm.topicCurrentFocus);
        break;
      }
    }
    if (moveTo) {
      moveTo.focus(true);
    }
    console.info(moveTo);

    switch (e.code) {
      case "Enter":
        // 按“回车”键时要做的事。
        break;
      case "Escape":
        // 按“ESC”键时要做的事。
        vm.topicCurrentFocus.focus(false);
        break;
      case "Backspace": {
        vm.topicCurrentFocus.remove();
        vm.topicCurrentFocus = undefined;
        break;
      }
    }
  });
}
// 上下走向进行聚焦
function selectUpDown(topic: Topic, goUp: boolean = false, srcTopic: Topic = topic, level: string[] = ["a"]): Topic | undefined {
  const parent = topic.parent;
  if (topic.direction === LayoutModeEnum.right || topic.direction === LayoutModeEnum.left) {
    if (parent) {
      const pchildren = parent.isRoot ? parent.children.filter(t => t.direction === srcTopic.direction) : parent.children;
      // 同父节点
      if (parent.id === (srcTopic.parent!.id || "")) {
        const prev = parent.isRoot
          ? pchildren.find(t => (goUp ? t.index <= topic.index - 1 : t.index >= topic.index + 1))
          : pchildren[goUp ? topic.index - 1 : topic.index + 1];
        return prev || selectUpDown(parent, goUp, srcTopic, (level.push("a"), level));
      } else {
        // 异父节点
        let select = pchildren.find(t => (goUp ? t.index <= topic.index - 1 : t.index >= topic.index + 1));
        select &&
          level.map(() => {
            if (select) {
              const _ = select.children[goUp ? select.children.length - 1 : 0];
              if (_) {
                select = _;
              }
            }
          });
        return select || selectUpDown(parent, goUp, srcTopic, (level.push("a"), level));
      }
    }
  } else if (topic.direction === LayoutModeEnum.bottom || topic.direction === LayoutModeEnum.top) {
    // 如果是上下结构，则采用左右走向进行上下选择
    return selectLeftRight(topic, goUp);
  }
  return undefined;
}
// 左右走向聚焦
function selectLeftRight(topic: Topic, goleft: boolean = false): Topic | undefined {
  if (topic.direction === LayoutModeEnum.right) {
    if (goleft) return topic.parent;
    else return topic.expanded ? topic.children[0] : undefined;
  } else if (topic.direction === LayoutModeEnum.left) {
    if (goleft) return topic.expanded ? topic.children[0] : undefined;
    else return topic.parent;
  } else if (topic.direction === LayoutModeEnum.bottom || topic.direction === LayoutModeEnum.top) {
    // 若是上下结构，则采用上下走向进行选择
    return selectUpDown(topic, goleft);
  } else if (topic.direction === LayoutModeEnum.center) {
    return topic.children.filter(t => t.direction === (goleft ? LayoutModeEnum.left : LayoutModeEnum.right))[0];
  }
  if (goleft) return topic.expanded ? topic.children[0] : undefined;
  else return topic.parent;
}
