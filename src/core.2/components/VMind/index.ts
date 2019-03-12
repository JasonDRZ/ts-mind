import { VTopic, IMVTopicProps } from "core.2/components/VTopic";
import TSMind, { TSMindDirectionMap } from "core.2";
import { Logger } from "utils/tools";

// just can be node-id or mind-node
type IMNode = undefined | string | VTopic;

// compute next insert node direction，base on root node;
function computeRootChildDirection(children: VTopic[]): IMDirectionValue {
  let _f = 0;
  children.map(child => {
    if (child.direction === TSMindDirectionMap.left) {
      _f--;
    } else _f++;
  });
  return _f > 0 ? TSMindDirectionMap.left : TSMindDirectionMap.right;
}

function _queryNode(vm: VMind, node: IMNode) {
  return typeof node === "string" ? vm.getNodeById(node) : node;
}

export class VMind {
  public mind: TSMind;
  public meta: IMSourceMeta;
  // mind private partners
  public logger = new Logger(this.mind.options.debug);

  /**
   * private properties
   */
  // support multiple roots,each other root could be other node's child node.
  private rootTopic: VTopic;
  // manage all selected nodes
  private selectedTopicMap: Map<string, VTopic> = new Map();
  // all registered nodes map,key is node's id;
  private topicMap: Map<string, VTopic> = new Map();

  constructor(mind: TSMind) {
    this.mind = mind;
  }
  private _createNode = (data: IMVTopicProps) => {
    return new VTopic(data, this);
  };
  // get VTopic item by id;
  public getNodeById = (id: string) => {
    return this.topicMap.get(id);
  };

  // add a child topic node
  public addTopic = (
    topicData: IMVTopicProps,
    // if no parent node,that means this node is a root node;
    parent?: IMNode
  ): boolean => {
    if (topicData.id in this.topicMap) {
      this.logger.warn(`The node[id:${topicData.id}] already exist!`);
      return false;
    }
    let node;
    if (!parent) {
      // add root node
      node = this._createNode(topicData);
      this.rootTopic = node;
    } else {
      parent = _queryNode(this, parent);
      if (!parent) return false;
      // add child node
      const direction = parent.isRoot ? computeRootChildDirection(parent.children) : parent.direction;
      // create current node instance
      node = this._createNode({ ...topicData, direction, parentId: parent.id, rootId: parent.rootId, branchId: parent.branchId });
      // add node to its parent
      parent.addChild(node);
    }
    // add node to global topicMap
    this.topicMap[node.id] = node;
    return true;
  };
  // insert sibling node on one [top-bottom] side of sibling node
  // public insertNode = (node: IMNode, topicData: IMTopicData, insertType: "before" | "after" | "child" = "after") => {
  //   node = _queryNode(this, node);
  //   const parent = _queryNode(this, node.parentId);
  //   if (!node) {
  //     this.logger.error(`The InsertNode's target node can not be found!`);
  //     return false;
  //   }
  //   if (!parent) {
  //     this.logger.error(`The InsertNode target must be a child node!`);
  //     return false;
  //   }
  //   // insert sibling node
  //   const direction = parent.direction;
  //   // create current node instance
  //   if (insertType === "child") {
  //     this.addTopic(topicData);
  //   } else {
  //     const newNode = this._createNode({ ...topicData, direction });
  //     // add node to its parent
  //     parent.addChild(newNode);
  //   }
  //   return true;
  // };

  // public getNodeBefore = (node: IMNode): null | VTopic => {
  //   node = _queryNode(this, node);
  //   if (!node || node.isRoot) {
  //     return null;
  //   }
  //   return node.parent.children[node.index - 1] || null;
  // };

  // public getNodeAfter = (node: IMNode): null | VTopic => {
  //   node = _queryNode(this, node);
  //   if (!node || node.isRoot) {
  //     return null;
  //   }
  //   return node.parent.children[node.index + 1] || null;
  // };

  public moveNode = (targetNode: IMNode, { toParentId, toIndex }: IMVmindMoveNodeToTargetData) => {
    // get nodes
    targetNode = _queryNode(this, targetNode);
    if (!targetNode) return false;
    const fromParent = this.getNodeById(targetNode.parentId);
    const toParent = this.getNodeById(toParentId);

    // egnore no parent change
    if (fromParent.id === toParent.id) return false;
    this._internal_inherit_children(targetNode, toParent);
    // remove current node from old parent
    targetNode.parent.removeChild(targetNode.id);
    // insert child
    return true;
  };

  // Change all children node direction to current base node's direction in internal way.
  private _internal_inherit_children = (node: VTopic, newParent: VTopic) => {
    node.options = newParent.options;
    node.children.forEach(child => {
      child.direction = node.direction;
      if (child.children.length > 0) this._internal_change_children_dir(child);
    });
  };
  public removeNode = (node: IMNode) => {
    const _logger_act = `RemoveNode`;
    node = _queryNode(this, node);
    if (!node) {
      this.logger.error(_logger_act, `The node can not be found!`);
      return false;
    }
    if (node.isRoot) {
      this.logger.error(_logger_act, `Root node can not be removed!`);
      return false;
    }
    // internal remove all child nodes from copy array
    [...node.children].map(this.removeNode);
    const parent = _queryNode(this, node.parentId);
    // remove it from its parent node
    parent!.removeChild(node.id);
    // remove node from global nodes store
    delete this.topicMap[node.id];
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
      this.logger.error("SelectNode", `The node can not be found!`);
      return false;
    }
    this.selectedTopicMap.set(node.id, node);
    node.toggleSelect();
    return true;
  };
  public deselectNode = (node: IMNode) => {
    node = _queryNode(this, node);
    if (!node) {
      this.logger.error("DeselectNode", `The node can not be found!`);
      return false;
    }
    const _id = node.id;
    const _tar = this.selectedNodes.splice(this.selectedNodes.findIndex(_nd => _nd.id === _id), 1);
    node.$deselect();
    return !!_tar[0];
  };
}
