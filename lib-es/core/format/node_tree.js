import { __name__, __authores__, __version__ } from "../../util/constants";
import { TSM_mind } from "../mind";
import { TSMindDirectionMap } from "..";
import { TSM_node } from "../node";
export const node_tree = {
    example: {
        meta: {
            name: __name__,
            author: __authores__,
            version: __version__
        },
        format: "node_tree",
        data: { id: "root", topic: "jsMind Example" }
    },
    get_mind(source) {
        const df = node_tree;
        const mind = new TSM_mind();
        mind.name = source.meta.name;
        mind.author = source.meta.author;
        mind.version = source.meta.version;
        df._parse(mind, source.data);
        return mind;
    },
    get_data(mind) {
        const df = node_tree;
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
    _parse(mind, node_root) {
        const df = node_tree;
        const data = df._extract_data(node_root);
        mind.set_root(node_root.id, node_root.topic, data);
        if ("children" in node_root) {
            const children = node_root.children;
            for (const child of children) {
                df._extract_subnode(mind, mind.root, child);
            }
        }
    },
    _extract_data(node_json) {
        const data = {};
        for (const k in node_json) {
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
    _extract_subnode(mind, node_parent, node_json) {
        const df = node_tree;
        const data = df._extract_data(node_json);
        let dir = TSMindDirectionMap.right;
        if (node_parent.isroot) {
            dir = TSMindDirectionMap[node_json.direction];
        }
        const node = mind.add_node(node_parent, node_json.id, node_json.topic, data, undefined, dir, node_json.expanded);
        if ("children" in node_json) {
            const children = node_json.children;
            for (const child of children) {
                df._extract_subnode(mind, node, child);
            }
        }
    },
    _buildnode(node) {
        const df = node_tree;
        if (!(node instanceof TSM_node)) {
            return;
        }
        const o = {
            id: node.id,
            topic: node.topic,
            expanded: node.expanded
        };
        if (!!node.parent && node.parent.isroot) {
            o.direction =
                node.direction === TSMindDirectionMap.left ? "left" : "right";
        }
        if (node.data != null) {
            const node_data = node.data;
            for (const k in node_data) {
                if (k) {
                    o[k] = node_data[k];
                }
            }
        }
        const children = node.children;
        if (children.length > 0) {
            o.children = [];
            for (const child of children) {
                o.children.push(df._buildnode(child));
            }
        }
        return o;
    }
};
