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
export interface IMMindOptions extends IMMindHooks {
  container: string | HTMLElement;
  theme?: IMTheme;
  editable?: boolean;
  mode?: IMMode;
  debug?: boolean;
  providers?: IMAnyProvider[];
  topic?: IMTopicOptions;
  capturedError?(debug: boolean, error: any): void;
  [k: string]: any;
}

export interface IMMindOptionsDef extends IMMindOptions {
  container: string | HTMLElement;
  theme: IMTheme;
  editable: boolean;
  mode: IMMode;
  debug: boolean;
  providers: IMAnyProvider[];
  topic: IMTopicOptionsDef;
  capturedError(debug: boolean, error: any): void;
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
