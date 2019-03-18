import { destroyObject } from "utils/tools";
import { IMMindHooks, IMMindOptionsDef } from "./defs";

export class MindLifecircle {
  public options: IMMindOptionsDef;
  // state flags
  public _mounted: boolean = false;
  public _destroyed: boolean = false;
  // extra state
  public state = {
    selected: false,
    expanded: true
  };
  constructor(options: IMMindOptionsDef) {
    this.options = options;
    this.$beforeCreate();
  }
  public readonly __callHook = (name: keyof IMMindHooks, ...args: any[]) => {
    return this.options.capturedError(this.options.debug, () => this.options[name].apply(this, [this, ...args]));
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
