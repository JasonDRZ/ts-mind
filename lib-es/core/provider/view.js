import { $logger, $isEl, $elByID, $doc, $pushText, $pushChild } from "../../util/tools";
import { dom } from "../../util/dom";
import { TSMindEventTypeMap } from "..";
import { text } from "../../util/text";
import { _slice } from "../../util/array";
import { canvas } from "../../util/canvas";
import { TSM_Node_Names } from "../../util/constants";
export default class view_provider {
    constructor(tsm, options) {
        this.e_panel = $doc.createElement("div");
        this.e_nodes = $doc.createElement(TSM_Node_Names.nodes);
        this.e_canvas = $doc.createElement("canvas");
        this.e_editor = $doc.createElement("input");
        this.canvas_ctx = this.e_canvas.getContext("2d");
        this.size = { w: 0, h: 0 };
        this.selected_node = null;
        this.editing_node = null;
        // view zoom
        this.actualZoom = 1;
        this.zoomStep = 0.1;
        this.minZoom = 0.5;
        this.maxZoom = 2;
        this.add_event = (obj, event_name, event_handle) => {
            this.e_nodes &&
                dom.add_event(this.e_nodes, event_name, function (e) {
                    const evt = e || event;
                    event_handle.call(obj, evt);
                });
        };
        this.is_expander = (element) => {
            return element.tagName.toLowerCase() === TSM_Node_Names.fold;
        };
        this.reset = () => {
            $logger.debug("view.reset");
            this.selected_node = null;
            this.clear_lines();
            this.clear_nodes();
            this.reset_theme();
        };
        this.reset_theme = () => {
            const theme_name = this.tsm.options.theme;
            if (!!theme_name) {
                this.e_nodes.className = "theme-" + theme_name;
            }
            else {
                this.e_nodes.className = "";
            }
        };
        this.reset_custom_style = () => {
            const nodes = this.tsm.mind.nodes;
            for (const nodeid in nodes) {
                if (nodeid)
                    this.reset_node_custom_style(nodes[nodeid]);
            }
        };
        this.load = () => {
            $logger.debug("view.load");
            this.init_nodes();
        };
        this.expand_size = () => {
            const min_size = this.layout.get_min_size();
            if (!min_size)
                return;
            const min_height = min_size.h + this.opts.vmargin * 2;
            const min_width = min_size.w + this.opts.hmargin * 2;
            let client_w = this.e_panel.clientWidth || 0;
            let client_h = this.e_panel.clientHeight || 0;
            if (client_w < min_width) {
                client_w = min_width;
            }
            if (client_h < min_height) {
                client_h = min_height;
            }
            this.size.w = client_w;
            this.size.h = client_h;
        };
        this.init_nodes_size = (node) => {
            if (!node.view_data.element)
                return;
            node.view_data.width = node.view_data.element.clientWidth;
            node.view_data.height = node.view_data.element.clientHeight;
        };
        this.init_nodes = () => {
            const nodes = this.tsm.mind.nodes;
            const doc_frag = $doc.createDocumentFragment();
            for (const nodeid in nodes) {
                if (nodeid)
                    this.create_node_element(nodes[nodeid], doc_frag);
            }
            this.e_nodes.appendChild(doc_frag);
            for (const nodeid in nodes) {
                if (nodeid)
                    this.init_nodes_size(nodes[nodeid]);
            }
        };
        this.add_node = (node) => {
            this.create_node_element(node, this.e_nodes);
            this.init_nodes_size(node);
        };
        this.create_node_element = (node, parent_node) => {
            const d = $doc.createElement(TSM_Node_Names.node);
            if (node.isroot) {
                d.className = "root";
                // d.style.visibility = "visible";
            }
            else {
                const d_e = $doc.createElement(TSM_Node_Names.fold);
                $pushText(d_e, "-");
                d_e.setAttribute("nodeid", node.id);
                d_e.style.visibility = "hidden";
                parent_node.appendChild(d_e);
                node.view_data.expander = d_e;
            }
            if (!!node.topic) {
                if (this.opts.support_html) {
                    $pushChild(d, node.topic);
                }
                else {
                    $pushText(d, node.topic);
                }
            }
            d.setAttribute("nodeid", node.id);
            // d.style.visibility = "hidden";
            this._reset_node_custom_style(d, node.data);
            parent_node.appendChild(d);
            node.view_data.element = d;
        };
        this.remove_node = (node) => {
            if (this.selected_node != null && this.selected_node.id === node.id) {
                this.selected_node = null;
            }
            if (this.editing_node !== null && this.editing_node.id === node.id && node.view_data.element) {
                node.view_data.element.removeChild(this.e_editor);
                this.editing_node = null;
            }
            const children = node.children;
            let i = children.length;
            while (i--) {
                this.remove_node(children[i]);
            }
            const element = node.view_data.element;
            const expander = node.view_data.expander;
            if (this.e_nodes) {
                element && this.e_nodes.removeChild(element);
                expander && this.e_nodes.removeChild(expander);
                node.view_data.element = null;
                node.view_data.expander = null;
            }
        };
        this.update_node = (node) => {
            const element = node.view_data.element;
            if (!!node.topic) {
                if (this.opts.support_html) {
                    $pushChild(element, node.topic);
                }
                else {
                    $pushText(element, node.topic);
                }
            }
            node.view_data.width = element.clientWidth;
            node.view_data.height = element.clientHeight;
        };
        this.select_node = (node) => {
            if (!node || !this.selected_node)
                return;
            const selected_node_ele = this.selected_node.view_data.element;
            const node_ele = node.view_data.element;
            if (!!selected_node_ele) {
                selected_node_ele.className = selected_node_ele.className.replace(/\s*selected\b/i, "");
                this.reset_node_custom_style(this.selected_node);
            }
            if (!!node && !!node_ele) {
                this.selected_node = node;
                node_ele.className += " selected";
                this.clear_node_custom_style(node);
            }
        };
        this.select_clear = () => {
            this.select_node(null);
        };
        this.get_editing_node = () => {
            return this.editing_node;
        };
        this.is_editing = () => {
            return !!this.editing_node;
        };
        this.edit_node_begin = (node) => {
            if (!node.topic) {
                $logger.warn("don't edit image nodes");
                return;
            }
            if (this.editing_node != null) {
                this.edit_node_end();
            }
            this.editing_node = node;
            const element = node.view_data.element;
            if (!element)
                return;
            const topic = node.topic;
            const ncs = getComputedStyle(element);
            this.e_editor.value = topic;
            this.e_editor.style.width =
                element.clientWidth - parseInt(ncs.getPropertyValue("padding-left"), 10) - parseInt(ncs.getPropertyValue("padding-right"), 10) + "px";
            element.innerHTML = "";
            element.appendChild(this.e_editor);
            element.style.zIndex = "5";
            this.e_editor.focus();
            this.e_editor.select();
        };
        this.edit_node_end = () => {
            if (this.editing_node != null) {
                const node = this.editing_node;
                this.editing_node = null;
                const element = node.view_data.element;
                const topic = this.e_editor.value;
                element.style.zIndex = "auto";
                element.removeChild(this.e_editor);
                if (text.is_empty(topic) || node.topic === topic) {
                    if (this.opts.support_html) {
                        $pushChild(element, node.topic);
                    }
                    else {
                        $pushText(element, node.topic);
                    }
                }
                else {
                    this.tsm.update_node(node.id, topic);
                }
            }
        };
        this.get_view_offset = () => {
            const bounds = this.layout.bounds;
            return { x: (this.size.w - bounds.e - bounds.w) / 2, y: this.size.h / 2 };
        };
        this.resize = () => {
            this.e_canvas.width = 1;
            this.e_canvas.height = 1;
            this.e_nodes.style.width = "1px";
            this.e_nodes.style.height = "1px";
            this.expand_size();
            this._show();
        };
        this._show = () => {
            this.e_canvas.width = this.size.w;
            this.e_canvas.height = this.size.h;
            this.e_nodes.style.width = this.size.w + "px";
            this.e_nodes.style.height = this.size.h + "px";
            this.show_nodes();
            this.show_lines();
            // this.layout.cache_valid = true;
            this.tsm.invoke_event_handle(TSMindEventTypeMap.resize, { data: [] });
        };
        this.zoomIn = () => {
            return this.setZoom(this.actualZoom + this.zoomStep);
        };
        this.zoomOut = () => {
            return this.setZoom(this.actualZoom - this.zoomStep);
        };
        this.setZoom = (zoom) => {
            if (zoom < this.minZoom || zoom > this.maxZoom) {
                return false;
            }
            this.actualZoom = zoom;
            const _children = _slice.call(this.e_panel.children);
            for (const child of _children) {
                child.style.transform = "scale(" + zoom + ")";
            }
            this.show(true);
            return true;
        };
        this._center_root = () => {
            // center root node
            const outer_w = this.e_panel.clientWidth;
            const outer_h = this.e_panel.clientHeight;
            if (this.size.w > outer_w) {
                const _offset = this.get_view_offset();
                this.e_panel.scrollLeft = _offset.x - outer_w / 2;
            }
            if (this.size.h > outer_h) {
                this.e_panel.scrollTop = (this.size.h - outer_h) / 2;
            }
        };
        this.show = (keep_center) => {
            $logger.debug("view.show");
            this.expand_size();
            this._show();
            if (keep_center) {
                this._center_root();
            }
        };
        this.relayout = () => {
            this.expand_size();
            this._show();
        };
        this.save_location = (node) => {
            const vd = node.view_data;
            if (vd)
                vd._saved_location = {
                    x: Number(vd.element.style.left) - this.e_panel.scrollLeft,
                    y: Number(vd.element.style.top) - this.e_panel.scrollTop
                };
        };
        this.restore_location = (node) => {
            const vd = node.view_data;
            if (vd && vd.element) {
                const _ele = vd.element;
                this.e_panel.scrollLeft = Number(_ele.style.left) - vd._saved_location.x;
                this.e_panel.scrollTop = Number(vd.element.style.top) - vd._saved_location.y;
            }
        };
        this.clear_nodes = () => {
            const mind = this.tsm.mind;
            if (mind == null) {
                return;
            }
            const nodes = mind.nodes;
            let node = null;
            for (const nodeid in nodes) {
                if (!nodeid)
                    continue;
                node = nodes[nodeid];
                node.view_data.element = null;
                node.view_data.expander = null;
            }
            this.e_nodes.innerHTML = "";
        };
        this.show_nodes = () => {
            const nodes = this.tsm.mind.nodes;
            const _offset = this.get_view_offset();
            for (const nodeid in nodes) {
                if (!nodeid)
                    continue;
                const node = nodes[nodeid];
                $logger.log(node);
                const node_element = node.view_data.element;
                const expander = node.view_data.expander;
                if (!node_element)
                    continue;
                if (!this.layout.is_visible(node)) {
                    node_element.style.display = "none";
                    expander.style.display = "none";
                    continue;
                }
                this.reset_node_custom_style(node);
                const p = this.layout.get_node_point(node);
                node.view_data.abs_x = _offset.x + p.x;
                node.view_data.abs_y = _offset.y + p.y;
                node_element.style.left = node.view_data.abs_x + "px";
                node_element.style.top = node.view_data.abs_y + "px";
                node_element.style.display = "";
                node_element.style.visibility = "visible";
                //
                if (!node.isroot && node.children.length > 0) {
                    const expander_text = node.expanded ? "-" : "+";
                    const p_expander = this.layout.get_expander_point(node);
                    if (expander) {
                        expander.style.left = _offset.x + p_expander.x + "px";
                        expander.style.top = _offset.y + p_expander.y + "px";
                        expander.style.display = "";
                        expander.style.visibility = "visible";
                        $pushText(expander, expander_text);
                    }
                }
                // hide expander while all children have been removed
                if (!node.isroot && node.children.length === 0 && expander) {
                    expander.style.display = "none";
                    expander.style.visibility = "hidden";
                }
            }
        };
        this.reset_node_custom_style = (node) => {
            this._reset_node_custom_style(node.view_data.element, node.data);
        };
        this._reset_node_custom_style = (node_element, node_data) => {
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
                const backgroundImage = node_data["background-image"];
                if (backgroundImage.startsWith("data") && node_data.width && node_data.height) {
                    const img = new Image();
                    img.onload = function () {
                        const c = $doc.createElement("canvas");
                        c.width = node_element.clientWidth;
                        c.height = node_element.clientHeight;
                        const img = this;
                        if (c.getContext) {
                            const ctx = c.getContext("2d");
                            ctx.drawImage(img, 2, 2, node_element.clientWidth, node_element.clientHeight);
                            const scaledImageData = c.toDataURL();
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
        this.clear_node_custom_style = (node) => {
            const node_element = node.view_data.element;
            if (node_element) {
                node_element.style.backgroundColor = "";
                node_element.style.color = "";
            }
        };
        this.clear_lines = (canvas_ctx = this.canvas_ctx) => {
            canvas.clear(canvas_ctx, 0, 0, this.size.w, this.size.h);
        };
        this.show_lines = (canvas_ctx = this.canvas_ctx) => {
            this.clear_lines(canvas_ctx);
            const nodes = this.tsm.mind.nodes;
            let node = null;
            let pin = null;
            let pout = null;
            const _offset = this.get_view_offset();
            for (const nodeid in nodes) {
                if (!nodeid)
                    continue;
                node = nodes[nodeid];
                if (!!node.isroot) {
                    continue;
                }
                if ("visible" in node.layout_data && !node.layout_data.visible) {
                    continue;
                }
                pin = this.layout.get_node_point_in(node);
                pout = this.layout.get_node_point_out(node.parent);
                this.draw_line(pout, pin, _offset, canvas_ctx);
            }
        };
        this.draw_line = (pin, pout, offset, canvas_ctx = this.canvas_ctx) => {
            canvas_ctx.strokeStyle = this.opts.line_color;
            canvas_ctx.lineWidth = this.opts.line_width;
            canvas_ctx.lineCap = "round";
            canvas.bezierto(canvas_ctx, pin.x + offset.x, pin.y + offset.y, pout.x + offset.x, pout.y + offset.y);
        };
        this.opts = options;
        this.tsm = tsm;
        this.layout = tsm.layout_provider;
        $logger.debug("view.init");
        this.container = $isEl(this.opts.container) ? this.opts.container : $elByID(this.opts.container);
        if (!this.container) {
            $logger.error("the options.view.container was not be found in dom");
            return;
        }
        this.e_panel.className = "jsmind-inner";
        this.e_panel.appendChild(this.e_canvas);
        this.e_panel.appendChild(this.e_nodes);
        this.e_editor.className = "jsmind-editor";
        this.e_editor.type = "text";
        const v = this;
        dom.add_event(this.e_editor, "keydown", function (e) {
            const evt = e || event;
            if (evt.keyCode === 13) {
                v.edit_node_end();
                evt.stopPropagation();
            }
        });
        dom.add_event(this.e_editor, "blur", function () {
            v.edit_node_end();
        });
        this.container.appendChild(this.e_panel);
    }
    get_binded_nodeid(element) {
        if (element == null) {
            return null;
        }
        const tagName = element.tagName.toLowerCase();
        if (tagName === TSM_Node_Names.nodes || tagName === "body" || tagName === "html") {
            return null;
        }
        if (tagName === TSM_Node_Names.node || tagName === TSM_Node_Names.fold) {
            return element.getAttribute("nodeid");
        }
        else if (element.parentElement) {
            return this.get_binded_nodeid(element.parentElement);
        }
        return null;
    }
}
