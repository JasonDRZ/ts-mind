/**
 * COMMON PART
 */
// mind direction tag
type IMDirection = "left" | "right" | "center";
// mind direction value
type IMDirectionValue = 1 | 0 | -1;
// event name
type IMEventType = "show" | "resize" | "edit" | "select" | "mousedown" | "click" | "dblclick";
// event name goust
type IMEventTypeValue = 1 | 2 | 3 | 4;
// Callback
type IMAnyCall<Arg extends any[] = any[], Return = any> = (...arg: Arg) => Return;
type IMEmpty = undefined | null | "";
type IMUnionNull<Tar> = Tar | null;
type IMKeyValue<V = any> = { [k: string]: V };

/**
 * CUSTOM PART, WIDTH NAMESPACE
 */
// node Types
type IMVnodeTopic = any;
type IMVnodeTopicData = any;
type IMVnodeViewElement = Element | HTMLElement | Text;

interface IMVmindAddNodeData {
  id: string;
  topic: IMVnodeTopic;
  data?: {};
  index?: number;
  direction?: IMDirectionValue;
  expanded?: boolean;
}

interface IMVmindMoveNodeData {
  parentId: string;
  siblingId: string;
  direction?: IMDirectionValue;
  insertBefore?: boolean;
}

/**
 * DATA SOURCE
 */
// source data type
type IMSourceFormatType = "mind_list" | "mind_tree" | "mind_free";
type IMSource<MindData> = {
  meta: IMSourceMeta;
  format: IMSourceFormatType;
  data: MindData;
};
interface IMSourceMeta {
  name: string;
  author: any;
  version: string;
}
// mind node data format
interface IMSourceBaseItem {
  id: string;
  topic: string;
  width: number;
  height: number;
  isRoot?: boolean;
  expanded?: boolean;
  parentid?: string;
  direction?: IMDirection;
}

interface IMSourceArrayItem extends IMSourceBaseItem {
  children: string[];
  parent?: string;
}

interface IMSourceTreeItem extends IMSourceBaseItem {
  children: IMSourceTreeItem[];
  parent?: IMSourceTreeItem;
}

// 2d axis data
type IM2DAxisData = {
  x: number;
  y: number;
};

interface IMOptShortcut {
  enable?: boolean;
  handles?: IMOptShortcutHandles;
  mapping?: IMOptShortcutMap;
}
interface IMOptShortcutDef {
  enable: boolean;
  handles: IMOptShortcutHandles;
  mapping: IMOptShortcutMapDef;
}

interface IMOptShortcutMap {
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

interface IMOptShortcutMapDef {
  addchild: number; // Insert
  addbrother: number; // Enter
  editnode: number; // F2
  delnode: number; // Delete
  toggle: number; // Space
  left: number; // Left
  up: number; // Up
  right: number; // Right
  down: number; // Down
}

interface IMOptView {
  hmargin?: number;
  vmargin?: number;
  line_width?: number;
  line_color?: string;
}
interface IMOptViewDef {
  hmargin: number;
  vmargin: number;
  line_width: number;
  line_color: string;
}

interface IMOptLayout {
  hspace?: number;
  vspace?: number;
  pspace?: number;
}
interface IMOptLayoutDef {
  hspace: number;
  vspace: number;
  pspace: number;
}

interface IMOptDefEvHanle {
  enable_mousedown_handle?: boolean;
  enable_click_handle?: boolean;
  enable_dblclick_handle?: boolean;
}
interface IMOptDefEvHanleDef {
  enable_mousedown_handle: boolean;
  enable_click_handle: boolean;
  enable_dblclick_handle: boolean;
}

interface IMOptShortcutHandles {
  [k: string]: IMAnyCall;
}

type IMDragCloseNodeData = {
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

interface IMLayoutBounds {
  n: number;
  s: number;
  w: number;
  e: number;
}
