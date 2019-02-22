(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("TSMind", [], factory);
	else if(typeof exports === 'object')
		exports["TSMind"] = factory();
	else
		root["TSMind"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
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


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var constants_1 = __webpack_require__(2);
var tools_1 = __webpack_require__(0);
var data_1 = __webpack_require__(14);
var layout_1 = __webpack_require__(20);
var view_1 = __webpack_require__(21);
var util_1 = __webpack_require__(7);
var node_array_1 = __webpack_require__(9);
var shortcut_1 = __webpack_require__(22);
var pugin_1 = __webpack_require__(23);
// global use register
exports.use = pugin_1.globalUse;
// mind direction
exports.TSMindDirectionMap = { left: -1, center: 0, right: 1 };
// mind event type
exports.TSMindEventTypeMap = { show: 1, resize: 2, edit: 3, select: 4 };
// mind core class
var TSMind = /** @class */ (function () {
    function TSMind(options) {
        var _this = this;
        // public properties
        this.options = {
            container: ""
        };
        this.mind = null;
        this.initialized = false;
        this.event_handles = [];
        // private plugin list
        this._plugins = {};
        this.plugins = {};
        /**
         * register private plugin
         * @param plugin: ITSMPlugin
         */
        this.use = function (pname, plugin) {
            _this._plugins[pname] = plugin;
        };
        // initial plugin's main methods
        this.init_plugins = function (tsm, opts) {
            var _all_plug = tools_1.$extend({}, _this._plugins, pugin_1.GLOBAl_PLUGIN_LIST);
            // call plugin in async way, to make sure plugin register no execution-order dependences.
            setTimeout(function () {
                for (var pname in _all_plug) {
                    if (pname)
                        // 确保Class类型的插件能够成功初始化
                        _this.plugins[pname] = new _all_plug[pname](tsm, opts);
                }
            }, 0);
        };
        this.enable_edit = function () {
            return (_this.options.editable = true);
        };
        this.disable_edit = function () {
            return (_this.options.editable = false);
        };
        // call enable_event_handle('dblclick')
        // options are 'mousedown', 'click', 'dblclick'
        this.enable_event_handle = function (event_handle) {
            _this.options.default_event_handle["enable_" + event_handle + "_handle"] = true;
        };
        // call disable_event_handle('dblclick')
        // options are 'mousedown', 'click', 'dblclick'
        this.disable_event_handle = function (event_handle) {
            _this.options.default_event_handle["enable_" + event_handle + "_handle"] = false;
        };
        this.get_editable = function () {
            return _this.options.editable;
        };
        this.set_theme = function (theme) {
            var theme_old = _this.options.theme;
            _this.options.theme = !!theme ? theme : "primary";
            if (theme_old !== _this.options.theme) {
                _this.view_provider.reset_theme();
                _this.view_provider.reset_custom_style();
            }
        };
        this._event_bind = function () {
            _this.view_provider.add_event(_this, "mousedown", _this.mousedown_handle);
            _this.view_provider.add_event(_this, "click", _this.click_handle);
            _this.view_provider.add_event(_this, "dblclick", _this.dblclick_handle);
        };
        this.mousedown_handle = function (e) {
            if (e === void 0) { e = event; }
            if (!_this.options.default_event_handle.enable_mousedown_handle) {
                return;
            }
            var element = (e.target || e.srcElement);
            var nodeid = _this.view_provider.get_binded_nodeid(element);
            if (!!nodeid) {
                _this.select_node(nodeid);
            }
            else {
                _this.select_clear();
            }
        };
        this.click_handle = function (e) {
            if (e === void 0) { e = event; }
            if (!_this.options.default_event_handle.enable_click_handle) {
                return;
            }
            var element = (e.target || e.srcElement);
            var isexpander = _this.view_provider.is_expander(element);
            if (isexpander) {
                var nodeid = _this.view_provider.get_binded_nodeid(element);
                if (!!nodeid) {
                    _this.toggle_node(nodeid);
                }
            }
        };
        this.dblclick_handle = function (e) {
            if (e === void 0) { e = event; }
            if (!_this.options.default_event_handle.enable_dblclick_handle) {
                return;
            }
            if (_this.get_editable()) {
                var element = (e.target || e.srcElement);
                var nodeid = _this.view_provider.get_binded_nodeid(element);
                if (!!nodeid) {
                    _this.begin_edit(nodeid);
                }
            }
        };
        this.begin_edit = function (node) {
            if (!util_1["default"].is_node(node)) {
                var the_node = _this.get_node(node);
                if (!the_node) {
                    tools_1.$logger.error("the node[id=" + node + "] can not be found.");
                    return false;
                }
                else {
                    return _this.begin_edit(the_node);
                }
            }
            if (_this.get_editable()) {
                _this.view_provider.edit_node_begin(node);
            }
            else {
                tools_1.$logger.error("fail, this mind map is not editable.");
                return;
            }
        };
        this.end_edit = function () {
            _this.view_provider.edit_node_end();
        };
        this.toggle_node = function (node) {
            if (!util_1["default"].is_node(node)) {
                var the_node = _this.get_node(node);
                if (!the_node) {
                    tools_1.$logger.error("the node[id=" + node + "] can not be found.");
                    return;
                }
                else {
                    return _this.toggle_node(the_node);
                }
            }
            if (node.isroot) {
                return;
            }
            _this.view_provider.save_location(node);
            _this.layout_provider.toggle_node(node);
            _this.view_provider.relayout();
            _this.view_provider.restore_location(node);
        };
        this.expand_node = function (node) {
            if (!util_1["default"].is_node(node)) {
                var the_node = _this.get_node(node);
                if (!the_node) {
                    tools_1.$logger.error("the node[id=" + node + "] can not be found.");
                    return;
                }
                else {
                    return _this.expand_node(the_node);
                }
            }
            if (node.isroot) {
                return;
            }
            _this.view_provider.save_location(node);
            _this.layout_provider.expand_node(node);
            _this.view_provider.relayout();
            _this.view_provider.restore_location(node);
        };
        this.collapse_node = function (node) {
            if (!util_1["default"].is_node(node)) {
                var the_node = _this.get_node(node);
                if (!the_node) {
                    tools_1.$logger.error("the node[id=" + node + "] can not be found.");
                    return;
                }
                else {
                    return _this.collapse_node(the_node);
                }
            }
            if (node.isroot) {
                return;
            }
            _this.view_provider.save_location(node);
            _this.layout_provider.collapse_node(node);
            _this.view_provider.relayout();
            _this.view_provider.restore_location(node);
        };
        this.expand_all = function () {
            _this.layout_provider.expand_all();
            _this.view_provider.relayout();
        };
        this.collapse_all = function () {
            _this.layout_provider.collapse_all();
            _this.view_provider.relayout();
        };
        this.expand_to_depth = function (depth) {
            _this.layout_provider.expand_to_depth(depth);
            _this.view_provider.relayout();
        };
        this._reset = function () {
            _this.view_provider.reset();
            _this.layout_provider.reset();
            _this.data_provider.reset();
        };
        this._show = function (mind) {
            var m = mind || node_array_1.node_array.example;
            _this.mind = _this.data_provider.load(m);
            if (!_this.mind) {
                tools_1.$logger.error("data.load error");
                return;
            }
            else {
                tools_1.$logger.debug("data.load ok");
            }
            _this.view_provider.load();
            tools_1.$logger.debug("view.load ok");
            _this.layout_provider.layout();
            tools_1.$logger.debug("layout.layout ok");
            _this.view_provider.show(true);
            tools_1.$logger.debug("view.show ok");
            _this.invoke_event_handle(exports.TSMindEventTypeMap.show, { data: [mind] });
        };
        this.show = function (mind) {
            _this._reset();
            _this._show(mind);
        };
        this.get_meta = function () {
            return {
                name: _this.mind.name,
                author: _this.mind.author,
                version: _this.mind.version
            };
        };
        this.get_data = function (data_format) {
            if (data_format === void 0) { data_format = "node_tree"; }
            return _this.data_provider.get_data(data_format);
        };
        this.get_root = function () {
            return _this.mind.root;
        };
        this.get_node = function (nodeid) {
            return _this.mind.get_node(nodeid);
        };
        this.add_node = function (parent_node, nodeid, topic, data) {
            if (_this.get_editable()) {
                var node = _this.mind.add_node(parent_node, nodeid, topic, data);
                if (!!node) {
                    _this.view_provider.add_node(node);
                    _this.layout_provider.layout();
                    _this.view_provider.show(false);
                    _this.view_provider.reset_node_custom_style(node);
                    _this.expand_node(parent_node);
                    _this.invoke_event_handle(exports.TSMindEventTypeMap.edit, { evt: "add_node", data: [parent_node.id, nodeid, topic, data], node: nodeid });
                }
                return node;
            }
            else {
                tools_1.$logger.error("fail, this mind map is not editable");
                return null;
            }
        };
        this.insert_node_before = function (node_before, nodeid, topic, data) {
            if (_this.get_editable()) {
                var beforeid = util_1["default"].is_node(node_before) ? node_before.id : node_before;
                var node = _this.mind.insert_node_before(node_before, nodeid, topic, data);
                if (!!node) {
                    _this.view_provider.add_node(node);
                    _this.layout_provider.layout();
                    _this.view_provider.show(false);
                    _this.invoke_event_handle(exports.TSMindEventTypeMap.edit, { evt: "insert_node_before", data: [beforeid, nodeid, topic, data], node: nodeid });
                }
                return node;
            }
            else {
                tools_1.$logger.error("fail, this mind map is not editable");
                return null;
            }
        };
        this.insert_node_after = function (node_after, nodeid, topic, data) {
            if (_this.get_editable()) {
                var afterid = util_1["default"].is_node(node_after) ? node_after.id : node_after;
                var node = _this.mind.insert_node_after(node_after, nodeid, topic, data);
                if (!!node) {
                    _this.view_provider.add_node(node);
                    _this.layout_provider.layout();
                    _this.view_provider.show(false);
                    _this.invoke_event_handle(exports.TSMindEventTypeMap.edit, { evt: "insert_node_after", data: [afterid, nodeid, topic, data], node: nodeid });
                }
                return node;
            }
            else {
                tools_1.$logger.error("fail, this mind map is not editable");
                return null;
            }
        };
        this.remove_node = function (node) {
            if (!util_1["default"].is_node(node)) {
                var the_node = _this.get_node(node);
                if (!the_node) {
                    tools_1.$logger.error("the node[id=" + node + "] can not be found.");
                    return false;
                }
                else {
                    return _this.remove_node(the_node);
                }
            }
            if (_this.get_editable()) {
                if (node.isroot) {
                    tools_1.$logger.error("fail, can not remove root node");
                    return false;
                }
                var nodeid = node.id;
                var parentid = node.parent.id;
                var parent_node = _this.get_node(parentid);
                parent_node && _this.view_provider.save_location(parent_node);
                _this.view_provider.remove_node(node);
                _this.mind.remove_node(node);
                _this.layout_provider.layout();
                _this.view_provider.show(false);
                parent_node && _this.view_provider.restore_location(parent_node);
                _this.invoke_event_handle(exports.TSMindEventTypeMap.edit, { evt: "remove_node", data: [nodeid], node: parentid });
                return true;
            }
            else {
                tools_1.$logger.error("fail, this mind map is not editable");
                return false;
            }
        };
        this.update_node = function (nodeid, topic) {
            if (_this.get_editable()) {
                if (util_1["default"].text.is_empty(topic)) {
                    tools_1.$logger.warn("fail, topic can not be empty");
                    return;
                }
                var node = _this.get_node(nodeid);
                if (!!node) {
                    if (node.topic === topic) {
                        tools_1.$logger.info("nothing changed");
                        _this.view_provider.update_node(node);
                        return;
                    }
                    node.topic = topic;
                    _this.view_provider.update_node(node);
                    _this.layout_provider.layout();
                    _this.view_provider.show(false);
                    _this.invoke_event_handle(exports.TSMindEventTypeMap.edit, { evt: "update_node", data: [nodeid, topic], node: nodeid });
                }
            }
            else {
                tools_1.$logger.error("fail, this mind map is not editable");
                return;
            }
        };
        this.move_node = function (nodeid, beforeid, parentid, direction) {
            if (_this.get_editable()) {
                var node = _this.mind.move_node(nodeid, beforeid, parentid, direction);
                if (!!node) {
                    _this.view_provider.update_node(node);
                    _this.layout_provider.layout();
                    _this.view_provider.show(false);
                    _this.invoke_event_handle(exports.TSMindEventTypeMap.edit, { evt: "move_node", data: [nodeid, beforeid, parentid, direction], node: nodeid });
                }
            }
            else {
                tools_1.$logger.error("fail, this mind map is not editable");
                return;
            }
        };
        this.select_node = function (node) {
            if (!util_1["default"].is_node(node)) {
                var the_node = _this.get_node(node);
                if (!the_node) {
                    tools_1.$logger.error("the node[id=" + node + "] can not be found.");
                    return;
                }
                else {
                    return _this.select_node(the_node);
                }
            }
            if (!_this.layout_provider.is_visible(node)) {
                return;
            }
            _this.mind.selected = node;
            _this.view_provider.select_node(node);
        };
        this.get_selected_node = function () {
            if (!!_this.mind) {
                return _this.mind.selected;
            }
            else {
                return null;
            }
        };
        this.select_clear = function () {
            if (!!_this.mind) {
                _this.mind.selected = null;
                _this.view_provider.select_clear();
            }
        };
        this.is_node_visible = function (node) {
            return _this.layout_provider.is_visible(node);
        };
        this.find_node_before = function (node) {
            if (!util_1["default"].is_node(node)) {
                var the_node = _this.get_node(node);
                if (!the_node) {
                    tools_1.$logger.error("the node[id=" + node + "] can not be found.");
                    return null;
                }
                else {
                    return _this.find_node_before(the_node);
                }
            }
            if (node.isroot) {
                return null;
            }
            var n = null;
            if (node.parent.isroot) {
                var c = node.parent.children;
                var prev = null;
                for (var _i = 0, c_1 = c; _i < c_1.length; _i++) {
                    var ni = c_1[_i];
                    if (node.direction === ni.direction) {
                        if (node.id === ni.id) {
                            n = prev;
                        }
                        prev = ni;
                    }
                }
            }
            else {
                n = _this.mind.get_node_before(node);
            }
            return n;
        };
        this.find_node_after = function (node) {
            if (!util_1["default"].is_node(node)) {
                var the_node = _this.get_node(node);
                if (!the_node) {
                    tools_1.$logger.error("the node[id=" + node + "] can not be found.");
                    return;
                }
                else {
                    return _this.find_node_after(the_node);
                }
            }
            if (node.isroot) {
                return null;
            }
            var n = null;
            if (node.parent.isroot) {
                var c = node.parent.children;
                var getthis = false;
                for (var _i = 0, c_2 = c; _i < c_2.length; _i++) {
                    var ni = c_2[_i];
                    if (node.direction === ni.direction) {
                        if (getthis) {
                            n = ni;
                            break;
                        }
                        if (node.id === ni.id) {
                            getthis = true;
                        }
                    }
                }
            }
            else {
                n = _this.mind.get_node_after(node);
            }
            return n;
        };
        this.set_node_color = function (nodeid, bgcolor, fgcolor) {
            if (_this.get_editable()) {
                var node = _this.mind.get_node(nodeid);
                if (!!node) {
                    if (!!bgcolor) {
                        node.data["background-color"] = bgcolor;
                    }
                    if (!!fgcolor) {
                        node.data["foreground-color"] = fgcolor;
                    }
                    _this.view_provider.reset_node_custom_style(node);
                    return true;
                }
            }
            else {
                tools_1.$logger.error("fail, this mind map is not editable");
            }
            return false;
        };
        this.set_node_font_style = function (nodeid, size, weight, style) {
            if (_this.get_editable()) {
                var node = _this.mind.get_node(nodeid);
                if (!!node) {
                    if (!!size) {
                        node.data["font-size"] = size;
                    }
                    if (!!weight) {
                        node.data["font-weight"] = weight;
                    }
                    if (!!style) {
                        node.data["font-style"] = style;
                    }
                    _this.view_provider.reset_node_custom_style(node);
                    _this.view_provider.update_node(node);
                    _this.layout_provider.layout();
                    _this.view_provider.show(false);
                    return true;
                }
            }
            else {
                tools_1.$logger.error("fail, this mind map is not editable");
            }
            return false;
        };
        this.set_node_background_image = function (nodeid, image, width, height, rotation) {
            if (_this.get_editable()) {
                var node = _this.mind.get_node(nodeid);
                if (!!node) {
                    if (!!image) {
                        node.data["background-image"] = image;
                    }
                    if (!!width) {
                        node.data.width = width;
                    }
                    if (!!height) {
                        node.data.height = height;
                    }
                    if (!!rotation) {
                        node.data["background-rotation"] = rotation;
                    }
                    _this.view_provider.reset_node_custom_style(node);
                    _this.view_provider.update_node(node);
                    _this.layout_provider.layout();
                    _this.view_provider.show(false);
                    return true;
                }
            }
            else {
                tools_1.$logger.error("fail, this mind map is not editable");
            }
            return false;
        };
        this.set_node_background_rotation = function (nodeid, rotation) {
            if (_this.get_editable()) {
                var node = _this.mind.get_node(nodeid);
                if (!!node) {
                    if (!node.data["background-image"]) {
                        tools_1.$logger.error("fail, only can change rotation angle of node with background image");
                        return false;
                    }
                    node.data["background-rotation"] = rotation;
                    _this.view_provider.reset_node_custom_style(node);
                    _this.view_provider.update_node(node);
                    _this.layout_provider.layout();
                    _this.view_provider.show(false);
                    return true;
                }
            }
            else {
                tools_1.$logger.error("fail, this mind map is not editable");
            }
            return false;
        };
        this.resize = function () {
            _this.view_provider.resize();
        };
        // callback(type ,data)
        this.add_event_listener = function (callback) {
            if (callback === void 0) { callback = function () { return void 0; }; }
            if (typeof callback === "function") {
                _this.event_handles.push(callback);
            }
        };
        this.invoke_event_handle = function (type, data) {
            var j = _this;
            window.setTimeout(function () {
                j._invoke_event_handle(type, data);
            }, 0);
        };
        this._invoke_event_handle = function (type, data) {
            var l = _this.event_handles.length;
            for (var i = 0; i < l; i++) {
                _this.event_handles[i](type, data);
            }
        };
        if (!options.container) {
            throw Error("the options.container should not be null or empty.");
        }
        this.options = tools_1.$extend(true, constants_1.DEFAULT_OPTIONS, options);
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        var opts = this.options;
        var opts_layout = {
            mode: opts.mode,
            hspace: opts.layout.hspace,
            vspace: opts.layout.vspace,
            pspace: opts.layout.pspace
        };
        var opts_view = {
            container: opts.container,
            support_html: opts.support_html,
            hmargin: opts.view.hmargin,
            vmargin: opts.view.vmargin,
            line_width: opts.view.line_width,
            line_color: opts.view.line_color
        };
        // create instance of function provider
        this.data_provider = new data_1.data_provider(this);
        this.layout_provider = new layout_1["default"](this, opts_layout);
        this.view_provider = new view_1["default"](this, opts_view);
        this.shortcut_provider = new shortcut_1["default"](this, opts.shortcut);
        this._event_bind();
        this.init_plugins(this, options);
    }
    // static properties
    TSMind.version = constants_1.__version__;
    TSMind.direction = exports.TSMindDirectionMap;
    TSMind.event_type = exports.TSMindEventTypeMap;
    return TSMind;
}());
exports.TSMind = TSMind;
exports["default"] = TSMind;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.__name__ = "TSMind";
// library version
exports.__version__ = "0.5.0";
// authores
exports.__authores__ = ["1071115676@qq.com", "hizzgdev@163.com"];
exports.DEFAULT_OPTIONS = {
    container: "",
    editable: false,
    theme: "primary",
    mode: "full",
    support_html: true,
    view: {
        hmargin: 100,
        vmargin: 50,
        line_width: 2,
        line_color: "#555"
    },
    layout: {
        hspace: 30,
        vspace: 20,
        pspace: 13
    },
    default_event_handle: {
        enable_mousedown_handle: true,
        enable_click_handle: true,
        enable_dblclick_handle: true
    },
    shortcut: {
        enable: true,
        handles: {},
        mapping: {
            addchild: 45,
            addbrother: 13,
            editnode: 113,
            delnode: 46,
            toggle: 32,
            left: 37,
            up: 38,
            right: 39,
            down: 40 // Down
        }
    }
};
// custom node names
exports.TSM_Node_Names = {
    nodes: "tsmnodes",
    node: "tsmnode",
    fold: "tsmfold"
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var __1 = __webpack_require__(1);
var TSM_node = /** @class */ (function () {
    function TSM_node(sId, iIndex, sTopic, oData, bIsRoot, oParent, eDirection, bExpanded) {
        if (oData === void 0) { oData = {}; }
        if (eDirection === void 0) { eDirection = __1.TSMindDirectionMap.right; }
        if (bExpanded === void 0) { bExpanded = true; }
        var _this = this;
        this.id = "";
        this.index = 0;
        this.topic = "";
        this.data = {};
        this.isroot = true;
        this.direction = __1.TSMindDirectionMap.left;
        this.expanded = true;
        this.children = [];
        this.expands = {};
        this.width = 0;
        this.height = 0;
        this.view_data = {
            element: null,
            expander: null,
            abs_x: 0,
            abs_y: 0,
            width: 0,
            height: 0,
            _saved_location: {
                x: 0,
                y: 0
            }
        };
        this.layout_data = {
            direction: __1.TSMindDirectionMap.right,
            side_index: 0,
            offset_x: 0,
            offset_y: 0,
            outer_height: 0,
            left_nodes: [],
            right_nodes: [],
            outer_height_left: 0,
            outer_height_right: 0,
            visible: true,
            _offset_: {
                x: 0,
                y: 0
            }
        };
        this.get_location = function () {
            var vd = _this.view_data;
            return {
                x: vd.abs_x || 0,
                y: vd.abs_y || 0
            };
        };
        this.get_size = function () {
            var vd = _this.view_data;
            return {
                w: vd.width || 0,
                h: vd.height || 0
            };
        };
        this.id = sId;
        this.index = iIndex;
        this.topic = sTopic;
        this.data = oData;
        this.isroot = bIsRoot;
        this.parent = oParent;
        this.direction = eDirection;
        this.expanded = bExpanded;
    }
    TSM_node.inherited = function (pnode, node) {
        if (!!pnode && !!node) {
            if (pnode.id === node.id) {
                return true;
            }
            if (pnode.isroot) {
                return true;
            }
            var pid = pnode.id;
            var p = node;
            while (!p.isroot) {
                p = p.parent;
                if (p.id === pid) {
                    return true;
                }
            }
        }
        return false;
    };
    TSM_node.compare = function (node1, node2) {
        // '-1' is alwary the last
        var r = 0;
        var i1 = node1.index;
        var i2 = node2.index;
        if (i1 >= 0 && i2 >= 0) {
            r = i1 - i2;
        }
        else if (i1 === -1 && i2 === -1) {
            r = 0;
        }
        else if (i1 === -1) {
            r = 1;
        }
        else if (i2 === -1) {
            r = -1;
        }
        else {
            r = 0;
        }
        // logger.debug(i1+' <> '+i2+'  =  '+r);
        return r;
    };
    return TSM_node;
}());
exports.TSM_node = TSM_node;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.dom = {
    // target,eventType,handler
    add_event: function (target, event, call) {
        target.addEventListener(event, call, false);
    },
    css: function (cstyle, property_name) {
        return cstyle.getPropertyValue(property_name);
    },
    is_visible: function (cstyle) {
        var visibility = exports.dom.css(cstyle, "visibility");
        var display = exports.dom.css(cstyle, "display");
        exports.dom.css(cstyle, "backface-visibility");
        return visibility !== "hidden" && display !== "none";
    }
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.canvas = {
    bezierto: function (ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(x1 + ((x2 - x1) * 2) / 3, y1, x1, y2, x2, y2);
        ctx.stroke();
    },
    lineto: function (ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    },
    clear: function (ctx, x, y, w, h) {
        ctx.clearRect(x, y, w, h);
    },
    rect: function (ctx, x, y, w, h, r) {
        if (w < 2 * r)
            r = w / 2;
        if (h < 2 * r)
            r = h / 2;
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
    },
    text_multiline: function (ctx, text, x, y, w, h, lineheight) {
        var line = "";
        var text_len = text.length;
        var chars = text.split("");
        var test_line = null;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        for (var i = 0; i < text_len; i++) {
            test_line = line + chars[i];
            if (ctx.measureText(test_line).width > w && i > 0) {
                ctx.fillText(line, x, y);
                line = chars[i];
                y += lineheight;
            }
            else {
                line = test_line;
            }
        }
        ctx.fillText(line, x, y);
    },
    text_ellipsis: function (ctx, text, x, y, w, h) {
        var center_y = y + h / 2;
        text = exports.canvas.fittingString(ctx, text, w);
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(text, x, center_y, w);
    },
    fittingString: function (ctx, text, max_width) {
        var width = ctx.measureText(text).width;
        var ellipsis = "…";
        var ellipsis_width = ctx.measureText(ellipsis).width;
        if (width <= max_width || width <= ellipsis_width) {
            return text;
        }
        else {
            var len = text.length;
            while (width >= max_width - ellipsis_width && len-- > 0) {
                text = text.substring(0, len);
                width = ctx.measureText(text).width;
            }
            return text + ellipsis;
        }
    },
    image: function (ctx, backgroundUrl, x, y, w, h, r, rotation, callback) {
        if (callback === void 0) { callback = function () { }; }
        var img = new Image();
        img.onload = function () {
            ctx.save();
            ctx.translate(x, y);
            ctx.save();
            ctx.beginPath();
            exports.canvas.rect(ctx, 0, 0, w, h, r);
            ctx.closePath();
            ctx.clip();
            ctx.translate(w / 2, h / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.drawImage(img, -w / 2, -h / 2);
            ctx.restore();
            ctx.restore();
            callback();
        };
        img.src = backgroundUrl;
    }
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var tools_1 = __webpack_require__(0);
var util_1 = __webpack_require__(7);
var node_1 = __webpack_require__(3);
var __1 = __webpack_require__(1);
var TSM_mind = /** @class */ (function () {
    function TSM_mind() {
        var _this = this;
        this.name = null;
        this.author = null;
        this.version = null;
        this.root = null;
        this.selected = null;
        this.nodes = {};
        this.get_node = function (nodeid) {
            if (nodeid in _this.nodes) {
                return _this.nodes[nodeid];
            }
            else {
                tools_1.$logger.warn("the node[id=" + nodeid + "] can not be found");
                return null;
            }
        };
        this.set_root = function (nodeid, topic, data) {
            if (_this.root == null) {
                _this.root = new node_1.TSM_node(nodeid, 0, topic, data, true);
                _this._put_node(_this.root);
            }
            else {
                tools_1.$logger.error("root node is already exist");
            }
        };
        this.add_node = function (parent_node, nodeid, topic, data, idx, direction, expanded) {
            if (idx === void 0) { idx = -1; }
            if (!util_1["default"].is_node(parent_node)) {
                var the_parent_node = _this.get_node(parent_node);
                if (!the_parent_node) {
                    tools_1.$logger.error("the parent_node[id=" + parent_node + "] can not be found.");
                    return null;
                }
                else {
                    return _this.add_node(the_parent_node, nodeid, topic, data, idx, direction, expanded);
                }
            }
            var nodeindex = idx;
            var node = null;
            parent_node = parent_node;
            if (parent_node.isroot) {
                var d = __1["default"].direction.right;
                if (isNaN(direction)) {
                    var children = parent_node.children;
                    var children_len = children.length;
                    var r = 0;
                    for (var i = 0; i < children_len; i++) {
                        if (children[i].direction === __1["default"].direction.left) {
                            r--;
                        }
                        else {
                            r++;
                        }
                    }
                    d = children_len > 1 && r > 0 ? __1["default"].direction.left : __1["default"].direction.right;
                }
                else {
                    d = direction !== __1["default"].direction.left ? __1["default"].direction.right : __1["default"].direction.left;
                }
                node = new node_1.TSM_node(nodeid, nodeindex, topic, data, false, parent_node, d, expanded);
            }
            else {
                node = new node_1.TSM_node(nodeid, nodeindex, topic, data, false, parent_node, parent_node.direction, expanded);
            }
            if (_this._put_node(node)) {
                parent_node.children.push(node);
                _this._reindex(parent_node);
            }
            else {
                tools_1.$logger.error("fail, the nodeid '" + node.id + "' has been already exist.");
                node = null;
            }
            return node;
        };
        this.insert_node_before = function (node_before, nodeid, topic, data) {
            if (!util_1["default"].is_node(node_before)) {
                var the_node_before = _this.get_node(node_before);
                if (!the_node_before) {
                    tools_1.$logger.error("the node_before[id=" + node_before + "] can not be found.");
                    return null;
                }
                else {
                    return _this.insert_node_before(the_node_before, nodeid, topic, data);
                }
            }
            node_before = node_before;
            var node_index = node_before.index - 0.5;
            return node_before.parent ? _this.add_node(node_before.parent, nodeid, topic, data, node_index) : null;
        };
        this.get_node_before = function (node) {
            if (typeof node === "string") {
                var the_node = _this.get_node(node);
                if (!the_node) {
                    tools_1.$logger.error("the node[id=" + node + "] can not be found.");
                    return null;
                }
                else {
                    return _this.get_node_before(the_node);
                }
            }
            if (node.isroot) {
                return null;
            }
            var idx = node.index - 2;
            if (idx >= 0) {
                return node.parent.children[idx] || null;
            }
            else {
                return null;
            }
        };
        this.insert_node_after = function (node_after, nodeid, topic, data) {
            if (typeof node_after === "string") {
                var the_node_after = _this.get_node(node_after);
                if (!the_node_after) {
                    tools_1.$logger.error("the node_after[id=" + node_after + "] can not be found.");
                    return null;
                }
                else {
                    return _this.insert_node_after(the_node_after, nodeid, topic, data);
                }
            }
            var node_index = node_after.index + 0.5;
            return node_after.parent ? _this.add_node(node_after.parent, nodeid, topic, data, node_index) : null;
        };
        this.get_node_after = function (node) {
            if (typeof node === "string") {
                var the_node = _this.get_node(node);
                if (!the_node) {
                    tools_1.$logger.error("the node[id=" + node + "] can not be found.");
                    return null;
                }
                else {
                    return _this.get_node_after(the_node);
                }
            }
            if (node.isroot) {
                return null;
            }
            var idx = node.index;
            var brothers = node.parent.children || null;
            if (brothers.length >= idx) {
                return node.parent.children[idx] || null;
            }
            else {
                return null;
            }
        };
        this.move_node = function (node, beforeid, parentid, direction) {
            if (typeof node === "string") {
                var the_node = _this.get_node(node);
                if (!the_node) {
                    tools_1.$logger.error("the node[id=" + node + "] can not be found.");
                    return null;
                }
                else {
                    return _this.move_node(the_node, beforeid, parentid, direction);
                }
            }
            if (!parentid) {
                parentid = node.parent.id;
            }
            return _this._move_node(node, beforeid, parentid, direction);
        };
        this._flow_node_direction = function (node, direction) {
            if (typeof direction === "undefined") {
                direction = node.direction;
            }
            else {
                node.direction = direction;
            }
            var len = node.children.length;
            while (len--) {
                _this._flow_node_direction(node.children[len], direction);
            }
        };
        this._move_node_internal = function (node, beforeid) {
            if (!!node && !!beforeid) {
                if (beforeid === "_last_") {
                    node.index = -1;
                    _this._reindex(node.parent);
                }
                else if (beforeid === "_first_") {
                    node.index = 0;
                    _this._reindex(node.parent);
                }
                else {
                    var node_before = !!beforeid ? _this.get_node(beforeid) : null;
                    if (node_before != null && node_before.parent != null && node_before.parent.id === node.parent.id) {
                        node.index = node_before.index - 0.5;
                        _this._reindex(node.parent);
                    }
                }
            }
            return node;
        };
        this._move_node = function (node, beforeid, parentid, direction) {
            if (!!node && !!parentid) {
                if (node.parent.id !== parentid) {
                    // remove from parent's children
                    var sibling = node.parent.children;
                    var si = sibling.length;
                    while (si--) {
                        if (sibling[si].id === node.id) {
                            sibling.splice(si, 1);
                            break;
                        }
                    }
                    var _nparent = _this.get_node(parentid);
                    if (_nparent) {
                        node.parent = _nparent;
                        node.parent.children.push(node);
                    }
                }
                if (node.parent.isroot) {
                    if (direction === __1["default"].direction.left) {
                        node.direction = direction;
                    }
                    else {
                        node.direction = __1["default"].direction.right;
                    }
                }
                else {
                    node.direction = node.parent.direction;
                }
                _this._move_node_internal(node, beforeid);
                _this._flow_node_direction(node);
            }
            return node;
        };
        this.remove_node = function (node) {
            if (typeof node === "string") {
                var the_node = _this.get_node(node);
                if (!the_node) {
                    tools_1.$logger.error("the node[id=" + node + "] can not be found.");
                    return false;
                }
                else {
                    return _this.remove_node(the_node);
                }
            }
            if (!node) {
                tools_1.$logger.error("fail, the node can not be found");
                return false;
            }
            if (node.isroot) {
                tools_1.$logger.error("fail, can not remove root node");
                return false;
            }
            if (_this.selected !== null && _this.selected.id === node.id) {
                _this.selected = null;
            }
            // clean all subordinate nodes
            var children = node.children;
            var ci = children.length;
            while (ci--) {
                _this.remove_node(children[ci]);
            }
            // clean all children
            children.length = 0;
            // remove from parent's children
            var sibling = node.parent.children || [];
            var si = sibling.length;
            while (si--) {
                if (sibling[si].id === node.id) {
                    sibling.splice(si, 1);
                    break;
                }
            }
            // remove from global nodes
            delete _this.nodes[node.id];
            // clean all properties
            Object.keys(node).map(function (k) {
                delete node[k];
            });
            // remove it's self
            node = null;
            // delete node;
            return true;
        };
        this._put_node = function (node) {
            if (node.id in _this.nodes) {
                tools_1.$logger.warn("the nodeid '" + node.id + "' has been already exist.");
                return false;
            }
            else {
                _this.nodes[node.id] = node;
                return true;
            }
        };
        this._reindex = function (node) {
            if (node instanceof node_1.TSM_node) {
                node.children.sort(node_1.TSM_node.compare);
                for (var i = 0; i < node.children.length; i++) {
                    node.children[i].index = i + 1;
                }
            }
        };
    }
    return TSM_mind;
}());
exports.TSM_mind = TSM_mind;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var node_1 = __webpack_require__(3);
var canvas_1 = __webpack_require__(5);
var file_1 = __webpack_require__(15);
var json_1 = __webpack_require__(10);
var ajax_1 = __webpack_require__(16);
var dom_1 = __webpack_require__(4);
var uuid_1 = __webpack_require__(17);
var text_1 = __webpack_require__(11);
var array = __webpack_require__(8);
exports.util = {
    is_node: function (node) {
        return node instanceof node_1.TSM_node;
    },
    ajax: ajax_1.ajax,
    dom: dom_1.dom,
    canvas: canvas_1.canvas,
    file: file_1.file,
    json: json_1.json,
    uuid: uuid_1.uuid,
    text: text_1.text,
    array: array
};
exports["default"] = exports.util;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports._slice = Array.prototype.slice;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var constants_1 = __webpack_require__(2);
var mind_1 = __webpack_require__(6);
var tools_1 = __webpack_require__(0);
var node_1 = __webpack_require__(3);
var __1 = __webpack_require__(1);
exports.node_array = {
    example: {
        meta: {
            name: constants_1.__name__,
            author: constants_1.__authores__,
            version: constants_1.__version__
        },
        format: "node_array",
        data: [
            { id: "root", topic: "jsMind Example", isroot: true }
        ]
    },
    get_mind: function (source) {
        var df = exports.node_array;
        var mind = new mind_1.TSM_mind();
        mind.name = source.meta.name;
        mind.author = source.meta.author;
        mind.version = source.meta.version;
        df._parse(mind, source.data);
        return mind;
    },
    get_data: function (mind) {
        var df = exports.node_array;
        var data = [];
        df._array(mind, data);
        return {
            meta: {
                name: mind.name,
                author: mind.author,
                version: mind.version
            },
            format: "node_array",
            data: data
        };
    },
    _parse: function (mind, nodes) {
        var df = exports.node_array;
        var narray = nodes.slice(0);
        // reverse array for improving looping performance
        narray.reverse();
        var root_id = df._extract_root(mind, narray);
        if (!!root_id) {
            df._extract_subnode(mind, root_id, narray);
        }
        else {
            tools_1.$logger.error("root node can not be found");
        }
    },
    _extract_root: function (mind, nodes) {
        var df = exports.node_array;
        var i = nodes.length;
        while (i--) {
            if ("isroot" in nodes[i] && nodes[i].isroot) {
                var root_json = nodes[i];
                var data = df._extract_data(root_json);
                mind.set_root(root_json.id, root_json.topic, data);
                nodes.splice(i, 1);
                return root_json.id;
            }
        }
        return null;
    },
    _extract_subnode: function (mind, parentid, nodes) {
        var df = exports.node_array;
        var i = nodes.length;
        var node_json = null;
        var data = null;
        var extract_count = 0;
        while (i--) {
            node_json = nodes[i];
            if (node_json.parentid === parentid) {
                data = df._extract_data(node_json);
                var node_direction = node_json.direction;
                mind.add_node(parentid, node_json.id, node_json.topic, data, undefined, node_direction
                    ? node_direction === "left"
                        ? __1["default"].direction.left
                        : __1["default"].direction.right
                    : undefined, node_json.expanded);
                nodes.splice(i, 1);
                extract_count++;
                var sub_extract_count = df._extract_subnode(mind, node_json.id, nodes);
                if (sub_extract_count > 0) {
                    // reset loop index after extract subordinate node
                    i = nodes.length;
                    extract_count += sub_extract_count;
                }
            }
        }
        return extract_count;
    },
    _extract_data: function (node_json) {
        var data = {};
        for (var k in node_json) {
            if (k === "id" ||
                k === "topic" ||
                k === "parentid" ||
                k === "isroot" ||
                k === "direction" ||
                k === "expanded") {
                continue;
            }
            data[k] = node_json[k];
        }
        return data;
    },
    _array: function (mind, nodes) {
        var df = exports.node_array;
        mind.root && df._array_node(mind.root, nodes);
    },
    _array_node: function (node, nodes) {
        var df = exports.node_array;
        if (!(node instanceof node_1.TSM_node)) {
            return;
        }
        var o = {
            id: node.id,
            topic: node.topic,
            expanded: node.expanded,
            children: [],
            width: 0,
            height: 0
        };
        if (!!node.parent) {
            o.parentid = node.parent.id;
        }
        if (node.isroot) {
            o.isroot = true;
        }
        if (!!node.parent && node.parent.isroot) {
            o.direction = node.direction === __1["default"].direction.left ? "left" : "right";
        }
        if (node.data != null) {
            var node_data_1 = node.data;
            Object.keys(node_data_1).map(function (k) {
                o[k] = node_data_1[k];
            });
        }
        nodes.push(o);
        var ci = node.children.length;
        for (var i = 0; i < ci; i++) {
            df._array_node(node.children[i], nodes);
        }
    }
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var tools_1 = __webpack_require__(0);
exports.json = {
    json2string: function (json) {
        if (!!JSON) {
            try {
                var json_str = JSON.stringify(json);
                return json_str;
            }
            catch (e) {
                tools_1.$logger.warn(e);
                tools_1.$logger.warn("can not convert to string");
                return null;
            }
        }
        return null;
    },
    string2json: function (json_str) {
        if (!!JSON) {
            try {
                var json_1 = JSON.parse(json_str);
                return json_1;
            }
            catch (e) {
                tools_1.$logger.warn(e);
                tools_1.$logger.warn("can not parse to json");
                return null;
            }
        }
    },
    merge: function (b, a) {
        return tools_1.$extend(b, a);
    }
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.text = {
    is_empty: function (s) {
        if (!s) {
            return true;
        }
        return s.replace(/\s*/, "").length === 0;
    }
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var tslib_1 = __webpack_require__(13);
tslib_1.__exportStar(__webpack_require__(1), exports);


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var tools_1 = __webpack_require__(0);
var node_array_1 = __webpack_require__(9);
var node_tree_1 = __webpack_require__(18);
var freemind_1 = __webpack_require__(19);
var data_provider = /** @class */ (function () {
    function data_provider(tsm) {
        var _this = this;
        this.reset = function () {
            tools_1.$logger.debug("data.reset");
        };
        this.load = function (mind_data) {
            var df = null;
            var mind = null;
            if (typeof mind_data === "object") {
                if (!!mind_data.format) {
                    df = mind_data.format;
                }
                else {
                    df = "node_tree";
                }
            }
            else {
                df = "freemind";
            }
            if (df === "node_array") {
                mind = node_array_1.node_array.get_mind(mind_data);
            }
            else if (df === "node_tree") {
                mind = node_tree_1.node_tree.get_mind(mind_data);
            }
            else if (df === "freemind") {
                mind = freemind_1.freemind.get_mind(mind_data);
            }
            else {
                tools_1.$logger.warn("unsupported format");
            }
            return mind;
        };
        this.get_data = function (data_format) {
            var data = null;
            if (!_this.tsm.mind)
                return data;
            if (data_format === "node_array") {
                data = node_array_1.node_array.get_data(_this.tsm.mind);
            }
            else if (data_format === "node_tree") {
                data = node_tree_1.node_tree.get_data(_this.tsm.mind);
            }
            else if (data_format === "freemind") {
                data = freemind_1.freemind.get_data(_this.tsm.mind);
            }
            else {
                tools_1.$logger.error("unsupported " + data_format + " format");
            }
            return data;
        };
        this.tsm = tsm;
        tools_1.$logger.debug("data.init");
    }
    return data_provider;
}());
exports.data_provider = data_provider;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var tools_1 = __webpack_require__(0);
exports.file = {
    read: function (file_data, fn_callback) {
        var reader = new FileReader();
        reader.onload = function () {
            if (typeof fn_callback === "function") {
                fn_callback(this.result, file_data.name);
            }
        };
        reader.readAsText(file_data);
    },
    save: function (file_data, type, name) {
        var blob;
        var _wind = window;
        if (typeof _wind.Blob === "function") {
            blob = new Blob([file_data], { type: type });
        }
        else {
            var BlobBuilder = _wind.BlobBuilder || _wind.MozBlobBuilder || _wind.WebKitBlobBuilder || _wind.MSBlobBuilder;
            var bb = new BlobBuilder();
            bb.append(file_data);
            blob = bb.getBlob(type);
        }
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, name);
        }
        else {
            var URL_1 = _wind.URL || _wind.webkitURL;
            var bloburl = URL_1.createObjectURL(blob);
            var anchor = tools_1.$doc.createElement("a");
            if ("download" in anchor) {
                anchor.style.visibility = "hidden";
                anchor.href = bloburl;
                anchor.download = name;
                tools_1.$doc.body.appendChild(anchor);
                var evt = tools_1.$doc.createEvent("MouseEvents");
                evt.initEvent("click", true, true);
                anchor.dispatchEvent(evt);
                tools_1.$doc.body.removeChild(anchor);
            }
            else {
                location.href = bloburl;
            }
        }
    }
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var json_1 = __webpack_require__(10);
var tools_1 = __webpack_require__(0);
exports.ajax = {
    _xhr: function () {
        var xhr = null;
        if ("XMLHttpRequest" in window) {
            xhr = new XMLHttpRequest();
        }
        else {
            try {
                xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e) { }
        }
        return xhr;
    },
    _eurl: function (url) {
        return encodeURIComponent(url);
    },
    request: function (url, param, method, callback, fail_callback) {
        if (param === void 0) { param = {}; }
        if (method === void 0) { method = "GET"; }
        if (callback === void 0) { callback = tools_1.$noop; }
        if (fail_callback === void 0) { fail_callback = tools_1.$noop; }
        var a = exports.ajax;
        var p = null;
        var tmp_param = [];
        Object.keys(param).map(function (k) {
            tmp_param.push(a._eurl(k) + "=" + a._eurl(param[k]));
        });
        if (tmp_param.length > 0) {
            p = tmp_param.join("&");
        }
        var xhr = a._xhr();
        if (!xhr) {
            return;
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) {
                    var data = json_1.json.string2json(xhr.responseText);
                    if (data != null) {
                        callback(data);
                    }
                    else {
                        callback(xhr.responseText);
                    }
                }
                else {
                    fail_callback(xhr);
                    tools_1.$logger.error("xhr request failed.", xhr);
                }
            }
        };
        method = method || "GET";
        xhr.open(method, url, true);
        xhr.setRequestHeader("If-Modified-Since", "0");
        if (method === "POST") {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
            xhr.send(p);
        }
        else {
            xhr.send();
        }
    },
    get: function (url, callback) {
        return exports.ajax.request(url, {}, "GET", callback);
    },
    post: function (url, param, callback) {
        return exports.ajax.request(url, param, "POST", callback);
    }
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.uuid = {
    newid: function () {
        return (new Date().getTime().toString(16) +
            Math.random()
                .toString(16)
                .substr(2)).substr(2, 16);
    }
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var constants_1 = __webpack_require__(2);
var mind_1 = __webpack_require__(6);
var __1 = __webpack_require__(1);
var node_1 = __webpack_require__(3);
exports.node_tree = {
    example: {
        meta: {
            name: constants_1.__name__,
            author: constants_1.__authores__,
            version: constants_1.__version__
        },
        format: "node_tree",
        data: { id: "root", topic: "jsMind Example" }
    },
    get_mind: function (source) {
        var df = exports.node_tree;
        var mind = new mind_1.TSM_mind();
        mind.name = source.meta.name;
        mind.author = source.meta.author;
        mind.version = source.meta.version;
        df._parse(mind, source.data);
        return mind;
    },
    get_data: function (mind) {
        var df = exports.node_tree;
        return {
            meta: {
                name: mind.name,
                author: mind.author,
                version: mind.version
            },
            format: "node_tree",
            data: df._buildnode(mind.root)
        };
    },
    _parse: function (mind, node_root) {
        var df = exports.node_tree;
        var data = df._extract_data(node_root);
        mind.set_root(node_root.id, node_root.topic, data);
        if ("children" in node_root) {
            var children = node_root.children;
            for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                var child = children_1[_i];
                df._extract_subnode(mind, mind.root, child);
            }
        }
    },
    _extract_data: function (node_json) {
        var data = {};
        for (var k in node_json) {
            if (k === "id" ||
                k === "topic" ||
                k === "children" ||
                k === "direction" ||
                k === "expanded") {
                continue;
            }
            data[k] = node_json[k];
        }
        return data;
    },
    _extract_subnode: function (mind, node_parent, node_json) {
        var df = exports.node_tree;
        var data = df._extract_data(node_json);
        var dir = __1.TSMindDirectionMap.right;
        if (node_parent.isroot) {
            dir = __1.TSMindDirectionMap[node_json.direction];
        }
        var node = mind.add_node(node_parent, node_json.id, node_json.topic, data, undefined, dir, node_json.expanded);
        if ("children" in node_json) {
            var children = node_json.children;
            for (var _i = 0, children_2 = children; _i < children_2.length; _i++) {
                var child = children_2[_i];
                df._extract_subnode(mind, node, child);
            }
        }
    },
    _buildnode: function (node) {
        var df = exports.node_tree;
        if (!(node instanceof node_1.TSM_node)) {
            return;
        }
        var o = {
            id: node.id,
            topic: node.topic,
            expanded: node.expanded
        };
        if (!!node.parent && node.parent.isroot) {
            o.direction =
                node.direction === __1.TSMindDirectionMap.left ? "left" : "right";
        }
        if (node.data != null) {
            var node_data = node.data;
            for (var k in node_data) {
                if (k) {
                    o[k] = node_data[k];
                }
            }
        }
        var children = node.children;
        if (children.length > 0) {
            o.children = [];
            for (var _i = 0, children_3 = children; _i < children_3.length; _i++) {
                var child = children_3[_i];
                o.children.push(df._buildnode(child));
            }
        }
        return o;
    }
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var constants_1 = __webpack_require__(2);
var mind_1 = __webpack_require__(6);
var __1 = __webpack_require__(1);
var array_1 = __webpack_require__(8);
exports.freemind = {
    example: {
        meta: {
            name: constants_1.__name__,
            author: constants_1.__authores__,
            version: constants_1.__version__
        },
        format: "freemind",
        data: "<map version=\"" + constants_1.__version__ + "\"><node ID=\"root\" TEXT=\"freemind Example\"/></map>"
    },
    get_mind: function (source) {
        var df = exports.freemind;
        var mind = new mind_1.TSM_mind();
        mind.name = source.meta.name;
        mind.author = source.meta.author;
        mind.version = source.meta.version;
        var xml = source.data;
        var xml_doc = df._parse_xml(xml);
        var xml_root = df._find_root(xml_doc);
        df._load_node(mind, null, xml_root);
        return mind;
    },
    get_data: function (mind) {
        var df = exports.freemind;
        var json = {
            meta: {
                name: mind.name,
                author: mind.author,
                version: mind.version
            },
            format: "freemind",
            data: ""
        };
        var xmllines = [];
        xmllines.push("<map version=\"" + constants_1.__version__ + "\">");
        df._buildmap(mind.root, xmllines);
        xmllines.push("</map>");
        json.data = xmllines.join(" ");
        return json;
    },
    _parse_xml: function (xml) {
        var xml_doc = null;
        if (!!DOMParser) {
            var parser = new DOMParser();
            xml_doc = parser.parseFromString(xml, "text/xml");
        }
        else {
            // Internet Explorer
            xml_doc = new window.ActiveXObject("Microsoft.XMLDOM");
            xml_doc.async = false;
            xml_doc.loadXML(xml);
        }
        return xml_doc;
    },
    _find_root: function (xml_doc) {
        var nodes = array_1._slice.call(xml_doc.childNodes);
        var node = null;
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var n = nodes_1[_i];
            if (n.nodeType === 1 && n.tagName === "map") {
                node = n;
                break;
            }
        }
        if (!!node) {
            var ns = array_1._slice.call(node.childNodes);
            node = null;
            for (var _a = 0, ns_1 = ns; _a < ns_1.length; _a++) {
                var n = ns_1[_a];
                if (n.nodeType === 1 && n.tagName === "node") {
                    node = n;
                    break;
                }
            }
        }
        return node;
    },
    _load_node: function (mind, parent_id, xml_node) {
        var df = exports.freemind;
        var node_id = xml_node.getAttribute("ID");
        if (!node_id)
            return;
        var node_topic = xml_node.getAttribute("TEXT");
        // look for richcontent
        if (node_topic == null) {
            var topic_children = array_1._slice.call(xml_node.childNodes);
            for (var _i = 0, topic_children_1 = topic_children; _i < topic_children_1.length; _i++) {
                var topic_child = topic_children_1[_i];
                // logger.debug(topic_child.tagName);
                if (topic_child.nodeType === 1 &&
                    topic_child.tagName === "richcontent") {
                    node_topic = topic_child.textContent;
                    break;
                }
            }
        }
        var node_data = df._load_attributes(xml_node);
        var node_expanded = "expanded" in node_data ? node_data.expanded === "true" : true;
        delete node_data.expanded;
        var node_position = xml_node.getAttribute("POSITION");
        var node_direction = node_position
            ? __1["default"].direction[node_position]
            : undefined;
        // logger.debug(node_position +':'+ node_direction);
        if (!!parent_id) {
            mind.add_node(parent_id, node_id, node_topic, node_data, undefined, node_direction, node_expanded);
        }
        else {
            mind.set_root(node_id, node_topic, node_data);
        }
        var children = array_1._slice.call(xml_node.childNodes);
        for (var _a = 0, children_1 = children; _a < children_1.length; _a++) {
            var child = children_1[_a];
            if (child.nodeType === 1 && child.tagName === "node") {
                df._load_node(mind, node_id, child);
            }
        }
    },
    _load_attributes: function (xml_node) {
        var children = array_1._slice.call(xml_node.childNodes);
        var attr_data = {};
        for (var _i = 0, children_2 = children; _i < children_2.length; _i++) {
            var attr = children_2[_i];
            if (attr.nodeType === 1 && attr.tagName === "attribute") {
                attr_data[attr.getAttribute("NAME")] = attr.getAttribute("VALUE");
            }
        }
        return attr_data;
    },
    _buildmap: function (node, xmllines) {
        if (!node)
            return;
        var df = exports.freemind;
        var pos = null;
        if (!!node.parent && node.parent.isroot) {
            pos = node.direction === __1["default"].direction.left ? "left" : "right";
        }
        xmllines.push("<node");
        xmllines.push('ID="' + node.id + '"');
        if (!!pos) {
            xmllines.push('POSITION="' + pos + '"');
        }
        xmllines.push('TEXT="' + node.topic + '">');
        // store expanded status as an attribute
        xmllines.push('<attribute NAME="expanded" VALUE="' + node.expanded + '"/>');
        // for attributes
        if (node.data) {
            Object.keys(node.data).map(function (k) {
                xmllines.push('<attribute NAME="' + k + '" VALUE="' + node.data[k] + '"/>');
            });
        }
        // for children
        for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
            var child = _a[_i];
            df._buildmap(child, xmllines);
        }
        xmllines.push("</node>");
    }
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var __1 = __webpack_require__(1);
var tools_1 = __webpack_require__(0);
var layout_provider = /** @class */ (function () {
    function layout_provider(tsm, options) {
        var _this = this;
        this.bounds = { n: 0, s: 0, w: 0, e: 0 };
        this.reset = function () {
            tools_1.$logger.debug("layout.reset");
            _this.bounds = { n: 0, s: 0, w: 0, e: 0 };
        };
        this.layout = function () {
            tools_1.$logger.debug("layout.layout");
            _this.layout_direction();
            _this.layout_offset();
        };
        this.layout_direction = function () {
            _this._layout_direction_root();
        };
        this._layout_direction_root = function () {
            var node = _this.tsm.mind.root;
            if (!node)
                return;
            // $logger.debug(node);
            var children = node.children;
            var children_count = children.length;
            node.layout_data.direction = __1["default"].direction.center;
            node.layout_data.side_index = 0;
            if (_this.isside) {
                var i = children_count;
                while (i--) {
                    _this._layout_direction_side(children[i], __1["default"].direction.right, i);
                }
            }
            else {
                var i = children_count;
                var subnode = null;
                while (i--) {
                    subnode = children[i];
                    if (subnode.direction === __1["default"].direction.left) {
                        _this._layout_direction_side(subnode, __1["default"].direction.left, i);
                    }
                    else {
                        _this._layout_direction_side(subnode, __1["default"].direction.right, i);
                    }
                }
                /*
                          var boundary = Math.ceil(children_count/2);
                          var i = children_count;
                          while(i--){
                              if(i>=boundary){
                                  this._layout_direction_side(children[i],tsm.direction.left, children_count-i-1);
                              }else{
                                  this._layout_direction_side(children[i],tsm.direction.right, i);
                              }
                          }*/
            }
        };
        this._layout_direction_side = function (node, direction, side_index) {
            var layout_data = node.layout_data;
            var children = node.children;
            var children_count = children.length;
            layout_data.direction = direction;
            layout_data.side_index = side_index;
            var i = children_count;
            while (i--) {
                _this._layout_direction_side(children[i], direction, i);
            }
        };
        this.layout_offset = function () {
            var node = _this.tsm.mind.root;
            if (!node)
                return;
            var layout_data = node.layout_data;
            if (!layout_data)
                return;
            var children = node.children;
            var i = children.length;
            var left_nodes = [];
            var right_nodes = [];
            var subnode = null;
            while (i--) {
                subnode = children[i];
                if (subnode.layout_data.direction === __1["default"].direction.right) {
                    right_nodes.unshift(subnode);
                }
                else {
                    left_nodes.unshift(subnode);
                }
            }
            layout_data.left_nodes = left_nodes;
            layout_data.right_nodes = right_nodes;
            layout_data.outer_height_left = _this._layout_offset_subnodes(left_nodes);
            layout_data.outer_height_right = _this._layout_offset_subnodes(right_nodes);
            _this.bounds.e = (node.view_data.width || 0) / 2;
            _this.bounds.w = 0 - _this.bounds.e;
            // $logger.debug(this.bounds.w);
            _this.bounds.n = 0;
            _this.bounds.s = Math.max(layout_data.outer_height_left, layout_data.outer_height_right);
        };
        // layout both the x and y axis
        this._layout_offset_subnodes = function (nodes) {
            var total_height = 0;
            var nodes_count = nodes.length;
            var i = nodes_count;
            var node = null;
            var node_outer_height = 0;
            var base_y = 0;
            var pd = null; // parent._data
            while (i--) {
                node = nodes[i];
                var layout_data = node.layout_data;
                if (pd == null) {
                    pd = node.parent;
                }
                node_outer_height = _this._layout_offset_subnodes(node.children);
                if (!node.expanded) {
                    node_outer_height = 0;
                    _this.set_visible(node.children, false);
                }
                node_outer_height = Math.max(node.view_data.height || 0, node_outer_height);
                layout_data.outer_height = node_outer_height;
                layout_data.offset_y = base_y - node_outer_height / 2;
                layout_data.offset_x = _this.opts.hspace * layout_data.direction + (pd.view_data.width * (pd.layout_data.direction + layout_data.direction)) / 2;
                if (!node.parent.isroot) {
                    layout_data.offset_x += _this.opts.pspace * layout_data.direction;
                }
                base_y = base_y - node_outer_height - _this.opts.vspace;
                total_height += node_outer_height;
            }
            if (nodes_count > 1) {
                total_height += _this.opts.vspace * (nodes_count - 1);
            }
            i = nodes_count;
            var middle_height = total_height / 2;
            while (i--) {
                node = nodes[i];
                node.layout_data.offset_y += middle_height;
            }
            return total_height;
        };
        // layout the y axis only, for collapse/expand a node
        this._layout_offset_subnodes_height = function (nodes) {
            var total_height = 0;
            var nodes_count = nodes.length;
            var i = nodes_count;
            var node = null;
            var node_outer_height = 0;
            var layout_data = null;
            var base_y = 0;
            while (i--) {
                node = nodes[i];
                layout_data = node.layout_data;
                node_outer_height = _this._layout_offset_subnodes_height(node.children);
                if (!node.expanded) {
                    node_outer_height = 0;
                }
                node_outer_height = Math.max(node.view_data.height, node_outer_height);
                layout_data.outer_height = node_outer_height;
                layout_data.offset_y = base_y - node_outer_height / 2;
                base_y = base_y - node_outer_height - _this.opts.vspace;
                total_height += node_outer_height;
            }
            if (nodes_count > 1) {
                total_height += _this.opts.vspace * (nodes_count - 1);
            }
            i = nodes_count;
            var middle_height = total_height / 2;
            while (i--) {
                node = nodes[i];
                node.layout_data.offset_y += middle_height;
                // $logger.debug(node.topic);
                // $logger.debug(node.layout_data.offset_y);
            }
            return total_height;
        };
        this.get_node_offset = function (node) {
            var layout_data = node.layout_data;
            var offset_cache = { x: -1, y: -1 };
            if ("_offset_" in layout_data && _this.cache_valid) {
                offset_cache = layout_data._offset_;
            }
            else {
                layout_data._offset_ = offset_cache;
            }
            if (offset_cache.x === -1 || offset_cache.y === -1) {
                var x = layout_data.offset_x;
                var y = layout_data.offset_y;
                if (!node.isroot) {
                    var offset_p = _this.get_node_offset(node.parent);
                    x += offset_p.x;
                    y += offset_p.y;
                }
                offset_cache.x = x;
                offset_cache.y = y;
            }
            return offset_cache;
        };
        this.get_node_point = function (node) {
            var offset_p = _this.get_node_offset(node);
            tools_1.$logger.debug(offset_p);
            var p = {
                x: offset_p.x + (node.view_data.width * (node.layout_data.direction - 1)) / 2,
                y: offset_p.y - node.view_data.height / 2
            };
            // $logger.debug(p);
            return p;
        };
        this.get_node_point_in = function (node) {
            return _this.get_node_offset(node);
        };
        this.get_node_point_out = function (node) {
            var pout_cache = { x: -1, y: -1 };
            if (pout_cache.x === -1 || pout_cache.y === -1) {
                if (node.isroot) {
                    pout_cache.x = 0;
                    pout_cache.y = 0;
                }
                else {
                    var offset_p = _this.get_node_offset(node);
                    pout_cache.x = offset_p.x + (node.view_data.width + _this.opts.pspace) * node.layout_data.direction;
                    pout_cache.y = offset_p.y;
                    // $logger.debug('pout');
                    // $logger.debug(pout_cache);
                }
            }
            return pout_cache;
        };
        this.get_expander_point = function (node) {
            var p = _this.get_node_point_out(node);
            var ex_p = {
                x: 0,
                y: 0
            };
            if (node.layout_data.direction === __1["default"].direction.right) {
                ex_p.x = p.x - _this.opts.pspace;
            }
            else {
                ex_p.x = p.x;
            }
            ex_p.y = p.y - Math.ceil(_this.opts.pspace / 2);
            return ex_p;
        };
        this.get_min_size = function () {
            var nodes = _this.tsm.mind.nodes;
            if (!nodes)
                return;
            var node = null;
            var pout = null;
            for (var nodeid in nodes) {
                if (!nodeid)
                    continue;
                node = nodes[nodeid];
                pout = _this.get_node_point_out(node);
                // $logger.debug(pout.x);
                if (pout.x > _this.bounds.e) {
                    _this.bounds.e = pout.x;
                }
                if (pout.x < _this.bounds.w) {
                    _this.bounds.w = pout.x;
                }
            }
            return {
                w: _this.bounds.e - _this.bounds.w,
                h: _this.bounds.s - _this.bounds.n
            };
        };
        this.toggle_node = function (node) {
            if (node.isroot) {
                return;
            }
            if (node.expanded) {
                _this.collapse_node(node);
            }
            else {
                _this.expand_node(node);
            }
        };
        this.expand_node = function (node) {
            node.expanded = true;
            _this.part_layout(node);
            _this.set_visible(node.children, true);
        };
        this.collapse_node = function (node) {
            node.expanded = false;
            _this.part_layout(node);
            _this.set_visible(node.children, false);
        };
        this.expand_all = function () {
            var nodes = _this.tsm.mind.nodes;
            if (!nodes)
                return;
            var c = 0;
            var node;
            for (var nodeid in nodes) {
                if (!nodeid)
                    continue;
                node = nodes[nodeid];
                if (!node.expanded) {
                    node.expanded = true;
                    c++;
                }
            }
            if (c > 0) {
                var root = _this.tsm.mind.root;
                if (!root)
                    return;
                _this.part_layout(root);
                _this.set_visible(root.children, true);
            }
        };
        this.collapse_all = function () {
            var nodes = _this.tsm.mind.nodes;
            var c = 0;
            var node;
            for (var nodeid in nodes) {
                if (!nodeid)
                    continue;
                node = nodes[nodeid];
                if (node.expanded && !node.isroot) {
                    node.expanded = false;
                    c++;
                }
            }
            if (c > 0) {
                var root = _this.tsm.mind.root;
                if (!root)
                    return;
                _this.part_layout(root);
                _this.set_visible(root.children, true);
            }
        };
        this.expand_to_depth = function (target_depth, curr_nodes, curr_depth) {
            if (curr_nodes === void 0) { curr_nodes = _this.tsm.mind.root.children; }
            if (curr_depth === void 0) { curr_depth = 1; }
            if (target_depth < 1) {
                return;
            }
            var i = curr_nodes.length;
            var node = null;
            while (i--) {
                node = curr_nodes[i];
                if (curr_depth < target_depth) {
                    if (!node.expanded) {
                        _this.expand_node(node);
                    }
                    _this.expand_to_depth(target_depth, node.children, curr_depth + 1);
                }
                if (curr_depth === target_depth) {
                    if (node.expanded) {
                        _this.collapse_node(node);
                    }
                }
            }
        };
        this.part_layout = function (node) {
            var root = _this.tsm.mind.root;
            if (!!root) {
                var root_layout_data = root.layout_data;
                if (!root_layout_data)
                    return;
                if (node.isroot) {
                    root_layout_data.right_nodes && (root_layout_data.outer_height_right = _this._layout_offset_subnodes_height(root_layout_data.right_nodes));
                    root_layout_data.left_nodes && (root_layout_data.outer_height_left = _this._layout_offset_subnodes_height(root_layout_data.left_nodes));
                }
                else {
                    if (node.layout_data.direction === __1["default"].direction.right) {
                        root_layout_data.right_nodes && (root_layout_data.outer_height_right = _this._layout_offset_subnodes_height(root_layout_data.right_nodes));
                    }
                    else {
                        root_layout_data.left_nodes && (root_layout_data.outer_height_left = _this._layout_offset_subnodes_height(root_layout_data.left_nodes));
                    }
                }
                _this.bounds.s = Math.max(root_layout_data.outer_height_left, root_layout_data.outer_height_right);
                _this.cache_valid = false;
            }
            else {
                tools_1.$logger.warn("can not found root node");
            }
        };
        this.set_visible = function (nodes, visible) {
            var i = nodes.length;
            var node = null;
            // let layout_data: any;
            while (i--) {
                node = nodes[i];
                // layout_data = node.layout_data;
                if (node.expanded) {
                    _this.set_visible(node.children, visible);
                }
                else {
                    _this.set_visible(node.children, false);
                }
                if (!node.isroot) {
                    node.layout_data.visible = visible;
                }
            }
        };
        this.is_expand = function (node) {
            return node.expanded;
        };
        this.is_visible = function (node) {
            return !!node.layout_data.visible;
        };
        this.opts = options;
        this.tsm = tsm;
        this.isside = this.opts.mode === "side";
        this.cache_valid = false;
        tools_1.$logger.debug("layout.init");
    }
    return layout_provider;
}());
exports["default"] = layout_provider;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var tools_1 = __webpack_require__(0);
var dom_1 = __webpack_require__(4);
var __1 = __webpack_require__(1);
var text_1 = __webpack_require__(11);
var array_1 = __webpack_require__(8);
var canvas_1 = __webpack_require__(5);
var constants_1 = __webpack_require__(2);
var view_provider = /** @class */ (function () {
    function view_provider(tsm, options) {
        var _this = this;
        this.e_panel = tools_1.$doc.createElement("div");
        this.e_nodes = tools_1.$doc.createElement(constants_1.TSM_Node_Names.nodes);
        this.e_canvas = tools_1.$doc.createElement("canvas");
        this.e_editor = tools_1.$doc.createElement("input");
        this.canvas_ctx = this.e_canvas.getContext("2d");
        this.size = { w: 0, h: 0 };
        this.selected_node = null;
        this.editing_node = null;
        // view zoom
        this.actualZoom = 1;
        this.zoomStep = 0.1;
        this.minZoom = 0.5;
        this.maxZoom = 2;
        this.add_event = function (obj, event_name, event_handle) {
            _this.e_nodes &&
                dom_1.dom.add_event(_this.e_nodes, event_name, function (e) {
                    var evt = e || event;
                    event_handle.call(obj, evt);
                });
        };
        this.is_expander = function (element) {
            return element.tagName.toLowerCase() === constants_1.TSM_Node_Names.fold;
        };
        this.reset = function () {
            tools_1.$logger.debug("view.reset");
            _this.selected_node = null;
            _this.clear_lines();
            _this.clear_nodes();
            _this.reset_theme();
        };
        this.reset_theme = function () {
            var theme_name = _this.tsm.options.theme;
            if (!!theme_name) {
                _this.e_nodes.className = "theme-" + theme_name;
            }
            else {
                _this.e_nodes.className = "";
            }
        };
        this.reset_custom_style = function () {
            var nodes = _this.tsm.mind.nodes;
            for (var nodeid in nodes) {
                if (nodeid)
                    _this.reset_node_custom_style(nodes[nodeid]);
            }
        };
        this.load = function () {
            tools_1.$logger.debug("view.load");
            _this.init_nodes();
        };
        this.expand_size = function () {
            var min_size = _this.layout.get_min_size();
            if (!min_size)
                return;
            var min_height = min_size.h + _this.opts.vmargin * 2;
            var min_width = min_size.w + _this.opts.hmargin * 2;
            var client_w = _this.e_panel.clientWidth || 0;
            var client_h = _this.e_panel.clientHeight || 0;
            if (client_w < min_width) {
                client_w = min_width;
            }
            if (client_h < min_height) {
                client_h = min_height;
            }
            _this.size.w = client_w;
            _this.size.h = client_h;
        };
        this.init_nodes_size = function (node) {
            if (!node.view_data.element)
                return;
            node.view_data.width = node.view_data.element.clientWidth;
            node.view_data.height = node.view_data.element.clientHeight;
        };
        this.init_nodes = function () {
            var nodes = _this.tsm.mind.nodes;
            var doc_frag = tools_1.$doc.createDocumentFragment();
            for (var nodeid in nodes) {
                if (nodeid)
                    _this.create_node_element(nodes[nodeid], doc_frag);
            }
            _this.e_nodes.appendChild(doc_frag);
            for (var nodeid in nodes) {
                if (nodeid)
                    _this.init_nodes_size(nodes[nodeid]);
            }
        };
        this.add_node = function (node) {
            _this.create_node_element(node, _this.e_nodes);
            _this.init_nodes_size(node);
        };
        this.create_node_element = function (node, parent_node) {
            var d = tools_1.$doc.createElement(constants_1.TSM_Node_Names.node);
            if (node.isroot) {
                d.className = "root";
                // d.style.visibility = "visible";
            }
            else {
                var d_e = tools_1.$doc.createElement(constants_1.TSM_Node_Names.fold);
                tools_1.$pushText(d_e, "-");
                d_e.setAttribute("nodeid", node.id);
                d_e.style.visibility = "hidden";
                parent_node.appendChild(d_e);
                node.view_data.expander = d_e;
            }
            if (!!node.topic) {
                if (_this.opts.support_html) {
                    tools_1.$pushChild(d, node.topic);
                }
                else {
                    tools_1.$pushText(d, node.topic);
                }
            }
            d.setAttribute("nodeid", node.id);
            // d.style.visibility = "hidden";
            _this._reset_node_custom_style(d, node.data);
            parent_node.appendChild(d);
            node.view_data.element = d;
        };
        this.remove_node = function (node) {
            if (_this.selected_node != null && _this.selected_node.id === node.id) {
                _this.selected_node = null;
            }
            if (_this.editing_node !== null && _this.editing_node.id === node.id && node.view_data.element) {
                node.view_data.element.removeChild(_this.e_editor);
                _this.editing_node = null;
            }
            var children = node.children;
            var i = children.length;
            while (i--) {
                _this.remove_node(children[i]);
            }
            var element = node.view_data.element;
            var expander = node.view_data.expander;
            if (_this.e_nodes) {
                element && _this.e_nodes.removeChild(element);
                expander && _this.e_nodes.removeChild(expander);
                node.view_data.element = null;
                node.view_data.expander = null;
            }
        };
        this.update_node = function (node) {
            var element = node.view_data.element;
            if (!!node.topic) {
                if (_this.opts.support_html) {
                    tools_1.$pushChild(element, node.topic);
                }
                else {
                    tools_1.$pushText(element, node.topic);
                }
            }
            node.view_data.width = element.clientWidth;
            node.view_data.height = element.clientHeight;
        };
        this.select_node = function (node) {
            if (!node || !_this.selected_node)
                return;
            var selected_node_ele = _this.selected_node.view_data.element;
            var node_ele = node.view_data.element;
            if (!!selected_node_ele) {
                selected_node_ele.className = selected_node_ele.className.replace(/\s*selected\b/i, "");
                _this.reset_node_custom_style(_this.selected_node);
            }
            if (!!node && !!node_ele) {
                _this.selected_node = node;
                node_ele.className += " selected";
                _this.clear_node_custom_style(node);
            }
        };
        this.select_clear = function () {
            _this.select_node(null);
        };
        this.get_editing_node = function () {
            return _this.editing_node;
        };
        this.is_editing = function () {
            return !!_this.editing_node;
        };
        this.edit_node_begin = function (node) {
            if (!node.topic) {
                tools_1.$logger.warn("don't edit image nodes");
                return;
            }
            if (_this.editing_node != null) {
                _this.edit_node_end();
            }
            _this.editing_node = node;
            var element = node.view_data.element;
            if (!element)
                return;
            var topic = node.topic;
            var ncs = getComputedStyle(element);
            _this.e_editor.value = topic;
            _this.e_editor.style.width =
                element.clientWidth - parseInt(ncs.getPropertyValue("padding-left"), 10) - parseInt(ncs.getPropertyValue("padding-right"), 10) + "px";
            element.innerHTML = "";
            element.appendChild(_this.e_editor);
            element.style.zIndex = "5";
            _this.e_editor.focus();
            _this.e_editor.select();
        };
        this.edit_node_end = function () {
            if (_this.editing_node != null) {
                var node = _this.editing_node;
                _this.editing_node = null;
                var element = node.view_data.element;
                var topic = _this.e_editor.value;
                element.style.zIndex = "auto";
                element.removeChild(_this.e_editor);
                if (text_1.text.is_empty(topic) || node.topic === topic) {
                    if (_this.opts.support_html) {
                        tools_1.$pushChild(element, node.topic);
                    }
                    else {
                        tools_1.$pushText(element, node.topic);
                    }
                }
                else {
                    _this.tsm.update_node(node.id, topic);
                }
            }
        };
        this.get_view_offset = function () {
            var bounds = _this.layout.bounds;
            return { x: (_this.size.w - bounds.e - bounds.w) / 2, y: _this.size.h / 2 };
        };
        this.resize = function () {
            _this.e_canvas.width = 1;
            _this.e_canvas.height = 1;
            _this.e_nodes.style.width = "1px";
            _this.e_nodes.style.height = "1px";
            _this.expand_size();
            _this._show();
        };
        this._show = function () {
            _this.e_canvas.width = _this.size.w;
            _this.e_canvas.height = _this.size.h;
            _this.e_nodes.style.width = _this.size.w + "px";
            _this.e_nodes.style.height = _this.size.h + "px";
            _this.show_nodes();
            _this.show_lines();
            // this.layout.cache_valid = true;
            _this.tsm.invoke_event_handle(__1.TSMindEventTypeMap.resize, { data: [] });
        };
        this.zoomIn = function () {
            return _this.setZoom(_this.actualZoom + _this.zoomStep);
        };
        this.zoomOut = function () {
            return _this.setZoom(_this.actualZoom - _this.zoomStep);
        };
        this.setZoom = function (zoom) {
            if (zoom < _this.minZoom || zoom > _this.maxZoom) {
                return false;
            }
            _this.actualZoom = zoom;
            var _children = array_1._slice.call(_this.e_panel.children);
            for (var _i = 0, _children_1 = _children; _i < _children_1.length; _i++) {
                var child = _children_1[_i];
                child.style.transform = "scale(" + zoom + ")";
            }
            _this.show(true);
            return true;
        };
        this._center_root = function () {
            // center root node
            var outer_w = _this.e_panel.clientWidth;
            var outer_h = _this.e_panel.clientHeight;
            if (_this.size.w > outer_w) {
                var _offset = _this.get_view_offset();
                _this.e_panel.scrollLeft = _offset.x - outer_w / 2;
            }
            if (_this.size.h > outer_h) {
                _this.e_panel.scrollTop = (_this.size.h - outer_h) / 2;
            }
        };
        this.show = function (keep_center) {
            tools_1.$logger.debug("view.show");
            _this.expand_size();
            _this._show();
            if (keep_center) {
                _this._center_root();
            }
        };
        this.relayout = function () {
            _this.expand_size();
            _this._show();
        };
        this.save_location = function (node) {
            var vd = node.view_data;
            if (vd)
                vd._saved_location = {
                    x: Number(vd.element.style.left) - _this.e_panel.scrollLeft,
                    y: Number(vd.element.style.top) - _this.e_panel.scrollTop
                };
        };
        this.restore_location = function (node) {
            var vd = node.view_data;
            if (vd && vd.element) {
                var _ele = vd.element;
                _this.e_panel.scrollLeft = Number(_ele.style.left) - vd._saved_location.x;
                _this.e_panel.scrollTop = Number(vd.element.style.top) - vd._saved_location.y;
            }
        };
        this.clear_nodes = function () {
            var mind = _this.tsm.mind;
            if (mind == null) {
                return;
            }
            var nodes = mind.nodes;
            var node = null;
            for (var nodeid in nodes) {
                if (!nodeid)
                    continue;
                node = nodes[nodeid];
                node.view_data.element = null;
                node.view_data.expander = null;
            }
            _this.e_nodes.innerHTML = "";
        };
        this.show_nodes = function () {
            var nodes = _this.tsm.mind.nodes;
            var _offset = _this.get_view_offset();
            for (var nodeid in nodes) {
                if (!nodeid)
                    continue;
                var node = nodes[nodeid];
                tools_1.$logger.log(node);
                var node_element = node.view_data.element;
                var expander = node.view_data.expander;
                if (!node_element)
                    continue;
                if (!_this.layout.is_visible(node)) {
                    node_element.style.display = "none";
                    expander.style.display = "none";
                    continue;
                }
                _this.reset_node_custom_style(node);
                var p = _this.layout.get_node_point(node);
                node.view_data.abs_x = _offset.x + p.x;
                node.view_data.abs_y = _offset.y + p.y;
                node_element.style.left = node.view_data.abs_x + "px";
                node_element.style.top = node.view_data.abs_y + "px";
                node_element.style.display = "";
                node_element.style.visibility = "visible";
                //
                if (!node.isroot && node.children.length > 0) {
                    var expander_text = node.expanded ? "-" : "+";
                    var p_expander = _this.layout.get_expander_point(node);
                    if (expander) {
                        expander.style.left = _offset.x + p_expander.x + "px";
                        expander.style.top = _offset.y + p_expander.y + "px";
                        expander.style.display = "";
                        expander.style.visibility = "visible";
                        tools_1.$pushText(expander, expander_text);
                    }
                }
                // hide expander while all children have been removed
                if (!node.isroot && node.children.length === 0 && expander) {
                    expander.style.display = "none";
                    expander.style.visibility = "hidden";
                }
            }
        };
        this.reset_node_custom_style = function (node) {
            _this._reset_node_custom_style(node.view_data.element, node.data);
        };
        this._reset_node_custom_style = function (node_element, node_data) {
            if ("background-color" in node_data) {
                node_element.style.backgroundColor = node_data["background-color"];
            }
            if ("foreground-color" in node_data) {
                node_element.style.color = node_data["foreground-color"];
            }
            if ("width" in node_data) {
                node_element.style.width = node_data.width + "px";
            }
            if ("height" in node_data) {
                node_element.style.height = node_data.height + "px";
            }
            if ("font-size" in node_data) {
                node_element.style.fontSize = node_data["font-size"] + "px";
            }
            if ("font-weight" in node_data) {
                node_element.style.fontWeight = node_data["font-weight"];
            }
            if ("font-style" in node_data) {
                node_element.style.fontStyle = node_data["font-style"];
            }
            if ("background-image" in node_data) {
                var backgroundImage = node_data["background-image"];
                if (backgroundImage.startsWith("data") && node_data.width && node_data.height) {
                    var img = new Image();
                    img.onload = function () {
                        var c = tools_1.$doc.createElement("canvas");
                        c.width = node_element.clientWidth;
                        c.height = node_element.clientHeight;
                        var img = this;
                        if (c.getContext) {
                            var ctx = c.getContext("2d");
                            ctx.drawImage(img, 2, 2, node_element.clientWidth, node_element.clientHeight);
                            var scaledImageData = c.toDataURL();
                            node_element.style.backgroundImage = "url(" + scaledImageData + ")";
                        }
                    };
                    img.src = backgroundImage;
                }
                else {
                    node_element.style.backgroundImage = "url(" + backgroundImage + ")";
                }
                node_element.style.backgroundSize = "99%";
                if ("background-rotation" in node_data) {
                    node_element.style.transform = "rotate(" + node_data["background-rotation"] + "deg)";
                }
            }
        };
        this.clear_node_custom_style = function (node) {
            var node_element = node.view_data.element;
            if (node_element) {
                node_element.style.backgroundColor = "";
                node_element.style.color = "";
            }
        };
        this.clear_lines = function (canvas_ctx) {
            if (canvas_ctx === void 0) { canvas_ctx = _this.canvas_ctx; }
            canvas_1.canvas.clear(canvas_ctx, 0, 0, _this.size.w, _this.size.h);
        };
        this.show_lines = function (canvas_ctx) {
            if (canvas_ctx === void 0) { canvas_ctx = _this.canvas_ctx; }
            _this.clear_lines(canvas_ctx);
            var nodes = _this.tsm.mind.nodes;
            var node = null;
            var pin = null;
            var pout = null;
            var _offset = _this.get_view_offset();
            for (var nodeid in nodes) {
                if (!nodeid)
                    continue;
                node = nodes[nodeid];
                if (!!node.isroot) {
                    continue;
                }
                if ("visible" in node.layout_data && !node.layout_data.visible) {
                    continue;
                }
                pin = _this.layout.get_node_point_in(node);
                pout = _this.layout.get_node_point_out(node.parent);
                _this.draw_line(pout, pin, _offset, canvas_ctx);
            }
        };
        this.draw_line = function (pin, pout, offset, canvas_ctx) {
            if (canvas_ctx === void 0) { canvas_ctx = _this.canvas_ctx; }
            canvas_ctx.strokeStyle = _this.opts.line_color;
            canvas_ctx.lineWidth = _this.opts.line_width;
            canvas_ctx.lineCap = "round";
            canvas_1.canvas.bezierto(canvas_ctx, pin.x + offset.x, pin.y + offset.y, pout.x + offset.x, pout.y + offset.y);
        };
        this.opts = options;
        this.tsm = tsm;
        this.layout = tsm.layout_provider;
        tools_1.$logger.debug("view.init");
        this.container = tools_1.$isEl(this.opts.container) ? this.opts.container : tools_1.$elByID(this.opts.container);
        if (!this.container) {
            tools_1.$logger.error("the options.view.container was not be found in dom");
            return;
        }
        this.e_panel.className = "jsmind-inner";
        this.e_panel.appendChild(this.e_canvas);
        this.e_panel.appendChild(this.e_nodes);
        this.e_editor.className = "jsmind-editor";
        this.e_editor.type = "text";
        var v = this;
        dom_1.dom.add_event(this.e_editor, "keydown", function (e) {
            var evt = e || event;
            if (evt.keyCode === 13) {
                v.edit_node_end();
                evt.stopPropagation();
            }
        });
        dom_1.dom.add_event(this.e_editor, "blur", function () {
            v.edit_node_end();
        });
        this.container.appendChild(this.e_panel);
    }
    view_provider.prototype.get_binded_nodeid = function (element) {
        if (element == null) {
            return null;
        }
        var tagName = element.tagName.toLowerCase();
        if (tagName === constants_1.TSM_Node_Names.nodes || tagName === "body" || tagName === "html") {
            return null;
        }
        if (tagName === constants_1.TSM_Node_Names.node || tagName === constants_1.TSM_Node_Names.fold) {
            return element.getAttribute("nodeid");
        }
        else if (element.parentElement) {
            return this.get_binded_nodeid(element.parentElement);
        }
        return null;
    };
    return view_provider;
}());
exports["default"] = view_provider;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var dom_1 = __webpack_require__(4);
var tools_1 = __webpack_require__(0);
var __1 = __webpack_require__(1);
var util_1 = __webpack_require__(7);
var shortcut_provider = /** @class */ (function () {
    function shortcut_provider(tsm, options) {
        var _this = this;
        this._mapping = {};
        this.enable_shortcut = function () {
            _this.opts.enable = true;
        };
        this.disable_shortcut = function () {
            _this.opts.enable = false;
        };
        this.handler = function (e) {
            if (e === void 0) { e = event; }
            if (_this.tsm.view_provider.is_editing()) {
                return;
            }
            if (!_this.opts.enable) {
                return true;
            }
            var kc = e.keyCode;
            if (kc in _this._mapping) {
                _this._mapping[kc].call(_this, _this.tsm, e);
            }
        };
        this.handle_addchild = function (tsm) {
            var selected_node = tsm.get_selected_node();
            if (!!selected_node) {
                var nodeid = util_1["default"].uuid.newid();
                var node = tsm.add_node(selected_node, nodeid, "New Node");
                if (!!node) {
                    tsm.select_node(nodeid);
                    tsm.begin_edit(nodeid);
                }
            }
        };
        this.handle_addbrother = function (tsm) {
            var selected_node = tsm.get_selected_node();
            if (!!selected_node && !selected_node.isroot) {
                var nodeid = util_1["default"].uuid.newid();
                var node = tsm.insert_node_after(selected_node, nodeid, "New Node");
                if (!!node) {
                    tsm.select_node(nodeid);
                    tsm.begin_edit(nodeid);
                }
            }
        };
        this.handle_editnode = function (tsm) {
            var selected_node = tsm.get_selected_node();
            if (!!selected_node) {
                tsm.begin_edit(selected_node);
            }
        };
        this.handle_delnode = function (tsm) {
            var selected_node = tsm.get_selected_node();
            if (!!selected_node && !selected_node.isroot) {
                tsm.select_node(selected_node.parent);
                tsm.remove_node(selected_node);
            }
        };
        this.handle_toggle = function (tsm, e) {
            if (e === void 0) { e = event; }
            var selected_node = tsm.get_selected_node();
            if (!!selected_node) {
                tsm.toggle_node(selected_node.id);
                e.stopPropagation();
                e.preventDefault();
            }
        };
        this.handle_up = function (tsm, e) {
            if (e === void 0) { e = event; }
            var selected_node = tsm.get_selected_node();
            if (!!selected_node) {
                var up_node = tsm.find_node_before(selected_node);
                if (!up_node) {
                    var np = tsm.find_node_before(selected_node.parent);
                    if (!!np && np.children.length > 0) {
                        up_node = np.children[np.children.length - 1];
                    }
                }
                if (!!up_node) {
                    tsm.select_node(up_node);
                }
                e.stopPropagation();
                e.preventDefault();
            }
        };
        this.handle_down = function (tsm, e) {
            if (e === void 0) { e = event; }
            var selected_node = tsm.get_selected_node();
            if (!!selected_node) {
                var down_node = tsm.find_node_after(selected_node);
                if (!down_node) {
                    var np = tsm.find_node_after(selected_node.parent);
                    if (!!np && np.children.length > 0) {
                        down_node = np.children[0];
                    }
                }
                if (!!down_node) {
                    tsm.select_node(down_node);
                }
                e.stopPropagation();
                e.preventDefault();
            }
        };
        this.handle_left = function (tsm, e) {
            _this._handle_direction(tsm, e, __1["default"].direction.left);
        };
        this.handle_right = function (tsm, e) {
            _this._handle_direction(tsm, e, __1["default"].direction.right);
        };
        this._handle_direction = function (tsm, e, d) {
            if (e === void 0) { e = event; }
            var selected_node = tsm.get_selected_node();
            var node = null;
            if (!!selected_node) {
                if (selected_node.isroot) {
                    var c = selected_node.children;
                    var children = [];
                    for (var i = 0; i < c.length; i++) {
                        if (c[i].direction === d) {
                            children.push(i);
                        }
                    }
                    node = c[children[Math.floor((children.length - 1) / 2)]];
                }
                else if (selected_node.direction === d) {
                    var children = selected_node.children;
                    var childrencount = children.length;
                    if (childrencount > 0) {
                        node = children[Math.floor((childrencount - 1) / 2)];
                    }
                }
                else {
                    node = selected_node.parent;
                }
                if (!!node) {
                    tsm.select_node(node);
                }
                e.stopPropagation();
                e.preventDefault();
            }
        };
        this.tsm = tsm;
        this.opts = options;
        this.mapping = options.mapping;
        this.handles = options.handles;
        dom_1.dom.add_event(tools_1.$doc, "keydown", this.handler.bind(this));
        this.handles.addchild = this.handle_addchild;
        this.handles.addbrother = this.handle_addbrother;
        this.handles.editnode = this.handle_editnode;
        this.handles.delnode = this.handle_delnode;
        this.handles.toggle = this.handle_toggle;
        this.handles.up = this.handle_up;
        this.handles.down = this.handle_down;
        this.handles.left = this.handle_left;
        this.handles.right = this.handle_right;
        for (var handle in this.mapping) {
            if (!!this.mapping[handle] && handle in this.handles) {
                this._mapping[this.mapping[handle]] = this.handles[handle];
            }
        }
    }
    return shortcut_provider;
}());
exports["default"] = shortcut_provider;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var draggable_1 = __webpack_require__(24);
var screenshot_1 = __webpack_require__(25);
// global plugin list
exports.GLOBAl_PLUGIN_LIST = {};
/**
 * register global plugin list
 * @param initializer: ITSMPlugin
 */
function globalUse(pname, initializer) {
    exports.GLOBAl_PLUGIN_LIST[pname] = initializer;
}
exports.globalUse = globalUse;
exports["default"] = globalUse;
// global regiter drag support
globalUse("draggable", draggable_1["default"]);
globalUse("screenshot", screenshot_1["default"]);


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var __1 = __webpack_require__(1);
var tools_1 = __webpack_require__(0);
var constants_1 = __webpack_require__(2);
var canvas_1 = __webpack_require__(5);
var dom_1 = __webpack_require__(4);
var node_1 = __webpack_require__(3);
var dragOptions = {
    line_width: 5,
    lookup_delay: 500,
    lookup_interval: 80
};
var clear_selection = "getSelection" in window
    ? function () {
        window.getSelection().removeAllRanges();
    }
    : function () {
        document.selection.empty();
    };
var draggable = /** @class */ (function () {
    function draggable(tsm, opts) {
        var _this = this;
        this.e_canvas = null;
        this.canvas_ctx = null;
        this.shadow = null;
        this.shadow_w = 0;
        this.shadow_h = 0;
        this.active_node = null;
        this.target_node = null;
        this.target_direct = null;
        this.client_w = 0;
        this.client_h = 0;
        this.client_hw = 0;
        this.client_hh = 0;
        this.offset_x = 0;
        this.offset_y = 0;
        // private set
        // whether tag the drag-event has begun!
        this._drag_begun = false;
        this._drag_moved = false;
        this.resize = function () {
            _this.shadow && _this.tsm.view_provider.e_nodes.appendChild(_this.shadow);
            _this.e_canvas.width = _this.tsm.view_provider.size.w;
            _this.e_canvas.height = _this.tsm.view_provider.size.h;
        };
        this._create_canvas = function () {
            var c = tools_1.$doc.createElement("canvas");
            c.width = Number(_this.tsm.view_provider.e_panel.clientWidth);
            c.height = Number(_this.tsm.view_provider.e_panel.clientHeight);
            _this.tsm.view_provider.e_panel.appendChild(c);
            var ctx = c.getContext("2d");
            _this.e_canvas = c;
            _this.canvas_ctx = ctx;
        };
        this._create_shadow = function () {
            var s = tools_1.$doc.createElement(constants_1.TSM_Node_Names.node);
            s.style.visibility = "hidden";
            s.style.zIndex = "3";
            s.style.cursor = "move";
            s.style.opacity = "0.7";
            _this.shadow = s;
            _this.tsm.view_provider.e_panel.appendChild(s);
        };
        this.reset_shadow = function (el) {
            if (!_this.shadow)
                return;
            var s = _this.shadow.style;
            _this.shadow.innerHTML = el.innerHTML;
            s.left = el.style.left;
            s.top = el.style.top;
            s.width = el.style.width;
            s.height = el.style.height;
            s.backgroundImage = el.style.backgroundImage;
            s.backgroundSize = el.style.backgroundSize;
            s.transform = el.style.transform;
            _this.shadow_w = _this.shadow.clientWidth;
            _this.shadow_h = _this.shadow.clientHeight;
        };
        this.show_shadow = function () {
            if (!_this._drag_moved && _this.shadow) {
                _this.shadow.style.visibility = "visible";
            }
        };
        this.hide_shadow = function () {
            _this.shadow.style.visibility = "hidden";
        };
        this.clear_lines = function () {
            _this.canvas_ctx && canvas_1.canvas.clear(_this.canvas_ctx, 0, 0, _this.tsm.view_provider.size.w, _this.tsm.view_provider.size.h);
        };
        this._magnet_shadow = function (node) {
            if (!!node && !!_this.canvas_ctx) {
                _this.canvas_ctx.lineWidth = dragOptions.line_width;
                _this.canvas_ctx.strokeStyle = "rgba(0,0,0,0.3)";
                _this.canvas_ctx.lineCap = "round";
                _this.clear_lines();
                canvas_1.canvas.lineto(_this.canvas_ctx, node.sp.x, node.sp.y, node.np.x, node.np.y);
            }
        };
        this._lookup_close_node = function () {
            var root = _this.tsm.get_root();
            if (!root)
                return null;
            var root_location = root.get_location();
            var root_size = root.get_size();
            var root_x = root_location.x + root_size.w / 2;
            // console.info(root_location);
            var sw = _this.shadow_w;
            var sh = _this.shadow_h;
            var sx = _this.shadow.offsetLeft || 0;
            var sy = _this.shadow.offsetTop || 0;
            var ns;
            var nl;
            var direct = sx + sw / 2 >= root_x ? __1["default"].direction.right : __1["default"].direction.left;
            var nodes = _this.tsm.mind.nodes;
            if (!nodes)
                return null;
            var node = null;
            var min_distance = Number.MAX_VALUE;
            var distance = 0;
            var closest_node = null;
            var closest_p = null;
            var shadow_p = null;
            for (var nodeid in nodes) {
                if (!nodeid)
                    continue;
                var np = void 0;
                var sp = void 0;
                node = nodes[nodeid];
                if (node.isroot || node.direction === direct) {
                    if (node.id === _this.active_node.id) {
                        continue;
                    }
                    ns = node.get_size();
                    nl = node.get_location();
                    if (direct === __1["default"].direction.right) {
                        if (sx - nl.x - ns.w <= 0) {
                            continue;
                        }
                        distance = Math.abs(sx - nl.x - ns.w) + Math.abs(sy + sh / 2 - nl.y - ns.h / 2);
                        np = { x: nl.x + ns.w - dragOptions.line_width, y: nl.y + ns.h / 2 };
                        sp = { x: sx + dragOptions.line_width, y: sy + sh / 2 };
                    }
                    else {
                        if (nl.x - sx - sw <= 0) {
                            continue;
                        }
                        distance = Math.abs(sx + sw - nl.x) + Math.abs(sy + sh / 2 - nl.y - ns.h / 2);
                        np = { x: nl.x + dragOptions.line_width, y: nl.y + ns.h / 2 };
                        sp = { x: sx + sw - dragOptions.line_width, y: sy + sh / 2 };
                    }
                    if (distance < min_distance) {
                        closest_node = node;
                        closest_p = np;
                        shadow_p = sp;
                        min_distance = distance;
                    }
                }
            }
            var result_node = null;
            if (!!closest_node) {
                result_node = {
                    node: closest_node,
                    direction: direct,
                    sp: shadow_p,
                    np: closest_p
                };
            }
            return result_node;
        };
        // to ensure better draw-line performance
        this.lookup_close_node = tools_1.$debounce(function () {
            var node_data = _this._lookup_close_node();
            if (!!node_data) {
                _this._magnet_shadow(node_data);
                _this.target_node = node_data.node;
                _this.target_direct = node_data.direction;
            }
        });
        this._event_bind = function () {
            if (!_this.tsm.view_provider.container)
                return;
            var _self = _this;
            var container = _this.tsm.view_provider.container;
            dom_1.dom.add_event(container, "mousedown", function (e) {
                if (e === void 0) { e = event; }
                _self.dragstart.call(_self, e);
            });
            dom_1.dom.add_event(container, "mousemove", function (e) {
                if (e === void 0) { e = event; }
                _self.drag.call(_self, e);
            });
            dom_1.dom.add_event(container, "mouseup", function (e) {
                if (e === void 0) { e = event; }
                _self.dragend.call(_self, e);
            });
            dom_1.dom.add_event(container, "touchstart", function (e) {
                if (e === void 0) { e = event; }
                _self.dragstart.call(_self, e);
            });
            dom_1.dom.add_event(container, "touchmove", function (e) {
                if (e === void 0) { e = event; }
                _self.drag.call(_self, e);
            });
            dom_1.dom.add_event(container, "touchend", function (e) {
                if (e === void 0) { e = event; }
                _self.dragend.call(_self, e);
            });
        };
        this.dragstart = function (e) {
            if (e === void 0) { e = event; }
            if (_this._drag_begun) {
                return;
            }
            if (!_this.tsm.get_editable()) {
                return;
            }
            _this.active_node = null;
            var tsview = _this.tsm.view_provider;
            var el = (e.target || e.srcElement);
            if (el.tagName.toLowerCase() !== constants_1.TSM_Node_Names.node) {
                return;
            }
            var nodeid = tsview.get_binded_nodeid(el);
            var isTouch = e.type.match(/^touch/);
            if (!!nodeid) {
                var node = _this.tsm.get_node(nodeid);
                if (!!node && !node.isroot) {
                    _this.reset_shadow(el);
                    _this.active_node = node;
                    var _client = (isTouch ? e.touches[0] : e);
                    _this.offset_x = _client.clientX - el.offsetLeft;
                    _this.offset_y = _client.clientY - el.offsetTop;
                    _this.client_hw = Math.floor(el.clientWidth / 2);
                    _this.client_hh = Math.floor(el.clientHeight / 2);
                    // start to drag
                    _this._drag_begun = true;
                }
            }
        };
        this.drag = function (e) {
            if (e === void 0) { e = event; }
            if (!_this.tsm.get_editable()) {
                return;
            }
            if (_this._drag_begun) {
                var isTouch = e.type.match(/^touch/);
                e.preventDefault();
                _this.show_shadow();
                _this._drag_moved = true;
                clear_selection();
                var _client = (isTouch ? e.touches[0] : e);
                var px = _client.clientX - _this.offset_x;
                var py = _client.clientY - _this.offset_y;
                _this.shadow.style.left = px + "px";
                _this.shadow.style.top = py + "px";
                clear_selection();
                _this.lookup_close_node();
            }
        };
        this.dragend = function (e) {
            if (e === void 0) { e = event; }
            if (!_this.tsm.get_editable()) {
                return;
            }
            if (_this._drag_begun) {
                if (_this._drag_moved) {
                    var src_node = _this.active_node;
                    var target_node = _this.target_node;
                    var target_direct = _this.target_direct;
                    src_node && target_node && target_direct && _this.move_node(src_node, target_node, target_direct);
                }
                _this.hide_shadow();
                _this.clear_lines();
                _this._drag_moved = false;
                _this._drag_begun = false;
            }
        };
        this.move_node = function (src_node, target_node, target_direct) {
            if (!_this.shadow)
                return;
            var shadow_h = _this.shadow.offsetTop;
            if (!!target_node && !!src_node && !node_1.TSM_node.inherited(src_node, target_node)) {
                // lookup before_node
                var sibling_nodes = target_node.children;
                var sc = sibling_nodes.length;
                var node = null;
                var delta_y = Number.MAX_VALUE;
                var node_before = null;
                var beforeid = "_last_";
                while (sc--) {
                    node = sibling_nodes[sc];
                    if (node.direction === target_direct && node.id !== src_node.id) {
                        var dy = node.get_location().y - shadow_h;
                        if (dy > 0 && dy < delta_y) {
                            delta_y = dy;
                            node_before = node;
                            beforeid = "_first_";
                        }
                    }
                }
                if (!!node_before) {
                    beforeid = node_before.id;
                }
                _this.tsm.move_node(src_node.id, beforeid, target_node.id, target_direct);
            }
            _this.active_node = null;
            _this.target_node = null;
            _this.target_direct = null;
        };
        this.event_handle = function (type) {
            if (type === __1["default"].event_type.resize) {
                _this.resize();
            }
        };
        this.tsm = tsm;
        this.options = opts;
        tsm.add_event_listener(this.event_handle);
        this._create_canvas();
        this._create_shadow();
        this._event_bind();
    }
    return draggable;
}());
exports["default"] = draggable;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var __1 = __webpack_require__(1);
var tools_1 = __webpack_require__(0);
var dom_1 = __webpack_require__(4);
var canvas_1 = __webpack_require__(5);
var screenshot = /** @class */ (function () {
    function screenshot(tsm, opts) {
        var _this = this;
        this.canvas_elem = null;
        this.canvas_ctx = null;
        this._inited = false;
        this.shoot = function (callback) {
            _this.init();
            var scs = _this;
            _this._draw(function () {
                if (!!callback) {
                    callback(scs);
                }
                scs.clean();
            });
            _this._watermark();
        };
        this.shootDownload = function () {
            _this.shoot(function (scs) {
                scs._download();
            });
        };
        this.shootAsDataURL = function (callback) {
            _this.shoot(function (scs) {
                callback(scs.canvas_elem.toDataURL());
            });
        };
        this.resize = function () {
            if (_this._inited && _this.canvas_elem) {
                _this.canvas_elem.width = _this.tsm.view_provider.size.w;
                _this.canvas_elem.height = _this.tsm.view_provider.size.h;
            }
        };
        this.clean = function () {
            var c = _this.canvas_elem;
            if (c && _this.canvas_ctx)
                _this.canvas_ctx.clearRect(0, 0, c.width, c.height);
        };
        this._draw = function (callback) {
            var ctx = _this.canvas_ctx;
            if (!ctx)
                return;
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            _this._draw_lines();
            _this._draw_nodes(callback);
        };
        this._watermark = function () {
            var c = _this.canvas_elem;
            var ctx = _this.canvas_ctx;
            if (!c || !ctx)
                return;
            ctx.textAlign = "right";
            ctx.textBaseline = "bottom";
            ctx.fillStyle = "#000";
            ctx.font = "11px Verdana,Arial,Helvetica,sans-serif";
            ctx.fillText("hizzgdev.github.io/jsmind", c.width - 5.5, c.height - 2.5);
            ctx.textAlign = "left";
            ctx.fillText(location.href, 5.5, c.height - 2.5);
        };
        this._draw_lines = function () {
            _this.canvas_ctx && _this.tsm.view_provider.show_lines(_this.canvas_ctx);
        };
        this._draw_nodes = function (callback) {
            var nodes = _this.tsm.mind.nodes;
            for (var nodeid in nodes) {
                if (!nodeid)
                    continue;
                var node = nodes[nodeid];
                _this._draw_node(node);
            }
            function check_nodes_ready() {
                console.log("check_node_ready" + new Date());
                var allOk = true;
                for (var nodeid in nodes) {
                    if (!nodeid)
                        continue;
                    var node = nodes[nodeid];
                    allOk = allOk && node.expands.screen_shot_ready;
                }
                if (!allOk) {
                    setTimeout(check_nodes_ready, 200);
                }
                else {
                    setTimeout(callback, 200);
                }
            }
            check_nodes_ready();
        };
        this._draw_node = function (node) {
            var ctx = _this.canvas_ctx;
            var view_data = node.view_data;
            var node_element = view_data.element;
            if (!node_element || !ctx)
                return;
            var ncs = getComputedStyle(node_element);
            if (!dom_1.dom.is_visible(ncs)) {
                node.expands.screen_shot_ready = true;
                return;
            }
            var bgcolor = dom_1.dom.css(ncs, "background-color");
            var round_radius = parseInt(dom_1.dom.css(ncs, "border-top-left-radius"), 10);
            var color = dom_1.dom.css(ncs, "color");
            var padding_left = parseInt(dom_1.dom.css(ncs, "padding-left"), 10);
            var padding_right = parseInt(dom_1.dom.css(ncs, "padding-right"), 10);
            var padding_top = parseInt(dom_1.dom.css(ncs, "padding-top"), 10);
            var padding_bottom = parseInt(dom_1.dom.css(ncs, "padding-bottom"), 10);
            var text_overflow = dom_1.dom.css(ncs, "text-overflow");
            var font = dom_1.dom.css(ncs, "font-style") + " " + dom_1.dom.css(ncs, "font-variant") + " " + dom_1.dom.css(ncs, "font-weight") + " " + dom_1.dom.css(ncs, "font-size") + "/" + dom_1.dom.css(ncs, "line-height") + " " + dom_1.dom.css(ncs, "font-family");
            var rb = { x: view_data.abs_x || 0, y: view_data.abs_y || 0, w: (view_data.width || 0) + 1, h: (view_data.height || 0) + 1 };
            var tb = { x: rb.x + padding_left, y: rb.y + padding_top, w: rb.w - padding_left - padding_right, h: rb.h - padding_top - padding_bottom };
            ctx.font = font;
            ctx.fillStyle = bgcolor;
            ctx.beginPath();
            canvas_1.canvas.rect(ctx, rb.x, rb.y, rb.w, rb.h, round_radius);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = color;
            if ("background-image" in node.data) {
                var backgroundUrl = dom_1.dom.css(ncs, "background-image").slice(5, -2);
                node.expands.screen_shot_ready = false;
                var rotation = 0;
                if ("background-rotation" in node.data) {
                    rotation = node.data["background-rotation"];
                }
                canvas_1.canvas.image(ctx, backgroundUrl, rb.x, rb.y, rb.w, rb.h, round_radius, rotation, function () {
                    node.expands.screen_shot_ready = true;
                });
            }
            if (!!node.topic) {
                if (text_overflow === "ellipsis") {
                    canvas_1.canvas.text_ellipsis(ctx, node.topic, tb.x, tb.y, tb.w, tb.h);
                }
                else {
                    var line_height = parseInt(dom_1.dom.css(ncs, "line-height"), 10);
                    canvas_1.canvas.text_multiline(ctx, node.topic, tb.x, tb.y, tb.w, tb.h, line_height);
                }
            }
            if (!!view_data.expander) {
                _this._draw_expander(view_data.expander);
            }
            if (!("background-image" in node.data)) {
                node.expands.screen_shot_ready = true;
            }
        };
        this._draw_expander = function (expander) {
            var ctx = _this.canvas_ctx;
            var ncs = getComputedStyle(expander);
            if (!dom_1.dom.is_visible(ncs) || !ctx) {
                return;
            }
            var style_left = dom_1.dom.css(ncs, "left");
            var style_top = dom_1.dom.css(ncs, "top");
            // const font = dom.css(ncs, "font");
            var left = parseInt(style_left, 10);
            var top = parseInt(style_top, 10);
            var is_plus = expander.innerHTML === "+";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(left + 7, top + 7, 5, 0, Math.PI * 2, true);
            ctx.moveTo(left + 10, top + 7);
            ctx.lineTo(left + 4, top + 7);
            if (is_plus) {
                ctx.moveTo(left + 7, top + 4);
                ctx.lineTo(left + 7, top + 10);
            }
            ctx.closePath();
            ctx.stroke();
        };
        this._download = function () {
            var c = _this.canvas_elem;
            if (!c)
                return;
            var name = _this.tsm.mind.name + ".png";
            var _toblob = !!c.toBlob || !!c.msToBlob;
            if (navigator.msSaveBlob && _toblob) {
                if ("toBlob" in c)
                    c.toBlob(function (blob) {
                        navigator.msSaveBlob(blob, name);
                    });
                else if ("msToBlob" in c) {
                    var blob = c.msToBlob();
                    navigator.msSaveBlob(blob, name);
                }
            }
            else {
                var bloburl = _this.canvas_elem.toDataURL();
                var anchor = tools_1.$doc.createElement("a");
                if ("download" in anchor) {
                    anchor.style.visibility = "hidden";
                    anchor.href = bloburl;
                    anchor.download = name;
                    tools_1.$doc.body.appendChild(anchor);
                    var evt = tools_1.$doc.createEvent("MouseEvents");
                    evt.initEvent("click", true, true);
                    anchor.dispatchEvent(evt);
                    tools_1.$doc.body.removeChild(anchor);
                }
                else {
                    location.href = bloburl;
                }
            }
        };
        this.event_handle = function (type) {
            if (type === __1.TSMindEventTypeMap.resize) {
                _this.resize();
            }
        };
        this.tsm = tsm;
        this.options = opts;
        tsm.add_event_listener(this.event_handle);
    }
    screenshot.prototype.init = function () {
        if (this._inited) {
            return;
        }
        console.log("init");
        var c = tools_1.$doc.createElement("canvas");
        var ctx = c.getContext("2d");
        this.canvas_elem = c;
        this.canvas_ctx = ctx;
        this.tsm.view_provider.e_panel.appendChild(c);
        this._inited = true;
        this.resize();
    };
    return screenshot;
}());
exports["default"] = screenshot;


/***/ })
/******/ ]);
});
//# sourceMappingURL=ts-mind.js.map