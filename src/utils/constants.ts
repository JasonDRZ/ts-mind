export const __name__ = "TSMind";
// library version
export const __version__ = "0.5.0";
// authores
export const __authores__ = ["1071115676@qq.com", "hizzgdev@163.com"];

export type IMMode = "full" | "side";
export type IMTheme = string;

// default configuration
export interface IMOptions {
	container: string; // id of the container
	editable?: boolean; // you can change it in your options
	theme?: IMTheme;
	mode?: IMMode; // full or side
	support_html?: boolean;
	debug?: boolean;
	view?: IMOptView;
	layout?: IMOptLayout;
	default_event_handle?: IMOptDefEvHanle;
	shortcut?: IMOptShortcut;
}
export interface IMOptionsDef {
	container: string; // id of the container
	editable: boolean; // you can change it in your options
	theme: IMTheme;
	mode: IMMode; // full or side
	support_html: boolean;
	debug: boolean;
	view: IMOptViewDef;
	layout: IMOptLayoutDef;
	default_event_handle: IMOptDefEvHanleDef;
	shortcut: IMOptShortcutDef;
}

export const DEFAULT_OPTIONS: IMOptionsDef = {
	container: "", // id of the container
	editable: false, // you can change it in your options
	theme: "primary",
	mode: "full", // full or side
	support_html: true,
	debug: false,
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
