import { Topic } from "../vt";
import { createElementWidthClassName, updateElePosition, emptyRect, eleAbsolute } from "../../../utils/view";
import { mergeObject, objValues, whileFor, debounce } from "../../../utils/tools";
import { LayoutModeEnum } from "../../layout";
import { checkClassNames, bindNodeEvents, unbindEvents, updateRectDeep } from "./methods";

declare global {
  interface HTMLElement {
    _clientRect: DOMRect | ClientRect;
  }
}
// element className map
const classNames = {
  container: "tsm-topic-container",
  topicBox: "tsm-topic-box",
  topic: "tsm-topic",
  children: "tsm-topic-children",
  expander: "tsm-topic-expander"
};

interface IMTopicViewEles {
  // this is for directly children group
  container: HTMLDivElement;
  // this is topic element
  topicBox: HTMLDivElement;
  topic: HTMLDivElement;
  // this is topic children container,could be replaced width another node
  children: HTMLDivElement;
  expander?: HTMLSpanElement;
}

export class TopicView {
  // bounded html elements
  $els: IMTopicViewEles;

  constructor(public vt: Topic) {
    this.createNodes();
  }
  getEleRect = (ele: keyof IMTopicViewEles = "topicBox"): DOMRect | ClientRect => {
    const _ele = this.$els[ele];
    return !_ele ? emptyRect() : _ele._clientRect || emptyRect();
  };
  // 同步更新
  updateEleRectSync = () => {
    let modified = false;
    objValues<HTMLElement>(this.$els, ele => {
      const last = ele._clientRect;
      const latest = ele.getBoundingClientRect();
      if (!last || mergeObject(last, latest)) {
        modified = true;
      }
      ele._clientRect = latest;
    });
    return modified;
  };
  // 异步更新对应元素缓存的的所有绘制定位数据值
  updateEleRect = (noLayout: boolean = false) => {
    return new Promise((res, rej) => {
      this.updateEleRectSync() ? res(true) : rej();
    }).then(modified => {
      !noLayout && modified && this.vt.vm.layout.layout();
      return modified;
    });
  };
  currentPosition: IMPosition = { top: 0, left: 0 };
  setPosition = (position: IMPosition = this.getPosition()) => {
    const hasChange = mergeObject(this.currentPosition, position);
    if (hasChange) {
      mergeObject(this.vt.data.layout.position, hasChange);
      updateElePosition(this.$els.container, hasChange);
    }
  };
  getPosition = (): IMPosition => {
    return this.vt.data.layout.position;
  };
  clone = () => {
    return this.$els.container.cloneNode(true);
  };
  createNodes = (cloneNodes?: HTMLDivElement) => {
    if (cloneNodes) {
      this.$els = {
        container: cloneNodes,
        children: (cloneNodes.getElementsByClassName(classNames.children) as any) || createElementWidthClassName(classNames.children, "div"),
        topicBox: (cloneNodes.getElementsByClassName(classNames.topicBox) as any) || createElementWidthClassName(classNames.topicBox, "div"),
        topic: (cloneNodes.getElementsByClassName(classNames.topic) as any) || createElementWidthClassName(classNames.topic, "div")
      };
      if (!this.vt.isRoot)
        this.$els.expander =
          (cloneNodes.getElementsByClassName(classNames.expander) as any) || createElementWidthClassName(classNames.expander, "span");
    } else {
      this.$els = {
        container: createElementWidthClassName(classNames.container, "div"),
        children: createElementWidthClassName(classNames.children, "div"),
        topicBox: createElementWidthClassName(classNames.topicBox, "div"),
        topic: createElementWidthClassName(classNames.topic, "div")
      };
      if (!this.vt.isRoot) this.$els.expander = createElementWidthClassName(classNames.expander, "span");
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
    console.warn(this.vt.topic, `mode-${LayoutModeEnum[this.vt.direction]}`)
    if (!this.vt.isRoot)
      this.$els.container.className = `${this.$els.container.className.replace(/(?:mode-[^\W]*? ?)/, "")} mode-${LayoutModeEnum[this.vt.direction]}`;
  };
  // 更新视图
  updateView = debounce(() => {
    checkClassNames(this);
    this.changeModeClassName()
    // 如果是分支或根节点，则设置其为绝对定位
    if (this.vt.isBranch || this.vt.isRoot || this.vt.isFree) {
      eleAbsolute(this.$els.container);// set position from topic data
      this.setPosition();
    }
    // set id attr
    this.$els.topicBox.id = this.vt.id;
    this.$els.topic.innerText = `NO.${this.vt.index}:${this.vt.topic}`;
    this.$els.container.setAttribute("topic", this.vt.topic);
  }, 1000 / 90)
  // 所有mount操作同步进行
  mount = () => {
    const cvt = this.vt;
    const ptv = this.vt.parent;
    return new Promise((res, rej) => {
      // 先更新视图数据
      this.updateView();

      cvt.$beforeMount();
      // mount
      if (!ptv || ptv.isRoot) {
        // DOTO: mount to mind root node
        this.vt.vm.view.$els.canvas.append(cvt.view.$els.container);
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
        // 仅当根节点已经mount后，才更新当前父节点的rect信息；
        if (cvt.vm.rootTopic._mounted) ptv.view.updateEleRectSync();
      }
      // 检测是否可展开
      ptv ? ptv.view.expanderVisiblity() : this.expanderVisiblity();
      bindNodeEvents(this);

      // 当初始跟节点被插入到画布中时，异步的将所有Topic的rect信息进行更新
      if (this.vt.isRoot) {
        return updateRectDeep(this.vt)
          .then(modified => {
            modified && res();
          })
          .catch(rej);
      } else if (cvt.vm.rootTopic._mounted) this.updateEleRectSync();
      cvt.$mounted();
      return res();
    });
  };
  // unmount self element
  unmount = () => {
    if (!this.vt.parent || this.vt.isRoot) {
      return;
    }
    unbindEvents(this);
    // remove from parent children element list.
    if (this.vt.isBranch) {
      this.vt.vm.view.$els.canvas.removeChild(this.$els.container);
    } else this.vt.parent.view.$els.children.removeChild(this.$els.container);
    whileFor(this.vt.children, cvt => cvt.view.unmount());
    this.vt.$unmounted();
  };
}
