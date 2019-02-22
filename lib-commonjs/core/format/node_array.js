"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../../util/constants");
var mind_1 = require("../mind");
var tools_1 = require("../../util/tools");
var node_1 = require("../node");
var __1 = require("..");
exports.node_array = {
    example: {
        meta: {
            name: constants_1.__name__,
            author: constants_1.__authores__,
            version: constants_1.__version__
        },
        format: "node_array",
        data: [
            { id: "root", topic: "jsMind Example", isroot: true }
        ]
    },
    get_mind: function (source) {
        var df = exports.node_array;
        var mind = new mind_1.TSM_mind();
        mind.name = source.meta.name;
        mind.author = source.meta.author;
        mind.version = source.meta.version;
        df._parse(mind, source.data);
        return mind;
    },
    get_data: function (mind) {
        var df = exports.node_array;
        var data = [];
        df._array(mind, data);
        return {
            meta: {
                name: mind.name,
                author: mind.author,
                version: mind.version
            },
            format: "node_array",
            data: data
        };
    },
    _parse: function (mind, nodes) {
        var df = exports.node_array;
        var narray = nodes.slice(0);
        // reverse array for improving looping performance
        narray.reverse();
        var root_id = df._extract_root(mind, narray);
        if (!!root_id) {
            df._extract_subnode(mind, root_id, narray);
        }
        else {
            tools_1.$logger.error("root node can not be found");
        }
    },
    _extract_root: function (mind, nodes) {
        var df = exports.node_array;
        var i = nodes.length;
        while (i--) {
            if ("isroot" in nodes[i] && nodes[i].isroot) {
                var root_json = nodes[i];
                var data = df._extract_data(root_json);
                mind.set_root(root_json.id, root_json.topic, data);
                nodes.splice(i, 1);
                return root_json.id;
            }
        }
        return null;
    },
    _extract_subnode: function (mind, parentid, nodes) {
        var df = exports.node_array;
        var i = nodes.length;
        var node_json = null;
        var data = null;
        var extract_count = 0;
        while (i--) {
            node_json = nodes[i];
            if (node_json.parentid === parentid) {
                data = df._extract_data(node_json);
                var node_direction = node_json.direction;
                mind.add_node(parentid, node_json.id, node_json.topic, data, undefined, node_direction
                    ? node_direction === "left"
                        ? __1.default.direction.left
                        : __1.default.direction.right
                    : undefined, node_json.expanded);
                nodes.splice(i, 1);
                extract_count++;
                var sub_extract_count = df._extract_subnode(mind, node_json.id, nodes);
                if (sub_extract_count > 0) {
                    // reset loop index after extract subordinate node
                    i = nodes.length;
                    extract_count += sub_extract_count;
                }
            }
        }
        return extract_count;
    },
    _extract_data: function (node_json) {
        var data = {};
        for (var k in node_json) {
            if (k === "id" ||
                k === "topic" ||
                k === "parentid" ||
                k === "isroot" ||
                k === "direction" ||
                k === "expanded") {
                continue;
            }
            data[k] = node_json[k];
        }
        return data;
    },
    _array: function (mind, nodes) {
        var df = exports.node_array;
        mind.root && df._array_node(mind.root, nodes);
    },
    _array_node: function (node, nodes) {
        var df = exports.node_array;
        if (!(node instanceof node_1.TSM_node)) {
            return;
        }
        var o = {
            id: node.id,
            topic: node.topic,
            expanded: node.expanded,
            children: [],
            width: 0,
            height: 0
        };
        if (!!node.parent) {
            o.parentid = node.parent.id;
        }
        if (node.isroot) {
            o.isroot = true;
        }
        if (!!node.parent && node.parent.isroot) {
            o.direction = node.direction === __1.default.direction.left ? "left" : "right";
        }
        if (node.data != null) {
            var node_data_1 = node.data;
            Object.keys(node_data_1).map(function (k) {
                o[k] = node_data_1[k];
            });
        }
        nodes.push(o);
        var ci = node.children.length;
        for (var i = 0; i < ci; i++) {
            df._array_node(node.children[i], nodes);
        }
    }
};
