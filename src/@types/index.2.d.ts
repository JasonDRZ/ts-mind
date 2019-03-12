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
// VTopic topic type
type IMVTopicTopic = string;
type IMVTopicPrivateData<T = {}> = { [k: string]: object } & T;
// VTopic export data
type IMVTopicExportData = {
  id: string;
  topic: IMVTopicTopic;
  index: number;
  direction: IMDirectionValue;
  isRoot: boolean;
  parentId: string;
  expanded: boolean;
  data: IMVTopicPrivateData;
};
type IMVTopicOptions = {
  id: string;
  topic: IMVTopicTopic;
  index: number;
  direction: IMDirectionValue;
  isRoot: boolean;
  isBranch: boolean;
  parentId: string;
  rootId: string;
  branchId?: string;
};
type IMMindData<EX = {}> = Map<string, IMVTopicExportData & EX>;

interface IMVmindMoveNodeToTargetData {
  toParentId: string;
  // 不填，则默认添加到最后
  toIndex?: string;
}

/**
 * DATA SOURCE
 */
// source data type
type IMSourceFormatType = string; //"mind_list" | "mind_tree" | "mind_free";
type IMSourceData<Source> = {
  meta: IMSourceMeta;
  format: IMSourceFormatType;
  data: Source;
};
interface IMSourceMeta {
  name: string;
  author: any;
  version: string;
}
