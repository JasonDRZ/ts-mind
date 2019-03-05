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
// default global VNode hook register func
export function globalRegister(
	hookName: ITSMEventName,
	fn: ITSMAnyCall,
	hookBank = GLOBAL_EVENTS
) {
	const hook = hookBank[hookName];
	if (hook) {
		hook.push(fn);
	} else hookBank[hookName] = [fn];
	return {
		// off the hook call in next time
		off() {
			hook.splice(hook.findIndex(_fn => _fn === fn), 1);
		}
	};
}
// scoped hooks class
export class EventManager {
	private _events: ITSMEventBank = {};
	public register = (name: ITSMEventName, fn: ITSMAnyCall) => {
		return globalRegister(name, fn, this._events);
	};
	// excute event by name
	public trigger = <T extends any[]>(name: ITSMEventName, ...args: T) => {
		(this._events[name] || []).map(call => call.apply(null, args));
		(GLOBAL_EVENTS[name] || []).map(call => call.apply(null, args));
	};
}
