"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$noop = function () {
    var arg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arg[_i] = arguments[_i];
    }
};
exports.$logger = console || {
    log: exports.$noop,
    debug: exports.$noop,
    error: exports.$noop,
    warn: exports.$noop,
    info: exports.$noop
};
// NODE Operation
exports.$doc = window.document;
// $g=>getElementById
function $elByID(id) {
    return exports.$doc.getElementById(id);
}
exports.$elByID = $elByID;
// $t=>push-textNode
function $pushText(parent, txt) {
    if (parent.hasChildNodes()) {
        parent.firstChild.nodeValue = txt;
    }
    else
        parent.appendChild(exports.$doc.createTextNode(txt));
}
exports.$pushText = $pushText;
// $h=>push-childNode
function $pushChild(parent, child) {
    if (child instanceof HTMLElement) {
        parent.innerHTML = "";
        parent.appendChild(child);
    }
    else {
        parent.innerHTML = child;
    }
}
exports.$pushChild = $pushChild;
// $i=>isElement
function $isEl(el) {
    return "nodeType" in el;
}
exports.$isEl = $isEl;
// To determine whether a string starting with [beg].
function $startWith(str, beg) {
    return str.slice(0, beg.length) === beg;
}
exports.$startWith = $startWith;
// To determine whether a target is a Function.
function $isFunc(tar) {
    return typeof tar === "function";
}
exports.$isFunc = $isFunc;
// The abbreviation of hasOwnProperty method.
exports.$hasOwnProperty = Object.prototype.hasOwnProperty;
// To determine the plain-object.
function $isPlainObject(obj) {
    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if (!obj || toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval) {
        return false;
    }
    // Not own constructor property must be Object
    if (obj.constructor && !exports.$hasOwnProperty.call(obj, "constructor") && !exports.$hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
        return false;
    }
    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.
    var key;
    for (key in obj) {
    }
    return key === undefined || exports.$hasOwnProperty.call(obj, key);
}
exports.$isPlainObject = $isPlainObject;
function $extend() {
    var options;
    var name;
    var src;
    var copy;
    var copyIsArray;
    var clone;
    var target = arguments[0] || {};
    var i = 1;
    var length = arguments.length;
    var deep = false;
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
exports.$extend = $extend;
// debounce method
function $debounce(handler, tick) {
    if (tick === void 0) { tick = 10; }
    var _timer = null;
    function _dbce() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _ctx = this;
        if (_timer) {
            return;
        }
        _timer = setTimeout(function () {
            handler.apply(_ctx, args);
            _timer = null;
        }, tick);
    }
    // clear debounce
    _dbce.clear = function () {
        clearTimeout(_timer);
        _timer = null;
    };
    return _dbce;
}
exports.$debounce = $debounce;
