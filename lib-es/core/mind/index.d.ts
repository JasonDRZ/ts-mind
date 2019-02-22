import { TSM_node } from "../node";
declare type IJSMindNodeSelector = string | TSM_node;
export declare class TSM_mind {
    id: string;
    name: any;
    author: any;
    version: any;
    root: null | TSM_node;
    selected: null | TSM_node;
    nodes: {
        [k: string]: TSM_node;
    };
    get_node: (nodeid: string) => TSM_node | null;
    set_root: (nodeid: string, topic: any, data?: {} | undefined) => void;
    add_node: (parent_node: IJSMindNodeSelector, nodeid: string, topic: any, data?: {} | undefined, idx?: number, direction?: 0 | 1 | -1 | undefined, expanded?: boolean | undefined) => any;
    insert_node_before: (node_before: IJSMindNodeSelector, nodeid: string, topic: any, data?: object | undefined) => TSM_node | null;
    get_node_before: (node: IJSMindNodeSelector) => TSM_node | null;
    insert_node_after: (node_after: IJSMindNodeSelector, nodeid: string, topic: any, data: object) => TSM_node | null;
    get_node_after: (node: IJSMindNodeSelector) => TSM_node | null;
    move_node: (node: IJSMindNodeSelector, beforeid: string, parentid: string, direction: ITSMDirectionValue) => TSM_node | null;
    _flow_node_direction: (node: TSM_node, direction?: 0 | 1 | -1 | undefined) => void;
    _move_node_internal: (node: TSM_node, beforeid: string) => TSM_node;
    _move_node: (node: TSM_node, beforeid: string, parentid: string, direction: ITSMDirectionValue) => TSM_node;
    remove_node: (node: IJSMindNodeSelector) => boolean;
    _put_node: (node: TSM_node) => boolean;
    _reindex: (node: TSM_node) => void;
}
export {};
