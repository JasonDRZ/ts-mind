"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var draggable_1 = require("./draggable");
var screenshot_1 = require("./screenshot");
// global plugin list
exports.GLOBAl_PLUGIN_LIST = {};
/**
 * register global plugin list
 * @param initializer: ITSMPlugin
 */
function globalUse(pname, initializer) {
    exports.GLOBAl_PLUGIN_LIST[pname] = initializer;
}
exports.globalUse = globalUse;
exports.default = globalUse;
// global regiter drag support
globalUse("draggable", draggable_1.default);
globalUse("screenshot", screenshot_1.default);
