/**
 * COMMON PART
 */
// event name
type IMEventType = "show" | "resize" | "edit" | "select" | "mousedown" | "click" | "dblclick";
// event name goust
type IMEventTypeValue = 1 | 2 | 3 | 4;
// Callback
type IMAnyCall<Arg extends any[] = any[], Return = any> = (...arg: Arg) => Return;
type IMEmpty = undefined | null | "";
type IMUnionNull<Tar> = Tar | null;
type IMKeyValue<V = any> = { [k: string]: V };

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
  typeId: string;
}
interface IMProviderCustom<CTX, ProviderAPI> extends IMProviderStatic {
  new (vm: CTX): ProviderAPI;
}
