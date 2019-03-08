import { TSMindDirectionMap } from "..";
import { VNodeView } from "./view";
import { VMind } from "core.2/mind/vmind";
import { BSVNodeLifeCircle } from "../lifeCircle";

export interface IMVnodeProps {
  id: string;
  topic: IMVnodeTopic;
  parentId?: string;
  rootId?: string;
  branchId?: string;
  index?: number;
  data?: IMVnodeTopicData;
  isRoot?: boolean;
  direction?: IMDirectionValue;
  expanded?: boolean;
}

export const VNodeAddr = "vn";
export const VNodeEleType = "tsm-node";

export class VNode extends BSVNodeLifeCircle {
  /**
   * VNode attrbutes
   */
  // unique node identifier
  public readonly id: string;
  // current node's data
  public readonly data: IMVnodeTopicData;
  // weather the current node is root node
  public readonly isRoot: boolean;
  // weather this parent is root node
  public readonly isSubRoot: boolean;
  // layout index
  public index: number;
  // node topic,could be any thing
  public topic: IMVnodeTopic;
  // current node's visible flag
  public expanded: boolean;
  // current node's direction
  public direction: IMDirectionValue;
  /** got connection with parent nodes */
  // current node's parent node,root node's parent node is itself;
  public parentId: string;
  // connected with root node,root node's root node is itself;
  public rootId: string;
  // connected with main branch node
  public branchId?: string;

  // current node's children nodes
  public readonly children: VNode[] = [];
  /**
   * options
   */
  public options: {
    // node color, can be inherited.
    color: "black";
    nodeStyle: {};
    stateClassNames: {
      default: "";
      selected: "";
      disabled: "";
    };
  };

  // node view provider
  public view: VNodeView;
  // selected flag
  public _selected: boolean = false;
  constructor(
    {
      // required fields
      id,
      topic,
      parentId,
      rootId,
      branchId,
      // optional fields
      index = -1,
      data = {},
      isRoot = false,
      direction = TSMindDirectionMap.right,
      expanded = true
    }: IMVnodeProps,
    vm: VMind
  ) {
    super(vm);
    vm.mind.$trigger<VNode>("beforeCreate.node", this);
    if (!id || !topic || !vm || !vm.mind) {
      throw Error(
        `The params (id,topic,vm[instance of VMind],mind[instance of TSMind]) are all required,when create an VNode!In order to reduce the loss of vnode-searching performance.`
      );
    }
    // mind vm
    this.vm = vm;
    // config
    this.id = id;
    this.topic = topic;
    this.branchId = branchId;
    this.rootId = rootId || this.id;
    this.parentId = parentId || this.id;
    this.index = index;
    this.data = data;
    this.isRoot = isRoot;
    this.isSubRoot = !!parentId && vm.getNodeById(parentId).isRoot;
    this.direction = direction;
    this.expanded = expanded;
    this.view = new VNodeView(this);
    vm.mind.$trigger<VNode>("created.node", this);
  }
  // add new child node
  public addChild = (node: VNode, insertIndex?: number, insertBefore: boolean = false) => {
    this.vm.mind.$trigger<VNode>("beforeUpdate.node", this);
    node.direction = this.direction;
    node.parentId = this.id;
    if (typeof insertIndex === "number") {
      insertIndex = insertBefore ? insertIndex : insertIndex + 1;
      this.children.splice(insertIndex, 0, node);
    } else {
      this.children.push(node);
    }
    this.vm.mind.$trigger<VNode>("updated.node", this);
    // update children index, after pushed or inserted.
    this.updateChildrenIndex();
    node.view.mount();
    return node;
  };
  // get all child node as an Array
  public getChildren = () => {
    return this.children;
  };
  // find a child by id
  public getChild = (id: string) => {
    return this.children.find(child => child.id === id);
  };
  // get child index by id
  public getChildIndex = (id: string) => {
    return this.children.findIndex(child => child.id === id);
  };
  // remove some child node
  public removeChild = (id: string) => {
    this.$beforeUpdate();
    const _fl = !!this.children.splice(this.getChildIndex(id), 1)[0];
    if (_fl) this.updateChildrenIndex();
    this.$updated();
    return _fl;
  };
  // update children index,for layout
  public updateChildrenIndex = () => {
    this.children.map((child, idx) => {
      child.index = idx;
    });
  };
  // can expand all child and itself
  public readonly $expand = (expandAll: boolean = false) => {
    this.expanded = !this.expanded;
    // internal expand children nodes
    if (expandAll && this.children.length > 0) {
      this.children.map(child => child.$expand(true));
    }
    this.vm.mind.$trigger("expand.node", this);
    return this.expanded;
  };
  public readonly $select = () => {
    this._selected = true;
    this.vm.mind.$trigger("select.node", this);
  };
  public readonly $deselect = () => {
    this._selected = false;
    this.vm.mind.$trigger("deselect.node", this);
  };
}

// tool methods
export function vnode(parent: VNode) {
  return {
    // To determine this node weather belongs to some parent node;
    hasChild(child: VNode): boolean {
      if (!(child instanceof VNode)) {
        throw Error(`The target child should be an instance of VNode!`);
      }
      if (parent.id === child.id) return true;
      if (parent.isRoot) return true;
      const pid = parent.id;
      let p = child;
      // keep searching,util meet the root node.
      while (!p.isRoot) {
        p = child.vm.getNodeById(p.parentId);
        if (p.id === pid) {
          return true;
        }
      }
      return false;
    },
    // find some node from a declared parent node
    findChild(id: string): null | VNode {
      for (const child of parent.children) {
        if (child.id === id) return child;
        else if (child.children.length > 0) {
          const _fd = vnode(child).findChild(id);
          if (_fd) return _fd;
        }
      }
      return null;
    }
  };
}

export default VNode;
