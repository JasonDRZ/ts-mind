import TSMind from "..";
import { $logger } from "../../util/tools";
import { TSM_node } from "../node";

type ITSMLayoutProvNode = TSM_node;

export default class layout_provider {
  private opts: { [k: string]: any };
  private tsm: TSMind;
  private isside: boolean;
  public bounds = { n: 0, s: 0, w: 0, e: 0 };
  private cache_valid: boolean;
  constructor(tsm: TSMind, options: { [k: string]: any }) {
    this.opts = options;
    this.tsm = tsm;
    this.isside = this.opts.mode === "side";

    this.cache_valid = false;
    $logger.debug("layout.init");
  }
  reset = () => {
    $logger.debug("layout.reset");
    this.bounds = { n: 0, s: 0, w: 0, e: 0 };
  };
  layout = () => {
    $logger.debug("layout.layout");
    this.layout_direction();
    this.layout_offset();
  };

  layout_direction = () => {
    this._layout_direction_root();
  };

  _layout_direction_root = () => {
    const node = this.tsm.mind!.root;
    if (!node) return;
    // $logger.debug(node);
    const children = node.children;
    const children_count = children.length;
    node.layout_data.direction = TSMind.direction.center;
    node.layout_data.side_index = 0;
    if (this.isside) {
      let i = children_count;
      while (i--) {
        this._layout_direction_side(children[i], TSMind.direction.right, i);
      }
    } else {
      let i = children_count;
      let subnode = null;
      while (i--) {
        subnode = children[i];
        if (subnode.direction === TSMind.direction.left) {
          this._layout_direction_side(subnode, TSMind.direction.left, i);
        } else {
          this._layout_direction_side(subnode, TSMind.direction.right, i);
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

  _layout_direction_side = (node: ITSMLayoutProvNode, direction: ITSMDirectionValue, side_index: number) => {
    const layout_data = node.layout_data;
    const children = node.children;
    const children_count = children.length;

    layout_data.direction = direction;
    layout_data.side_index = side_index;
    let i = children_count;
    while (i--) {
      this._layout_direction_side(children[i], direction, i);
    }
  };

  layout_offset = () => {
    const node = this.tsm.mind!.root;
    if (!node) return;
    const layout_data = node.layout_data;
    if (!layout_data) return;
    const children = node.children;
    let i = children.length;
    const left_nodes = [];
    const right_nodes = [];
    let subnode = null;
    while (i--) {
      subnode = children[i];
      if (subnode.layout_data!.direction === TSMind.direction.right) {
        right_nodes.unshift(subnode);
      } else {
        left_nodes.unshift(subnode);
      }
    }
    layout_data.left_nodes = left_nodes;
    layout_data.right_nodes = right_nodes;
    layout_data.outer_height_left = this._layout_offset_subnodes(left_nodes);
    layout_data.outer_height_right = this._layout_offset_subnodes(right_nodes);
    this.bounds.e = (node.view_data.width || 0) / 2;
    this.bounds.w = 0 - this.bounds.e;
    // $logger.debug(this.bounds.w);
    this.bounds.n = 0;
    this.bounds.s = Math.max(layout_data.outer_height_left, layout_data.outer_height_right);
  };

  // layout both the x and y axis
  _layout_offset_subnodes = (nodes: ITSMLayoutProvNode[]) => {
    let total_height = 0;
    const nodes_count = nodes.length;
    let i = nodes_count;
    let node = null;
    let node_outer_height = 0;
    let base_y = 0;
    let pd = null; // parent._data
    while (i--) {
      node = nodes[i];
      const layout_data = node.layout_data;
      if (pd == null) {
        pd = node.parent;
      }

      node_outer_height = this._layout_offset_subnodes(node.children);
      if (!node.expanded) {
        node_outer_height = 0;
        this.set_visible(node.children, false);
      }
      node_outer_height = Math.max(node.view_data.height || 0, node_outer_height);

      layout_data.outer_height = node_outer_height;
      layout_data.offset_y = base_y - node_outer_height / 2;
      layout_data.offset_x = this.opts.hspace * layout_data.direction + (pd.view_data.width * (pd.layout_data.direction + layout_data.direction)) / 2;
      if (!node.parent.isRoot) {
        layout_data.offset_x += this.opts.pspace * layout_data.direction;
      }

      base_y = base_y - node_outer_height - this.opts.vspace;
      total_height += node_outer_height;
    }
    if (nodes_count > 1) {
      total_height += this.opts.vspace * (nodes_count - 1);
    }
    i = nodes_count;
    const middle_height = total_height / 2;
    while (i--) {
      node = nodes[i];
      node.layout_data.offset_y += middle_height;
    }
    return total_height;
  };

  // layout the y axis only, for collapse/expand a node
  _layout_offset_subnodes_height = (nodes: ITSMLayoutProvNode[]) => {
    let total_height = 0;
    const nodes_count = nodes.length;
    let i = nodes_count;
    let node = null;
    let node_outer_height = 0;
    let layout_data = null;
    let base_y = 0;
    while (i--) {
      node = nodes[i];
      layout_data = node.layout_data;

      node_outer_height = this._layout_offset_subnodes_height(node.children);
      if (!node.expanded) {
        node_outer_height = 0;
      }
      node_outer_height = Math.max(node.view_data.height, node_outer_height);

      layout_data.outer_height = node_outer_height;
      layout_data.offset_y = base_y - node_outer_height / 2;
      base_y = base_y - node_outer_height - this.opts.vspace;
      total_height += node_outer_height;
    }
    if (nodes_count > 1) {
      total_height += this.opts.vspace * (nodes_count - 1);
    }
    i = nodes_count;
    const middle_height = total_height / 2;
    while (i--) {
      node = nodes[i];
      node.layout_data.offset_y += middle_height;
      // $logger.debug(node.topic);
      // $logger.debug(node.layout_data.offset_y);
    }
    return total_height;
  };

  get_node_offset = (node: ITSMLayoutProvNode) => {
    const layout_data = node.layout_data;
    let offset_cache = { x: -1, y: -1 };
    if ("_offset_" in layout_data && this.cache_valid) {
      offset_cache = layout_data._offset_;
    } else {
      layout_data._offset_ = offset_cache;
    }
    if (offset_cache.x === -1 || offset_cache.y === -1) {
      let x = layout_data.offset_x;
      let y = layout_data.offset_y;
      if (!node.isRoot) {
        const offset_p = this.get_node_offset(node.parent);
        x += offset_p.x;
        y += offset_p.y;
      }
      offset_cache.x = x;
      offset_cache.y = y;
    }
    return offset_cache;
  };

  get_node_point = (node: ITSMLayoutProvNode) => {
    const offset_p = this.get_node_offset(node);
    $logger.debug(offset_p);
    const p = {
      x: offset_p.x + (node.view_data.width * (node.layout_data.direction - 1)) / 2,
      y: offset_p.y - node.view_data.height / 2
    };
    // $logger.debug(p);
    return p;
  };

  get_node_point_in = (node: ITSMLayoutProvNode) => {
    return this.get_node_offset(node);
  };

  get_node_point_out = (node: ITSMLayoutProvNode) => {
    const pout_cache = { x: -1, y: -1 };
    if (pout_cache.x === -1 || pout_cache.y === -1) {
      if (node.isRoot) {
        pout_cache.x = 0;
        pout_cache.y = 0;
      } else {
        const offset_p = this.get_node_offset(node);
        pout_cache.x = offset_p.x + (node.view_data.width + this.opts.pspace) * node.layout_data.direction;
        pout_cache.y = offset_p.y;
        // $logger.debug('pout');
        // $logger.debug(pout_cache);
      }
    }
    return pout_cache;
  };

  get_expander_point = (node: ITSMLayoutProvNode) => {
    const p = this.get_node_point_out(node);
    const ex_p = {
      x: 0,
      y: 0
    };
    if (node.layout_data.direction === TSMind.direction.right) {
      ex_p.x = p.x - this.opts.pspace;
    } else {
      ex_p.x = p.x;
    }
    ex_p.y = p.y - Math.ceil(this.opts.pspace / 2);
    return ex_p;
  };

  get_min_size = () => {
    const nodes = this.tsm.mind!.nodes;
    if (!nodes) return;
    let node = null;
    let pout = null;
    for (const nodeId in nodes) {
      if (!nodeId) continue;
      node = nodes[nodeId];
      pout = this.get_node_point_out(node);
      // $logger.debug(pout.x);
      if (pout.x > this.bounds.e) {
        this.bounds.e = pout.x;
      }
      if (pout.x < this.bounds.w) {
        this.bounds.w = pout.x;
      }
    }
    return {
      w: this.bounds.e - this.bounds.w,
      h: this.bounds.s - this.bounds.n
    };
  };

  toggle_node = (node: ITSMLayoutProvNode) => {
    if (node.isRoot) {
      return;
    }
    if (node.expanded) {
      this.collapse_node(node);
    } else {
      this.expand_node(node);
    }
  };

  expand_node = (node: ITSMLayoutProvNode) => {
    node.expanded = true;
    this.part_layout(node);
    this.set_visible(node.children, true);
  };

  collapse_node = (node: ITSMLayoutProvNode) => {
    node.expanded = false;
    this.part_layout(node);
    this.set_visible(node.children, false);
  };

  expand_all = () => {
    const nodes = this.tsm.mind!.nodes;
    if (!nodes) return;
    let c = 0;
    let node;
    for (const nodeId in nodes) {
      if (!nodeId) continue;
      node = nodes[nodeId];
      if (!node.expanded) {
        node.expanded = true;
        c++;
      }
    }
    if (c > 0) {
      const root = this.tsm.mind!.root;
      if (!root) return;
      this.part_layout(root);
      this.set_visible(root.children, true);
    }
  };

  collapse_all = () => {
    const nodes = this.tsm.mind!.nodes;
    let c = 0;
    let node;
    for (const nodeId in nodes) {
      if (!nodeId) continue;
      node = nodes[nodeId];
      if (node.expanded && !node.isRoot) {
        node.expanded = false;
        c++;
      }
    }
    if (c > 0) {
      const root = this.tsm.mind!.root;
      if (!root) return;
      this.part_layout(root);
      this.set_visible(root.children, true);
    }
  };

  expand_to_depth = (target_depth: number, curr_nodes: any = this.tsm.mind!.root!.children, curr_depth: number = 1) => {
    if (target_depth < 1) {
      return;
    }
    let i = curr_nodes.length;
    let node = null;
    while (i--) {
      node = curr_nodes[i];
      if (curr_depth < target_depth) {
        if (!node.expanded) {
          this.expand_node(node);
        }
        this.expand_to_depth(target_depth, node.children, curr_depth + 1);
      }
      if (curr_depth === target_depth) {
        if (node.expanded) {
          this.collapse_node(node);
        }
      }
    }
  };

  part_layout = (node: ITSMLayoutProvNode) => {
    const root = this.tsm.mind!.root;
    if (!!root) {
      const root_layout_data = root.layout_data;
      if (!root_layout_data) return;
      if (node.isRoot) {
        root_layout_data.right_nodes && (root_layout_data.outer_height_right = this._layout_offset_subnodes_height(root_layout_data.right_nodes));
        root_layout_data.left_nodes && (root_layout_data.outer_height_left = this._layout_offset_subnodes_height(root_layout_data.left_nodes));
      } else {
        if (node.layout_data.direction === TSMind.direction.right) {
          root_layout_data.right_nodes && (root_layout_data.outer_height_right = this._layout_offset_subnodes_height(root_layout_data.right_nodes));
        } else {
          root_layout_data.left_nodes && (root_layout_data.outer_height_left = this._layout_offset_subnodes_height(root_layout_data.left_nodes));
        }
      }
      this.bounds.s = Math.max(root_layout_data.outer_height_left, root_layout_data.outer_height_right);
      this.cache_valid = false;
    } else {
      $logger.warn("can not found root node");
    }
  };

  set_visible = (nodes: ITSMLayoutProvNode[], visible: boolean) => {
    let i = nodes.length;
    let node = null;
    // let layout_data: any;
    while (i--) {
      node = nodes[i];
      // layout_data = node.layout_data;
      if (node.expanded) {
        this.set_visible(node.children, visible);
      } else {
        this.set_visible(node.children, false);
      }
      if (!node.isRoot) {
        node.layout_data.visible = visible;
      }
    }
  };

  is_expand = (node: ITSMLayoutProvNode) => {
    return node.expanded;
  };

  is_visible = (node: ITSMLayoutProvNode) => {
    return !!node.layout_data.visible;
  };
}
