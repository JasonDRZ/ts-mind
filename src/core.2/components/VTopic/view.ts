import VTopic from "./topic";
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

export class VTopicView {
  private vt: VTopic;
  // bounded html elements
  private elements: {
    // this is for directly children group
    wrapper: HTMLDivElement;
    // this is topic element
    topicBox: HTMLDivElement;
    topic: HTMLDivElement;
    // this is topic children container
    children: HTMLDivElement;
  };

  partners: Partner[] = [];

  constructor(vt: VTopic) {
    this.vt = vt;
    this._generateElements();
  }
  private _generateElements = () => {
    Object.keys(this.elements).map(el => {
      this.elements[el] = createElementWidthClassName(ELEMENT_CLASSNAMES[el]);
    });
    this.elements.topicBox.appendChild(this.elements.topic);
    this.elements.wrapper.appendChild(this.elements.topicBox);
    this.elements.wrapper.appendChild(this.elements.children);
    if (this.vt.options.isBranch) {
      if (this.vt.vm.mind.options.debug) {
        // just for debug mode
        this.elements.topicBox.setAttribute("sub-root", "true");
        this.elements.topicBox.setAttribute("root-id", this.vt.options.rootId);
      }
    }
  };
  public mount = () => {
    const vt = this.vt;
    const pvn = vt.vm.getNodeById(vt.options.parentId);
    if (!pvn) return false;
    vt.$beforeMount();
    const _index = pvn.getChildIndex(vt.id);
    const _count = pvn.children.length;
    // mount node partner before inserted into dom.
    // this._mountPartners();
    if (_index === _count - 1) {
      // append all together
      pvn.view.elements.children.appendChild(this.elements.wrapper);
    } else {
      // insert before the brother node,which index is _index
      const _brother = pvn.view.elements.children.childNodes[_index];
      pvn.view.elements.children.insertBefore(this.elements.wrapper, _brother);
    }
    vt.$mounted();
    return true;
  };
  // private mountRootNode = () => {
  //   const vm = this.vt.vm;
  //   // mount on vm.view
  // };
  //
  // private _mountPartners = () => {
  //   const vt = this.vt;
  //   const partners = vt.vm.partner.get();
  //   Object.keys(partners).map(pname => {
  //     const partner = (partners[pname] as IMPartnerGenerater)(this.vt);
  //     partner.$mount();
  //     this.partners.push(partner);
  //   });
  // };
  public unmount = () => {
    // remove from parent children element list.
    this.vt.$unmounted();
  };
}

/**
 * theme manager is an inherit theme manager,to help line and topic theme rendering.
 */
export function themeManager() {
  return "theme config";
}
