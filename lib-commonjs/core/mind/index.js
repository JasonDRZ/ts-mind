"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("../../util/tools");
var util_1 = require("../../util");
var node_1 = require("../node");
var __1 = require("..");
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
            if (!util_1.default.is_node(parent_node)) {
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
                var d = __1.default.direction.right;
                if (isNaN(direction)) {
                    var children = parent_node.children;
                    var children_len = children.length;
                    var r = 0;
                    for (var i = 0; i < children_len; i++) {
                        if (children[i].direction === __1.default.direction.left) {
                            r--;
                        }
                        else {
                            r++;
                        }
                    }
                    d = children_len > 1 && r > 0 ? __1.default.direction.left : __1.default.direction.right;
                }
                else {
                    d = direction !== __1.default.direction.left ? __1.default.direction.right : __1.default.direction.left;
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
            if (!util_1.default.is_node(node_before)) {
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
                    if (direction === __1.default.direction.left) {
                        node.direction = direction;
                    }
                    else {
                        node.direction = __1.default.direction.right;
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
