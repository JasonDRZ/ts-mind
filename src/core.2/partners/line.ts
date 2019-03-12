// import { eleInvisible, doc } from "utils/dom";
import { Partner, IMPartnerType } from "./";
import VNode from "core.2/components/VTopic";

export interface IMSVGLineData {}
export class SVGLine extends Partner {
  public data: IMSVGLineData = {};
  type: IMPartnerType = "node";
  className = "tsm-svg-line";
  insertBefore = true;
  constructor(vt: VNode) {
    super(vt);
  }
  beforeMount() {}
  mounted() {}
  unmount() {}
  nodeUpdated() {}
}
