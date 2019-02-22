export const $noop = function (...arg) { };
export const $logger = console || {
    log: $noop,
    debug: $noop,
    error: $noop,
    warn: $noop,
    info: $noop
};
// NODE Operation
export const $doc = window.document;
// $g=>getElementById
export function $elByID(id) {
    return $doc.getElementById(id);
}
// $t=>push-textNode
export function $pushText(parent, txt) {
    if (parent.hasChildNodes()) {
        parent.firstChild.nodeValue = txt;
    }
    else
        parent.appendChild($doc.createTextNode(txt));
}
// $h=>push-childNode
export function $pushChild(parent, child) {
    if (child instanceof HTMLElement) {
        parent.innerHTML = "";
        parent.appendChild(child);
    }
    else {
        parent.innerHTML = child;
    }
}
// $i=>isElement
export function $isEl(el) {
    return "nodeType" in el;
}
// To determine whether a string starting with [beg].
export function $startWith(str, beg) {
    return str.slice(0, beg.length) === beg;
}
// To determine whether a target is a Function.
export function $isFunc(tar) {
    return typeof tar === "function";
}
// The abbreviation of hasOwnProperty method.
export const $hasOwnProperty = Object.prototype.hasOwnProperty;
// To determine the plain-object.
export function $isPlainObject(obj) {
    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if (!obj || toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval) {
        return false;
    }
    // Not own constructor property must be Object
    if (obj.constructor && !$hasOwnProperty.call(obj, "constructor") && !$hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
        return false;
    }
    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.
    let key;
    for (key in obj) {
    }
    return key === undefined || $hasOwnProperty.call(obj, key);
}
export function $extend() {
    let options;
    let name;
    let src;
    let copy;
    let copyIsArray;
    let clone;
    let target = arguments[0] || {};
    let i = 1;
    const length = arguments.length;
    let deep = false;
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
                        }
                        else if (!copyIsArray && !$isPlainObject(src)) {
                            clone = {};
                        }
                        else {
                            clone = src;
                        }
                        copyIsArray = false;
                        // Never move original objects, clone them
                        target[name] = $extend(deep, clone, copy);
                        // Don't bring in undefined values
                    }
                    else if (copy !== undefined) {
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
export function $debounce(handler, tick = 10) {
    let _timer = null;
    function _dbce(...args) {
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
