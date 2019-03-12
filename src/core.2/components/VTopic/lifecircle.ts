import { destroyObject } from "utils/tools";
import { VMind } from "../VMind";
import { VTopicHooks } from "core.2/hooks";

export class VTopicLifecircle {
  public vm: VMind;
  // state flags
  public _mounted: boolean = false;
  public _destroyed: boolean = false;
  // extra state
  public state = {
    selected: false,
    expanded: true
  };
  constructor(vm: VMind) {
    this.$beforeCreate();
    this.vm = vm;
  }
  public readonly __callHook = (name: keyof VTopicHooks, ...args: any[]) => {
    return this.vm.mind.topic[name].apply(this, [this, ...args]);
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
  // can expand all child and itself
  public readonly $expandChange = () => {
    this.__callHook("expand", this.state.expanded);
  };
  public readonly $selectChange = () => {
    this.__callHook("select", this.state.selected);
  };
}
