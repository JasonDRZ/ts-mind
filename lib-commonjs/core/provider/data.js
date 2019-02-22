"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("../../util/tools");
var node_array_1 = require("../format/node_array");
var node_tree_1 = require("../format/node_tree");
var freemind_1 = require("../format/freemind");
var data_provider = /** @class */ (function () {
    function data_provider(tsm) {
        var _this = this;
        this.reset = function () {
            tools_1.$logger.debug("data.reset");
        };
        this.load = function (mind_data) {
            var df = null;
            var mind = null;
            if (typeof mind_data === "object") {
                if (!!mind_data.format) {
                    df = mind_data.format;
                }
                else {
                    df = "node_tree";
                }
            }
            else {
                df = "freemind";
            }
            if (df === "node_array") {
                mind = node_array_1.node_array.get_mind(mind_data);
            }
            else if (df === "node_tree") {
                mind = node_tree_1.node_tree.get_mind(mind_data);
            }
            else if (df === "freemind") {
                mind = freemind_1.freemind.get_mind(mind_data);
            }
            else {
                tools_1.$logger.warn("unsupported format");
            }
            return mind;
        };
        this.get_data = function (data_format) {
            var data = null;
            if (!_this.tsm.mind)
                return data;
            if (data_format === "node_array") {
                data = node_array_1.node_array.get_data(_this.tsm.mind);
            }
            else if (data_format === "node_tree") {
                data = node_tree_1.node_tree.get_data(_this.tsm.mind);
            }
            else if (data_format === "freemind") {
                data = freemind_1.freemind.get_data(_this.tsm.mind);
            }
            else {
                tools_1.$logger.error("unsupported " + data_format + " format");
            }
            return data;
        };
        this.tsm = tsm;
        tools_1.$logger.debug("data.init");
    }
    return data_provider;
}());
exports.data_provider = data_provider;
