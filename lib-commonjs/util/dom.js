"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dom = {
    // target,eventType,handler
    add_event: function (target, event, call) {
        target.addEventListener(event, call, false);
    },
    css: function (cstyle, property_name) {
        return cstyle.getPropertyValue(property_name);
    },
    is_visible: function (cstyle) {
        var visibility = exports.dom.css(cstyle, "visibility");
        var display = exports.dom.css(cstyle, "display");
        exports.dom.css(cstyle, "backface-visibility");
        return visibility !== "hidden" && display !== "none";
    }
};
