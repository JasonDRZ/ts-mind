import TSMind from "..";
import { TSM_node } from "../node";
export default class layout_provider {
    private opts;
    private tsm;
    private isside;
    bounds: {
        n: number;
        s: number;
        w: number;
        e: number;
    };
    private cache_valid;
    constructor(tsm: TSMind, options: {
        [k: string]: any;
    });
    reset: () => void;
    layout: () => void;
    layout_direction: () => void;
    _layout_direction_root: () => void;
    _layout_direction_side: (node: TSM_node, direction: ITSMDirectionValue, side_index: number) => void;
    layout_offset: () => void;
    _layout_offset_subnodes: (nodes: TSM_node[]) => number;
    _layout_offset_subnodes_height: (nodes: TSM_node[]) => number;
    get_node_offset: (node: TSM_node) => {
        x: number;
        y: number;
    };
    get_node_point: (node: TSM_node) => {
        x: number;
        y: number;
    };
    get_node_point_in: (node: TSM_node) => {
        x: number;
        y: number;
    };
    get_node_point_out: (node: TSM_node) => {
        x: number;
        y: number;
    };
    get_expander_point: (node: TSM_node) => {
        x: number;
        y: number;
    };
    get_min_size: () => {
        w: number;
        h: number;
    } | undefined;
    toggle_node: (node: TSM_node) => void;
    expand_node: (node: TSM_node) => void;
    collapse_node: (node: TSM_node) => void;
    expand_all: () => void;
    collapse_all: () => void;
    expand_to_depth: (target_depth: number, curr_nodes?: any, curr_depth?: number) => void;
    part_layout: (node: TSM_node) => void;
    set_visible: (nodes: TSM_node[], visible: boolean) => void;
    is_expand: (node: TSM_node) => boolean;
    is_visible: (node: TSM_node) => boolean;
}
