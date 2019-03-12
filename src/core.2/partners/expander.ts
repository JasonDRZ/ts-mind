import { doc } from "utils/dom";
import { Partner, IMPartnerType } from "./";
import VNode from "core.2/components/VTopic";

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
  constructor(vt: VNode) {
    super(vt);
    this.element = doc.createElement("span");
  }
  beforeMount() {}
  mounted() {}
  unmount() {}
  nodeUpdated() {}
}
