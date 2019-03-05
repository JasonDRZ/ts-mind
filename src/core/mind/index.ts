import { $logger } from "../../util/tools";
import { TSM_node } from "../node";
import TSMind from "..";

// just can be node-id or mind-node
type IJSMindNodeSelector = string | TSM_node;

export class TSM_mind {
	public meta: ITSMSourceMeta;
	public root: null | TSM_node = null;
	public selected: null | TSM_node = null;
	public nodes: { [k: string]: TSM_node } = {};
	get_node = (nodeId: string) => {
		if (nodeId in this.nodes) {
			return this.nodes[nodeId];
		} else {
			$logger.warn("the node[id=" + nodeId + "] can not be found");
			return null;
		}
	};

	set_root = (nodeId: string, topic: any, data?: object) => {
		if (this.root == null) {
			this.root = new TSM_node({ nodeId, topic, data, isRoot: true });
			this._put_node(this.root);
		} else {
			$logger.error("root node is already exist");
		}
	};

	add_node = (
		parent: IJSMindNodeSelector,
		nodeId: string,
		topic: any,
		data?: {},
		idx: number = -1,
		direction?: ITSMDirectionValue,
		expanded?: boolean
	): any => {
		if (typeof parent === "string") {
			const the_parent_node = this.get_node(parent as string);
			if (!the_parent_node) {
				$logger.error("the parent_node[id=" + parent + "] can not be found.");
				return null;
			} else {
				return this.add_node(
					the_parent_node,
					nodeId,
					topic,
					data,
					idx,
					direction,
					expanded
				);
			}
		}
		const nodeIndex = idx;
		let node = null;
		parent = parent as TSM_node;
		if (parent.isRoot) {
			let direction = TSMind.direction.right;
			if (isNaN(direction as number)) {
				const children = parent.children as TSM_node[];
				const children_len = children.length;
				let r = 0;
				for (let i = 0; i < children_len; i++) {
					if (children[i].direction === TSMind.direction.left) {
						r--;
					} else {
						r++;
					}
				}
				direction =
					children_len > 1 && r > 0
						? TSMind.direction.left
						: TSMind.direction.right;
			} else {
				direction =
					direction !== TSMind.direction.left
						? TSMind.direction.right
						: TSMind.direction.left;
			}
			node = new TSM_node({
				nodeId,
				nodeIndex,
				topic,
				data,
				parent,
				direction,
				expanded
			});
		} else {
			node = new TSM_node({
				nodeId: nodeId,
				nodeIndex,
				topic,
				data,
				parent,
				direction: parent.direction,
				expanded
			});
		}
		if (this._put_node(node)) {
			parent.children.push(node);
			this._reindex(parent);
		} else {
			$logger.error(
				"fail, the nodeId '" + node.id + "' has been already exist."
			);
			node = null;
		}
		return node;
	};

	insert_node_before = (
		node_before: TSM_node | string,
		nodeId: string,
		topic: any,
		data?: object
	): null | TSM_node => {
		if (typeof node_before === "string") {
			const the_node_before = this.get_node(node_before as string);
			if (!the_node_before) {
				$logger.error(
					"the node_before[id=" + node_before + "] can not be found."
				);
				return null;
			} else {
				return this.insert_node_before(the_node_before, nodeId, topic, data);
			}
		}
		node_before = node_before as TSM_node;
		const node_index = node_before.index - 0.5;
		return node_before.parent
			? this.add_node(node_before.parent, nodeId, topic, data, node_index)
			: null;
	};

	get_node_before = (node: IJSMindNodeSelector): null | TSM_node => {
		if (typeof node === "string") {
			const the_node = this.get_node(node);
			if (!the_node) {
				$logger.error("the node[id=" + node + "] can not be found.");
				return null;
			} else {
				return this.get_node_before(the_node);
			}
		}
		if (node.isRoot) {
			return null;
		}
		const idx = node.index - 2;
		if (idx >= 0) {
			return node.parent!.children[idx] || null;
		} else {
			return null;
		}
	};

	insert_node_after = (
		node_after: IJSMindNodeSelector,
		nodeId: string,
		topic: any,
		data: object
	): null | TSM_node => {
		if (typeof node_after === "string") {
			const the_node_after = this.get_node(node_after);
			if (!the_node_after) {
				$logger.error(
					"the node_after[id=" + node_after + "] can not be found."
				);
				return null;
			} else {
				return this.insert_node_after(the_node_after, nodeId, topic, data);
			}
		}
		const node_index = node_after.index + 0.5;
		return node_after.parent
			? this.add_node(node_after.parent, nodeId, topic, data, node_index)
			: null;
	};

