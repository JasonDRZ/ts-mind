"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var tools_1 = require("../../util/tools");
var dom_1 = require("../../util/dom");
var canvas_1 = require("../../util/canvas");
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
exports.default = screenshot;
