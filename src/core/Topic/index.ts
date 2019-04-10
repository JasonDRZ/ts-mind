import { TopicLifecircle, IMTopicData, IMChangeTopicAttrKey } from "./lifecircle";
import { TopicView } from "./view";
import { Mind, queryTopic } from "../Mind";
import { IMTopicOptionsDef } from "./defs";
import {
  vtClone,
  getTopicData,
  vtExtend,
  modifyTopic,
  selfRemove,
  addChild,
  branch,
  removeChildById,
  changeParent,
  initProviders,
  setAttribute
} from "./methods";
import { IMLayoutMode, IMLayoutModeValue } from "../layouts";

export * from "./defs";
export * from "./methods";

// just can be node-id or mind-node
export type IMTopic = undefined | string | Topic;

export interface IMTopicProps {
  id: string;
  topic?: IMTopicTopic;
  parentId?: string;
  rootId?: string;
  // 仅在运行时创建此字段
  branchId?: string;
  index?: number;
  isRoot?: boolean;
  isFree?: boolean;
  direction?: IMLayoutModeValue;
  expanded?: boolean;
  data?: IMTopicData;
}

// Topic export data
export type IMTopicExportData = {
  id: string;
  topic: IMTopicTopic;
  index: number;
  direction: IMLayoutModeValue;
  isRoot: boolean;
  // root topic has no parent topic
  parentId?: string;
  expanded: boolean;
  data: IMTopicPrivateData;
};
export type IMMindData<EX = {}> = Map<string, IMTopicExportData & EX>;

export class Topic extends TopicLifecircle {
  // view layer
  public view: TopicView;
  // layout layer
  public layout: TopicView;

  constructor(vm: Mind, topicSource: IMTopicProps, options: IMTopicOptionsDef) {
    super(vm, topicSource, options);
    const { id, rootId, branchId, isRoot = false } = topicSource;
    this.root = vm.getTopicById(rootId || id) || this;
    this.branch = isRoot ? undefined : !branchId ? undefined : vm.getTopicById(branchId) || this.parent!.branch || this;
    // after created
    this.initProviders();

    // active provider hooks
    this.$created();
    this.view = new TopicView(this);
  }

  public attr = (attr: IMChangeTopicAttrKey, value: any) => {
    setAttribute(this, attr, value);
  };

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
  public changeMode = (mode: IMLayoutMode) => {
    this.view;
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
  public toggleSelect = (select: boolean = !this.selected) => {
    this.selected = select;
    this.$selectChange();
    return select;
  };
  // can expand all child and itself
  public toggleExpand = (toggleAll: boolean = false, expand = !this.expanded) => {
    this.expanded = expand;
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
