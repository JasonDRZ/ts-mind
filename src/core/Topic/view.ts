import { Topic } from ".";
import { createElementWidthClassName, updateElePosition } from "../../utils/view";
import { IMTopicOptionsDef } from "./defs";
import { mergeObject } from "../../utils/tools";
import { LayoutModeEnum } from "../layout";
import { addEvent, removeEvent } from "../../utils/dom";
// element className map
const classNames = {
  container: "tsm-topic-container",
  topicBox: "tsm-topic-box",
  topic: "tsm-topic",
  children: "tsm-topic-children",
  expander: "tsm-topic-expander"
};
export class TopicView {
  opts: IMTopicOptionsDef;
  // bounded html elements
  $els: {
    // this is for directly children group
    container: HTMLDivElement;
    // this is topic element
    topicBox: HTMLDivElement;
    topic: HTMLDivElement;
    // this is topic children container,could be replaced width another node
    children: HTMLDivElement;
    expander?: HTMLSpanElement;
  };

  constructor(public vt: Topic) {
    this.opts = vt.options;
    this.initElements();
  }
  getSize = (ele: "container" | "topic" | "topicBox" | "children" = "topicBox") => {
    const _ele = this.$els[ele];
    return {
      w: _ele.clientWidth,
      h: _ele.clientHeight
    };
  };
  setPosition = (position: IMPosition = this.getPosition()) => {
    const hasChange = mergeObject(this.vt.data.layout.position, position);
    hasChange && updateElePosition(this.$els.container, hasChange);
  };
  getPosition = (): IMPosition => {
    return this.vt.data.layout.position;
  };
  clone = () => {
    return this.$els.container.cloneNode(true);
  };
  initElements = (cloneNodes?: HTMLDivElement) => {
    if (cloneNodes) {
      this.$els = {
        container: cloneNodes,
        children: (cloneNodes.getElementsByClassName(classNames.children) as any) || createElementWidthClassName(classNames.children, "div"),
        topicBox: (cloneNodes.getElementsByClassName(classNames.topicBox) as any) || createElementWidthClassName(classNames.topicBox, "div"),
        topic: (cloneNodes.getElementsByClassName(classNames.topic) as any) || createElementWidthClassName(classNames.topic, "div"),
        expander: (cloneNodes.getElementsByClassName(classNames.expander) as any) || createElementWidthClassName(classNames.expander, "span")
      };
    } else {
      this.$els = {
        container: createElementWidthClassName(classNames.container, "div"),
        children: createElementWidthClassName(classNames.children, "div"),
        topicBox: createElementWidthClassName(classNames.topicBox, "div"),
        topic: createElementWidthClassName(classNames.topic, "div"),
        expander: this.vt.isRoot ? undefined : createElementWidthClassName(classNames.expander, "span")
      };
      this.$els.topicBox.appendChild(this.$els.topic);
      this.$els.expander && this.$els.topicBox.appendChild(this.$els.expander);
      // append to container
      this.$els.container.appendChild(this.$els.topicBox);
      this.$els.container.appendChild(this.$els.children);
    }
    // 优先检测是否是展开路线
    this.expand();
    this.expanderVisiblity();
  };
  expanderVisiblity() {
    if (this.$els.expander) {
      this.$els.expander.style.display = this.vt.isRoot ? "none" : this.vt.children.length > 0 ? "block" : "none";
    }
  }
  expand = () => {
    if (this.$els.expander) {
      if (this.vt.expanded) {
        this.$els.expander.classList.add("expanded");
        this.$els.children.style.display = null;
      } else {
        this.$els.expander.classList.remove("expanded");
        this.$els.children.style.display = "none";
      }
    }
  };
  select = () => {
    if (this.vt.selected) {
      this.$els.topicBox.classList.add("selected");
    } else this.$els.topicBox.classList.remove("selected");
  };
  focus = () => {
    if (this.vt.focused) {
      this.$els.topicBox.classList.add("focus");
    } else this.$els.topicBox.classList.remove("focus");
  };

