import { destroyObject, mergeObject } from "../../utils/tools";
import { Mind } from "../Mind";
import { IMTopicHooks, IMTopicOptionsDef, TopicProvider } from "./defs";
import { Topic } from ".";
import { IMLayoutModeValue, LayoutModeEnum } from "../layout";
import { IMTopicProps } from ".";

export interface IMTopicData {
  // for view data store
  view?: {
    position?: IMPosition;
    [k: string]: any;
  };
  // for every provider's data
  providers?: {
    // [typeid]: providerData
    [k: string]: any;
  };
}

export type IMChangeTopicAttrKey = "isRoot" | "root" | "isBranch" | "isFree" | "index" | "topic" | "parent" | "branch" | "direction";

export class TopicLifecircle {
  /**
   * Topic attributes
   */
  // unique topic identifier
  id: string;
  // current topic's data
  // weather the current topic is root topic
  isRoot: boolean;
  // weather this topic is a branch base topic
  isBranch: boolean;
  // weather this topic is a free topic,its location is based on root topic,and its location will not be updated automaticlly.
  // free topic has no parent topic,but root topic is stil.
  isFree: boolean;
  // layout index, 0 is first index, Infinity index is the last child id.
  index: number;
  // topic topic,could be any thing
  topic: IMTopicTopic;
  /** got connection with parent nodes */
  // current topic's parent topic,root topic's parent topic is itself;
  parent?: Topic;
  // connected with root topic,root topic's root topic is itself;
  root: Topic;
  // connected with main branch topic,branch's branchId is self id, root has no branchId.
  branch?: Topic;
  /**
   * can be extended attributes
   */
  // current topic's direction
  direction: IMLayoutModeValue;
  // current topic's children nodes
  children: Topic[] = [];
  /** attributes end */

  // is cloned node tag
  isClone: boolean = false;
  // state flags
  _mounted: boolean = false;
  _destroyed: boolean = false;
  // extra state
  selected: boolean = false;
  expanded: boolean = true;
  focused: boolean = false;

  providers: TopicProvider[] = [];
  // topic private data;
  data = {
    // for view data store
    layout: {
      position: {
        x: 0,
        y: 0
      }
    },
    // for every provider's data
    providers: {
      // [typeid]: providerData
    }
  };
  constructor(public vm: Mind, source: IMTopicProps, public options: IMTopicOptionsDef) {
    const {
      // required fields
      id,
      topic = "",
      // optional fields,-1 means add the Topic to a place that is after some last child-Topic.
      parentId,
      data = {},
      index = Infinity,
      isRoot = false,
      isFree = false,
      direction = LayoutModeEnum.center,
      expanded = true
    } = source;
    if (!id) {
      throw Error(`The params (id,topic) are all required,when create an Topic!In order to reduce the loss of Topic-searching performance.`);
    }
    const parent = vm.getTopicById(parentId as string);
    // console.info(parent);
    // config
    this.id = id;
    this.topic = topic;
    this.index = index;
    this.direction = direction;
    this.isRoot = isRoot;
    this.isFree = isFree;
    this.isBranch = (parent && parent.isRoot) || false;
    this.parent = parent;
    this.expanded = expanded;

    this.vm = vm;
    this.options = options;
    Object.keys(data).map(key => {
      mergeObject(this.data[key], data[key]);
    });
    this.$beforeCreate();
  }

  readonly __callHook = (name: keyof IMTopicHooks, ...args: any[]) => {
    return this.vm.options.capturedError(this.vm.options.debug, () => this.options[name].apply(this, [this, ...args]));
  };
  // private setDataHook(source: IMTopicProps) {}
  // life hooks
  readonly $destroy = () => {
    if (this._destroyed) return;
    this.__callHook("beforeDestroy");
    destroyObject(this);
    // set destroyed flag
    this._destroyed = true;
    this.__callHook("destroyed");
  };
  readonly $beforeUpdate = () => {
    this.__callHook("beforeUpdate");
  };
  readonly $updated = () => {
    this.__callHook("updated");
  };
  readonly $beforeCreate = () => {
    this.__callHook("beforeCreate");
  };
  readonly $created = () => {
    this.__callHook("created");
  };
  readonly $mounted = () => {
    this._mounted = true;
    this.__callHook("mounted");
  };
  readonly $beforeMount = () => {
    this.__callHook("beforeMount");
  };
  readonly $unmounted = () => {
    this._mounted = false;
    this.__callHook("unmounted");
  };

  // can expand all child and itself
  readonly $expandChange = () => {
    this.__callHook("expand", this.expanded);
  };
  readonly $selectChange = () => {
    this.__callHook("select", this.selected);
  };
}
