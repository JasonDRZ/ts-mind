import { __version__, DEFAULT_OPTIONS, IMOptions, IMOptionsDef } from "../utils/constants";
import { extend, _noop } from "../utils/tools";
import VNode from "./components/VTopic";
import { VMind } from "./components/VMind";
import { globalPartner } from "./partners";
import { IMVTopicHooks, VTopicHooks, IMVMindHooks, VMindHooks } from "./hooks";

export type IMClassPlug = new (tsm: TSMind, opts: IMOptions) => any;
export type IMPlugin = IMAnyCall<[TSMind, IMOptions], void> | IMClassPlug;

export type IMNode = string | VNode;

// mind direction
export const TSMindDirectionMap: { [k: string]: IMDirectionValue } = {
  left: -1,
  center: 0,
  right: 1
};
// mind event type
export const TSMindEventTypeMap: { [k: string]: IMEventTypeValue } = {
  show: 1,
  resize: 2,
  edit: 3,
  select: 4
};

export const TSMindAddr = "tsmind";
export const TSMindEleType = "tsm-designer";

// mind core class
export class TSMind {
  public readonly addr = TSMindAddr;
  public readonly type = TSMindEleType;
  public readonly isInitialized: boolean = false;
  // static properties
  static version = __version__;
  // static apis
  static directionMap = TSMindDirectionMap;
  static eventTypeMap = TSMindEventTypeMap;
  // global partners
  static partner = globalPartner();

  // public properties
  public options: IMOptionsDef;
  public vm: VMind;

  // public component hooks
  public readonly topic = new VTopicHooks();
  public readonly mind = new VMindHooks();

  constructor(options: IMOptions, onReady = _noop) {
    if (!options.container) {
      throw Error("the options.container should not be null or empty.");
    }
    // update hooks obj in every TSMind instanc
    // generate hooks
    this.options = extend(true, DEFAULT_OPTIONS, options);
    this.isInitialized = true;
    this.vm = new VMind(this);
    // call ready hook
    onReady(this);
  }
}

export default TSMind;
