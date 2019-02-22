"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../../util/constants");
var mind_1 = require("../mind");
var __1 = require("..");
var array_1 = require("../../util/array");
exports.freemind = {
    example: {
        meta: {
            name: constants_1.__name__,
            author: constants_1.__authores__,
            version: constants_1.__version__
        },
        format: "freemind",
        data: "<map version=\"" + constants_1.__version__ + "\"><node ID=\"root\" TEXT=\"freemind Example\"/></map>"
    },
    get_mind: function (source) {
        var df = exports.freemind;
        var mind = new mind_1.TSM_mind();
        mind.name = source.meta.name;
        mind.author = source.meta.author;
        mind.version = source.meta.version;
        var xml = source.data;
        var xml_doc = df._parse_xml(xml);
        var xml_root = df._find_root(xml_doc);
        df._load_node(mind, null, xml_root);
        return mind;
    },
    get_data: function (mind) {
        var df = exports.freemind;
        var json = {
            meta: {
                name: mind.name,
                author: mind.author,
                version: mind.version
            },
            format: "freemind",
            data: ""
        };
        var xmllines = [];
        xmllines.push("<map version=\"" + constants_1.__version__ + "\">");
        df._buildmap(mind.root, xmllines);
        xmllines.push("</map>");
        json.data = xmllines.join(" ");
        return json;
    },
    _parse_xml: function (xml) {
        var xml_doc = null;
        if (!!DOMParser) {
            var parser = new DOMParser();
            xml_doc = parser.parseFromString(xml, "text/xml");
        }
        else {
            // Internet Explorer
            xml_doc = new window.ActiveXObject("Microsoft.XMLDOM");
            xml_doc.async = false;
            xml_doc.loadXML(xml);
        }
        return xml_doc;
    },
    _find_root: function (xml_doc) {
        var nodes = array_1._slice.call(xml_doc.childNodes);
        var node = null;
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var n = nodes_1[_i];
            if (n.nodeType === 1 && n.tagName === "map") {
                node = n;
                break;
            }
        }
        if (!!node) {
            var ns = array_1._slice.call(node.childNodes);
            node = null;
            for (var _a = 0, ns_1 = ns; _a < ns_1.length; _a++) {
                var n = ns_1[_a];
                if (n.nodeType === 1 && n.tagName === "node") {
                    node = n;
                    break;
                }
            }
        }
        return node;
    },
    _load_node: function (mind, parent_id, xml_node) {
        var df = exports.freemind;
        var node_id = xml_node.getAttribute("ID");
        if (!node_id)
            return;
        var node_topic = xml_node.getAttribute("TEXT");
        // look for richcontent
        if (node_topic == null) {
            var topic_children = array_1._slice.call(xml_node.childNodes);
            for (var _i = 0, topic_children_1 = topic_children; _i < topic_children_1.length; _i++) {
                var topic_child = topic_children_1[_i];
                // logger.debug(topic_child.tagName);
                if (topic_child.nodeType === 1 &&
                    topic_child.tagName === "richcontent") {
                    node_topic = topic_child.textContent;
                    break;
                }
            }
        }
        var node_data = df._load_attributes(xml_node);
        var node_expanded = "expanded" in node_data ? node_data.expanded === "true" : true;
        delete node_data.expanded;
        var node_position = xml_node.getAttribute("POSITION");
        var node_direction = node_position
            ? __1.default.direction[node_position]
            : undefined;
        // logger.debug(node_position +':'+ node_direction);
        if (!!parent_id) {
            mind.add_node(parent_id, node_id, node_topic, node_data, undefined, node_direction, node_expanded);
        }
        else {
            mind.set_root(node_id, node_topic, node_data);
        }
        var children = array_1._slice.call(xml_node.childNodes);
        for (var _a = 0, children_1 = children; _a < children_1.length; _a++) {
            var child = children_1[_a];
            if (child.nodeType === 1 && child.tagName === "node") {
                df._load_node(mind, node_id, child);
            }
        }
    },
    _load_attributes: function (xml_node) {
        var children = array_1._slice.call(xml_node.childNodes);
        var attr_data = {};
        for (var _i = 0, children_2 = children; _i < children_2.length; _i++) {
            var attr = children_2[_i];
            if (attr.nodeType === 1 && attr.tagName === "attribute") {
                attr_data[attr.getAttribute("NAME")] = attr.getAttribute("VALUE");
            }
        }
        return attr_data;
    },
    _buildmap: function (node, xmllines) {
        if (!node)
            return;
        var df = exports.freemind;
        var pos = null;
        if (!!node.parent && node.parent.isroot) {
            pos = node.direction === __1.default.direction.left ? "left" : "right";
        }
        xmllines.push("<node");
        xmllines.push('ID="' + node.id + '"');
        if (!!pos) {
            xmllines.push('POSITION="' + pos + '"');
        }
        xmllines.push('TEXT="' + node.topic + '">');
        // store expanded status as an attribute
        xmllines.push('<attribute NAME="expanded" VALUE="' + node.expanded + '"/>');
        // for attributes
        if (node.data) {
            Object.keys(node.data).map(function (k) {
                xmllines.push('<attribute NAME="' + k + '" VALUE="' + node.data[k] + '"/>');
            });
        }
        // for children
        for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
            var child = _a[_i];
            df._buildmap(child, xmllines);
        }
        xmllines.push("</node>");
    }
};
