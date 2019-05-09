import { Topic } from "./vt";
export type IMTopicProvider = IMProviderCustom<Topic, TopicProvider>;
export abstract class TopicProvider {
  data: object | (() => object) = {};
  constructor(vt: Topic) {}
  mounted() {}
  unmounted() {}
  beforeUpdate() {}
  updated() {}
  beforeDestroy() {}
}
export interface IMTopicOptions extends IMTopicHooks {
  // common options
  providers?: IMTopicProvider[];
}

export interface IMTopicOptionsDef extends IMTopicHooksDef {
  providers: IMKeyValue<IMTopicProvider>;
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
}
