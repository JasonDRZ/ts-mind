import { TSMindDirectionMap } from "../..";
import TSMind from "../..";
interface ITSMNodeDataView {
	axisX: number;
	axisY: number;
	location: {
		x: number;
		y: number;
	};
}
interface ITSMNodeDataLayout {
	sideIndex: number;
	offsetX: number;
	offsetY: number;
	outerHeight: number;
	leftNodes: TSM_node[];
	rightNodes: TSM_node[];
	leftNodeOuterHeight: number;
	rightNodeOuterHeight: number;
}

export interface ITSMNodeProps {
	id: string;
	topic: any;
	index?: number;
	data?: object;
	isRoot?: boolean;
	parent?: any;
	direction?: ITSMDirectionValue;
	expanded?: boolean;
}

export class TSM_node {
	// TSMind instance
	public mind: TSMind;
	// layout index
	public index: number;
	// unique node identifier
	public readonly id: string;
	// current node's data
	public readonly data: { [k: string]: any };
	// weather the current node is root node
	public readonly isRoot: boolean;
	// current node's children nodes
	public readonly children: TSM_node[] = [];
	// node topic,could be any thing
	public topic: any;
	// current node's visible flag
	public expanded: boolean;
	// current node's parent node
	public parent: TSM_node;
	// current node's direction
	public direction: ITSMDirectionValue;
	// extra data, for data extension
	public extraData: { [k: string]: any } = {};
	// current node's size
	public width: number = 0;
	public height: number = 0;
	// current node's real element
	public readonly element: HTMLDivElement;
	// current node's expander real element
	public readonly expander: HTMLDivElement;
	// current node's view provider data
	public readonly viewData: ITSMNodeDataView = {
		// X-axis coordinate
		axisX: 0,
		// Y-axis coordinate
		axisY: 0,
		// the node-location in view sight;equals (node.axisX - panel.scrollX)
		location: {
			x: 0,
			y: 0
		}
	};
	public readonly layoutData: ITSMNodeDataLayout = {
		// children order side index
		sideIndex: 0,
		// layout offsets
		offsetX: 0,
		offsetY: 0,
		// node-element outer height, for colume layout computing;
		outerHeight: 0,
		// side of left nodes
		leftNodes: [],
		// side of right nodes
		rightNodes: [],
		// left node outer height cache, for layout computing
		leftNodeOuterHeight: 0,
		// right node outer height cache, for layout computing
		rightNodeOuterHeight: 0
	};
	// state flags
	public isMounted: boolean = false;
	public isDestroyed: boolean = false;
	public isSelected: boolean = false;
	constructor(
		mind: TSMind,
		{
			// required fields
			id,
			topic,
			parent,
			// optional fields
			index = -1,
			data = {},
			isRoot = false,
			direction = TSMindDirectionMap.right,
			expanded = true
		}: ITSMNodeProps
	) {
		// mind vm
		this.mind = mind;
		mind.EventManager.trigger<[TSM_node]>("beforeCreate.node", this);
		// config
		this.id = id;
		this.topic = topic;
		this.parent = parent;
		this.index = index;
		this.data = data;
		this.isRoot = isRoot;
		this.direction = direction;
		this.expanded = expanded;
		mind.EventManager.trigger<[TSM_node]>("created.node", this);
	}
	// add new child node
	public addChild = (
		node: TSM_node,
		insertIndex?: number,
		insertBefore: boolean = false
	) => {
		this.mind.EventManager.trigger<[TSM_node]>("beforeUpdate.node", this);
		if (typeof insertIndex === "number") {
			insertIndex = insertBefore ? insertIndex : insertIndex + 1;
			this.children.splice(insertIndex, 0, node);
		} else this.children.push(node);
		node.parent = this;
		// update children index, after pushed or inserted.
		this.updateChildrenIndex();
		this.mind.EventManager.trigger<[TSM_node]>("updated.node", this);
		return node;
	};
	// get all child node as an Array
	public getChildren = () => {
		return this.children;
	};
	// find a child by id
	public getChild = (id: string) => {
		return this.children.find(child => child.id === id);
	};
	// get child index by id
	public getChildIndex = (id: string) => {
		return this.children.findIndex(child => child.id === id);
	};
	// remove some child node
	public removeChild = (id: string) => {
		this.$beforeUpdate();
		const _fl = !!this.children.splice(this.getChildIndex(id), 1)[0];
		if (_fl) this.updateChildrenIndex();
		this.$updated();
		return _fl;
	};
	// update children index,for layout
	public updateChildrenIndex = () => {
		this.children.map((child, idx) => {
			child.index = idx;
		});
	};

	// life hooks
	public $destroy = () => {
		const _dsId = this.id;
		this.mind.EventManager.trigger<[TSM_node]>("beforeDestroy.node", this);
		// remove the element and expander
		// delete all properties
		Object.keys(this).map(key => {
			delete this[key];
		});
		// set destroyed flag
		this.isDestroyed = true;
		this.mind.EventManager.trigger<[TSM_node, string]>(
			"destroyed.node",
			this,
			_dsId
		);
	};
	public $beforeUpdate = () => {
		this.mind.EventManager.trigger<[TSM_node]>("beforeUpdate.node", this);
	};
	public $updated = () => {
		this.mind.EventManager.trigger<[TSM_node]>("updated.node", this);
	};
	public $beforeMount = () => {
		this.mind.EventManager.trigger<[TSM_node]>("beforeMount.node", this);
	};
	public $mounted = () => {
		this.mind.EventManager.trigger<[TSM_node]>("mounted.node", this);
	};
	public $unmount = () => {
		this.mind.EventManager.trigger<[TSM_node]>("unmount.node", this);
	};
	public $expand = () => {
		this.expanded = !this.expanded;
		this.mind.EventManager.trigger<[TSM_node]>("expand.node", this);
		return this.expanded;
	};
	public $select = () => {
		this.isSelected = true;
		this.mind.EventManager.trigger<[TSM_node]>("select.node", this);
	};
	public $deselect = () => {
		this.isSelected = false;
		this.mind.EventManager.trigger<[TSM_node]>("deselect.node", this);
	};
}
