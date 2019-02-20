import { dom } from "../../util/dom";
import { $doc } from "../../util/tools";
import TSMind from "..";
import util from "../../util";

export default class shortcut_provider {
  tsm: TSMind;
  opts: ITSMShortcutProvOpts;
  mapping: ITSMShortcutProvOptsMapping;
  handles: ITSMShortcutProvOptsHandles;
  _mapping: ITSMShortcutProvOptsMapping = {};
  constructor(tsm: TSMind, options: ITSMShortcutProvOpts) {
    this.tsm = tsm;
    this.opts = options;
    this.mapping = options.mapping;
    this.handles = options.handles;

    dom.add_event($doc, "keydown", this.handler.bind(this));

    this.handles.addchild = this.handle_addchild;
    this.handles.addbrother = this.handle_addbrother;
    this.handles.editnode = this.handle_editnode;
    this.handles.delnode = this.handle_delnode;
    this.handles.toggle = this.handle_toggle;
    this.handles.up = this.handle_up;
    this.handles.down = this.handle_down;
    this.handles.left = this.handle_left;
    this.handles.right = this.handle_right;

    for (const handle in this.mapping) {
      if (!!this.mapping[handle] && handle in this.handles) {
        this._mapping[this.mapping[handle]] = this.handles[handle];
      }
    }
  }

  enable_shortcut = () => {
    this.opts.enable = true;
  };

  disable_shortcut = () => {
    this.opts.enable = false;
  };

  handler = (e: KeyboardEvent = event as KeyboardEvent): any => {
    if (this.tsm.view_provider.is_editing()) {
      return;
    }
    if (!this.opts.enable) {
      return true;
    }
    const kc = e.keyCode;
    if (kc in this._mapping) {
      this._mapping[kc].call(this, this.tsm, e);
    }
  };

  handle_addchild = (tsm: TSMind) => {
    const selected_node = tsm.get_selected_node();
    if (!!selected_node) {
      const nodeid = util.uuid.newid();
      const node = tsm.add_node(selected_node, nodeid, "New Node");
      if (!!node) {
        tsm.select_node(nodeid);
        tsm.begin_edit(nodeid);
      }
    }
  };
  handle_addbrother = (tsm: TSMind) => {
    const selected_node = tsm.get_selected_node();
    if (!!selected_node && !selected_node.isroot) {
      const nodeid = util.uuid.newid();
      const node = tsm.insert_node_after(selected_node, nodeid, "New Node");
      if (!!node) {
        tsm.select_node(nodeid);
        tsm.begin_edit(nodeid);
      }
    }
  };
  handle_editnode = (tsm: TSMind) => {
    const selected_node = tsm.get_selected_node();
    if (!!selected_node) {
      tsm.begin_edit(selected_node);
    }
  };
  handle_delnode = (tsm: TSMind) => {
    const selected_node = tsm.get_selected_node();
    if (!!selected_node && !selected_node.isroot) {
      tsm.select_node(selected_node.parent);
      tsm.remove_node(selected_node);
    }
  };
  handle_toggle = (tsm: TSMind, e: Event = event as Event) => {
    const selected_node = tsm.get_selected_node();
    if (!!selected_node) {
      tsm.toggle_node(selected_node.id);
      e.stopPropagation();
      e.preventDefault();
    }
  };
  handle_up = (tsm: TSMind, e: Event = event as Event) => {
    const selected_node = tsm.get_selected_node();
    if (!!selected_node) {
      let up_node = tsm.find_node_before(selected_node);
      if (!up_node) {
        const np = tsm.find_node_before(selected_node.parent);
        if (!!np && np.children.length > 0) {
          up_node = np.children[np.children.length - 1];
        }
      }
      if (!!up_node) {
        tsm.select_node(up_node);
      }
      e.stopPropagation();
      e.preventDefault();
    }
  };

  handle_down = (tsm: TSMind, e: Event = event as Event) => {
    const selected_node = tsm.get_selected_node();
    if (!!selected_node) {
      let down_node = tsm.find_node_after(selected_node);
      if (!down_node) {
        const np = tsm.find_node_after(selected_node.parent);
        if (!!np && np.children.length > 0) {
          down_node = np.children[0];
        }
      }
      if (!!down_node) {
        tsm.select_node(down_node);
      }
      e.stopPropagation();
      e.preventDefault();
    }
  };

  handle_left = (tsm: TSMind, e: any) => {
    this._handle_direction(tsm, e, TSMind.direction.left);
  };
  handle_right = (tsm: TSMind, e: any) => {
    this._handle_direction(tsm, e, TSMind.direction.right);
  };
  _handle_direction = (tsm: TSMind, e: Event = event as Event, d: ITSMDirectionValue) => {
    const selected_node = tsm.get_selected_node();
    let node = null;
    if (!!selected_node) {
      if (selected_node.isroot) {
        const c = selected_node.children;
        const children = [];
        for (let i = 0; i < c.length; i++) {
          if (c[i].direction === d) {
            children.push(i);
          }
        }
        node = c[children[Math.floor((children.length - 1) / 2)]];
      } else if (selected_node.direction === d) {
        const children = selected_node.children;
        const childrencount = children.length;
        if (childrencount > 0) {
          node = children[Math.floor((childrencount - 1) / 2)];
        }
      } else {
        node = selected_node.parent;
      }
      if (!!node) {
        tsm.select_node(node);
      }
      e.stopPropagation();
      e.preventDefault();
    }
  };
}
