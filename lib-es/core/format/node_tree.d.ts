import { TSM_mind } from "../mind";
export declare const node_tree: {
    example: {
        meta: {
            name: string;
            author: string[];
            version: string;
        };
        format: string;
        data: ITSMNodeDataItem;
    };
    get_mind(source: any): TSM_mind;
    get_data(mind: TSM_mind): {
        meta: {
            name: any;
            author: any;
            version: any;
        };
        format: string;
        data: any;
    };
    _parse(mind: TSM_mind, node_root: any): void;
    _extract_data(node_json: JSON): {};
    _extract_subnode(mind: TSM_mind, node_parent: any, node_json: any): void;
    _buildnode(node: any): any;
};
