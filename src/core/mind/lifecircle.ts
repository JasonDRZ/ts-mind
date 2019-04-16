import { destroyObject, extend, Logger } from "../../utils/tools";
import { IMMindEntryOptionsDef, IMMindHooksDef, IMMindEntryOptions, MindProvider } from "./defs";
import { DEFAULT_OPTIONS } from "../../utils/constants";
import { Topic } from "../Topic";

export class MindLifecircle {
  // mind meta
  meta: IMSourceMeta;
  // mind options
  options: IMMindEntryOptionsDef;
  // state flags
  _mounted: boolean = false;
  _destroyed: boolean = false;
  data = {
    layout: {},
    providers: {}
  };
  providers: MindProvider[] = [];
  // mind private partners
  logger: Logger;

  // support multiple roots,each other root could be other topic's child topic.
  rootTopic: Topic;
  topicCurrentFocus?: Topic;
  // manage all selected topics
  topicSelectedMap: Map<string, Topic> = new Map();
  // all registered topics map,key is topic's id;
  topicCollectedMap: Map<string, Topic> = new Map();

  constructor(options: IMMindEntryOptions) {
    this.options = extend(true, DEFAULT_OPTIONS, options);
    this.logger = new Logger(this.options.debug);
  }
  readonly __callHook = (name: keyof IMMindHooksDef, ...args: any[]) => {
    return this.options.capturedError(this.options.debug, () => {
      // call mind hooks
      this.options[name].apply(this, [this, ...args]);
      // trigger providers hooks
      this.providers.map(prov => {
        prov[name] && prov[name]();
      });
    });
  };
  // life hooks
  readonly $destroy = () => {
    if (this._destroyed) return;
    destroyObject(this);
    // set destroyed flag
    this._destroyed = true;
    this.__callHook("destroyed");
  };
  readonly $created = () => {
    this.__callHook("created");
  };
  readonly $mounted = () => {
    this._mounted = true;
    this.__callHook("mounted");
  };
  readonly $beforeMount = () => {
    this._mounted = true;
    this.__callHook("beforeMount");
  };
}
