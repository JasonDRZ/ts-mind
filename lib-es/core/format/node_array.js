import { __authores__, __version__, __name__ } from "../../util/constants";
import { TSM_mind } from "../mind";
import { $logger } from "../../util/tools";
import { TSM_node } from "../node";
import TSMind from "..";
export const node_array = {
    example: {
        meta: {
            name: __name__,
            author: __authores__,
            version: __version__
        },
        format: "node_array",
        data: [
            { id: "root", topic: "jsMind Example", isroot: true }
        ]
    },
    get_mind(source) {
        const df = node_array;
        const mind = new TSM_mind();
        mind.name = source.meta.name;
        mind.author = source.meta.author;
        mind.version = source.meta.version;
        df._parse(mind, source.data);
        return mind;
    },
    get_data(mind) {
        const df = node_array;
        const data = [];
        df._array(mind, data);
        return {
            meta: {
                name: mind.name,
                author: mind.author,
                version: mind.version
            },
            format: "node_array",
            data
        };
    },
    _parse(mind, nodes) {
        const df = node_array;
        const narray = nodes.slice(0);
        // reverse array for improving looping performance
        narray.reverse();
        const root_id = df._extract_root(mind, narray);
        if (!!root_id) {
            df._extract_subnode(mind, root_id, narray);
        }
        else {
            $logger.error("root node can not be found");
        }
    },
    _extract_root(mind, nodes) {
        const df = node_array;
        let i = nodes.length;
        while (i--) {
            if ("isroot" in nodes[i] && nodes[i].isroot) {
                const root_json = nodes[i];
                const data = df._extract_data(root_json);
                mind.set_root(root_json.id, root_json.topic, data);
                nodes.splice(i, 1);
                return root_json.id;
            }
        }
        return null;
    },
    _extract_subnode(mind, parentid, nodes) {
        const df = node_array;
        let i = nodes.length;
        let node_json = null;
        let data = null;
        let extract_count = 0;
        while (i--) {
            node_json = nodes[i];
            if (node_json.parentid === parentid) {
                data = df._extract_data(node_json);
                const node_direction = node_json.direction;
                mind.add_node(parentid, node_json.id, node_json.topic, data, undefined, node_direction
                    ? node_direction === "left"
                        ? TSMind.direction.left
                        : TSMind.direction.right
                    : undefined, node_json.expanded);
                nodes.splice(i, 1);
                extract_count++;
                const sub_extract_count = df._extract_subnode(mind, node_json.id, nodes);
                if (sub_extract_count > 0) {
                    // reset loop index after extract subordinate node
                    i = nodes.length;
                    extract_count += sub_extract_count;
                }
            }
        }
        return extract_count;
    },
    _extract_data(node_json) {
        const data = {};
        for (const k in node_json) {
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
    _array(mind, nodes) {
        const df = node_array;
        mind.root && df._array_node(mind.root, nodes);
    },
    _array_node(node, nodes) {
        const df = node_array;
        if (!(node instanceof TSM_node)) {
            return;
        }
        const o = {
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
            o.direction = node.direction === TSMind.direction.left ? "left" : "right";
        }
        if (node.data != null) {
            const node_data = node.data;
            Object.keys(node_data).map(k => {
                o[k] = node_data[k];
            });
        }
        nodes.push(o);
        const ci = node.children.length;
        for (let i = 0; i < ci; i++) {
            df._array_node(node.children[i], nodes);
        }
    }
};
