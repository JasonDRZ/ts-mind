import VNode from "./vnode";
import { createDivElement } from "utils/view";
import { doc } from "utils/dom";
import { IMPartnerGenerater, Partner } from "core.2/partners";
// element className map
const ELEMENT_CLASSNAMES = {
  wrapper: "tsm-topic-wrapper",
  topicBox: "tsm-topic-box",
  topic: "tsm-topic",
  children: "tsm-topic-children"
};

function createElementWidthClassName(className: string) {
  const el = createDivElement();
  el.className = className;
  return el;
}

export class VNodeView {
  public vn: VNode;
  // public axisX: number = 0;
  // // Y-axis coordinate
  // public axisY: number = 0;
  // // the node-location in view sight;equals (node.axisX - panel.scrollX)
  // public location = {
  //   x: 0,
  //   y: 0
  // };
  // // current node's size
  // public width: number = 0;
  // public height: number = 0;
  // bounded html elements
  elements: {
    // this is for directly children group
    wrapper: HTMLDivElement;
    // this is topic element
    topicBox: HTMLDivElement;
    topic: HTMLDivElement;
    // this is topic children container
    children: HTMLDivElement;
  };

  partners: Partner[] = [];

  constructor(vn: VNode) {
    this.vn = vn;
    this._generateElements();
  }
  private _generateElements = () => {
    Object.keys(this.elements).map(el => {
      this.elements[el] = createElementWidthClassName(ELEMENT_CLASSNAMES[el]);
    });
    this.elements.topicBox.appendChild(this.elements.topic);
    this.elements.wrapper.appendChild(this.elements.topicBox);
    this.elements.wrapper.appendChild(this.elements.children);
    if (this.vn.isSubRoot) {
      if (this.vn.vm.mind.options.debug) {
        // just for debug mode
        this.elements.topicBox.setAttribute("sub-root", "true");
        this.elements.topicBox.setAttribute("root-id", this.vn.rootId);
      }
    }
  };
  public mount = () => {
    const vn = this.vn;
    const pvn = vn.vm.getNodeById(vn.parentId);
    vn.$beforeMount();
    // append all together
    pvn.view.elements.children.appendChild(this.elements.wrapper);
    this._mountPartners();
    vn.$mounted();
    return true;
  };
  //
  private _mountPartners = () => {
    const vn = this.vn;
    const partners = vn.vm.mind.partner.get();
    Object.keys(partners).map(pname => {
      const partner = (partners[pname] as IMPartnerGenerater)();
      partner.$mount(vn);
      this.partners.push(partner);
    });
  };
  public unmount = () => {};
}

/**
 * theme manager is an inherit theme manager,to help line and topic theme rendering.
 */
export function themeManager() {
  return "theme config";
}
