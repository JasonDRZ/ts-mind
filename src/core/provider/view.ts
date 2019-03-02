import {
	$logger,
	$isEl,
	$elByID,
	$doc,
	$pushText,
	$pushChild
} from "../../util/tools";
import { dom } from "../../util/dom";
import TSMind, { TSMindEventTypeMap } from "..";
import layout_provider from "./layout";
import { TSM_node } from "../node";
import { _slice } from "../../util/array";
import { canvas } from "../../util/canvas";
import { TSM_Node_Names } from "../../util/constants";

interface ITSMViewProvOptions {
	[k: string]: any;
}
type ITSMViewEle<T = HTMLElement> = T | null;

export default class view_provider {
	private tsm: TSMind;
	// public conf
	public opts: ITSMViewProvOptions;
	public layout: layout_provider;
	public container: HTMLElement;
	public e_panel: HTMLElement = $doc.createElement("div");
	public e_nodes: HTMLElement = $doc.createElement(TSM_Node_Names.nodes);
	public e_canvas: HTMLCanvasElement = $doc.createElement("canvas");
	public e_editor: HTMLInputElement = $doc.createElement("input");
	public canvas_ctx: CanvasRenderingContext2D = this.e_canvas.getContext(
		"2d"
	) as CanvasRenderingContext2D;
	public size = { w: 0, h: 0 };
	public selected_node: ITSMViewEle<TSM_node> = null;
	public editing_node: ITSMViewEle<TSM_node> = null;
	// view zoom
	private actualZoom = 1;
	private zoomStep = 0.1;
	private minZoom = 0.5;
	private maxZoom = 2;
	constructor(tsm: TSMind, options: ITSMViewProvOptions) {
		this.opts = options;
		this.tsm = tsm;
		this.layout = tsm.layout_provider;

		$logger.debug("view.init");

		this.container = $isEl(this.opts.container)
			? this.opts.container
			: $elByID(this.opts.container);
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
		dom.add_event(this.e_editor, "keydown", function(e) {
			const evt = e || event;
			if (evt.keyCode === 13) {
				v.edit_node_end();
				evt.stopPropagation();
			}
		});
		dom.add_event(this.e_editor, "blur", function() {
			v.edit_node_end();
		});

		this.container.appendChild(this.e_panel);
	}

	add_event = (
		obj: {},
		event_name: ITSMEventType,
		event_handle: ITSMAnyCall
	) => {
		this.e_nodes &&
			dom.add_event(this.e_nodes, event_name, function(e) {
				const evt = e || event;
				event_handle.call(obj, evt);
			});
	};

	get_binded_nodeid(element: HTMLElement): null | string {
		if (element == null) {
			return null;
		}
		const tagName = element.tagName.toLowerCase();
		if (
			tagName === TSM_Node_Names.nodes ||
			tagName === "body" ||
			tagName === "html"
		) {
			return null;
		}
		if (tagName === TSM_Node_Names.node || tagName === TSM_Node_Names.fold) {
			return element.getAttribute("nodeId");
		} else if (element.parentElement) {
			return this.get_binded_nodeid(element.parentElement);
		}
		return null;
	}

	is_expander = (element: HTMLElement) => {
		return element.tagName.toLowerCase() === TSM_Node_Names.fold;
	};

	reset = () => {
		$logger.debug("view.reset");
		this.selected_node = null;
		this.clear_lines();
		this.clear_nodes();
		this.reset_theme();
	};

	reset_theme = () => {
		const theme_name = this.tsm.options.theme;
		if (!!theme_name) {
			this.e_nodes!.className = "theme-" + theme_name;
		} else {
			this.e_nodes!.className = "";
		}
	};

	reset_custom_style = () => {
		const nodes = this.tsm.mind!.nodes;
		for (const nodeId in nodes) {
			if (nodeId) this.reset_node_custom_style(nodes[nodeId]);
		}
	};

	load = () => {
		$logger.debug("view.load");
		this.init_nodes();
	};

