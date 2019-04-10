import { Mind } from ".";
import { IMTopicProvider, IMTopicOptions, IMTopicOptionsDef } from "../Topic";
import { IMLayoutMode } from "../layouts";
export declare class MindProviderInstance {
  vm: Mind;
  data?: object | (() => object);
  mounted(): void;
  updated(): void;
  destroyed(): void;
  [k: string]: any;
}
export type IMMindProvider = IMProviderCustom<Mind, MindProviderInstance>;

export class MindProvider {
  typeId: string;
  vm: Mind;
  data: object | (() => object) = {};
  constructor(vm: Mind) {
    this.vm = vm;
  }
  mounted() {}
  updated() {}
  destroyed() {}
}

export interface IMMindHooks {
  beforeCreate?(this: Mind, VM: Mind): void;
  created?(this: Mind, VM: Mind): void;
  beforeMount?(this: Mind, VM: Mind): void;
  mounted?(this: Mind, VM: Mind): void;
  unmounted?(this: Mind, VM: Mind): void;
  beforeUpdate?(this: Mind, VM: Mind): void;
  updated?(this: Mind, VM: Mind): void;
  beforeDestroy?(this: Mind, VM: Mind): void;
  destroyed?(this: Mind, VM: Mind): void;
  shouldMount?(this: Mind, VM: Mind): boolean;
  shouldUpdate?(this: Mind, VM: Mind): boolean;
}

export type IMAnyProvider = IMTopicProvider | IMMindProvider;

export interface IMMindHooksDef {
  beforeCreate(this: Mind, VM: Mind): void;
  created(this: Mind, VM: Mind): void;
  beforeMount(this: Mind, VM: Mind): void;
  mounted(this: Mind, VM: Mind): void;
  unmounted(this: Mind, VM: Mind): void;
  beforeUpdate(this: Mind, VM: Mind): void;
  updated(this: Mind, VM: Mind): void;
  beforeDestroy(this: Mind, VM: Mind): void;
  destroyed(this: Mind, VM: Mind): void;
  shouldMount(this: Mind, VM: Mind): boolean;
  shouldUpdate(this: Mind, VM: Mind): boolean;
}

export interface IMMindEntryOptions extends IMMindHooks {
  container: string | HTMLElement;
  theme?: IMTheme;
  editable?: boolean;
  mode?: IMLayoutMode;
  debug?: boolean;
  providers?: IMKeyValue<IMMindProvider>;
  className?: string;
  style?: IMCSSStyleMap;
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
  classNames: { canvas: string; container: string };
  providers: IMKeyValue<IMMindProvider>;
  style: IMCSSStyleMap;
  capturedError(debug: boolean, error: any): void;
  [k: string]: any;
}
