import TSMind, { TSMindEventTypeMap } from "..";
import { ITSMOptions } from "../../util/constants";
import { $doc } from "../../util/tools";
import { _slice } from "../../util/array";
import { TSM_node } from "../node";
import { dom } from "../../util/dom";
import { canvas } from "../../util/canvas";

export default class screenshot {
  tsm: TSMind;
  options: ITSMOptions;
  canvas_elem: ITSMUnionNull<HTMLCanvasElement> = null;
  canvas_ctx: ITSMUnionNull<CanvasRenderingContext2D> = null;
  _inited = false;
  constructor(tsm: TSMind, opts: ITSMOptions) {
    this.tsm = tsm;
    this.options = opts;
    tsm.add_event_listener(this.event_handle);
  }
  init() {
    if (this._inited) {
      return;
    }
    console.log("init");
    const c = $doc.createElement("canvas");
    const ctx = c.getContext("2d");

    this.canvas_elem = c;
    this.canvas_ctx = ctx;
    this.tsm.view_provider.e_panel!.appendChild(c);
    this._inited = true;
    this.resize();
  }
  shoot = (callback: ITSMAnyCall) => {
    this.init();
    const scs = this;
    this._draw(function() {
      if (!!callback) {
        callback(scs);
      }
      scs.clean();
    });
    this._watermark();
  };

  shootDownload = () => {
    this.shoot(function(scs) {
      scs._download();
    });
  };

  shootAsDataURL = (callback: ITSMAnyCall) => {
    this.shoot(function(scs) {
      callback(scs.canvas_elem.toDataURL());
    });
  };

  resize = () => {
    if (this._inited && this.canvas_elem) {
      this.canvas_elem.width = this.tsm.view_provider.size.w;
      this.canvas_elem.height = this.tsm.view_provider.size.h;
    }
  };

  clean = () => {
    const c = this.canvas_elem;
    if (c && this.canvas_ctx) this.canvas_ctx.clearRect(0, 0, c.width, c.height);
  };

  _draw = (callback: ITSMAnyCall) => {
    const ctx = this.canvas_ctx;
    if (!ctx) return;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    this._draw_lines();
    this._draw_nodes(callback);
  };

  _watermark = () => {
    const c = this.canvas_elem;
    const ctx = this.canvas_ctx;
    if (!c || !ctx) return;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "#000";
    ctx.font = "11px Verdana,Arial,Helvetica,sans-serif";
    ctx.fillText("hizzgdev.github.io/jsmind", c.width - 5.5, c.height - 2.5);
    ctx.textAlign = "left";
    ctx.fillText(location.href, 5.5, c.height - 2.5);
  };

  _draw_lines = () => {
    this.canvas_ctx && this.tsm.view_provider.show_lines(this.canvas_ctx);
  };

  _draw_nodes = (callback: ITSMAnyCall) => {
    const nodes = this.tsm.mind!.nodes;
    for (const nodeid in nodes) {
      if (!nodeid) continue;
      const node = nodes[nodeid];
      this._draw_node(node);
    }

    function check_nodes_ready() {
      console.log("check_node_ready" + new Date());
      let allOk = true;
      for (const nodeid in nodes) {
        if (!nodeid) continue;
        const node = nodes[nodeid];
        allOk = allOk && node.expands.screen_shot_ready;
      }

      if (!allOk) {
        setTimeout(check_nodes_ready, 200);
      } else {
        setTimeout(callback, 200);
      }
    }
    check_nodes_ready();
  };

