"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../../util/constants");
var mind_1 = require("../mind");
var __1 = require("..");
var node_1 = require("../node");
exports.node_tree = {
    example: {
        meta: {
            name: constants_1.__name__,
            author: constants_1.__authores__,
            version: constants_1.__version__
        },
        format: "node_tree",
        data: { id: "root", topic: "jsMind Example" }
    },
    get_mind: function (source) {
        var df = exports.node_tree;
        var mind = new mind_1.TSM_mind();
        mind.name = source.meta.name;
        mind.author = source.meta.author;
        mind.version = source.meta.version;
        df._parse(mind, source.data);
        return mind;
    },
    get_data: function (mind) {
        var df = exports.node_tree;
        return {
            meta: {
                name: mind.name,
                author: mind.author,
                version: mind.version
            },
            format: "node_tree",
            data: df._buildnode(mind.root)
        };
    },
    _parse: function (mind, node_root) {
        var df = exports.node_tree;
        var data = df._extract_data(node_root);
        mind.set_root(node_root.id, node_root.topic, data);
        if ("children" in node_root) {
            var children = node_root.children;
            for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                var child = children_1[_i];
                df._extract_subnode(mind, mind.root, child);
            }
        }
    },
    _extract_data: function (node_json) {
        var data = {};
        for (var k in node_json) {
            if (k === "id" ||
                k === "topic" ||
                k === "children" ||
                k === "direction" ||
                k === "expanded") {
                continue;
            }
            data[k] = node_json[k];
        }
        return data;
    },
    _extract_subnode: function (mind, node_parent, node_json) {
        var df = exports.node_tree;
        var data = df._extract_data(node_json);
        var dir = __1.TSMindDirectionMap.right;
        if (node_parent.isroot) {
            dir = __1.TSMindDirectionMap[node_json.direction];
        }
        var node = mind.add_node(node_parent, node_json.id, node_json.topic, data, undefined, dir, node_json.expanded);
        if ("children" in node_json) {
            var children = node_json.children;
            for (var _i = 0, children_2 = children; _i < children_2.length; _i++) {
                var child = children_2[_i];
                df._extract_subnode(mind, node, child);
            }
        }
    },
    _buildnode: function (node) {
        var df = exports.node_tree;
        if (!(node instanceof node_1.TSM_node)) {
            return;
        }
        var o = {
            id: node.id,
            topic: node.topic,
            expanded: node.expanded
        };
        if (!!node.parent && node.parent.isroot) {
            o.direction =
                node.direction === __1.TSMindDirectionMap.left ? "left" : "right";
        }
        if (node.data != null) {
            var node_data = node.data;
            for (var k in node_data) {
                if (k) {
                    o[k] = node_data[k];
                }
            }
        }
        var children = node.children;
        if (children.length > 0) {
            o.children = [];
            for (var _i = 0, children_3 = children; _i < children_3.length; _i++) {
                var child = children_3[_i];
                o.children.push(df._buildnode(child));
            }
        }
        return o;
    }
};
