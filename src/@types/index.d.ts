type ITSMTopic = any;
// mind direction tag
type ITSMDirection = "left" | "right" | "center";
// mind direction value
type ITSMDirectionValue = 1 | 0 | -1;
// event name
type ITSMEventType =
	| "show"
	| "resize"
	| "edit"
	| "select"
	| "mousedown"
	| "click"
	| "dblclick";
// event name goust
type ITSMEventTypeValue = 1 | 2 | 3 | 4;
// node Types
type ITSMNode = Element | HTMLElement | Text;
// mind node data format
type ITSMNodeDataItem = {
	id: string;
	children: ITSMNodeDataItem[];
	topic: string;
	width: number;
	height: number;
	isRoot?: boolean;
	expanded?: boolean;
	parentid?: string;
	direction?: ITSMDirection;
	parent?: ITSMNodeDataItem;
};
// Callback
type ITSMAnyCall<Arg extends any[] = any[], Return = any> = (
	...arg: Arg
) => Return;

interface ITSMSourceMeta {
	name: string;
	author: any;
	version: string;
}

type ITSMSourceData<MindData> = {
	meta: ITSMSourceMeta;
	format: string;
	data: MindData;
};

type ITSMDataFormat = "node_array" | "node_tree" | "freemind";

type ITSMEmpty = undefined | null | "";

type ITSMPotions = {
	x: number;
	y: number;
};

interface ITSMShortcutProvOpts {
	enable: boolean;
	mapping: ITSMShortcutProvOptsMapping;
	handles: ITSMShortcutProvOptsHandles;
}

interface ITSMShortcutProvOptsMapping {
	addchild?: number; // Insert
	addbrother?: number; // Enter
	editnode?: number; // F2
	delnode?: number; // Delete
	toggle?: number; // Space
	left?: number; // Left
	up?: number; // Up
	right?: number; // Right
	down?: number; // Down
}

interface ITSMShortcutProvOptsHandles {
	[k: string]: ITSMAnyCall;
}

type ITSMUnionNull<Tar> = Tar | null;

type ITSMDragCloseNodeData = {
	node: any;
	direction: any;
	sp: {
		x: number;
		y: number;
	} | null;
	np: {
		x: number;
		y: number;
	} | null;
} | null;
