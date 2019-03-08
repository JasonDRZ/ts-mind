export type ITSMEventName =
  | "beforeCreate"
  | "created"
  | "beforeMount"
  | "mounted"
  | "unmount"
  | "visible"
  | "beforeDestroy"
  | "destroyed"
  | "beforeUpdate"
  | "updated"
  | "beforeCreate.node"
  | "created.node"
  | "beforeMount.node"
  | "mounted.node"
  | "unmount.node"
  | "select.node"
  | "deselect.node"
  | "beforeDestroy.node"
  | "destroyed.node"
  | "expand.node"
  | "beforeUpdate.node"
  | "updated.node";
export interface ITSMEventBank {
  [k: string]: ITSMAnyCall[];
}
const GLOBAL_EVENTS: ITSMEventBank = {};

export class BSEvent {
  __event_map__: ITSMEventBank = {};
  $on<T = any>(ename: string, fn: IMAnyCall<[T]>) {
    return eventRegister(ename, fn, this.__event_map__);
  }
  $trigger<T = any>(ename: string, data: T) {
    (this.__event_map__[ename] || []).map(fn => fn(data));
    return true;
  }
  $off(ename: string) {
    delete this.__event_map__[ename];
  }
}
// default global VNode hook register func
export function eventRegister(hookName: string, fn: ITSMAnyCall, map = GLOBAL_EVENTS) {
  const evt = map[hookName];
  if (evt) {
    evt.push(fn);
  } else map[hookName] = [fn];
  return {
    off() {
      evt.splice(evt.findIndex(_fn => _fn === fn), 1);
    }
  };
}