	get_node_after = (node: IJSMindNodeSelector): null | TSM_node => {
		if (typeof node === "string") {
			const the_node = this.get_node(node);
			if (!the_node) {
				$logger.error("the node[id=" + node + "] can not be found.");
				return null;
			} else {
				return this.get_node_after(the_node);
			}
		}
		if (node.isRoot) {
			return null;
		}
		const idx = node.index;
		const brothers = node.parent!.children || null;
		if (brothers.length >= idx) {
			return node.parent!.children[idx] || null;
		} else {
			return null;
		}
	};

	move_node = (
		node: IJSMindNodeSelector,
		beforeid: string,
		parentid: string,
		direction: ITSMDirectionValue
	): null | TSM_node => {
		if (typeof node === "string") {
			const the_node = this.get_node(node);
			if (!the_node) {
				$logger.error("the node[id=" + node + "] can not be found.");
				return null;
			} else {
				return this.move_node(the_node, beforeid, parentid, direction);
			}
		}
		if (!parentid) {
			parentid = node.parent.id;
		}
		return this._move_node(node, beforeid, parentid, direction);
	};

	private _flow_node_direction = (
		node: TSM_node,
		direction?: ITSMDirectionValue
	) => {
		if (typeof direction === "undefined") {
			direction = node.direction;
		} else {
			node.direction = direction;
		}
		let len = node.children.length;
		while (len--) {
			this._flow_node_direction(node.children[len], direction);
		}
	};

	private _move_node_internal = (node: TSM_node, beforeid: string) => {
		if (!!node && !!beforeid) {
			if (beforeid === "_last_") {
				node.index = -1;
				this._reindex(node.parent);
			} else if (beforeid === "_first_") {
				node.index = 0;
				this._reindex(node.parent);
			} else {
				const node_before = !!beforeid ? this.get_node(beforeid) : null;
				if (
					node_before != null &&
					node_before.parent != null &&
					node_before.parent.id === node.parent.id
				) {
					node.index = node_before.index - 0.5;
					this._reindex(node.parent);
				}
			}
		}
		return node;
	};

	private _move_node = (
		node: TSM_node,
		beforeid: string,
		parentid: string,
		direction: ITSMDirectionValue
	) => {
		if (!!node && !!parentid) {
			if (node.parent.id !== parentid) {
				// remove from parent's children
				const sibling = node.parent.children;
				let si = sibling.length;
				while (si--) {
					if (sibling[si].id === node.id) {
						sibling.splice(si, 1);
						break;
					}
				}
				const _nparent = this.get_node(parentid);
				if (_nparent) {
					node.parent = _nparent;
					node.parent.children.push(node);
				}
			}

			if (node.parent!.isRoot) {
				if (direction === TSMind.direction.left) {
					node.direction = direction;
				} else {
					node.direction = TSMind.direction.right;
				}
			} else {
				node.direction = node.parent!.direction;
			}
			this._move_node_internal(node, beforeid);
			this._flow_node_direction(node);
		}
		return node;
	};

	remove_node = (node: IJSMindNodeSelector): boolean => {
		if (typeof node === "string") {
			const the_node = this.get_node(node);
			if (!the_node) {
				$logger.error("the node[id=" + node + "] can not be found.");
				return false;
			} else {
				return this.remove_node(the_node);
			}
		}
		if (!node) {
			$logger.error("fail, the node can not be found");
			return false;
		}
		if (node.isRoot) {
			$logger.error("fail, can not remove root node");
			return false;
		}
		if (this.selected !== null && this.selected.id === node.id) {
			this.selected = null;
		}
		// clean all subordinate nodes
		const children = node.children;
		let ci = children.length;
		while (ci--) {
			this.remove_node(children[ci]);
		}
		// clean all children
		children.length = 0;
		// remove from parent's children
		const sibling = node.parent!.children || [];
		let si = sibling.length;
		while (si--) {
			if (sibling[si].id === node.id) {
				sibling.splice(si, 1);
				break;
			}
		}
		// remove from global nodes
		delete this.nodes[node.id];
		// clean all properties
		Object.keys(node).map(k => {
			delete node[k];
		});
		// remove it's self
		node = null as any;
		// delete node;
		return true;
	};

	private _put_node = (node: TSM_node) => {
		if (node.id in this.nodes) {
			$logger.warn("the nodeId '" + node.id + "' has been already exist.");
			return false;
		} else {
			this.nodes[node.id] = node;
			return true;
		}
	};

	private _reindex = (node: TSM_node) => {
		if (node instanceof TSM_node) {
			node.children.sort(TSM_node.compare);
			for (let i = 0; i < node.children.length; i++) {
				node.children[i].index = i + 1;
			}
		}
	};
}
