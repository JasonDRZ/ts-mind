"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = require("../core/node");
var canvas_1 = require("./canvas");
var file_1 = require("./file");
var json_1 = require("./json");
var ajax_1 = require("./ajax");
var dom_1 = require("./dom");
var uuid_1 = require("./uuid");
var text_1 = require("./text");
var array = require("./array");
exports.util = {
    is_node: function (node) {
        return node instanceof node_1.TSM_node;
    },
    ajax: ajax_1.ajax,
    dom: dom_1.dom,
    canvas: canvas_1.canvas,
    file: file_1.file,
    json: json_1.json,
    uuid: uuid_1.uuid,
    text: text_1.text,
    array: array
};
exports.default = exports.util;
