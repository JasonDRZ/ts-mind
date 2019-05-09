import { TopicLifecircle, IMTopicData } from "./lifecircle";
import { TopicView } from "../view";
import { Mind, queryTopic } from "../../Mind/vm";
import { IMTopicOptionsDef } from "../defs";
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
  initProviders
} from "./_methods";
import { IMLayoutMode, IMLayoutModeValue } from "../../layout";
import { fastDom } from "../../../utils/view";

export * from "../defs";
export * from "./_methods";

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

export type IMChangeTopicAttrKey = "isRoot" | "root" | "isBranch" | "isFree" | "index" | "topic" | "parent" | "branch" | "direction";
export const TopicAttributes = ["isRoot", "root", "isBranch", "isFree", "index", "topic", "parent", "branch", "direction"];


export class Topic extends TopicLifecircle {
  // view layer
  view: TopicView;
  // layout layer
  layout: TopicView;
  constructor(vm: Mind, topicSource: IMTopicProps, options: IMTopicOptionsDef) {
    super(vm, topicSource, options);
    const { id, rootId, branchId, isRoot = false } = topicSource;
    this.root = vm.getTopicById(rootId || id) || this;
    // free is branch also
    this.branch = isRoot ? undefined : !branchId ? undefined : vm.getTopicById(branchId) || this.parent!.branch || this;
    // after created
    this.initProviders();

    // active provider hooks
    this.$created();
    this.view = new TopicView(this);
  }

  initProviders = () => {
    initProviders(this);
  };
  /**
   * Data operation methods
   */
  // this action may cost big amount computing resource,when target topic has many children topics.
  clone = (): Topic => {
    return vtClone(this);
  };
  // get topic data,in order to export data file
  getData = () => {
    return getTopicData(this);
  };
  // vt configuration extends
  extends = (tarVt: Topic): Topic => {
    return vtExtend(this, tarVt);
  };
  // modify this topic content
  modifyTopic = (topic: string) => {
    return modifyTopic(this, topic);
  };
  changeMode = (mode: IMLayoutMode) => {
    this.view;
  };

  /**
   * VComp operation methods
   */
  // remove self,and destroy self
  remove = () => {
    return selfRemove(this);
  };
  // add new child topic
  addChild = (topic: Topic) => {
    return addChild(this, topic);
  };
  hasChild = (vt: IMTopic) => {
    const _c = queryTopic(this.vm, vt);
    return !_c ? false : branch(this).hasChild(_c);
  };
  findChildById = (id: string) => {
    return branch(this).findChild(id);
  };
  // remove some child topic
  removeChildById = (id: string) => {
    return removeChildById(this, id);
  };
  // find a child by id
  getChildById = (id: string) => {
    return this.children.find(child => child.id === id);
  };
  // get child index by id
  getChildIndexById = (id: string) => {
    return this.children.findIndex(child => child.id === id);
  };

  select = (select: boolean = !this.selected, selectChildren: boolean = false) => {
    this.selected = select;
    // internal expand children nodes
    if (selectChildren && this.children.length > 0) {
      this.children.map(child => child.select(select, selectChildren));
    }
    const selectedMap = this.vm.topicSelectedMap;
    if (this.selected) {
      selectedMap.set(this.id, this);
    } else {
      selectedMap.delete(this.id);
    }
    return fastDom.mutate(() => {
      this.view.select();
      if (this.selected) {
        this.focus(true);
      }
      this.$selectChange();
    });
  };
  focus = (yes: boolean = true) => {
    if (this.focused === yes) return Promise.reject();
    // 修改状态
    this.focused = yes;
    return fastDom.mutate(() => {
      if (this.focused) {
        this.vm.topicCurrentFocus && this.vm.topicCurrentFocus.focus(false);
        this.vm.topicCurrentFocus = this;
      } else this.vm.topicCurrentFocus = undefined;
      this.view.focus();
    });
  };
  // can expand all child and itself
  expand = (expand = !this.expanded, expandChildren: boolean = false) => {
    this.expanded = expand;
    // internal expand children nodes
    if (expandChildren && this.children.length > 0) {
      this.children.map(child => child.expand(expandChildren, expand));
    }
    return fastDom.mutate(this.view.expand).then(() => {
      this.$expandChange();
    });
  };
  changeParent = (pv: Topic | Mind, index: number = -1) => {
    return changeParent(this, pv, index);
  };
  // quick methods
  // 向前插入兄弟节点
  insertBefore() { }
  // 向后插入兄弟街节点
  insertAfter() { }
  // 向前插入父节点
  insertForward() { }
}