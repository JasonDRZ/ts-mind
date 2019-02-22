import TSMind from "..";
import { $doc, $debounce } from "../../util/tools";
import { TSM_Node_Names } from "../../util/constants";
import { canvas } from "../../util/canvas";
import { dom } from "../../util/dom";
import { TSM_node } from "../node";
const dragOptions = {
    line_width: 5,
    lookup_delay: 500,
    lookup_interval: 80
};
const clear_selection = "getSelection" in window
    ? function () {
        window.getSelection().removeAllRanges();
    }
    : function () {
        document.selection.empty();
    };
export default class draggable {
    constructor(tsm, opts) {
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
        this.resize = () => {
            this.shadow && this.tsm.view_provider.e_nodes.appendChild(this.shadow);
            this.e_canvas.width = this.tsm.view_provider.size.w;
            this.e_canvas.height = this.tsm.view_provider.size.h;
        };
        this._create_canvas = () => {
            const c = $doc.createElement("canvas");
            c.width = Number(this.tsm.view_provider.e_panel.clientWidth);
            c.height = Number(this.tsm.view_provider.e_panel.clientHeight);
            this.tsm.view_provider.e_panel.appendChild(c);
            const ctx = c.getContext("2d");
            this.e_canvas = c;
            this.canvas_ctx = ctx;
        };
        this._create_shadow = () => {
            const s = $doc.createElement(TSM_Node_Names.node);
            s.style.visibility = "hidden";
            s.style.zIndex = "3";
            s.style.cursor = "move";
            s.style.opacity = "0.7";
            this.shadow = s;
            this.tsm.view_provider.e_panel.appendChild(s);
        };
        this.reset_shadow = (el) => {
            if (!this.shadow)
                return;
            const s = this.shadow.style;
            this.shadow.innerHTML = el.innerHTML;
            s.left = el.style.left;
            s.top = el.style.top;
            s.width = el.style.width;
            s.height = el.style.height;
            s.backgroundImage = el.style.backgroundImage;
            s.backgroundSize = el.style.backgroundSize;
            s.transform = el.style.transform;
            this.shadow_w = this.shadow.clientWidth;
            this.shadow_h = this.shadow.clientHeight;
        };
        this.show_shadow = () => {
            if (!this._drag_moved && this.shadow) {
                this.shadow.style.visibility = "visible";
            }
        };
        this.hide_shadow = () => {
            this.shadow.style.visibility = "hidden";
        };
        this.clear_lines = () => {
            this.canvas_ctx && canvas.clear(this.canvas_ctx, 0, 0, this.tsm.view_provider.size.w, this.tsm.view_provider.size.h);
        };
        this._magnet_shadow = (node) => {
            if (!!node && !!this.canvas_ctx) {
                this.canvas_ctx.lineWidth = dragOptions.line_width;
                this.canvas_ctx.strokeStyle = "rgba(0,0,0,0.3)";
                this.canvas_ctx.lineCap = "round";
                this.clear_lines();
                canvas.lineto(this.canvas_ctx, node.sp.x, node.sp.y, node.np.x, node.np.y);
            }
        };
        this._lookup_close_node = () => {
            const root = this.tsm.get_root();
            if (!root)
                return null;
            const root_location = root.get_location();
            const root_size = root.get_size();
            const root_x = root_location.x + root_size.w / 2;
            // console.info(root_location);
            const sw = this.shadow_w;
            const sh = this.shadow_h;
            const sx = this.shadow.offsetLeft || 0;
            const sy = this.shadow.offsetTop || 0;
            let ns;
            let nl;
            const direct = sx + sw / 2 >= root_x ? TSMind.direction.right : TSMind.direction.left;
            const nodes = this.tsm.mind.nodes;
            if (!nodes)
                return null;
            let node = null;
            let min_distance = Number.MAX_VALUE;
            let distance = 0;
            let closest_node = null;
            let closest_p = null;
            let shadow_p = null;
            for (const nodeid in nodes) {
                if (!nodeid)
                    continue;
                let np;
                let sp;
                node = nodes[nodeid];
                if (node.isroot || node.direction === direct) {
                    if (node.id === this.active_node.id) {
                        continue;
                    }
                    ns = node.get_size();
                    nl = node.get_location();
                    if (direct === TSMind.direction.right) {
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
            let result_node = null;
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
        this.lookup_close_node = $debounce(() => {
            const node_data = this._lookup_close_node();
            if (!!node_data) {
                this._magnet_shadow(node_data);
                this.target_node = node_data.node;
                this.target_direct = node_data.direction;
            }
        });
        this._event_bind = () => {
            if (!this.tsm.view_provider.container)
                return;
            const _self = this;
            const container = this.tsm.view_provider.container;
            dom.add_event(container, "mousedown", function (e = event) {
                _self.dragstart.call(_self, e);
            });
            dom.add_event(container, "mousemove", function (e = event) {
                _self.drag.call(_self, e);
            });
            dom.add_event(container, "mouseup", function (e = event) {
                _self.dragend.call(_self, e);
            });
            dom.add_event(container, "touchstart", function (e = event) {
                _self.dragstart.call(_self, e);
            });
            dom.add_event(container, "touchmove", function (e = event) {
                _self.drag.call(_self, e);
            });
            dom.add_event(container, "touchend", function (e = event) {
                _self.dragend.call(_self, e);
            });
        };
        this.dragstart = (e = event) => {
            if (this._drag_begun) {
                return;
            }
            if (!this.tsm.get_editable()) {
                return;
            }
            this.active_node = null;
            const tsview = this.tsm.view_provider;
            const el = (e.target || e.srcElement);
            if (el.tagName.toLowerCase() !== TSM_Node_Names.node) {
                return;
            }
            const nodeid = tsview.get_binded_nodeid(el);
            const isTouch = e.type.match(/^touch/);
            if (!!nodeid) {
                const node = this.tsm.get_node(nodeid);
                if (!!node && !node.isroot) {
                    this.reset_shadow(el);
                    this.active_node = node;
                    const _client = (isTouch ? e.touches[0] : e);
                    this.offset_x = _client.clientX - el.offsetLeft;
                    this.offset_y = _client.clientY - el.offsetTop;
                    this.client_hw = Math.floor(el.clientWidth / 2);
                    this.client_hh = Math.floor(el.clientHeight / 2);
                    // start to drag
                    this._drag_begun = true;
                }
            }
        };
        this.drag = (e = event) => {
            if (!this.tsm.get_editable()) {
                return;
            }
            if (this._drag_begun) {
                const isTouch = e.type.match(/^touch/);
                e.preventDefault();
                this.show_shadow();
                this._drag_moved = true;
                clear_selection();
                const _client = (isTouch ? e.touches[0] : e);
                const px = _client.clientX - this.offset_x;
                const py = _client.clientY - this.offset_y;
                this.shadow.style.left = px + "px";
                this.shadow.style.top = py + "px";
                clear_selection();
                this.lookup_close_node();
            }
        };
        this.dragend = (e = event) => {
            if (!this.tsm.get_editable()) {
                return;
            }
            if (this._drag_begun) {
                if (this._drag_moved) {
                    const src_node = this.active_node;
                    const target_node = this.target_node;
                    const target_direct = this.target_direct;
                    src_node && target_node && target_direct && this.move_node(src_node, target_node, target_direct);
                }
                this.hide_shadow();
                this.clear_lines();
                this._drag_moved = false;
                this._drag_begun = false;
            }
        };
        this.move_node = (src_node, target_node, target_direct) => {
            if (!this.shadow)
                return;
            const shadow_h = this.shadow.offsetTop;
            if (!!target_node && !!src_node && !TSM_node.inherited(src_node, target_node)) {
                // lookup before_node
                const sibling_nodes = target_node.children;
                let sc = sibling_nodes.length;
                let node = null;
                let delta_y = Number.MAX_VALUE;
                let node_before = null;
                let beforeid = "_last_";
                while (sc--) {
                    node = sibling_nodes[sc];
                    if (node.direction === target_direct && node.id !== src_node.id) {
                        const dy = node.get_location().y - shadow_h;
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
                this.tsm.move_node(src_node.id, beforeid, target_node.id, target_direct);
            }
            this.active_node = null;
            this.target_node = null;
            this.target_direct = null;
        };
        this.event_handle = (type) => {
            if (type === TSMind.event_type.resize) {
                this.resize();
            }
        };
        this.tsm = tsm;
        this.options = opts;
        tsm.add_event_listener(this.event_handle);
        this._create_canvas();
        this._create_shadow();
        this._event_bind();
    }
}
