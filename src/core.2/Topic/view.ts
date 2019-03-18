import Topic from "./topic";
import { createDivElement } from "utils/view";
import { IMTopicOptionsDef } from "./defs";

function createElementWidthClassName(className: string) {
  const el = createDivElement();
  el.className = className;
  return el;
}

function applyTopicStyle(el: HTMLElement, style?: IMCSSStyleMap) {
  if (style) {
    Object.keys(style).map(sn => (el.style[sn] = style[sn]));
  }
}

export class TopicView {
  public vt: Topic;
  public opts: IMTopicOptionsDef;
  // bounded html elements
  public $el: {
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
  public initElements = (cloneNodes?: HTMLDivElement) => {
    const _classNames = this.opts.classNames;
    if (cloneNodes) {
      this.$el.container = cloneNodes;
      this.$el.children = (cloneNodes.getElementsByClassName(_classNames.children) as any) || createElementWidthClassName(_classNames["children"]);
      this.$el.topicBox = (cloneNodes.getElementsByClassName(_classNames.topicBox) as any) || createElementWidthClassName(_classNames["topicBox"]);
      this.$el.topic = (cloneNodes.getElementsByClassName(_classNames.topic) as any) || createElementWidthClassName(_classNames["topic"]);
    } else {
      Object.keys(_classNames).map(el => {
        this.$el[el] = createElementWidthClassName(_classNames[el]);
      });
      // bind custom style
      applyTopicStyle(this.$el.topicBox, this.vt.options.style);
      this.$el.topic.innerText = this.vt.topic;
      this.$el.topicBox.appendChild(this.$el.topic);
      // append to container
      this.$el.container.appendChild(this.$el.topicBox);
      this.$el.container.appendChild(this.$el.children);
    }
    const _boxClass = this.$el.topicBox.classList;
    // add branch className
    if (this.vt.isBranch) {
      _boxClass.add("branch-topic");
    } else _boxClass.remove("branch-topic");
    // add root className
    if (this.vt.isRoot) {
      this.$el.topicBox.classList.add("root-topic");
    }
    // set id attr
    this.$el.topicBox.id = this.vt.id;
  };
  // mount child topic
  public mount = () => {
    const cvt = this.vt;
    const ptv = this.vt.parent;
    cvt.$beforeMount();
    if (!ptv) {
      // DOTO: mount to mind root node
    } else {
      const _index = cvt.index; // -1 , 0, ....
      // deal cloned vtopic
      if (cvt.isClone) {
        // mount all children topics
        cvt.children.map(_cvt => cvt.view.mount());
      }

      if (Number.isFinite(_index)) {
        // append all together
        ptv.view.$el.children.appendChild(cvt.view.$el.container);
      } else {
        // insert before the brother node,which index is _index
        const _brother = ptv.view.$el.children.childNodes[_index];
        ptv.view.$el.children.insertBefore(cvt.view.$el.container, _brother);
      }
    }
    cvt.$mounted();
    return true;
  };
  // mount self element to some element
  public mountTo = (el: HTMLElement) => {
    const vt = this.vt;
    vt.$beforeMount();
    // deal cloned vtopic
    if (vt.isClone) {
      // mount all children topics
      vt.children.map(_cvt => vt.view.mount());
    }
    el.appendChild(this.$el.container);
    vt.$mounted();
    return true;
  };
  public updateTopic = (topic: string) => {
    this.$el.topic.innerText = topic;
  };
  // unmount self element
  public unmount = () => {
    // remove from parent children element list.
    this.vt.$unmounted();
  };
  public addChild = (vt: Topic) => {
    this.$el.children;
  };
  // add topic prefix element
  public addPrefixNode = (el: HTMLElement) => {};
  public addSuffixNode = (el: HTMLElement) => {};
}

export function cloneElement(ele: HTMLElement) {
  return ele.cloneNode(true);
}

/**
 * theme manager is an inherit theme manager,to help line and topic theme rendering.
 */
export function themeManager() {
  return "theme config";
}
