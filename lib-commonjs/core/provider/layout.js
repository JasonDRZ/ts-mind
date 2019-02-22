"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var tools_1 = require("../../util/tools");
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
            node.layout_data.direction = __1.default.direction.center;
            node.layout_data.side_index = 0;
            if (_this.isside) {
                var i = children_count;
                while (i--) {
                    _this._layout_direction_side(children[i], __1.default.direction.right, i);
                }
            }
            else {
                var i = children_count;
                var subnode = null;
                while (i--) {
                    subnode = children[i];
                    if (subnode.direction === __1.default.direction.left) {
                        _this._layout_direction_side(subnode, __1.default.direction.left, i);
                    }
                    else {
                        _this._layout_direction_side(subnode, __1.default.direction.right, i);
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
                if (subnode.layout_data.direction === __1.default.direction.right) {
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
            if (node.layout_data.direction === __1.default.direction.right) {
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
                    if (node.layout_data.direction === __1.default.direction.right) {
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
exports.default = layout_provider;
