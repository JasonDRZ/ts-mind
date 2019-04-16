import { Mind } from ".";
import { createElement } from "../../utils/view";
import { addEvent } from "../../utils/dom";
import { Topic } from "../Topic";
import { LayoutModeEnum } from "../layout";

const classNames = {
  canvas: "tsm-canvas",
  stage: "tsm-stage"
};
export class MindView {
  root: Element;
  $els: {
    canvas: HTMLDivElement;
    stage: HTMLDivElement;
  };
  constructor(public vm: Mind) {
    this.vm = vm;

    const root = typeof vm.options.container === "string" ? document.getElementById(vm.options.container) : vm.options.container;
    if (!root) {
      throw Error(`The basic container element is not found!`);
    }
    this.root = root;
    this.initElement();
  }
  initElement = () => {
    this.$els = {
      canvas: createElement("div"),
      stage: createElement("div")
    };
    this.$els.canvas.className = classNames.canvas;
    this.$els.stage.className = classNames.stage;
    this.$els.stage.append(this.$els.canvas);
  };
  mount = () => {
    this.vm.$beforeMount();
    // mount container to root node
    this.root.appendChild(this.$els.stage);
    this.bindEvents();
    this.setCanvasSize();
    this.vm.$mounted();
  };
  addNode = (el: Node) => {
    this.$els.canvas.append(el);
  };
  getCanvasSize = () => {
    const el = this.$els.canvas;
    // 获取缓存size
    return el["size"];
  };
  setCanvasSize = (size: { w: number; h: number } = { w: 1920, h: 1080 }) => {
    const { w, h } = size;
    const el = this.$els.canvas;
    // 缓存设置的宽高，避免多次访问
    el["size"] = size;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
  };
  private bindEvents = () => {
    const vm = this.vm;
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
          break;
      }
    });
  };
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