  _draw_node = (node: TSM_node) => {
    const ctx = this.canvas_ctx;
    const view_data = node.view_data;
    const node_element = view_data!.element;
    if (!node_element || !ctx) return;
    const ncs = getComputedStyle(node_element);
    if (!dom.is_visible(ncs)) {
      node.expands.screen_shot_ready = true;
      return;
    }

    const bgcolor = dom.css(ncs, "background-color");
    const round_radius = parseInt(dom.css(ncs, "border-top-left-radius"), 10);
    const color = dom.css(ncs, "color");
    const padding_left = parseInt(dom.css(ncs, "padding-left"), 10);
    const padding_right = parseInt(dom.css(ncs, "padding-right"), 10);
    const padding_top = parseInt(dom.css(ncs, "padding-top"), 10);
    const padding_bottom = parseInt(dom.css(ncs, "padding-bottom"), 10);
    const text_overflow = dom.css(ncs, "text-overflow");
    const font = `${dom.css(ncs, "font-style")} ${dom.css(ncs, "font-variant")} ${dom.css(ncs, "font-weight")} ${dom.css(ncs, "font-size")}/${dom.css(
      ncs,
      "line-height"
    )} ${dom.css(ncs, "font-family")}`;

    const rb = { x: view_data!.abs_x || 0, y: view_data!.abs_y || 0, w: (view_data!.width || 0) + 1, h: (view_data!.height || 0) + 1 };
    const tb = { x: rb.x + padding_left, y: rb.y + padding_top, w: rb.w - padding_left - padding_right, h: rb.h - padding_top - padding_bottom };

    ctx.font = font;
    ctx.fillStyle = bgcolor;
    ctx.beginPath();
    canvas.rect(ctx, rb.x, rb.y, rb.w, rb.h, round_radius);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = color;
    if ("background-image" in node.data) {
      const backgroundUrl = dom.css(ncs, "background-image").slice(5, -2);
      node.expands.screen_shot_ready = false;
      let rotation = 0;
      if ("background-rotation" in node.data) {
        rotation = node.data["background-rotation"];
      }
      canvas.image(ctx, backgroundUrl, rb.x, rb.y, rb.w, rb.h, round_radius, rotation, function() {
        node.expands.screen_shot_ready = true;
      });
    }
    if (!!node.topic) {
      if (text_overflow === "ellipsis") {
        canvas.text_ellipsis(ctx, node.topic, tb.x, tb.y, tb.w, tb.h);
      } else {
        const line_height = parseInt(dom.css(ncs, "line-height"), 10);
        canvas.text_multiline(ctx, node.topic, tb.x, tb.y, tb.w, tb.h, line_height);
      }
    }
    if (!!view_data.expander) {
      this._draw_expander(view_data.expander);
    }
    if (!("background-image" in node.data)) {
      node.expands.screen_shot_ready = true;
    }
  };

  _draw_expander = (expander: HTMLElement) => {
    const ctx = this.canvas_ctx;
    const ncs = getComputedStyle(expander);
    if (!dom.is_visible(ncs) || !ctx) {
      return;
    }

    const style_left = dom.css(ncs, "left");
    const style_top = dom.css(ncs, "top");
    // const font = dom.css(ncs, "font");
    const left = parseInt(style_left, 10);
    const top = parseInt(style_top, 10);
    const is_plus = expander.innerHTML === "+";

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

  _download = () => {
    const c = this.canvas_elem;
    if (!c) return;
    const name = this.tsm.mind!.name + ".png";
    const _toblob = !!c.toBlob || !!(c as any).msToBlob;
    if (navigator.msSaveBlob && _toblob) {
      if ("toBlob" in c)
        c.toBlob(blob => {
          navigator.msSaveBlob(blob, name);
        });
      else if ("msToBlob" in c) {
        const blob = (c as any).msToBlob();
        navigator.msSaveBlob(blob, name);
      }
    } else {
      const bloburl = this.canvas_elem!.toDataURL();
      const anchor = $doc.createElement("a");
      if ("download" in anchor) {
        anchor.style.visibility = "hidden";
        anchor.href = bloburl;
        anchor.download = name;
        $doc.body.appendChild(anchor);
        const evt = $doc.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        anchor.dispatchEvent(evt);
        $doc.body.removeChild(anchor);
      } else {
        location.href = bloburl;
      }
    }
  };

  event_handle = (type: ITSMEventTypeValue) => {
    if (type === TSMindEventTypeMap.resize) {
      this.resize();
    }
  };
}
