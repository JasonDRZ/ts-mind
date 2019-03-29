import { Mind } from ".";
import { IMTopicProvider, IMTopicOptions, IMTopicOptionsDef } from "../Topic";
export declare class MindProviderInstance {
  data?: object | (() => object);
  mounted(): void;
  updated(): void;
  destroyed(): void;
  [k: string]: any;
}
export type IMMindProvider = IMProviderCustom<Mind, MindProviderInstance>;

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

export interface IMMindOptions extends IMMindHooks {
  className?: string;
  providers?: IMMindProvider[];
  style?: IMCSSStyleMap;
}

export interface IMMindOptionsDef extends IMMindHooksDef {
  className: string;
  providers: IMMindProvider[];
  style: IMCSSStyleMap;
}

export interface IMMindEntryOptions {
  container: string | HTMLElement;
  theme?: IMTheme;
  editable?: boolean;
  mode?: IMMode;
  debug?: boolean;
  providers?: IMAnyProvider[];
  topic?: IMTopicOptions;
  mind?: IMMindOptions;
  capturedError?(debug: boolean, error: any): void;
  [k: string]: any;
}

export interface IMMindEntryOptionsDef {
  container: string | HTMLElement;
  theme: IMTheme;
  editable: boolean;
  mode: IMMode;
  debug: boolean;
  providers: IMAnyProvider[];
  topic: IMTopicOptionsDef;
  mind: IMMindOptionsDef;
  capturedError(debug: boolean, error: any): void;
  [k: string]: any;
}
