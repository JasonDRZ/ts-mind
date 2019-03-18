import { IMMindOptionsDef } from "core.2/Mind/defs";

export const __name__ = "TSMind";
// library version
export const __version__ = "1.0.2";
// authores
export const __author__ = "1071115676@qq.com";

// mind direction
export const TSMindDirectionMap: { [k: string]: IMDirectionValue } = {
  center: 0,
  top: 1,
  right: 2,
  bottom: 3,
  left: 4
};
export enum TSMindDirectionEnum {
  center = 0,
  top = 1,
  right = 2,
  bottom = 3,
  left = 4
}

/**
 * DEFAULT OPTIONS
 */
export const DEFAULT_OPTIONS: IMMindOptionsDef = {
  container: "", // id of the container
  editable: false, // you can change it in your options
  theme: "primary",
  mode: "left-right", // full or side
  debug: false,
  providers: [],
  topic: {
    classNames:
      // element className map
      {
        container: "tsm-topic-container",
        topicBox: "tsm-topic-box",
        topic: "tsm-topic",
        children: "tsm-topic-children"
      },
    style: {},
    providers: [],
    beforeCreate() {},
    created() {},
    beforeMount() {},
    mounted() {},
    unmounted() {},
    beforeUpdate() {},
    updated() {},
    beforeDestroy() {},
    destroyed() {},
    select() {},
    expand() {},
    shouldMount() {
      return true;
    },
    shouldUpdate() {
      return true;
    }
  },
  capturedError(debug: boolean, fn: IMAnyCall) {
    let res;
    if (debug) {
      try {
        res = fn();
      } catch (error) {
        console.error(error);
      }
    } else res = fn();
    return res;
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  unmounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  shouldMount() {
    return true;
  },
  shouldUpdate() {
    return true;
  }
};
