"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("../../util/tools");
var dom_1 = require("../../util/dom");
var __1 = require("..");
var text_1 = require("../../util/text");
var array_1 = require("../../util/array");
var canvas_1 = require("../../util/canvas");
var constants_1 = require("../../util/constants");
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
exports.default = view_provider;
