import TSMind, { TSMindDirectionMap } from "..";
import { VNode } from "core.2/vnode";
import { getInitBounds } from "./compute";

type ITSMLayoutProvNode = VNode;

export default class Layout {
  private opts: { [k: string]: any };
  private mind: TSMind;
  private isside: boolean;
  public bounds: IMLayoutBounds = getInitBounds();
  constructor(mind: TSMind, options: { [k: string]: any }) {
    this.opts = options;
    this.mind = mind;
    this.isside = this.opts.mode === "side";

    this.mind.logger.debug("layout.init");
  }
  reset = () => {
    this.mind.logger.debug("layout.reset");
    this.bounds = getInitBounds();
  };
  layout = () => {
    this.mind.logger.debug("layout.layout");
    this.layout_direction();
    this.layout_offset();
  };

  layout_direction = () => {
    this._layout_direction_root();
  };

  _layout_direction_root = () => {
    const node = this.mind.vm.rootNode;
    if (!node) return;
    // this.mind.logger.debug(node);
    const children = node.children;
    const children_count = children.length;
    node.direction = TSMindDirectionMap.center;
    node.layoutData.sideIndex = 0;
    if (this.isside) {
      let i = children_count;
      while (i--) {
        this._layout_direction_side(children[i], TSMindDirectionMap.right, i);
      }
    } else {
      let i = children_count;
      let subnode = null;
      while (i--) {
        subnode = children[i];
        if (subnode.direction === TSMindDirectionMap.left) {
          this._layout_direction_side(subnode, TSMindDirectionMap.left, i);
        } else {
          this._layout_direction_side(subnode, TSMindDirectionMap.right, i);
        }
      }
      /*
                var boundary = Math.ceil(children_count/2);
                var i = children_count;
                while(i--){
                    if(i>=boundary){
                        this._layout_direction_side(children[i],mind.direction.left, children_count-i-1);
                    }else{
                        this._layout_direction_side(children[i],mind.direction.right, i);
                    }
                }*/
    }
  };

  _layout_direction_side = (node: ITSMLayoutProvNode, direction: ITSMDirectionValue, sideIndex: number) => {
    const layoutData = node.layoutData;
    const children = node.children;
    const children_count = children.length;

    node.direction = direction;
    layoutData.sideIndex = sideIndex;
    let i = children_count;
    while (i--) {
      this._layout_direction_side(children[i], direction, i);
    }
  };

