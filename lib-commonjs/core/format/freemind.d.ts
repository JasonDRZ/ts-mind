import { TSM_mind } from "../mind";
import { TSM_node } from "../node";
export declare const freemind: {
    example: ITSMSourceData<string>;
    get_mind(source: ITSMSourceData<string>): TSM_mind;
    get_data(mind: TSM_mind): ITSMSourceData<string>;
    _parse_xml(xml: string): any;
    _find_root(xml_doc: Document): any;
    _load_node(mind: TSM_mind, parent_id: string | null, xml_node: Element): void;
    _load_attributes(xml_node: Element): {
        [k: string]: string;
    };
    _buildmap(node: TSM_node | null, xmllines: string[]): void;
};
