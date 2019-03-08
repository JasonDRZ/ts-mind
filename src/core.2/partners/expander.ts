import { doc } from "utils/dom";
import { Partner, IMPartnerType } from "./";
import VNode from "core.2/node/vnode";

export interface ITopicExpanderData {
  style: object;
  expanded: boolean;
}
export class TopicExpander extends Partner {
  type: IMPartnerType = "topic";
  public data: ITopicExpanderData = {
    style: {},
    expanded: false
  };
  constructor(vn: VNode) {
    super(vn);
    this.element = doc.createElement("span");
  }
  beforeMount() {}
  mounted() {}
  unmount() {}
  nodeUpdated() {}
}
