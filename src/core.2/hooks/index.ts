import VTopic from "core.2/components/VTopic/topic";
import { VMind } from "core.2/components/VMind";
export interface IMVTopicHooks {
  beforeCreate?(this: VTopic, VT: VTopic): void;
  created?(this: VTopic, VT: VTopic): void;
  beforeMount?(this: VTopic, VT: VTopic): void;
  mounted?(this: VTopic, VT: VTopic): void;
  unmounted(this: VTopic, VT: VTopic): void;
  beforeUpdate?(this: VTopic, VT: VTopic): void;
  updated?(this: VTopic, VT: VTopic): void;
  beforeDestroy?(this: VTopic, VT: VTopic): void;
  destroyed?(this: VTopic, VT: VTopic): void;
  select?(this: VTopic, VT: VTopic, select: boolean): void;
  expand?(this: VTopic, VT: VTopic, expand: boolean): void;
  shouldMount?(this: VTopic, VT: VTopic): boolean;
  shouldUpdate?(this: VTopic, VT: VTopic): boolean;
}

export class VTopicHooks {
  beforeCreate(this: VTopic, VT: VTopic): void {}
  created(this: VTopic, VT: VTopic): void {}
  beforeMount(this: VTopic, VT: VTopic): void {}
  mounted(this: VTopic, VT: VTopic): void {}
  unmounted(this: VTopic, VT: VTopic): void {}
  beforeUpdate(this: VTopic, VT: VTopic): void {}
  updated(this: VTopic, VT: VTopic): void {}
  beforeDestroy(this: VTopic, VT: VTopic): void {}
  destroyed(this: VTopic, VT: VTopic): void {}
  select(this: VTopic, VT: VTopic, select: boolean): void {}
  expand(this: VTopic, VT: VTopic, expand: boolean): void {}
  shouldMount(this: VTopic, VT: VTopic): boolean {
    return true;
  }
  shouldUpdate(this: VTopic, VT: VTopic): boolean {
    return true;
  }
}

export interface IMVMindHooks {
  beforeCreate?(this: VMind, VM: VMind): void;
  created?(this: VMind, VM: VMind): void;
  beforeMount?(this: VMind, VM: VMind): void;
  mounted?(this: VMind, VM: VMind): void;
  beforeUpdate?(this: VMind, VM: VMind): void;
  updated?(this: VMind, VM: VMind): void;
  beforeDestroy?(this: VMind, VM: VMind): void;
  destroyed?(this: VMind, VM: VMind): void;
  shouldMount?(this: VMind, VM: VMind): boolean;
  shouldUpdate?(this: VMind, VM: VMind): boolean;
}
export class VMindHooks {
  beforeCreate(this: VMind, VM: VMind): void {}
  created(this: VMind, VM: VMind): void {}
  beforeMount(this: VMind, VM: VMind): void {}
  mounted(this: VMind, VM: VMind): void {}
  beforeUpdate(this: VMind, VM: VMind): void {}
  updated(this: VMind, VM: VMind): void {}
  beforeDestroy(this: VMind, VM: VMind): void {}
  destroyed(this: VMind, VM: VMind): void {}
  shouldMount(this: VMind, VM: VMind): boolean {
    return true;
  }
  shouldUpdate(this: VMind, VM: VMind): boolean {
    return true;
  }
}
