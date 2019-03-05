import { $logger } from "../../util/tools";
import { TSM_node } from "./node";
import TSMind, { TSMindDirectionMap } from "..";

// just can be node-id or mind-node
type ITSMNode = string | TSM_node;
interface ITSMNodeCreationData {
	id: string;
	topic: ITSMTopic;
	data?: {};
	index?: number;
	direction?: ITSMDirectionValue;
	expanded?: boolean;
}

interface ITSMMoveNodeOption {
	parentId: string;
	siblingId: string;
	direction?: ITSMDirectionValue;
	insertBefore?: boolean;
}

// compute next insert node direction，base on root node;
function computeRootChildDirection(children: TSM_node[]): ITSMDirectionValue {
	let _f = 0;
	children.map(child => {
		if (child.direction === TSMindDirectionMap.left) {
			_f--;
		} else _f++;
	});
	return _f > 0 ? TSMindDirectionMap.left : TSMindDirectionMap.right;
}

export class TSM_mind {
	public mind: TSMind;
	public meta: ITSMSourceMeta;
	public rootNode: null | TSM_node = null;
	public selectedNodes: TSM_node[] = [];
	public nodesMap: { [k: string]: TSM_node } = {};
	constructor(mind: TSMind) {
		this.mind = mind;
	}
	private _getNode = (node: ITSMNode) => {
		return typeof node === "string" ? this.getNodeById(node) : node;
	};
	// get TSM_node item by id;
	public getNodeById = (id: string) => {
		return this.nodesMap[id];
	};

	// set root point
	public setRoot = (id: string, topic: ITSMTopic, data?: object) => {
		if (!!this.rootNode) {
			$logger.warn(`Root node is already exist,please check the data source!`);
			return false;
		}
		this.rootNode = new TSM_node(this.mind, {
			id,
			topic,
			data
		});
		return true;
	};

	// add a topic node
	public addNode = (
		parent: ITSMNode,
		{
			id,
			topic,
			data = {},
			index,
			direction,
			expanded = true
		}: ITSMNodeCreationData,
		insertBefore: boolean = false
	): boolean => {
		if (id in this.nodesMap) {
			$logger.warn(`The node[id:${id}] already exist!`);
			return false;
		}
		parent = this._getNode(parent);
		if (parent.isRoot) {
			direction = computeRootChildDirection(parent.children);
		} else direction = parent.direction;
		// create current node instance
		const node = new TSM_node(this.mind, {
			id,
			index,
			topic,
			data,
			expanded,
			direction,
			parent
		});
		// add node to global nodesMap
		this.nodesMap[node.id] = node;
		// add node to its parent
		parent.addChild(node, index, insertBefore);
		return true;
	};

	public insertNodeBefore = (
		node: ITSMNode,
		id: string,
		topic: ITSMTopic,
		data?: object
	) => {
		node = this._getNode(node);
		if (!node) {
			$logger.error(`The Insert-Before target node can not be found!`);
			return false;
		}
		this.addNode(
			node.parent || node,
			{
				id,
				topic,
				data,
				index: node.index
			},
			true
		);
		return true;
	};

	public insertNodeAfter = (
		node: ITSMNode,
		id: string,
		topic: ITSMTopic,
		data?: object
	) => {
		node = this._getNode(node);
		if (!node) {
			$logger.error(`The Insert-After target node can not be found!`);
			return false;
		}
		this.addNode(node.parent || node, {
			id,
			topic,
			data,
			index: node.index
		});
		return true;
	};

	public getNodeBefore = (node: ITSMNode): null | TSM_node => {
		node = this._getNode(node);
		if (!node || node.isRoot) {
			return null;
		}
		return node.parent.children[node.index - 1] || null;
	};

	public getNodeAfter = (node: ITSMNode): null | TSM_node => {
		node = this._getNode(node);
		if (!node || node.isRoot) {
			return null;
		}
		return node.parent.children[node.index + 1] || null;
	};

	public moveNode = (
		node: ITSMNode,
		{ parentId, siblingId, direction, insertBefore = false }: ITSMMoveNodeOption
	) => {
		// get nodes
		node = this._getNode(node);
		const parent = this.getNodeById(parentId);
		const sibling = this.getNodeById(siblingId);
		// egnore no parent change
		if (parent.id === node.parent.id) return node;
		// change direction
		node.direction = direction || parent.direction;
		this._internal_change_children_dir(node);
		// remove current node from old parent
		node.parent.removeChild(node.id);
		// insert child
		return parent.addChild(node, sibling.index, insertBefore);
	};

	// Change all children node direction to current base node's direction in internal way.
	private _internal_change_children_dir = (
		node: TSM_node,
		direction?: ITSMDirectionValue
	) => {
		node.children.forEach(child => {
			child.direction = direction || node.direction;
			if (child.children.length > 0) this._internal_change_children_dir(child);
		});
	};
	public removeNode = (node: ITSMNode) => {
		const _logger_act = `RemoveNode`;
		node = this._getNode(node);
		if (!node) {
			this.mind.$logger.error(_logger_act, `The node can not be found!`);
			return false;
		}
		if (node.isRoot) {
			this.mind.$logger.error(_logger_act, `Root node can not be removed!`);
			return false;
		}
		// internal remove all child nodes from copy array
		[...node.children].map(this.removeNode);
		// remove it from its parent node
		node.parent.removeChild(node.id);
		// remove node from global nodes store
		delete this.nodesMap[node.id];
		// destory the node instance
		node.$destroy();
		// clear cache
		node = null as any;
		return true;
	};
	// support multiple selection
	public selectNode = (node: ITSMNode) => {
		node = this._getNode(node);
		if (!node) {
			this.mind.$logger.error("SelectNode", `The node can not be found!`);
			return false;
		}
		this.selectedNodes.push(node);
		node.$select();
		return true;
	};
	public deselectNode = (node: ITSMNode) => {
		node = this._getNode(node);
		if (!node) {
			this.mind.$logger.error("DeselectNode", `The node can not be found!`);
			return false;
		}
		const _id = node.id;
		const _tar = this.selectedNodes.splice(
			this.selectedNodes.findIndex(_nd => _nd.id === _id),
			1
		);
		node.$deselect();
		return !!_tar[0];
	};
}
