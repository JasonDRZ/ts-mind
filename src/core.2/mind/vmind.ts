import VNode, { IMVnodeProps } from "core.2/node/vnode";
import TSMind, { TSMindDirectionMap } from "core.2";

// just can be node-id or mind-node
type IMNode = string | VNode;

// compute next insert node direction，base on root node;
function computeRootChildDirection(children: VNode[]): IMDirectionValue {
  let _f = 0;
  children.map(child => {
    if (child.direction === TSMindDirectionMap.left) {
      _f--;
    } else _f++;
  });
  return _f > 0 ? TSMindDirectionMap.left : TSMindDirectionMap.right;
}

function _getNodeById(vm: VMind, id: string) {
  return vm.nodesMap[id];
}

function _queryNode(vm: VMind, node: IMNode) {
  return typeof node === "string" ? _getNodeById(vm, node) : node;
}

export const VMindAddr = "vn";
export const VMindEleType = "tsm-mind";
export class VMind {
  public mind: TSMind;
  public meta: IMSourceMeta;
  // support multiple roots,each other root could be other node's child node.
  public rootNodes: VNode[] = [];
  // manage all selected nodes
  public selectedNodes: VNode[] = [];
  // all registered nodes map,key is node's id;
  public nodesMap: { [k: string]: VNode } = {};
  constructor(mind: TSMind) {
    this.mind = mind;
  }
  private _createNode = (data: IMVnodeProps) => {
    return new VNode(data, this);
  };
  // get VNode item by id;
  public getNodeById = (id: string) => {
    return _getNodeById(this, id);
  };

  // add a child topic node
  public addNode = (
    nodeData: IMVmindAddNodeData,
    // if no parent node,that means this node is a root node;
    parent?: IMNode
  ): boolean => {
    if (nodeData.id in this.nodesMap) {
      this.mind.logger.warn(`The node[id:${nodeData.id}] already exist!`);
      return false;
    }
    let node;
    if (!parent) {
      // add root node
      node = this._createNode(nodeData);
      this.rootNodes.push(node);
    } else {
      // add child node
      parent = _queryNode(this, parent);
      const direction = parent.isRoot ? computeRootChildDirection(parent.children) : parent.direction;
      // create current node instance
      node = this._createNode({ ...nodeData, direction, parentId: parent.id, rootId: parent.rootId, branchId: parent.branchId });
      // add node to its parent
      parent.addChild(node);
    }
    // add node to global nodesMap
    this.nodesMap[node.id] = node;
    return true;
  };
  // insert sibling node on one [top-bottom] side of sibling node
  public insertNode = (node: IMNode, nodeData: IMVmindAddNodeData, insertType: "before" | "after" | "child" = "after") => {
    node = _queryNode(this, node);
    const parent = _queryNode(this, node.parentId);
    if (!node) {
      this.mind.logger.error(`The InsertNode's target node can not be found!`);
      return false;
    }
    if (!parent) {
      this.mind.logger.error(`The InsertNode target must be a child node!`);
      return false;
    }
    // insert sibling node
    const direction = parent.direction;
    // create current node instance
    if (insertType === "child") {
      this.addNode(nodeData);
    } else {
      const newNode = this._createNode({ ...nodeData, direction });
      // add node to its parent
      parent.addChild(newNode);
    }
    return true;
  };

  public getNodeBefore = (node: IMNode): null | VNode => {
    node = _queryNode(this, node);
    if (!node || node.isRoot) {
      return null;
    }
    return node.parent.children[node.index - 1] || null;
  };

  public getNodeAfter = (node: IMNode): null | VNode => {
    node = _queryNode(this, node);
    if (!node || node.isRoot) {
      return null;
    }
    return node.parent.children[node.index + 1] || null;
  };

  public moveNode = (node: IMNode, { parentId, siblingId, direction, insertBefore = false }: IMVmindMoveNodeData) => {
    // get nodes
    node = _queryNode(this, node);
    const parent = this.getNodeById(parentId);
    const sibling = this.getNodeById(siblingId);
    // egnore no parent change
    if (parent.id === node.parent.id) return node;
    // change direction
    node.direction = direction || parent.direction;
    this._internal_change_children_dir(node);
    // remove current node from old parent
    node.parent.removeChild(node.id);
    // insert child
    return parent.addChild(node, sibling.index, insertBefore);
  };

  // Change all children node direction to current base node's direction in internal way.
  private _internal_change_children_dir = (node: VNode, direction?: IMDirectionValue) => {
    node.children.forEach(child => {
      child.direction = direction || node.direction;
      if (child.children.length > 0) this._internal_change_children_dir(child);
    });
  };
  public removeNode = (node: IMNode) => {
    const _logger_act = `RemoveNode`;
    node = _queryNode(this, node);
    if (!node) {
      this.mind.logger.error(_logger_act, `The node can not be found!`);
      return false;
    }
    if (node.isRoot) {
      this.mind.logger.error(_logger_act, `Root node can not be removed!`);
      return false;
    }
    // internal remove all child nodes from copy array
    [...node.children].map(this.removeNode);
    // remove it from its parent node
    node.parent.removeChild(node.id);
    // remove node from global nodes store
    delete this.nodesMap[node.id];
    // destory the node instance
    node.$destroy();
    // clear cache
    node = null as any;
    return true;
  };
  // support multiple selection
  public selectNode = (node: IMNode) => {
    node = _queryNode(this, node);
    if (!node) {
      this.mind.logger.error("SelectNode", `The node can not be found!`);
      return false;
    }
    this.selectedNodes.push(node);
    node.$select();
    return true;
  };
  public deselectNode = (node: IMNode) => {
    node = _queryNode(this, node);
    if (!node) {
      this.mind.logger.error("DeselectNode", `The node can not be found!`);
      return false;
    }
    const _id = node.id;
    const _tar = this.selectedNodes.splice(this.selectedNodes.findIndex(_nd => _nd.id === _id), 1);
    node.$deselect();
    return !!_tar[0];
  };
}