	expand_size = () => {
		const min_size = this.layout.get_min_size();
		if (!min_size) return;
		const min_height = min_size.h + this.opts.vmargin * 2;
		const min_width = min_size.w + this.opts.hmargin * 2;
		let client_w = this.e_panel!.clientWidth || 0;
		let client_h = this.e_panel!.clientHeight || 0;
		if (client_w < min_width) {
			client_w = min_width;
		}
		if (client_h < min_height) {
			client_h = min_height;
		}
		this.size.w = client_w;
		this.size.h = client_h;
	};

	init_nodes_size = (node: TSM_node) => {
		if (!node.view_data.element) return;
		node.view_data.width = node.view_data.element.clientWidth;
		node.view_data.height = node.view_data.element.clientHeight;
	};

	init_nodes = () => {
		const nodes = this.tsm.mind!.nodes;
		const doc_frag = $doc.createDocumentFragment();
		for (const nodeId in nodes) {
			if (nodeId) this.create_node_element(nodes[nodeId], doc_frag);
		}
		this.e_nodes!.appendChild(doc_frag);
		for (const nodeId in nodes) {
			if (nodeId) this.init_nodes_size(nodes[nodeId]);
		}
	};

	add_node = (node: TSM_node) => {
		this.create_node_element(node, this.e_nodes as HTMLElement);
		this.init_nodes_size(node);
	};

	create_node_element = (
		node: TSM_node,
		parent_node: HTMLElement | DocumentFragment
	) => {
		const d = $doc.createElement(TSM_Node_Names.node);
		if (node.isRoot) {
			d.className = "root";
			// d.style.visibility = "visible";
		} else {
			const d_e = $doc.createElement(TSM_Node_Names.fold);
			$pushText(d_e, "-");
			d_e.setAttribute("nodeId", node.id);
			d_e.style.visibility = "hidden";
			parent_node.appendChild(d_e);
			node.view_data.expander = d_e;
		}
		if (!!node.topic) {
			if (this.opts.support_html) {
				$pushChild(d, node.topic);
			} else {
				$pushText(d, node.topic);
			}
		}
		d.setAttribute("nodeId", node.id);
		// d.style.visibility = "hidden";
		this._reset_node_custom_style(d, node.data);

		parent_node.appendChild(d);
		node.view_data.element = d;
	};

