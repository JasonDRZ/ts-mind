import { destroyObject, mergeObject } from "../../utils/tools";
import { Mind } from "../Mind";
import { IMTopicHooks, TopicProviderInstance, IMTopicOptionsDef } from "./defs";
import { Topic } from ".";
import { IMLayoutModeValue, LayoutModeEnum } from "../layouts";
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
  public id: string;
  // current topic's data
  // weather the current topic is root topic
  public isRoot: boolean;
  // weather this topic is a branch base topic
  public isBranch: boolean;
  // weather this topic is a free topic,its location is based on root topic,and its location will not be updated automaticlly.
  // free topic has no parent topic,but root topic is stil.
  public isFree: boolean;
  // layout index, 0 is first index, Infinity index is the last child id.
  public index: number;
  // topic topic,could be any thing
  public topic: IMTopicTopic;
  /** got connection with parent nodes */
  // current topic's parent topic,root topic's parent topic is itself;
  public parent?: Topic;
  // connected with root topic,root topic's root topic is itself;
  public root: Topic;
  // connected with main branch topic,branch's branchId is self id, root has no branchId.
  public branch?: Topic;
  /**
   * can be extended attributes
   */
  // current topic's direction
  public direction: IMLayoutModeValue;
  // current topic's children nodes
  public children: Topic[] = [];
  // topic  options, index of configuration.
  public options: IMTopicOptionsDef;
  /** attributes end */

  public vm: Mind;
  // is cloned node tag
  public isClone: boolean = false;
  // state flags
  public _mounted: boolean = false;
  public _destroyed: boolean = false;
  // extra state
  public selected: boolean = false;
  public expanded: boolean = true;

  public providers: TopicProviderInstance[] = [];
  // topic private data;
  public data = {
    // for view data store
    view: {
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
  constructor(vm: Mind, source: IMTopicProps, options: IMTopicOptionsDef) {
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

  public readonly __callHook = (name: keyof IMTopicHooks, ...args: any[]) => {
    return this.vm.options.capturedError(this.vm.options.debug, () => this.options[name].apply(this, [this, ...args]));
  };
  // private setDataHook(source: IMTopicProps) {}
  // life hooks
  public readonly $destroy = () => {
    if (this._destroyed) return;
    this.__callHook("beforeDestroy");
    destroyObject(this);
    // set destroyed flag
    this._destroyed = true;
    this.__callHook("destroyed");
  };
  public readonly $beforeUpdate = () => {
    this.__callHook("beforeUpdate");
  };
  public readonly $updated = () => {
    this.__callHook("updated");
  };
  public readonly $beforeCreate = () => {
    this.__callHook("beforeCreate");
  };
  public readonly $created = () => {
    this.__callHook("created");
  };
  public readonly $shouldMount = () => {
    return this.__callHook("shouldMount");
  };
  public readonly $mounted = () => {
    this._mounted = true;
    this.__callHook("mounted");
  };
  public readonly $beforeMount = () => {
    this.__callHook("beforeMount");
  };
  public readonly $unmounted = () => {
    this._mounted = false;
    this.__callHook("unmounted");
  };

  public readonly $shouldUpdate = () => {
    return this.__callHook("shouldUpdate");
  };
  // can expand all child and itself
  public readonly $expandChange = () => {
    this.__callHook("expand", this.expanded);
  };
  public readonly $selectChange = () => {
    this.__callHook("select", this.selected);
  };
}
