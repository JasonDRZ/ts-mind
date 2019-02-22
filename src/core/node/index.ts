import { TSMindDirectionMap } from "..";
interface ITSMNodeDataView {
  element: null | HTMLElement;
  expander: null | HTMLElement;
  abs_x: number;
  abs_y: number;
  width: number;
  height: number;
  _saved_location: {
    x: number;
    y: number;
  };
}
interface ITSMNodeDataLayout {
  direction: ITSMDirectionValue;
  side_index: number;
  offset_x: number;
  offset_y: number;
  outer_height: number;
  left_nodes: TSM_node[];
  right_nodes: TSM_node[];
  outer_height_left: number;
  outer_height_right: number;
  visible: boolean;
  _offset_: {
    x: number;
    y: number;
  };
}
export class TSM_node {
  public id = "";
  public index = 0;
  public topic = "";
  public data: { [k: string]: any } = {};
  public isroot = true;
  public parent: TSM_node;
  public direction = TSMindDirectionMap.left;
  public expanded = true;
  public children: TSM_node[] = [];
  public expands: { [k: string]: any } = {};
  public width: number = 0;
  public height: number = 0;
  public view_data: ITSMNodeDataView = {
    element: null,
    expander: null,
    abs_x: 0,
    abs_y: 0,
    width: 0,
    height: 0,
    _saved_location: {
      x: 0,
      y: 0
    }
  };
  public layout_data: ITSMNodeDataLayout = {
    direction: TSMindDirectionMap.right,
    side_index: 0,
    offset_x: 0,
    offset_y: 0,
    outer_height: 0,
    left_nodes: [],
    right_nodes: [],
    outer_height_left: 0,
    outer_height_right: 0,
    visible: true,
    _offset_: {
      x: 0,
      y: 0
    }
  };
  constructor(
    sId: string,
    iIndex: number,
    sTopic: any,
    oData: object = {},
    bIsRoot: boolean,
    oParent?: any,
    eDirection: ITSMDirectionValue = TSMindDirectionMap.right,
    bExpanded: boolean = true
  ) {
    this.id = sId;
    this.index = iIndex;
    this.topic = sTopic;
    this.data = oData;
    this.isroot = bIsRoot;
    this.parent = oParent;
    this.direction = eDirection;
    this.expanded = bExpanded;
  }
  static inherited(pnode: any, node: any) {
    if (!!pnode && !!node) {
      if (pnode.id === node.id) {
        return true;
      }
      if (pnode.isroot) {
        return true;
      }
      const pid = pnode.id;
      let p = node;
      while (!p.isroot) {
        p = p.parent;
        if (p.id === pid) {
          return true;
        }
      }
    }
    return false;
  }
  static compare(node1: any, node2: any) {
    // '-1' is alwary the last
    let r = 0;
    const i1 = node1.index;
    const i2 = node2.index;
    if (i1 >= 0 && i2 >= 0) {
      r = i1 - i2;
    } else if (i1 === -1 && i2 === -1) {
      r = 0;
    } else if (i1 === -1) {
      r = 1;
    } else if (i2 === -1) {
      r = -1;
    } else {
      r = 0;
    }
    // logger.debug(i1+' <> '+i2+'  =  '+r);
    return r;
  }
  get_location = () => {
    const vd = this.view_data;
    return {
      x: vd.abs_x || 0,
      y: vd.abs_y || 0
    };
  };
  get_size = () => {
    const vd = this.view_data;
    return {
      w: vd.width || 0,
      h: vd.height || 0
    };
  };
}
