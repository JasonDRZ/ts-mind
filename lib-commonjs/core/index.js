"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../util/constants");
var tools_1 = require("../util/tools");
var data_1 = require("./provider/data");
var layout_1 = require("./provider/layout");
var view_1 = require("./provider/view");
var util_1 = require("../util");
var node_array_1 = require("./format/node_array");
var shortcut_1 = require("./provider/shortcut");
var pugin_1 = require("./pugin");
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
            if (!util_1.default.is_node(node)) {
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
            if (!util_1.default.is_node(node)) {
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
            if (!util_1.default.is_node(node)) {
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
            if (!util_1.default.is_node(node)) {
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
                var beforeid = util_1.default.is_node(node_before) ? node_before.id : node_before;
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
                var afterid = util_1.default.is_node(node_after) ? node_after.id : node_after;
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
            if (!util_1.default.is_node(node)) {
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
                if (util_1.default.text.is_empty(topic)) {
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
            if (!util_1.default.is_node(node)) {
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
            if (!util_1.default.is_node(node)) {
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
            if (!util_1.default.is_node(node)) {
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
        this.layout_provider = new layout_1.default(this, opts_layout);
        this.view_provider = new view_1.default(this, opts_view);
        this.shortcut_provider = new shortcut_1.default(this, opts.shortcut);
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
exports.default = TSMind;
