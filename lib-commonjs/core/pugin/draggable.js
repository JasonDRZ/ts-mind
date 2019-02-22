"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var tools_1 = require("../../util/tools");
var constants_1 = require("../../util/constants");
var canvas_1 = require("../../util/canvas");
var dom_1 = require("../../util/dom");
var node_1 = require("../node");
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
            var direct = sx + sw / 2 >= root_x ? __1.default.direction.right : __1.default.direction.left;
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
                    if (direct === __1.default.direction.right) {
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
            if (type === __1.default.event_type.resize) {
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
exports.default = draggable;
