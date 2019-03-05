import { _slice } from "./array";
import { TSM_node } from "core.2/mind/node";

export const $noop = function(...arg: any[]): any {};

function _loggerHandler(method: string) {
	return (action: string, msg: string, ...oth: any[]) =>
		console[method].apply(null, `[ACTION: ${action}]`, msg, ...oth);
}

export class $logger {
	// let _handler: any = () => $noop;
	// if (mode === "debug") _handler = _loggerHandler;
	_handler: (s: string) => (action: string, ...msg: any[]) => void;
	constructor(isDebug: boolean) {
		this._handler = isDebug ? _loggerHandler : () => $noop;
	}
	log = this._handler("log");
	debug = this._handler("debug");
	error = this._handler("error");
	warn = this._handler("warn");
	info = this._handler("info");
}

// NODE Operation
export const $doc = window.document;
// $g=>getElementById
export function $elByID(id: string) {
	return $doc.getElementById(id);
}
// $t=>push-textNode
export function $pushText(parent: HTMLElement, txt: string) {
	if (parent.hasChildNodes()) {
		parent.firstChild!.nodeValue = txt;
	} else parent.appendChild($doc.createTextNode(txt));
}
// $h=>push-childNode
export function $pushChild(parent: HTMLElement, child: any) {
	if (child instanceof HTMLElement) {
		parent.innerHTML = "";
		parent.appendChild(child);
	} else {
		parent.innerHTML = child;
	}
}
// $i=>isElement
export function $isEl<T extends object>(el: T) {
	return "nodeType" in el;
}
// To determine whether a string starting with [beg].
export function $startWith(str: string, beg: string) {
	return str.slice(0, beg.length) === beg;
}

// To determine whether a target is a Function.
export function $isFunc(tar: any) {
	return typeof tar === "function";
}

// The abbreviation of hasOwnProperty method.
export const $hasOwnProperty = Object.prototype.hasOwnProperty;
// To determine the plain-object.
export function $isPlainObject(obj: any) {
	// Must be an Object.
	// Because of IE, we also have to check the presence of the constructor property.
	// Make sure that DOM nodes and window objects don't pass through, as well
	if (
		!obj ||
		toString.call(obj) !== "[object Object]" ||
		obj.nodeType ||
		obj.setInterval
	) {
		return false;
	}

	// Not own constructor property must be Object
	if (
		obj.constructor &&
		!$hasOwnProperty.call(obj, "constructor") &&
		!$hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")
	) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.

	let key;
	for (key in obj) {
	}

	return key === undefined || $hasOwnProperty.call(obj, key);
}

// object [deep optional] assign method
export function $extend<T extends object = {}>(
	deep: boolean,
	...arg: object[]
): T;
export function $extend<T extends object = {}>(this: any, ...arg: object[]): T;
export function $extend(this: any) {
	let options: any;
	let name: string;
	let src: object;
	let copy: object;
	let copyIsArray: boolean;
	let clone: object;
	let target = arguments[0] || {};
	let i = 1;
	const length: number = arguments.length;
	let deep: boolean = false;

	// Handle a deep copy situation
	if (typeof target === "boolean") {
		deep = target;

		// Skip the boolean and the target
		target = arguments[i] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if (typeof target !== "object" && !$isFunc(target)) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if (i === length) {
		target = this || {};
		i--;
	}

	for (; i < length; i++) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options !== null) {
			// Extend the base object
			for (name in options) {
				if (!!name) {
					copy = options[name];

					// Prevent never-ending loop
					if (target === copy) {
						continue;
					}
					copyIsArray = Array.isArray(copy);
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && ($isPlainObject(copy) || copyIsArray)) {
						src = target[name];

						// Ensure proper type for the source value
						if (copyIsArray && !Array.isArray(src)) {
							clone = [];
						} else if (!copyIsArray && !$isPlainObject(src)) {
							clone = {};
						} else {
							clone = src;
						}
						copyIsArray = false;

						// Never move original objects, clone them
						target[name] = $extend(deep, clone, copy);

						// Don't bring in undefined values
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
}

// debounce method
export function $debounce<T extends any[] = any[]>(
	handler: ITSMAnyCall<T, void>,
	tick: number = 10
) {
	let _timer: any = null;
	function _dbce(this: any, ...args: T): void {
		const _ctx = this;
		if (_timer) {
			return;
		}
		_timer = setTimeout(() => {
			handler.apply(_ctx, args);
			_timer = null;
		}, tick);
	}
	// clear debounce
	_dbce.clear = () => {
		clearTimeout(_timer);
		_timer = null;
	};
	return _dbce;
}

// whether str is empty,including space char;
export function $isEmptyStr(s: any) {
	if (!s) {
		return true;
	}
	return s.replace(/\s*/, "").length === 0;
}

export function $branchRoot(parent: TSM_node) {
	return {
		// To determine this node weather belongs to some parent node;
		has(child: TSM_node): boolean {
			// just mounted node
			if (!parent || !child || !child.isMounted) return false;
			if (parent.id === child.id) {
				return true;
			}
			if (parent.isRoot) {
				return true;
			}
			const pid = parent.id;
			let p = child;
			while (!p.isRoot) {
				p = p.parent;
				if (p.id === pid) {
					return true;
				}
			}
			return false;
		},
		// find some node from a declared parent node
		find(id: string): null | TSM_node {
			for (const child of parent.children) {
				if (child.id === id) return child;
				else if (child.children.length > 0) {
					const _fd = $branchRoot(child).find(id);
					if (_fd) return _fd;
				}
			}
			return null;
		}
	};
}

// Compare index between two TSM_nodes;
export function $sortNodeByIndex(node1: TSM_node, node2: TSM_node): number {
	// '-1' is alwary the last
	let r = 0;
	const i1 = node1.index;
	const i2 = node2.index;
	if (i1 >= 0 && i2 >= 0) {
		r = i1 - i2;
	} else if (i1 === -1 && i2 === -1) {
		r = 0;
	} else if (i1 === -1) {
		r = 1;
	} else if (i2 === -1) {
		r = -1;
	} else {
		r = 0;
	}
	// logger.debug(i1+' <> '+i2+'  =  '+r);
	return r;
}
