import { destroyObject, mergeObject } from "../../../utils/tools";
import { Mind } from "../../Mind/vm";
import { IMTopicHooks, IMTopicOptionsDef, TopicProvider } from "../defs";
import { Topic } from ".";
import { IMLayoutModeValue, LayoutModeEnum } from "../../layout";
import { IMTopicProps } from ".";
import { EventManager } from '../../Event';
import { observeWidthDefaultValueMap } from '../../../utils/observe';
import { onAttributeUpdated } from './_methods';

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

export abstract class TopicLifecircle extends EventManager<Topic> {
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
  /** attributes end */
  // current topic's children nodes
  children: Topic[] = [];

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
        top: 0,
        left: 0
      } as IMPosition
    },
    // for every provider's data
    providers: {
      // [typeid]: providerData
    }
  };
  constructor(public vm: Mind, source: IMTopicProps, public options: IMTopicOptionsDef) {
    super();
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
    // set observered attribules;
    observeWidthDefaultValueMap(this as any, {
      id: id,
      topic: topic,
      index: index,
      direction: direction,
      isRoot: isRoot,
      isFree: isFree,
      isBranch: (parent && parent.isRoot) || false,
      parent: parent,
      expanded: expanded
    }, onAttributeUpdated)

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
