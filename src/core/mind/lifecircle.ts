import { destroyObject, extend, Logger } from "utils/tools";
import { IMMindEntryOptionsDef, IMMindHooksDef, IMMindProvider, IMMindEntryOptions } from "./defs";
import { DEFAULT_OPTIONS } from "utils/constants";
import { Topic } from "core/Topic";

export class MindLifecircle {
  // mind meta
  public meta: IMSourceMeta;
  // mind options
  public options: IMMindEntryOptionsDef;
  // state flags
  public _mounted: boolean = false;
  public _destroyed: boolean = false;
  // extra state
  public state = {
    selected: false,
    expanded: true
  };
  public data = {
    view: {},
    providers: {}
  };
  public providers: IMMindProvider[] = [];
  // mind private partners
  public logger = new Logger(this.options.debug);

  // support multiple roots,each other root could be other topic's child topic.
  public rootTopic: Topic;
  // manage all selected topics
  public topicSelectedMap: Map<string, Topic> = new Map();
  // all registered topics map,key is topic's id;
  public topicCollectedMap: Map<string, Topic> = new Map();

  constructor(options: IMMindEntryOptions) {
    this.options = extend(true, DEFAULT_OPTIONS, options);
    this.$beforeCreate();
  }
  public readonly __callHook = (name: keyof IMMindHooksDef, ...args: any[]) => {
    return this.options.capturedError(this.options.debug, () => this.options.mind[name].apply(this, [this, ...args]));
  };
  // life hooks
  public readonly $destroy = () => {
    if (this._destroyed) return;
    this.__callHook("beforeDestroy");
    destroyObject(this);
    // set destroyed flag
    this._destroyed = true;
    this.__callHook("destroyed");
  };
  public readonly $beforeUpdate = () => {
    this.__callHook("beforeUpdate");
  };
  public readonly $updated = () => {
    this.__callHook("updated");
  };
  public readonly $beforeCreate = () => {
    this.__callHook("beforeCreate");
  };
  public readonly $created = () => {
    this.__callHook("created");
  };
  public readonly $shouldMount = () => {
    return this.__callHook("shouldMount");
  };
  public readonly $mounted = () => {
    this._mounted = true;
    this.__callHook("mounted");
  };
  public readonly $beforeMount = () => {
    this._mounted = true;
    this.__callHook("beforeMount");
  };
  public readonly $unmounted = () => {
    this._mounted = true;
    this.__callHook("unmounted");
  };

  public readonly $shouldUpdate = () => {
    return this.__callHook("shouldUpdate");
  };
}
