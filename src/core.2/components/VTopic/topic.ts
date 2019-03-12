import { TSMindDirectionMap } from "../..";
import { VMind } from "core.2/components/VMind";
import { VTopicView } from "./view";
import { VTopicLifecircle } from "./lifecircle";

export interface IMVTopicProps {
  id: string;
  topic: IMVTopicTopic;
  parentId?: string;
  rootId?: string;
  // 仅在运行时创建此字段
  branchId?: string;
  index?: number;
  isRoot?: boolean;
  direction?: IMDirectionValue;
  expanded?: boolean;
}

export class VTopic extends VTopicLifecircle {
  /**
   * VTopic attrbutes
   */
  // unique node identifier
  public readonly id: string;
  // current node's data
  public readonly data: IMVTopicPrivateData;
  // // weather the current node is root node
  // public readonly isRoot: boolean;
  // // weather this parent is root node
  // public readonly isSubRoot: boolean;
  // // layout index, 0 is first index, -1 is the last index.
  // public index: number;
  // // node topic,could be any thing
  // public topic: IMVTopicTopic;
  // // current node's visible flag
  // public expanded: boolean;
  // // current node's direction
  // public direction: IMDirectionValue;
  // /** got connection with parent nodes */
  // // current node's parent node,root node's parent node is itself;
  // public parentId: string;
  // // connected with root node,root node's root node is itself;
  // public rootId: string;
  // // connected with main branch node
  // public branchId?: string;
  public options: IMVTopicOptions;

  // current node's children nodes
  public readonly children: VTopic[] = [];
  public readonly view: VTopicView;
  // /**
  //  * options
  //  */
  // public options: {
  //   // node color, can be inherited.
  //   color: "black";
  //   nodeStyle: {};
  //   stateClassNames: {
  //     default: "";
  //     selected: "";
  //     disabled: "";
  //   };
  // };

  // selected flag
  public _selected: boolean = false;
  constructor(
    {
      // required fields
      id,
      topic,
      // optional fields,-1 means add the VTopic to a place that is after some last child-VTopic.
      parentId,
      rootId,
      branchId,
      index = -1,
      isRoot = false,
      direction = TSMindDirectionMap.right,
      expanded = true
    }: IMVTopicProps,
    vm: VMind
  ) {
    super(vm);
    if (!id || !topic || !vm || !vm.mind) {
      throw Error(
        `The params (id,topic,vm[instance of VMind],mind[instance of TSMind]) are all required,when create an VTopic!In order to reduce the loss of VTopic-searching performance.`
      );
    }
    // mind vm
    this.vm = vm;
    // config
    this.id = id;
    this.state.expanded = expanded;
    this.options = {
      id,
      topic,
      index,
      direction,
      isRoot,
      isBranch: (!!parentId && vm.getNodeById(parentId)!.options.isRoot) || false,
      parentId: parentId || this.id,
      rootId: rootId || this.id,
      branchId
    };
    this.view = new VTopicView(this);
    this.$created();
  }
  public getTopicData(): IMVTopicExportData {
    const _opt = { ...this.options };
    delete _opt.branchId;
    delete _opt.isBranch;
    delete _opt.rootId;
    return {
      ..._opt,
      expanded: this.state.expanded,
      data: this.data
    };
  }
  // add new child node
  public addChild = (node: VTopic) => {
    this.$beforeUpdate();
    node.options.direction = this.options.direction;
    node.options.parentId = this.id;
    // this value [-1] can just show once,then
    if (node.options.index !== -1) {
      this.children.splice(node.options.index, 0, node);
    } else {
      this.children.push(node);
    }
    // update children index, after pushed or inserted.
    this.updateChildrenIndex();
    // mount node element.
    node.view.mount();
    this.$updated();
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
  // get insert index
  // public get
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
      child.options.index = idx;
    });
  };
  // can expand all child and itself
  public readonly toggleExpand = (toggleAll: boolean = false, expand = !this.state.expanded) => {
    this.state.expanded = expand;
    // internal expand children nodes
    if (toggleAll && this.children.length > 0) {
      this.children.map(child => child.toggleExpand(toggleAll, expand));
    }
    this.$expandChange();
  };
  public readonly toggleSelect = () => {
    this.state.selected = !this.state.selected;
    this.$selectChange();
  };
}

// tool methods
export function _vtopic(parent: VTopic) {
  return {
    // To determine this node weather belongs to some parent node;
    hasChild(child: VTopic): boolean {
      if (!(child instanceof VTopic)) {
        throw Error(`The target child should be an instance of VTopic!`);
      }
      if (parent.id === child.id) return true;
      if (parent.options.isRoot) return true;
      const pid = parent.id;
      let p = child;
      // keep searching,util meet the root node.
      while (!p.options.isRoot) {
        const _p = child.vm.getNodeById(p.options.parentId);
        if (!p) continue;
        p = _p as VTopic;
        if (p.id === pid) {
          return true;
        }
      }
      return false;
    },
    // find some node from a declared parent node
    findChild(id: string): null | VTopic {
      for (const child of parent.children) {
        if (child.id === id) return child;
        else if (child.children.length > 0) {
          const _fd = _vtopic(child).findChild(id);
          if (_fd) return _fd;
        }
      }
      return null;
    }
  };
}

export default VTopic;
