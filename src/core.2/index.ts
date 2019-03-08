import { __version__, DEFAULT_OPTIONS, IMOptions, IMOptionsDef } from "../utils/constants";
import { extend, _noop, Logger } from "../utils/tools";
import { eventRegister, BSEvent } from "./event";
import VNode from "./node/vnode";
import { VMind } from "./mind/vmind";
import { scopedPartner, globalPartner } from "./partners";

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
export class TSMind extends BSEvent {
  public readonly addr = TSMindAddr;
  public readonly type = TSMindEleType;
  public readonly isInitialized: boolean = false;
  public readonly logger: Logger;
  // static properties
  static version = __version__;
  // static apis
  static directionMap = TSMindDirectionMap;
  static eventTypeMap = TSMindEventTypeMap;
  static $on = eventRegister;
  // global partners
  static partner = globalPartner();

  // private partners
  public partner = scopedPartner();

  // public properties
  public options: IMOptionsDef;
  public vm: VMind;

  constructor(options: IMOptions, onReady = _noop) {
    super();
    if (!options.container) {
      throw Error("the options.container should not be null or empty.");
    }
    this.options = extend(true, DEFAULT_OPTIONS, options);
    this.isInitialized = true;
    this.logger = new Logger(!!options.debug);
    this.vm = new VMind(this);
    // call ready hook
    onReady(this);
  }
}

export default TSMind;
