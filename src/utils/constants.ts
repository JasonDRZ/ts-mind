import { MindDrag } from "./../providers/mind.drag";
import { IMMindEntryOptionsDef } from "../core/Mind/defs";

export const __name__ = "TSMind";
// library version
export const __version__ = "1.0.2";
// authores
export const __author__ = "1071115676@qq.com";

/**
 * DEFAULT OPTIONS
 */
export const DEFAULT_OPTIONS: IMMindEntryOptionsDef = {
  container: "", // id of the container
  editable: false, // you can change it in your options
  theme: "primary",
  mode: "sides", // full or side
  debug: false,
  providers: { MindDrag },
  classNames: {
    canvas: "tsm-canvas",
    container: "tsm-container"
  },
  style: {},
  topic: {
    position: {
      x: 0,
      y: 0
    },
    classNames:
      // element className map
      {
        container: "tsm-topic-container",
        topicBox: "tsm-topic-box",
        topic: "tsm-topic",
        children: "tsm-topic-children"
      },
    style: {},
    providers: {},
    beforeCreate() {
      // console.log("Topic: beforeCreate", this);
    },
    created() {
      // console.log("Topic: created", this);
    },
    beforeMount() {
      // console.log("Topic: beforeMount", this);
    },
    mounted() {
      // console.log("Topic: mounted", this);
    },
    unmounted() {
      // console.log("Topic: unmounted", this);
    },
    beforeUpdate() {
      // console.log("Topic: beforeUpdate", this);
    },
    updated() {
      // console.log("Topic: updated", this);
    },
    beforeDestroy() {
      // console.log("Topic: beforeDestroy", this);
    },
    destroyed() {
      // console.log("Topic: destroyed", this);
    },
    select() {
      // console.log("Topic: select", this);
    },
    expand() {
      // console.log("Topic: expand", this);
    },
    shouldMount() {
      // console.log("Topic: beforeCshouldMountreate", this);
      return true;
    },
    shouldUpdate() {
      // console.log("Topic: shouldUpdate", this);
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
  beforeCreate() {
    console.log("Mind: beforeCreate", this);
  },
  created() {
    console.log("Mind: created", this);
  },
  beforeMount() {
    console.log("Mind: beforeMount", this);
  },
  mounted() {
    console.log("Mind: mounted", this);
  },
  unmounted() {
    console.log("Mind: unmounted", this);
  },
  beforeUpdate() {
    console.log("Mind: beforeUpdate", this);
  },
  updated() {
    console.log("Mind: updated", this);
  },
  beforeDestroy() {
    console.log("Mind: beforeDestroy", this);
  },
  destroyed() {
    console.log("Mind: destroyed", this);
  },
  shouldMount() {
    console.log("Mind: shouldMount", this);
    return true;
  },
  shouldUpdate() {
    console.log("Mind: shouldUpdate", this);
    return true;
  }
};
