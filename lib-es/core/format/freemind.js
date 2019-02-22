import { __name__, __authores__, __version__ } from "../../util/constants";
import { TSM_mind } from "../mind";
import TSMind from "..";
import { _slice } from "../../util/array";
export const freemind = {
    example: {
        meta: {
            name: __name__,
            author: __authores__,
            version: __version__
        },
        format: "freemind",
        data: `<map version="${__version__}"><node ID="root" TEXT="freemind Example"/></map>`
    },
    get_mind(source) {
        const df = freemind;
        const mind = new TSM_mind();
        mind.name = source.meta.name;
        mind.author = source.meta.author;
        mind.version = source.meta.version;
        const xml = source.data;
        const xml_doc = df._parse_xml(xml);
        const xml_root = df._find_root(xml_doc);
        df._load_node(mind, null, xml_root);
        return mind;
    },
    get_data(mind) {
        const df = freemind;
        const json = {
            meta: {
                name: mind.name,
                author: mind.author,
                version: mind.version
            },
            format: "freemind",
            data: ""
        };
        const xmllines = [];
        xmllines.push(`<map version="${__version__}">`);
        df._buildmap(mind.root, xmllines);
        xmllines.push("</map>");
        json.data = xmllines.join(" ");
        return json;
    },
    _parse_xml(xml) {
        let xml_doc = null;
        if (!!DOMParser) {
            const parser = new DOMParser();
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
    _find_root(xml_doc) {
        const nodes = _slice.call(xml_doc.childNodes);
        let node = null;
        for (const n of nodes) {
            if (n.nodeType === 1 && n.tagName === "map") {
                node = n;
                break;
            }
        }
        if (!!node) {
            const ns = _slice.call(node.childNodes);
            node = null;
            for (const n of ns) {
                if (n.nodeType === 1 && n.tagName === "node") {
                    node = n;
                    break;
                }
            }
        }
        return node;
    },
    _load_node(mind, parent_id, xml_node) {
        const df = freemind;
        const node_id = xml_node.getAttribute("ID");
        if (!node_id)
            return;
        let node_topic = xml_node.getAttribute("TEXT");
        // look for richcontent
        if (node_topic == null) {
            const topic_children = _slice.call(xml_node.childNodes);
            for (const topic_child of topic_children) {
                // logger.debug(topic_child.tagName);
                if (topic_child.nodeType === 1 &&
                    topic_child.tagName === "richcontent") {
                    node_topic = topic_child.textContent;
                    break;
                }
            }
        }
        const node_data = df._load_attributes(xml_node);
        const node_expanded = "expanded" in node_data ? node_data.expanded === "true" : true;
        delete node_data.expanded;
        const node_position = xml_node.getAttribute("POSITION");
        const node_direction = node_position
            ? TSMind.direction[node_position]
            : undefined;
        // logger.debug(node_position +':'+ node_direction);
        if (!!parent_id) {
            mind.add_node(parent_id, node_id, node_topic, node_data, undefined, node_direction, node_expanded);
        }
        else {
            mind.set_root(node_id, node_topic, node_data);
        }
        const children = _slice.call(xml_node.childNodes);
        for (const child of children) {
            if (child.nodeType === 1 && child.tagName === "node") {
                df._load_node(mind, node_id, child);
            }
        }
    },
    _load_attributes(xml_node) {
        const children = _slice.call(xml_node.childNodes);
        const attr_data = {};
        for (const attr of children) {
            if (attr.nodeType === 1 && attr.tagName === "attribute") {
                attr_data[attr.getAttribute("NAME")] = attr.getAttribute("VALUE");
            }
        }
        return attr_data;
    },
    _buildmap(node, xmllines) {
        if (!node)
            return;
        const df = freemind;
        let pos = null;
        if (!!node.parent && node.parent.isroot) {
            pos = node.direction === TSMind.direction.left ? "left" : "right";
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
            Object.keys(node.data).map(k => {
                xmllines.push('<attribute NAME="' + k + '" VALUE="' + node.data[k] + '"/>');
            });
        }
        // for children
        for (const child of node.children) {
            df._buildmap(child, xmllines);
        }
        xmllines.push("</node>");
    }
};
