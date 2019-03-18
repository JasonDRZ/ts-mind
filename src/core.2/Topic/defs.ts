import Topic from "./topic";
export declare class TopicProviderInstance {
  data?: object | (() => object);
  mounted(): void;
  updated(): void;
  destroyed(): void;
  selected(): void;
  expanded(): void;
  [k: string]: any;
}
export type IMTopicProvider = IMProviderCustom<Topic, TopicProviderInstance>;

export interface IMTopicOptions extends IMTopicHooks {
  classNames?: {
    container?: string;
    topicBox?: string;
    topic?: string;
    children?: string;
  };
  providers?: IMTopicProvider[];
  style?: IMCSSStyleMap;
}

export interface IMTopicOptionsDef extends IMTopicHooksDef {
  classNames: {
    container: string;
    topicBox: string;
    topic: string;
    children: string;
  };
  providers: IMTopicProvider[];
  style: IMCSSStyleMap;
}

export interface IMTopicHooksDef {
  beforeCreate(this: Topic, VT: Topic): void;
  created(this: Topic, VT: Topic): void;
  beforeMount(this: Topic, VT: Topic): void;
  mounted(this: Topic, VT: Topic): void;
  unmounted(this: Topic, VT: Topic): void;
  beforeUpdate(this: Topic, VT: Topic): void;
  updated(this: Topic, VT: Topic): void;
  beforeDestroy(this: Topic, VT: Topic): void;
  destroyed(this: Topic, VT: Topic): void;
  select(this: Topic, VT: Topic, select: boolean): void;
  expand(this: Topic, VT: Topic, expand: boolean): void;
  shouldMount(this: Topic, VT: Topic): boolean;
  shouldUpdate(this: Topic, VT: Topic): boolean;
}

export interface IMTopicHooks {
  beforeCreate?(this: Topic, VT: Topic): void;
  created?(this: Topic, VT: Topic): void;
  beforeMount?(this: Topic, VT: Topic): void;
  mounted?(this: Topic, VT: Topic): void;
  unmounted?(this: Topic, VT: Topic): void;
  beforeUpdate?(this: Topic, VT: Topic): void;
  updated?(this: Topic, VT: Topic): void;
  beforeDestroy?(this: Topic, VT: Topic): void;
  destroyed?(this: Topic, VT: Topic): void;
  select?(this: Topic, VT: Topic, select: boolean): void;
  expand?(this: Topic, VT: Topic, expand: boolean): void;
  shouldMount?(this: Topic, VT: Topic): boolean;
  shouldUpdate?(this: Topic, VT: Topic): boolean;
}
