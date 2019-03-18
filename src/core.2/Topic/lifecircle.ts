import { destroyObject } from "utils/tools";
import { Mind } from "../Mind";
import { IMTopicHooks, TopicProviderInstance, IMTopicOptionsDef } from "./defs";

export class TopicLifecircle {
  // topic  options, index of configuration.
  public options: IMTopicOptionsDef;
  public vm: Mind;
  // state flags
  public _mounted: boolean = false;
  public _destroyed: boolean = false;
  // extra state
  public state = {
    selected: false,
    expanded: true
  };
  public providers: IMKeyValue<TopicProviderInstance> = {};
  constructor(vm: Mind, options: IMTopicOptionsDef) {
    this.vm = vm;
    this.options = options;
    this.$beforeCreate();
  }
  public readonly __callHook = (name: keyof IMTopicHooks, ...args: any[]) => {
    return this.options[name].apply(this, [this, ...args]);
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
    this.__callHook("beforeMount");
  };
  public readonly $unmounted = () => {
    this._mounted = false;
    this.__callHook("unmounted");
  };

  public readonly $shouldUpdate = () => {
    return this.__callHook("shouldUpdate");
  };
  // can expand all child and itself
  public readonly $expandChange = () => {
    this.__callHook("expand", this.state.expanded);
  };
  public readonly $selectChange = () => {
    this.__callHook("select", this.state.selected);
  };
}
