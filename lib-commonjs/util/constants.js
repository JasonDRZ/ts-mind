"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__name__ = "TSMind";
// library version
exports.__version__ = "0.5.0";
// authores
exports.__authores__ = ["1071115676@qq.com", "hizzgdev@163.com"];
exports.DEFAULT_OPTIONS = {
    container: "",
    editable: false,
    theme: "primary",
    mode: "full",
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
            addchild: 45,
            addbrother: 13,
            editnode: 113,
            delnode: 46,
            toggle: 32,
            left: 37,
            up: 38,
            right: 39,
            down: 40 // Down
        }
    }
};
// custom node names
exports.TSM_Node_Names = {
    nodes: "tsmnodes",
    node: "tsmnode",
    fold: "tsmfold"
};
