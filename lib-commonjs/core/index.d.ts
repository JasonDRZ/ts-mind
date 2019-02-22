import { ITSMOptions, ITSMTheme } from "../util/constants";
import { data_provider } from "./provider/data";
import layout_provider from "./provider/layout";
import view_provider from "./provider/view";
import shortcut_provider from "./provider/shortcut";
import { globalUse } from "./pugin";
import { TSM_mind } from "./mind";
import { TSM_node } from "./node";
export declare type ITSMClassPlug = new (tsm: TSMind, opts: ITSMOptions) => any;
export declare type ITSMPlugin = ITSMAnyCall<[TSMind, ITSMOptions], void> | ITSMClassPlug;
export declare const use: typeof globalUse;
export declare const TSMindDirectionMap: {
    [k: string]: ITSMDirectionValue;
};
export declare const TSMindEventTypeMap: {
    [k: string]: ITSMEventTypeValue;
};
export declare class TSMind {
    options: ITSMOptions;
    mind: ITSMUnionNull<TSM_mind>;
    initialized: boolean;
    event_handles: ITSMAnyCall[];
    static version: string;
    static direction: {
        [k: string]: ITSMDirectionValue;
    };
    static event_type: {
        [k: string]: ITSMEventTypeValue;
    };
    data_provider: data_provider;
    layout_provider: layout_provider;
    view_provider: view_provider;
    shortcut_provider: shortcut_provider;
    private _plugins;
    plugins: object;
    constructor(options: ITSMOptions);
    /**
     * register private plugin
     * @param plugin: ITSMPlugin
     */
    use: (pname: string, plugin: ITSMPlugin) => void;
    init_plugins: (tsm: TSMind, opts?: any) => void;
    enable_edit: () => boolean;
    disable_edit: () => boolean;
    enable_event_handle: (event_handle: string) => void;
    disable_event_handle: (event_handle: string) => void;
    get_editable: () => boolean | undefined;
    set_theme: (theme: ITSMTheme) => void;
    _event_bind: () => void;
    mousedown_handle: (e?: Event) => void;
    click_handle: (e?: Event) => void;
    dblclick_handle: (e?: Event) => void;
    begin_edit: (node: any) => any;
    end_edit: () => void;
    toggle_node: (node: any) => any;
    expand_node: (node: any) => any;
    collapse_node: (node: any) => any;
    expand_all: () => void;
    collapse_all: () => void;
    expand_to_depth: (depth: number) => void;
    private _reset;
    private _show;
    show: (mind: any) => void;
    get_meta: () => {
        name: any;
        author: any;
        version: any;
    };
    get_data: (data_format?: ITSMDataFormat) => {
        meta: {
            name: any;
            author: any;
            version: any;
        };
        format: string;
        data: any;
    } | null;
    get_root: () => TSM_node | null;
    get_node: (nodeid: string) => TSM_node | null;
    add_node: (parent_node: TSM_node, nodeid: string, topic?: any, data?: any) => any;
    insert_node_before: (node_before: any, nodeid: string, topic: any, data: any) => TSM_node | null;
    insert_node_after: (node_after: any, nodeid: string, topic: any, data?: any) => TSM_node | null;
    remove_node: (node: any) => boolean;
    update_node: (nodeid: string, topic: any) => void;
    move_node: (nodeid: string, beforeid: string, parentid: string, direction: ITSMDirectionValue) => void;
    select_node: (node: any) => any;
    get_selected_node: () => TSM_node | null;
    select_clear: () => void;
    is_node_visible: (node: any) => boolean;
    find_node_before: (node: any) => ITSMNodeDataItem | null;
    find_node_after: (node: any) => any;
    set_node_color: (nodeid: string, bgcolor: string, fgcolor: string) => boolean;
    set_node_font_style: (nodeid: string, size: number, weight: number, style: string) => boolean;
    set_node_background_image: (nodeid: string, image: string, width: number, height: number, rotation: string) => boolean;
    set_node_background_rotation: (nodeid: string, rotation: string) => boolean;
    resize: () => void;
    add_event_listener: (callback?: ITSMAnyCall<[ITSMEventTypeValue, any], any>) => void;
    invoke_event_handle: (type: ITSMEventTypeValue, data: any) => void;
    private _invoke_event_handle;
}
export default TSMind;
