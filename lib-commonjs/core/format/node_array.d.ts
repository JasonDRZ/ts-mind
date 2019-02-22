import { TSM_mind } from "../mind";
import { TSM_node } from "../node";
export declare const node_array: {
    example: {
        meta: {
            name: string;
            author: string[];
            version: string;
        };
        format: string;
        data: ITSMNodeDataItem[];
    };
    get_mind(source: any): TSM_mind;
    get_data(mind: TSM_mind): {
        meta: {
            name: any;
            author: any;
            version: any;
        };
        format: string;
        data: any[];
    };
    _parse(mind: TSM_mind, nodes: any): void;
    _extract_root(mind: TSM_mind, nodes: any): any;
    _extract_subnode(mind: TSM_mind, parentid: string, nodes: any): number;
    _extract_data(node_json: any): {};
    _array(mind: TSM_mind, nodes: any): void;
    _array_node(node: TSM_node, nodes: any): void;
};