  layout_offset = () => {
    const node = this.mind.vm.rootNode;
    if (!node) return;
    const layoutData = node.layoutData;
    if (!layoutData) return;
    const children = node.children;
    let i = children.length;
    const leftNodes = [];
    const rightNodes = [];
    let subnode = null;
    while (i--) {
      subnode = children[i];
      if (subnode.direction === TSMindDirectionMap.right) {
        rightNodes.unshift(subnode);
      } else {
        leftNodes.unshift(subnode);
      }
    }
    layoutData.leftNodes = leftNodes;
    layoutData.rightNodes = rightNodes;
    layoutData.leftNodeOuterHeight = this._layout_offset_subnodes(leftNodes);
    layoutData.rightNodeOuterHeight = this._layout_offset_subnodes(rightNodes);
    this.bounds.e = node.width / 2;
    this.bounds.w = 0 - this.bounds.e;
    // this.mind.logger.debug(this.bounds.w);
    this.bounds.n = 0;
    this.bounds.s = Math.max(layoutData.leftNodeOuterHeight, layoutData.rightNodeOuterHeight);
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
      const layoutData = node.layoutData;
      if (pd == null) {
        pd = node.parent;
      }

      node_outer_height = this._layout_offset_subnodes(node.children);
      if (!node.expanded) {
        node_outer_height = 0;
        this.set_visible(node.children, false);
      }
      node_outer_height = Math.max(node.height || 0, node_outer_height);

      layoutData.outerHeight = node_outer_height;
      layoutData.offsetY = base_y - node_outer_height / 2;
      layoutData.offsetX = this.opts.hspace * node.direction + (pd.width * (pd.direction + node.direction)) / 2;
      if (!node.parent.isRoot) {
        layoutData.offsetX += this.opts.pspace * node.direction;
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
      node.layoutData.offsetY += middle_height;
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
    let layoutData = null;
    let base_y = 0;
    while (i--) {
      node = nodes[i];
      layoutData = node.layoutData;

      node_outer_height = this._layout_offset_subnodes_height(node.children);
      if (!node.expanded) {
        node_outer_height = 0;
      }
      node_outer_height = Math.max(node.height, node_outer_height);

      layoutData.outerHeight = node_outer_height;
      layoutData.offsetY = base_y - node_outer_height / 2;
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
      node.layoutData.offsetY += middle_height;
      // this.mind.logger.debug(node.topic);
      // this.mind.logger.debug(node.layoutData.offsetY);
    }
    return total_height;
  };

  get_node_offset = (node: ITSMLayoutProvNode) => {
    const layoutData = node.layoutData;
    let offset_cache = { x: -1, y: -1 };
    // if ("_offset_" in layoutData && this.cache_valid) {
    //   offset_cache = layoutData._offset_;
    // } else {
    //   layoutData._offset_ = offset_cache;
    // }
    if (offset_cache.x === -1 || offset_cache.y === -1) {
      let x = layoutData.offsetX;
      let y = layoutData.offsetY;
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
    this.mind.logger.debug("", offset_p);
    const p = {
      x: offset_p.x + (node.width * (node.direction - 1)) / 2,
      y: offset_p.y - node.height / 2
    };
    // this.mind.logger.debug(p);
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
        pout_cache.x = offset_p.x + (node.width + this.opts.pspace) * node.direction;
        pout_cache.y = offset_p.y;
        // this.mind.logger.debug('pout');
        // this.mind.logger.debug(pout_cache);
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
    if (node.direction === TSMindDirectionMap.right) {
      ex_p.x = p.x - this.opts.pspace;
    } else {
      ex_p.x = p.x;
    }
    ex_p.y = p.y - Math.ceil(this.opts.pspace / 2);
    return ex_p;
  };

  get_min_size = () => {
    const nodes = this.mind.vm.nodesMap;
    if (!nodes) return;
    let node = null;
    let pout = null;
    for (const nodeId in nodes) {
      if (!nodeId) continue;
      node = nodes[nodeId];
      pout = this.get_node_point_out(node);
      // this.mind.logger.debug(pout.x);
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
    const nodes = this.mind.vm.nodesMap;
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
      const root = this.mind.vm.rootNode;
      if (!root) return;
      this.part_layout(root);
      this.set_visible(root.children, true);
    }
  };

  collapse_all = () => {
    const nodes = this.mind.vm.nodesMap;
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
      const root = this.mind.vm.rootNode;
      if (!root) return;
      this.part_layout(root);
      this.set_visible(root.children, true);
    }
  };

  expand_to_depth = (target_depth: number, curr_nodes: any = this.mind.vm.rootNode!.children, curr_depth: number = 1) => {
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
    const root = this.mind.vm.rootNode;
    if (!!root) {
      const root_layout_data = root.layoutData;
      if (!root_layout_data) return;
      if (node.isRoot) {
        root_layout_data.rightNodes && (root_layout_data.rightNodeOuterHeight = this._layout_offset_subnodes_height(root_layout_data.rightNodes));
        root_layout_data.leftNodes && (root_layout_data.leftNodeOuterHeight = this._layout_offset_subnodes_height(root_layout_data.leftNodes));
      } else {
        if (node.direction === TSMindDirectionMap.right) {
          root_layout_data.rightNodes && (root_layout_data.rightNodeOuterHeight = this._layout_offset_subnodes_height(root_layout_data.rightNodes));
        } else {
          root_layout_data.leftNodes && (root_layout_data.leftNodeOuterHeight = this._layout_offset_subnodes_height(root_layout_data.leftNodes));
        }
      }
      this.bounds.s = Math.max(root_layout_data.leftNodeOuterHeight, root_layout_data.rightNodeOuterHeight);
    } else {
      this.mind.logger.warn("can not found root node");
    }
  };

  set_visible = (nodes: ITSMLayoutProvNode[], visible: boolean) => {
    let i = nodes.length;
    let node = null;
    // let layoutData: any;
    while (i--) {
      node = nodes[i];
      // layoutData = node.layoutData;
      if (node.expanded) {
        this.set_visible(node.children, visible);
      } else {
        this.set_visible(node.children, false);
      }
      if (!node.isRoot) {
        node.expanded = visible;
      }
    }
  };

  is_expand = (node: ITSMLayoutProvNode) => {
    return node.expanded;
  };

  is_visible = (node: ITSMLayoutProvNode) => {
    return !!node.expanded;
  };
}
