// import { eleInvisible, doc } from "utils/dom";
import { Partner, IMPartnerType } from "./";
import VNode from "core.2/node/vnode";

export interface IMSVGLineData {}
export class SVGLine extends Partner {
  public data: IMSVGLineData = {};
  type: IMPartnerType = "node";
  className = "tsm-svg-line";
  insertBefore = true;
  constructor(vn: VNode) {
    super(vn);
  }
  beforeMount() {}
  mounted() {}
  unmount() {}
  nodeUpdated() {}
}
