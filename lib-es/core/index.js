import { __version__, DEFAULT_OPTIONS } from "../util/constants";
import { $extend, $logger } from "../util/tools";
import { data_provider } from "./provider/data";
import layout_provider from "./provider/layout";
import view_provider from "./provider/view";
import util from "../util";
import { node_array } from "./format/node_array";
import shortcut_provider from "./provider/shortcut";
import { GLOBAl_PLUGIN_LIST, globalUse } from "./pugin";
// global use register
export const use = globalUse;
// mind direction
export const TSMindDirectionMap = { left: -1, center: 0, right: 1 };
// mind event type
export const TSMindEventTypeMap = { show: 1, resize: 2, edit: 3, select: 4 };
// mind core class
export class TSMind {
    constructor(options) {
        // public properties
        this.options = {
            container: ""
        };
        this.mind = null;
        this.initialized = false;
        this.event_handles = [];
        // private plugin list
        this._plugins = {};
        this.plugins = {};
        /**
         * register private plugin
         * @param plugin: ITSMPlugin
         */
        this.use = (pname, plugin) => {
            this._plugins[pname] = plugin;
        };
        // initial plugin's main methods
        this.init_plugins = (tsm, opts) => {
            const _all_plug = $extend({}, this._plugins, GLOBAl_PLUGIN_LIST);
            // call plugin in async way, to make sure plugin register no execution-order dependences.
            setTimeout(() => {
                for (const pname in _all_plug) {
                    if (pname)
                        // 确保Class类型的插件能够成功初始化
                        this.plugins[pname] = new _all_plug[pname](tsm, opts);
                }
            }, 0);
        };
        this.enable_edit = () => {
            return (this.options.editable = true);
        };
        this.disable_edit = () => {
            return (this.options.editable = false);
        };
        // call enable_event_handle('dblclick')
        // options are 'mousedown', 'click', 'dblclick'
        this.enable_event_handle = (event_handle) => {
            this.options.default_event_handle["enable_" + event_handle + "_handle"] = true;
        };
        // call disable_event_handle('dblclick')
        // options are 'mousedown', 'click', 'dblclick'
        this.disable_event_handle = (event_handle) => {
            this.options.default_event_handle["enable_" + event_handle + "_handle"] = false;
        };
        this.get_editable = () => {
            return this.options.editable;
        };
        this.set_theme = (theme) => {
            const theme_old = this.options.theme;
            this.options.theme = !!theme ? theme : "primary";
            if (theme_old !== this.options.theme) {
                this.view_provider.reset_theme();
                this.view_provider.reset_custom_style();
            }
        };
        this._event_bind = () => {
            this.view_provider.add_event(this, "mousedown", this.mousedown_handle);
            this.view_provider.add_event(this, "click", this.click_handle);
            this.view_provider.add_event(this, "dblclick", this.dblclick_handle);
        };
        this.mousedown_handle = (e = event) => {
            if (!this.options.default_event_handle.enable_mousedown_handle) {
                return;
            }
            const element = (e.target || e.srcElement);
            const nodeid = this.view_provider.get_binded_nodeid(element);
            if (!!nodeid) {
                this.select_node(nodeid);
            }
            else {
                this.select_clear();
            }
        };
        this.click_handle = (e = event) => {
            if (!this.options.default_event_handle.enable_click_handle) {
                return;
            }
            const element = (e.target || e.srcElement);
            const isexpander = this.view_provider.is_expander(element);
            if (isexpander) {
                const nodeid = this.view_provider.get_binded_nodeid(element);
                if (!!nodeid) {
                    this.toggle_node(nodeid);
                }
            }
        };
        this.dblclick_handle = (e = event) => {
            if (!this.options.default_event_handle.enable_dblclick_handle) {
                return;
            }
            if (this.get_editable()) {
                const element = (e.target || e.srcElement);
                const nodeid = this.view_provider.get_binded_nodeid(element);
                if (!!nodeid) {
                    this.begin_edit(nodeid);
                }
            }
        };
        this.begin_edit = (node) => {
            if (!util.is_node(node)) {
                const the_node = this.get_node(node);
                if (!the_node) {
                    $logger.error("the node[id=" + node + "] can not be found.");
                    return false;
                }
                else {
                    return this.begin_edit(the_node);
                }
            }
            if (this.get_editable()) {
                this.view_provider.edit_node_begin(node);
            }
            else {
                $logger.error("fail, this mind map is not editable.");
                return;
            }
        };
        this.end_edit = () => {
            this.view_provider.edit_node_end();
        };
        this.toggle_node = (node) => {
            if (!util.is_node(node)) {
                const the_node = this.get_node(node);
                if (!the_node) {
                    $logger.error("the node[id=" + node + "] can not be found.");
                    return;
                }
                else {
                    return this.toggle_node(the_node);
                }
            }
            if (node.isroot) {
                return;
            }
            this.view_provider.save_location(node);
            this.layout_provider.toggle_node(node);
            this.view_provider.relayout();
            this.view_provider.restore_location(node);
        };
        this.expand_node = (node) => {
            if (!util.is_node(node)) {
                const the_node = this.get_node(node);
                if (!the_node) {
                    $logger.error("the node[id=" + node + "] can not be found.");
                    return;
                }
                else {
                    return this.expand_node(the_node);
                }
            }
            if (node.isroot) {
                return;
            }
            this.view_provider.save_location(node);
            this.layout_provider.expand_node(node);
            this.view_provider.relayout();
            this.view_provider.restore_location(node);
        };
        this.collapse_node = (node) => {
            if (!util.is_node(node)) {
                const the_node = this.get_node(node);
                if (!the_node) {
                    $logger.error("the node[id=" + node + "] can not be found.");
                    return;
                }
                else {
                    return this.collapse_node(the_node);
                }
            }
            if (node.isroot) {
                return;
            }
            this.view_provider.save_location(node);
            this.layout_provider.collapse_node(node);
            this.view_provider.relayout();
            this.view_provider.restore_location(node);
        };
        this.expand_all = () => {
            this.layout_provider.expand_all();
            this.view_provider.relayout();
        };
        this.collapse_all = () => {
            this.layout_provider.collapse_all();
            this.view_provider.relayout();
        };
        this.expand_to_depth = (depth) => {
            this.layout_provider.expand_to_depth(depth);
            this.view_provider.relayout();
        };
        this._reset = () => {
            this.view_provider.reset();
            this.layout_provider.reset();
            this.data_provider.reset();
        };
        this._show = (mind) => {
            const m = mind || node_array.example;
            this.mind = this.data_provider.load(m);
            if (!this.mind) {
                $logger.error("data.load error");
                return;
            }
            else {
                $logger.debug("data.load ok");
            }
            this.view_provider.load();
            $logger.debug("view.load ok");
            this.layout_provider.layout();
            $logger.debug("layout.layout ok");
            this.view_provider.show(true);
            $logger.debug("view.show ok");
            this.invoke_event_handle(TSMindEventTypeMap.show, { data: [mind] });
        };
        this.show = (mind) => {
            this._reset();
            this._show(mind);
        };
        this.get_meta = () => {
            return {
                name: this.mind.name,
                author: this.mind.author,
                version: this.mind.version
            };
        };
        this.get_data = (data_format = "node_tree") => {
            return this.data_provider.get_data(data_format);
        };
        this.get_root = () => {
            return this.mind.root;
        };
        this.get_node = (nodeid) => {
            return this.mind.get_node(nodeid);
        };
        this.add_node = (parent_node, nodeid, topic, data) => {
            if (this.get_editable()) {
                const node = this.mind.add_node(parent_node, nodeid, topic, data);
                if (!!node) {
                    this.view_provider.add_node(node);
                    this.layout_provider.layout();
                    this.view_provider.show(false);
                    this.view_provider.reset_node_custom_style(node);
                    this.expand_node(parent_node);
                    this.invoke_event_handle(TSMindEventTypeMap.edit, { evt: "add_node", data: [parent_node.id, nodeid, topic, data], node: nodeid });
                }
                return node;
            }
            else {
                $logger.error("fail, this mind map is not editable");
                return null;
            }
        };
        this.insert_node_before = (node_before, nodeid, topic, data) => {
            if (this.get_editable()) {
                const beforeid = util.is_node(node_before) ? node_before.id : node_before;
                const node = this.mind.insert_node_before(node_before, nodeid, topic, data);
                if (!!node) {
                    this.view_provider.add_node(node);
                    this.layout_provider.layout();
                    this.view_provider.show(false);
                    this.invoke_event_handle(TSMindEventTypeMap.edit, { evt: "insert_node_before", data: [beforeid, nodeid, topic, data], node: nodeid });
                }
                return node;
            }
            else {
                $logger.error("fail, this mind map is not editable");
                return null;
            }
        };
        this.insert_node_after = (node_after, nodeid, topic, data) => {
            if (this.get_editable()) {
                const afterid = util.is_node(node_after) ? node_after.id : node_after;
                const node = this.mind.insert_node_after(node_after, nodeid, topic, data);
                if (!!node) {
                    this.view_provider.add_node(node);
                    this.layout_provider.layout();
                    this.view_provider.show(false);
                    this.invoke_event_handle(TSMindEventTypeMap.edit, { evt: "insert_node_after", data: [afterid, nodeid, topic, data], node: nodeid });
                }
                return node;
            }
            else {
                $logger.error("fail, this mind map is not editable");
                return null;
            }
        };
        this.remove_node = (node) => {
            if (!util.is_node(node)) {
                const the_node = this.get_node(node);
                if (!the_node) {
                    $logger.error("the node[id=" + node + "] can not be found.");
                    return false;
                }
                else {
                    return this.remove_node(the_node);
                }
            }
            if (this.get_editable()) {
                if (node.isroot) {
                    $logger.error("fail, can not remove root node");
                    return false;
                }
                const nodeid = node.id;
                const parentid = node.parent.id;
                const parent_node = this.get_node(parentid);
                parent_node && this.view_provider.save_location(parent_node);
                this.view_provider.remove_node(node);
                this.mind.remove_node(node);
                this.layout_provider.layout();
                this.view_provider.show(false);
                parent_node && this.view_provider.restore_location(parent_node);
                this.invoke_event_handle(TSMindEventTypeMap.edit, { evt: "remove_node", data: [nodeid], node: parentid });
                return true;
            }
            else {
                $logger.error("fail, this mind map is not editable");
                return false;
            }
        };
        this.update_node = (nodeid, topic) => {
            if (this.get_editable()) {
                if (util.text.is_empty(topic)) {
                    $logger.warn("fail, topic can not be empty");
                    return;
                }
                const node = this.get_node(nodeid);
                if (!!node) {
                    if (node.topic === topic) {
                        $logger.info("nothing changed");
                        this.view_provider.update_node(node);
                        return;
                    }
                    node.topic = topic;
                    this.view_provider.update_node(node);
                    this.layout_provider.layout();
                    this.view_provider.show(false);
                    this.invoke_event_handle(TSMindEventTypeMap.edit, { evt: "update_node", data: [nodeid, topic], node: nodeid });
                }
            }
            else {
                $logger.error("fail, this mind map is not editable");
                return;
            }
        };
        this.move_node = (nodeid, beforeid, parentid, direction) => {
            if (this.get_editable()) {
                const node = this.mind.move_node(nodeid, beforeid, parentid, direction);
                if (!!node) {
                    this.view_provider.update_node(node);
                    this.layout_provider.layout();
                    this.view_provider.show(false);
                    this.invoke_event_handle(TSMindEventTypeMap.edit, { evt: "move_node", data: [nodeid, beforeid, parentid, direction], node: nodeid });
                }
            }
            else {
                $logger.error("fail, this mind map is not editable");
                return;
            }
        };
        this.select_node = (node) => {
            if (!util.is_node(node)) {
                const the_node = this.get_node(node);
                if (!the_node) {
                    $logger.error("the node[id=" + node + "] can not be found.");
                    return;
                }
                else {
                    return this.select_node(the_node);
                }
            }
            if (!this.layout_provider.is_visible(node)) {
                return;
            }
            this.mind.selected = node;
            this.view_provider.select_node(node);
        };
        this.get_selected_node = () => {
            if (!!this.mind) {
                return this.mind.selected;
            }
            else {
                return null;
            }
        };
        this.select_clear = () => {
            if (!!this.mind) {
                this.mind.selected = null;
                this.view_provider.select_clear();
            }
        };
        this.is_node_visible = (node) => {
            return this.layout_provider.is_visible(node);
        };
        this.find_node_before = (node) => {
            if (!util.is_node(node)) {
                const the_node = this.get_node(node);
                if (!the_node) {
                    $logger.error("the node[id=" + node + "] can not be found.");
                    return null;
                }
                else {
                    return this.find_node_before(the_node);
                }
            }
            if (node.isroot) {
                return null;
            }
            let n = null;
            if (node.parent.isroot) {
                const c = node.parent.children;
                let prev = null;
                for (const ni of c) {
                    if (node.direction === ni.direction) {
                        if (node.id === ni.id) {
                            n = prev;
                        }
                        prev = ni;
                    }
                }
            }
            else {
                n = this.mind.get_node_before(node);
            }
            return n;
        };
        this.find_node_after = (node) => {
            if (!util.is_node(node)) {
                const the_node = this.get_node(node);
                if (!the_node) {
                    $logger.error("the node[id=" + node + "] can not be found.");
                    return;
                }
                else {
                    return this.find_node_after(the_node);
                }
            }
            if (node.isroot) {
                return null;
            }
            let n = null;
            if (node.parent.isroot) {
                const c = node.parent.children;
                let getthis = false;
                for (const ni of c) {
                    if (node.direction === ni.direction) {
                        if (getthis) {
                            n = ni;
                            break;
                        }
                        if (node.id === ni.id) {
                            getthis = true;
                        }
                    }
                }
            }
            else {
                n = this.mind.get_node_after(node);
            }
            return n;
        };
        this.set_node_color = (nodeid, bgcolor, fgcolor) => {
            if (this.get_editable()) {
                const node = this.mind.get_node(nodeid);
                if (!!node) {
                    if (!!bgcolor) {
                        node.data["background-color"] = bgcolor;
                    }
                    if (!!fgcolor) {
                        node.data["foreground-color"] = fgcolor;
                    }
                    this.view_provider.reset_node_custom_style(node);
                    return true;
                }
            }
            else {
                $logger.error("fail, this mind map is not editable");
            }
            return false;
        };
        this.set_node_font_style = (nodeid, size, weight, style) => {
            if (this.get_editable()) {
                const node = this.mind.get_node(nodeid);
                if (!!node) {
                    if (!!size) {
                        node.data["font-size"] = size;
                    }
                    if (!!weight) {
                        node.data["font-weight"] = weight;
                    }
                    if (!!style) {
                        node.data["font-style"] = style;
                    }
                    this.view_provider.reset_node_custom_style(node);
                    this.view_provider.update_node(node);
                    this.layout_provider.layout();
                    this.view_provider.show(false);
                    return true;
                }
            }
            else {
                $logger.error("fail, this mind map is not editable");
            }
            return false;
        };
        this.set_node_background_image = (nodeid, image, width, height, rotation) => {
            if (this.get_editable()) {
                const node = this.mind.get_node(nodeid);
                if (!!node) {
                    if (!!image) {
                        node.data["background-image"] = image;
                    }
                    if (!!width) {
                        node.data.width = width;
                    }
                    if (!!height) {
                        node.data.height = height;
                    }
                    if (!!rotation) {
                        node.data["background-rotation"] = rotation;
                    }
                    this.view_provider.reset_node_custom_style(node);
                    this.view_provider.update_node(node);
                    this.layout_provider.layout();
                    this.view_provider.show(false);
                    return true;
                }
            }
            else {
                $logger.error("fail, this mind map is not editable");
            }
            return false;
        };
        this.set_node_background_rotation = (nodeid, rotation) => {
            if (this.get_editable()) {
                const node = this.mind.get_node(nodeid);
                if (!!node) {
                    if (!node.data["background-image"]) {
                        $logger.error("fail, only can change rotation angle of node with background image");
                        return false;
                    }
                    node.data["background-rotation"] = rotation;
                    this.view_provider.reset_node_custom_style(node);
                    this.view_provider.update_node(node);
                    this.layout_provider.layout();
                    this.view_provider.show(false);
                    return true;
                }
            }
            else {
                $logger.error("fail, this mind map is not editable");
            }
            return false;
        };
        this.resize = () => {
            this.view_provider.resize();
        };
        // callback(type ,data)
        this.add_event_listener = (callback = () => void 0) => {
            if (typeof callback === "function") {
                this.event_handles.push(callback);
            }
        };
        this.invoke_event_handle = (type, data) => {
            const j = this;
            window.setTimeout(function () {
                j._invoke_event_handle(type, data);
            }, 0);
        };
        this._invoke_event_handle = (type, data) => {
            const l = this.event_handles.length;
            for (let i = 0; i < l; i++) {
                this.event_handles[i](type, data);
            }
        };
        if (!options.container) {
            throw Error("the options.container should not be null or empty.");
        }
        this.options = $extend(true, DEFAULT_OPTIONS, options);
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        const opts = this.options;
        const opts_layout = {
            mode: opts.mode,
            hspace: opts.layout.hspace,
            vspace: opts.layout.vspace,
            pspace: opts.layout.pspace
        };
        const opts_view = {
            container: opts.container,
            support_html: opts.support_html,
            hmargin: opts.view.hmargin,
            vmargin: opts.view.vmargin,
            line_width: opts.view.line_width,
            line_color: opts.view.line_color
        };
        // create instance of function provider
        this.data_provider = new data_provider(this);
        this.layout_provider = new layout_provider(this, opts_layout);
        this.view_provider = new view_provider(this, opts_view);
        this.shortcut_provider = new shortcut_provider(this, opts.shortcut);
        this._event_bind();
        this.init_plugins(this, options);
    }
}
// static properties
TSMind.version = __version__;
TSMind.direction = TSMindDirectionMap;
TSMind.event_type = TSMindEventTypeMap;
export default TSMind;
