/**
 * COMMON PART
 */
// mind direction tag
type IMDirection = "left" | "sides" | "right" | "bottom";
// mind direction value
type IMDirectionValue = -1 | 0 | 1 | 2;
// event name
type IMEventType = "show" | "resize" | "edit" | "select" | "mousedown" | "click" | "dblclick";
// event name goust
type IMEventTypeValue = 1 | 2 | 3 | 4;
// Callback
type IMAnyCall<Arg extends any[] = any[], Return = any> = (...arg: Arg) => Return;
type IMEmpty = undefined | null | "";
type IMUnionNull<Tar> = Tar | null;
type IMKeyValue<V = any> = { [k: string]: V };

type IMMode = IMDirection;
type IMTheme = string;

type IMProviderType = "mind" | "topic" | "data";

type IMCSSStyleMap = IMKeyValue;

interface IMPosition {
  x: number;
  y: number;
}
interface IMPositionDefect {
  x?: number;
  y?: number;
}

/**
 * CUSTOM PART, WIDTH NAMESPACE
 */
// Topic topic type
type IMTopicTopic = string;
type IMTopicPrivateData<T = {}> = IMKeyValue & T;
type IMMindPrivateData<T = {}> = IMKeyValue & T;
// Topic export data
type IMTopicExportData = {
  id: string;
  topic: IMTopicTopic;
  index: number;
  direction: IMDirectionValue;
  isRoot: boolean;
  // root topic has no parent topic
  parentId?: string;
  expanded: boolean;
  data: IMTopicPrivateData;
};
type IMMindData<EX = {}> = Map<string, IMTopicExportData & EX>;

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

/**
 * provider defination
 */
interface IMProviderStatic {
  readonly typeId: string;
  readonly type: "mind" | "topic" | "data";
}
interface IMProviderCustom<CTX, ProviderAPI> extends IMProviderStatic {
  new (vm: CTX): ProviderAPI;
}
