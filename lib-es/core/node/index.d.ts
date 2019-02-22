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
export declare class TSM_node {
    id: string;
    index: number;
    topic: string;
    data: {
        [k: string]: any;
    };
    isroot: boolean;
    parent: TSM_node;
    direction: ITSMDirectionValue;
    expanded: boolean;
    children: TSM_node[];
    expands: {
        [k: string]: any;
    };
    width: number;
    height: number;
    view_data: ITSMNodeDataView;
    layout_data: ITSMNodeDataLayout;
    constructor(sId: string, iIndex: number, sTopic: any, oData: object | undefined, bIsRoot: boolean, oParent?: any, eDirection?: ITSMDirectionValue, bExpanded?: boolean);
    static inherited(pnode: any, node: any): boolean;
    static compare(node1: any, node2: any): number;
    get_location: () => {
        x: number;
        y: number;
    };
    get_size: () => {
        w: number;
        h: number;
    };
}
export {};
