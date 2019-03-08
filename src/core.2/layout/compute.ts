import { VNode } from "core.2/vnode";
import { TSMindDirectionMap } from "core.2";

export function getInitBounds(): IMLayoutBounds {
  return { n: 0, s: 0, w: 0, e: 0 };
}

export function getLayoutOffset(rootNode: VNode, bounds: IMLayoutBounds): IMLayoutBounds {
  if (!rootNode) return bounds;
  const layoutData = rootNode.layoutData;
  if (!layoutData) return bounds;
  const children = rootNode.children;
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
  layoutData.leftNodeOuterHeight = _layout_offset_subnodes(leftNodes);
  layoutData.rightNodeOuterHeight = _layout_offset_subnodes(rightNodes);
  bounds.e = rootNode.width / 2;
  bounds.w = 0 - bounds.e;
  // mind.logger.debug(bounds.w);
  bounds.n = 0;
  bounds.s = Math.max(layoutData.leftNodeOuterHeight, layoutData.rightNodeOuterHeight);
  return bounds;
}

export function _layout_offset_subnodes(nodes: VNode[]) {
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

    node_outer_height = _layout_offset_subnodes(node.children);
    // if (!node.expanded) {
    // 	node_outer_height = 0;
    // 	this.set_visible(node.children, false);
    // }
    node_outer_height = Math.max(node.height, node_outer_height);

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
}
