export declare const __name__ = "TSMind";
export declare const __version__ = "0.5.0";
export declare const __authores__: string[];
export declare type ITSMMode = "full" | "side";
export declare type ITSMTheme = "primary" | "warning" | "danger" | "success" | "info" | "greensea" | "nephrite" | "belizehole" | "wisteria" | "asphalt" | "orange" | "pumpkin" | "pomegranate" | "clouds" | "asbestos";
export interface ITSMLayoutOpts {
    hspace?: number;
    vspace?: number;
    pspace?: number;
}
export interface ITSMOptions {
    container: string;
    editable?: boolean;
    theme?: ITSMTheme;
    mode?: ITSMMode;
    support_html?: boolean;
    view?: {
        hmargin?: number;
        vmargin?: number;
        line_width?: number;
        line_color?: string;
    };
    layout?: ITSMLayoutOpts;
    default_event_handle?: {
        enable_mousedown_handle: boolean;
        enable_click_handle: boolean;
        enable_dblclick_handle: boolean;
    };
    shortcut?: {
        enable: boolean;
        handles: ITSMShortcutProvOptsHandles;
        mapping: ITSMShortcutProvOptsMapping;
    };
}
export declare const DEFAULT_OPTIONS: {
    container: string;
    editable: boolean;
    theme: string;
    mode: string;
    support_html: boolean;
    view: {
        hmargin: number;
        vmargin: number;
        line_width: number;
        line_color: string;
    };
    layout: {
        hspace: number;
        vspace: number;
        pspace: number;
    };
    default_event_handle: {
        enable_mousedown_handle: boolean;
        enable_click_handle: boolean;
        enable_dblclick_handle: boolean;
    };
    shortcut: {
        enable: boolean;
        handles: {};
        mapping: {
            addchild: number;
            addbrother: number;
            editnode: number;
            delnode: number;
            toggle: number;
            left: number;
            up: number;
            right: number;
            down: number;
        };
    };
};
export declare const TSM_Node_Names: {
    nodes: string;
    node: string;
    fold: string;
};