  changeModeClassName = () => {
    if (!this.vt.isRoot)
      this.$els.container.className = `${this.$els.container.className.replace(/mode-[^\W]/, "")} mode-${LayoutModeEnum[this.vt.direction]}`;
  };
  // mount child topic
  mount = () => {
    const cvt = this.vt;
    const ptv = this.vt.parent;
    setTimeout(() => {
      cvt.$beforeMount();

      this.checkClassNames();
      this.changeModeClassName();
      // set id attr
      this.$els.topicBox.id = this.vt.id;
      this.$els.topic.innerText = `NO.${this.vt.index}:${this.vt.topic}`;
      this.$els.container.setAttribute("topic", this.vt.topic);

      // mount
      this.setPosition();
      if (!ptv || ptv.isRoot) {
        // DOTO: mount to mind root node
        this.vt.vm.view.addNode(cvt.view.$els.container);
      } else {
        const _index = cvt.index; // -1 , 0, ....
        // deal cloned vtopic
        if (cvt.isClone) {
          // mount all children topics
          cvt.children.map(_cvt => cvt.view.mount());
        }
        if (Number.isFinite(_index)) {
          // append all together
          ptv.view.$els.children.appendChild(cvt.view.$els.container);
        } else {
          // insert before the brother node,which index is _index
          const _brother = ptv.view.$els.children.childNodes[_index];
          ptv.view.$els.children.insertBefore(cvt.view.$els.container, _brother);
        }
      }
      // 检测是否可展开
      ptv ? ptv.view.expanderVisiblity() : this.expanderVisiblity();
      this.bindEvents();
      cvt.$mounted();
    }, 0);
  };
  // unmount self element
  unmount = () => {
    if (!this.vt.parent) {
      return;
    }
    this.unbindEvents();
    if (this.vt.isBranch) {
      this.vt.vm.view.$els.canvas.removeChild(this.$els.container);
    } else this.vt.parent.view.$els.children.removeChild(this.$els.container);
    // remove from parent children element list.
    this.vt.$unmounted();
  };

  /**
   * 私有方法集
   */
  private checkClassNames = () => {
    const _boxClass = this.$els.topicBox.classList;
    // add branch className
    if (this.vt.isBranch) {
      _boxClass.add("branch-topic");
    } else _boxClass.remove("branch-topic");
    // add root className
    if (this.vt.isRoot) {
      this.$els.topicBox.classList.add("root-topic");
    }
    if (this.vt.children.length === 0) {
      this.$els.children.style.display = "none";
    }
  };
  private bindEvents() {
    this.$els.expander && addEvent(this.$els.expander, "click", this.expanderHandler);
    addEvent(this.$els.topicBox, "click", this.selectTopicHandler);
    addEvent(this.vt.vm.view.$els.canvas, "click", this.deselecteTopic);
  }
  private selectTopicHandler = (e: MouseEvent) => {
    e.stopPropagation();
    this.vt.select();
  };
  private deselecteTopic = (e: MouseEvent) => {
    if (e.target !== this.$els.topicBox) {
      this.vt.selected && this.vt.select(false);
      this.vt.vm.topicCurrentFocus && this.vt.vm.topicCurrentFocus.focus(false);
    }
  };
  private expanderHandler = (e: MouseEvent) => {
    e.stopPropagation();
    this.vt.expand();
  };
  private unbindEvents() {
    this.$els.expander && removeEvent(this.$els.expander, "click", this.expanderHandler);
    removeEvent(this.$els.topicBox, "click", this.selectTopicHandler);
    removeEvent(this.vt.vm.view.$els.canvas, "click", this.deselecteTopic);
  }
}

/**
 * theme manager is an inherit theme manager,to help line and topic theme rendering.
 */
export function themeManager() {
  // TODO: theme manager
  return "theme config";
}
