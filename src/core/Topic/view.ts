import { Topic } from ".";
import { createElementWidthClassName, applyElementStyle, updateElePosition } from "../../utils/view";
import { IMTopicOptionsDef } from "./defs";
import { mergeObject } from "../../utils/tools";
import { LayoutModeEnum } from "../layouts";

export class TopicView {
  public vt: Topic;
  public opts: IMTopicOptionsDef;
  // bounded html elements
  public $els: {
    // this is for directly children group
    container: HTMLDivElement;
    // this is topic element
    topicBox: HTMLDivElement;
    topic: HTMLDivElement;
    // this is topic children container,could be replaced width another node
    children: HTMLDivElement;
  };

  constructor(vt: Topic) {
    this.vt = vt;
    this.opts = vt.options;
    this.initElements();
  }
  getSize = () => {
    const { container, topic, topicBox, children } = this.$els;
    return {
      container: {
        w: container.clientWidth,
        h: container.clientHeight
      },
      topicBox: {
        w: topicBox.clientWidth,
        h: topicBox.clientHeight
      },
      topic: {
        w: topic.clientWidth,
        h: topic.clientHeight
      },
      children: {
        w: children.clientWidth,
        h: children.clientHeight
      }
    };
  };
  public setPosition = (position: IMPosition = this.getPosition()) => {
    const hasChange = mergeObject(this.vt.data.view.position, position);
    hasChange && updateElePosition(this.$els.container, hasChange);
  };
  public getPosition = (): IMPosition => {
    return this.vt.data.view.position;
  };
  public clone = () => {
    return this.$els.container.cloneNode(true);
  };
  public initElements = (cloneNodes?: HTMLDivElement) => {
    const _classNames = this.opts.classNames;
    if (cloneNodes) {
      this.$els = {
        container: cloneNodes,
        children: (cloneNodes.getElementsByClassName(_classNames.children) as any) || createElementWidthClassName(_classNames["children"]),
        topicBox: (cloneNodes.getElementsByClassName(_classNames.topicBox) as any) || createElementWidthClassName(_classNames["topicBox"]),
        topic: (cloneNodes.getElementsByClassName(_classNames.topic) as any) || createElementWidthClassName(_classNames["topic"])
      };
    } else {
      this.$els = {
        container: createElementWidthClassName(_classNames.container),
        children: createElementWidthClassName(_classNames.children),
        topicBox: createElementWidthClassName(_classNames.topicBox),
        topic: createElementWidthClassName(_classNames.topic)
      };
      // bind custom style
      applyElementStyle(this.$els.topicBox, this.vt.options.style);
      this.$els.topic.innerText = this.vt.topic;
      this.$els.topicBox.appendChild(this.$els.topic);
      // append to container
      this.$els.container.appendChild(this.$els.topicBox);
      this.$els.container.appendChild(this.$els.children);

      this.$els.container.setAttribute("topic", this.vt.topic);
    }
    this.checkClassNames();
    this.changeModeClassName();
    // set id attr
    this.$els.topicBox.id = this.vt.id;
  };
  checkClassNames = () => {
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
  changeModeClassName = () => {
    if (!this.vt.isRoot)
      this.$els.container.className = `${this.$els.container.className.replace(/mode-[^\W]/, "")} mode-${LayoutModeEnum[this.vt.direction]}`;
  };
  // mount child topic
  public mount = () => {
    const cvt = this.vt;
    const ptv = this.vt.parent;
    cvt.$beforeMount();
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
      ptv.view.$els.children.style.display = null;
    }
    cvt.$mounted();
    return true;
  };
  // unmount self element
  public unmount = () => {
    // remove from parent children element list.
    this.vt.$unmounted();
  };
}

/**
 * theme manager is an inherit theme manager,to help line and topic theme rendering.
 */
export function themeManager() {
  // TODO: theme manager
  return "theme config";
}
