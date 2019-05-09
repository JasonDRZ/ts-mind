import { Mind } from "./vm";
import { IMTopicProvider, IMTopicOptions, IMTopicOptionsDef } from "../Topic/vt";
import { IMLayoutMode } from "../layout";
export type IMMindProvider = IMProviderCustom<Mind, MindProvider>;

export class MindProvider {
  vm: Mind;
  data: object | (() => object) = {};
  constructor(vm: Mind) {
    this.vm = vm;
  }
  // provider将会在Mind created 之后beforeMount之前初始化
  beforeMount() { }
  mounted() { }
  destroyed() { }
}

export interface IMMindHooks {
  created?(this: Mind, VM: Mind): void;
  beforeMount?(this: Mind, VM: Mind): void;
  mounted?(this: Mind, VM: Mind): void;
  destroyed?(this: Mind, VM: Mind): void;
}

export type IMAnyProvider = IMTopicProvider | IMMindProvider;

export interface IMMindHooksDef {
  created(this: Mind, VM: Mind): void;
  beforeMount(this: Mind, VM: Mind): void;
  mounted(this: Mind, VM: Mind): void;
  destroyed(this: Mind, VM: Mind): void;
}

export interface IMMindEntryOptions extends IMMindHooks {
  container: string | HTMLElement;
  theme?: IMTheme;
  editable?: boolean;
  mode?: IMLayoutMode;
  debug?: boolean;
  providers?: IMKeyValue<IMMindProvider>;
  topic?: IMTopicOptions;
  capturedError?(debug: boolean, error: any): void;
  [k: string]: any;
}

export interface IMMindEntryOptionsDef extends IMMindHooksDef {
  container: string | HTMLElement;
  theme: IMTheme;
  editable: boolean;
  mode: IMLayoutMode;
  debug: boolean;
  topic: IMTopicOptionsDef;
  providers: IMKeyValue<IMMindProvider>;
  capturedError(debug: boolean, error: any): void;
  [k: string]: any;
}
