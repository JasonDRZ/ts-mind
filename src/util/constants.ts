export const __name__ = "TSMind";
// library version
export const __version__ = "0.5.0";
// authores
export const __authores__ = ["1071115676@qq.com", "hizzgdev@163.com"];

export type ITSMMode = "full" | "side";
export type ITSMTheme =
  | "primary"
  | "warning"
  | "danger"
  | "success"
  | "info"
  | "greensea"
  | "nephrite"
  | "belizehole"
  | "wisteria"
  | "asphalt"
  | "orange"
  | "pumpkin"
  | "pomegranate"
  | "clouds"
  | "asbestos";
export interface ITSMLayoutOpts {
  hspace?: number;
  vspace?: number;
  pspace?: number;
}
// default configuration
export interface ITSMOptions {
  container: string; // id of the container
  editable?: boolean; // you can change it in your options
  theme?: ITSMTheme;
  mode?: ITSMMode; // full or side
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
export const DEFAULT_OPTIONS = {
  container: "", // id of the container
  editable: false, // you can change it in your options
  theme: "primary",
  mode: "full", // full or side
  support_html: true,
  view: {
    hmargin: 100,
    vmargin: 50,
    line_width: 2,
    line_color: "#555"
  },
  layout: {
    hspace: 30,
    vspace: 20,
    pspace: 13
  },
  default_event_handle: {
    enable_mousedown_handle: true,
    enable_click_handle: true,
    enable_dblclick_handle: true
  },
  shortcut: {
    enable: true,
    handles: {},
    mapping: {
      addchild: 45, // Insert
      addbrother: 13, // Enter
      editnode: 113, // F2
      delnode: 46, // Delete
      toggle: 32, // Space
      left: 37, // Left
      up: 38, // Up
      right: 39, // Right
      down: 40 // Down
    }
  }
};

// custom node names
export const TSM_Node_Names = {
  nodes: "tsmnodes",
  node: "tsmnode",
  fold: "tsmfold"
};
