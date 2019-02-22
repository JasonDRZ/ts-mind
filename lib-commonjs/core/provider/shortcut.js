"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = require("../../util/dom");
var tools_1 = require("../../util/tools");
var __1 = require("..");
var util_1 = require("../../util");
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
                var nodeid = util_1.default.uuid.newid();
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
                var nodeid = util_1.default.uuid.newid();
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
            _this._handle_direction(tsm, e, __1.default.direction.left);
        };
        this.handle_right = function (tsm, e) {
            _this._handle_direction(tsm, e, __1.default.direction.right);
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
exports.default = shortcut_provider;