	remove_node = (node: TSM_node) => {
		if (this.selected_node != null && this.selected_node!.id === node.id) {
			this.selected_node = null;
		}
		if (
			this.editing_node !== null &&
			this.editing_node.id === node.id &&
			node.view_data.element
		) {
			node.view_data.element.removeChild(this.e_editor as HTMLInputElement);
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

	update_node = (node: TSM_node) => {
		const element = node.view_data.element as HTMLElement;
		if (!!node.topic) {
			if (this.opts.support_html) {
				$pushChild(element, node.topic);
			} else {
				$pushText(element, node.topic);
			}
		}
		node.view_data.width = element.clientWidth;
		node.view_data.height = element.clientHeight;
	};

	select_node = (node: null | TSM_node) => {
		if (!node || !this.selected_node) return;
		const selected_node_ele = this.selected_node.view_data.element;
		const node_ele = node.view_data.element;
		if (!!selected_node_ele) {
			selected_node_ele.className = selected_node_ele.className.replace(
				/\s*selected\b/i,
				""
			);
			this.reset_node_custom_style(this.selected_node as TSM_node);
		}
		if (!!node && !!node_ele) {
			this.selected_node = node;
			node_ele.className += " selected";
			this.clear_node_custom_style(node);
		}
	};

	select_clear = () => {
		this.select_node(null);
	};

	get_editing_node = () => {
		return this.editing_node;
	};

	is_editing = () => {
		return !!this.editing_node;
	};

	edit_node_begin = (node: TSM_node) => {
		if (!node.topic) {
			$logger.warn("don't edit image nodes");
			return;
		}
		if (this.editing_node != null) {
			this.edit_node_end();
		}
		this.editing_node = node;
		const element = node.view_data.element;
		if (!element) return;
		const topic = node.topic;
		const ncs = getComputedStyle(element);
		this.e_editor.value = topic;
		this.e_editor.style.width =
			element.clientWidth -
			parseInt(ncs.getPropertyValue("padding-left"), 10) -
			parseInt(ncs.getPropertyValue("padding-right"), 10) +
			"px";
		element.innerHTML = "";
		element.appendChild(this.e_editor as Node);
		element.style.zIndex = "5";
		this.e_editor!.focus();
		this.e_editor!.select();
	};

	edit_node_end = () => {
		if (this.editing_node != null) {
			const node = this.editing_node;
			this.editing_node = null;
			const element = node.view_data.element as HTMLElement;
			const topic = this.e_editor!.value;
			element.style.zIndex = "auto";
			element.removeChild(this.e_editor as Node);
			if (!topic || node.topic === topic) {
				if (this.opts.support_html) {
					$pushChild(element, node.topic);
				} else {
					$pushText(element, node.topic);
				}
			} else {
				this.tsm.update_node(node.id, topic);
			}
		}
	};

	get_view_offset = () => {
		const bounds = this.layout.bounds;
		return { x: (this.size.w - bounds.e - bounds.w) / 2, y: this.size.h / 2 };
	};

	resize = () => {
		this.e_canvas!.width = 1;
		this.e_canvas!.height = 1;
		this.e_nodes!.style.width = "1px";
		this.e_nodes!.style.height = "1px";

		this.expand_size();
		this._show();
	};

	_show = () => {
		this.e_canvas!.width = this.size.w;
		this.e_canvas!.height = this.size.h;
		this.e_nodes!.style.width = this.size.w + "px";
		this.e_nodes!.style.height = this.size.h + "px";
		this.show_nodes();
		this.show_lines();
		// this.layout.cache_valid = true;
		this.tsm.invoke_event_handle(TSMindEventTypeMap.resize, { data: [] });
	};

	zoomIn = () => {
		return this.setZoom(this.actualZoom + this.zoomStep);
	};

	zoomOut = () => {
		return this.setZoom(this.actualZoom - this.zoomStep);
	};

	setZoom = (zoom: number) => {
		if (zoom < this.minZoom || zoom > this.maxZoom) {
			return false;
		}
		this.actualZoom = zoom;
		const _children = _slice.call(this.e_panel!.children);
		for (const child of _children) {
			child.style.transform = "scale(" + zoom + ")";
		}
		this.show(true);
		return true;
	};

	_center_root = () => {
		// center root node
		const outer_w = this.e_panel!.clientWidth;
		const outer_h = this.e_panel!.clientHeight;
		if (this.size.w > outer_w) {
			const _offset = this.get_view_offset();
			this.e_panel!.scrollLeft = _offset.x - outer_w / 2;
		}
		if (this.size.h > outer_h) {
			this.e_panel!.scrollTop = (this.size.h - outer_h) / 2;
		}
	};

	show = (keep_center: boolean) => {
		$logger.debug("view.show");
		this.expand_size();
		this._show();
		if (keep_center) {
			this._center_root();
		}
	};

	relayout = () => {
		this.expand_size();
		this._show();
	};

	save_location = (node: TSM_node) => {
		const vd = node.view_data;
		if (vd)
			vd._saved_location = {
				x: Number(vd.element!.style.left) - this.e_panel!.scrollLeft,
				y: Number(vd.element!.style.top) - this.e_panel!.scrollTop
			};
	};

	restore_location = (node: TSM_node) => {
		const vd = node.view_data;
		if (vd && vd.element) {
			const _ele = vd.element;
			this.e_panel!.scrollLeft =
				Number(_ele.style.left) - vd._saved_location!.x;
			this.e_panel!.scrollTop =
				Number(vd.element!.style.top) - vd._saved_location!.y;
		}
	};

	clear_nodes = () => {
		const mind = this.tsm.mind;
		if (mind == null) {
			return;
		}
		const nodes = mind.nodes;
		let node = null;
		for (const nodeId in nodes) {
			if (!nodeId) continue;
			node = nodes[nodeId];
			node.view_data.element = null;
			node.view_data.expander = null;
		}
		this.e_nodes!.innerHTML = "";
	};

	show_nodes = () => {
		const nodes = this.tsm.mind!.nodes;
		const _offset = this.get_view_offset();
		for (const nodeId in nodes) {
			if (!nodeId) continue;
			const node = nodes[nodeId];
			$logger.log(node);
			const node_element = node.view_data.element;
			const expander = node.view_data.expander;
			if (!node_element) continue;
			if (!this.layout.is_visible(node)) {
				node_element.style.display = "none";
				expander!.style.display = "none";
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
			if (!node.isRoot && node.children.length > 0) {
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
			if (!node.isRoot && node.children.length === 0 && expander) {
				expander.style.display = "none";
				expander.style.visibility = "hidden";
			}
		}
	};

	reset_node_custom_style = (node: TSM_node) => {
		this._reset_node_custom_style(
			node.view_data.element as HTMLElement,
			node.data
		);
	};

	_reset_node_custom_style = (node_element: HTMLElement, node_data: any) => {
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
			const backgroundImage = node_data["background-image"] as any;
			if (
				backgroundImage.startsWith("data") &&
				node_data.width &&
				node_data.height
			) {
				const img = new Image();

				img.onload = function() {
					const c = $doc.createElement("canvas");
					c.width = node_element.clientWidth;
					c.height = node_element.clientHeight;
					const img = this as CanvasImageSource;
					if (c.getContext) {
						const ctx = c.getContext("2d") as CanvasRenderingContext2D;
						ctx.drawImage(
							img,
							2,
							2,
							node_element.clientWidth,
							node_element.clientHeight
						);
						const scaledImageData = c.toDataURL();
						node_element.style.backgroundImage = "url(" + scaledImageData + ")";
					}
				};
				img.src = backgroundImage;
			} else {
				node_element.style.backgroundImage = "url(" + backgroundImage + ")";
			}
			node_element.style.backgroundSize = "99%";

			if ("background-rotation" in node_data) {
				node_element.style.transform =
					"rotate(" + node_data["background-rotation"] + "deg)";
			}
		}
	};

	clear_node_custom_style = (node: TSM_node) => {
		const node_element = node.view_data.element;
		if (node_element) {
			node_element.style.backgroundColor = "";
			node_element.style.color = "";
		}
	};

	clear_lines = (
		canvas_ctx: CanvasRenderingContext2D = this
			.canvas_ctx as CanvasRenderingContext2D
	) => {
		canvas.clear(canvas_ctx, 0, 0, this.size.w, this.size.h);
	};

	show_lines = (
		canvas_ctx: CanvasRenderingContext2D = this
			.canvas_ctx as CanvasRenderingContext2D
	) => {
		this.clear_lines(canvas_ctx);
		const nodes = this.tsm.mind!.nodes;
		let node = null;
		let pin = null;
		let pout = null;
		const _offset = this.get_view_offset();
		for (const nodeId in nodes) {
			if (!nodeId) continue;
			node = nodes[nodeId];
			if (!!node.isRoot) {
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

	draw_line = (
		pin: ITSMPotions,
		pout: ITSMPotions,
		offset: ITSMPotions,
		canvas_ctx: CanvasRenderingContext2D = this
			.canvas_ctx as CanvasRenderingContext2D
	) => {
		canvas_ctx.strokeStyle = this.opts.line_color;
		canvas_ctx.lineWidth = this.opts.line_width;
		canvas_ctx.lineCap = "round";

		canvas.bezierto(
			canvas_ctx,
			pin.x + offset.x,
			pin.y + offset.y,
			pout.x + offset.x,
			pout.y + offset.y
		);
	};
}
