import { TopicLifecircle } from "./lifecircle";
import { TopicView } from "./view";
import { Mind, queryTopic } from "../Mind";
import { IMTopicOptionsDef } from "./defs";
import { vtClone, getTopicData, vtExtend, modifyTopic, selfRemove, addChild, branch, removeChildById, changeParent, initProviders } from "./topic";

export * from "./defs";
export * from "./topic";

// just can be node-id or mind-node
export type IMTopic = undefined | string | Topic;

export interface IMTopicProps {
  id: string;
  topic: IMTopicTopic;
  parentId?: string;
  rootId?: string;
  // 仅在运行时创建此字段
  branchId?: string;
  index?: number;
  isRoot?: boolean;
  isFree?: boolean;
  direction?: IMDirectionValue;
  expanded?: boolean;
}

export class Topic extends TopicLifecircle {
  /**
   * Topic attrbutes
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
  // current topic's visible flag
  public expanded: boolean;
  /** got connection with parent nodes */
  // current topic's parent topic,root topic's parent topic is itself;
  public parent?: Topic;
  // connected with root topic,root topic's root topic is itself;
  public root: Topic;
  // connected with main branch topic,branch's branchId is self id, root has no branchId.
  public branch?: Topic;
  /**
   * can be extended attrs
   */
  // current topic's direction
  public direction: IMDirectionValue;
  // topic private data;
  public data: IMTopicPrivateData = {};

  // current topic's children nodes
  public children: Topic[] = [];

  // view layer
  public view: TopicView;
  // layout layer
  public layout: TopicView;

  // is cloned node tag
  public isClone: boolean = false;

  constructor(
    vm: Mind,
    {
      // required fields
      id,
      topic,
      // optional fields,-1 means add the Topic to a place that is after some last child-Topic.
      parentId,
      rootId,
      branchId,
      index = Infinity,
      isRoot = false,
      isFree = false,
      direction = 0,
      expanded = true
    }: IMTopicProps,
    options: IMTopicOptionsDef
  ) {
    super(vm, options);
    if (!id || !topic) {
      throw Error(`The params (id,topic) are all required,when create an Topic!In order to reduce the loss of Topic-searching performance.`);
    }
    const parent = vm.getTopicById(parentId as string);
    // config
    this.id = id;
    this.topic = topic;
    this.index = index;
    this.direction = direction;
    this.isRoot = isRoot;
    this.isFree = isFree;
    this.isBranch = parent!.isRoot || false;
    this.parent = parent;
    this.root = vm.getTopicById(rootId || id) || this;
    this.branch = isRoot ? undefined : !branchId ? undefined : vm.getTopicById(branchId) || parent!.branch || this;
    this.state.expanded = expanded;
    this.view = new TopicView(this);
    this.$created();
    // after created
    this.initProviders();
  }
  public initProviders = () => {
    initProviders(this);
  };
  /**
   * Data operation methods
   */
  // this action may cost big amount computing resource,when target topic has many children topics.
  public clone = (): Topic => {
    return vtClone(this);
  };
  // get topic data,in order to export data file
  public getData = () => {
    return getTopicData(this);
  };
  // vt configuration extends
  public extends = (tarVt: Topic): Topic => {
    return vtExtend(this, tarVt);
  };
  // modify this topic content
  public modifyTopic = (topic: string) => {
    return modifyTopic(this, topic);
  };

  /**
   * VComp operation methods
   */
  // remove self,and destroy self
  public remove = () => {
    return selfRemove(this);
  };
  // add new child topic
  public addChild = (topic: Topic) => {
    return addChild(this, topic);
  };
  public hasChild = (vt: IMTopic) => {
    const _c = queryTopic(this.vm, vt);
    return !_c ? false : branch(this).hasChild(_c);
  };
  public findChildById = (id: string) => {
    return branch(this).findChild(id);
  };
  // remove some child topic
  public removeChildById = (id: string) => {
    return removeChildById(this, id);
  };
  // find a child by id
  public getChildById = (id: string) => {
    return this.children.find(child => child.id === id);
  };
  // get child index by id
  public getChildIndexById = (id: string) => {
    return this.children.findIndex(child => child.id === id);
  };
  public toggleSelect = (select: boolean = !this.state.selected) => {
    this.state.selected = select;
    this.$selectChange();
    return select;
  };
  // can expand all child and itself
  public toggleExpand = (toggleAll: boolean = false, expand = !this.state.expanded) => {
    this.state.expanded = expand;
    // internal expand children nodes
    if (toggleAll && this.children.length > 0) {
      this.children.map(child => child.toggleExpand(toggleAll, expand));
    }
    this.$expandChange();
    return expand;
  };
  public changeParent = (pv: Topic | Mind, index: number = -1) => {
    return changeParent(this, pv, index);
  };
  // quick methods
  // 向前插入兄弟节点
  public insertBefore() {}
  // 向后插入兄弟街节点
  public insertAfter() {}
  // 向前插入父节点
  public insertForward() {}
}
