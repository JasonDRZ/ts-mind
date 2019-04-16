import { Mind, queryTopic } from "../Mind";
import { extend, randomId, initAnyProviders } from "../../utils/tools";
import { Topic, IMTopicExportData } from ".";
import { IMChangeTopicAttrKey } from "./lifecircle";

export function initProviders(vt: Topic) {
  initAnyProviders(vt, vt.options.providers, vt.data.providers);
}

// some new vtopic instance could extend his future parent's stuff.
export function vtExtend(vt: Topic, tarVt: Topic): Topic {
  // just extend attr,which can be extended.
  vt.direction = tarVt.direction;
  // options is read only for vtopic seft.
  vt.options = tarVt.options;
  vt.data = extend(true, {}, tarVt.data);
  vt.branch = tarVt.branch;
  return tarVt;
}

export function vtClone(vt: Topic): Topic {
  const _clone = extend<Topic>({}, vt);
  _clone.id = randomId();
  _clone.isBranch = false;
  _clone.isRoot = false;
  _clone.isClone = true;
  _clone._mounted = false;
  _clone._destroyed = false;
  // reset providers
  _clone.initProviders();
  // reset view
  _clone.view.initElements();
  _clone.view.vt = _clone;
  // TODO: weather have layout providers
  // reset layout
  _clone.layout.initElements();
  _clone.layout.vt = _clone;
  // clone all children
  _clone.children = vt.children.map(cvt => {
    return cvt.clone();
  });
  return _clone;
}

export function modifyTopic(vt: Topic, topic: string): boolean {
  if (topic === vt.topic) return false;
  vt.topic = topic;
  // vt.view.updateTopic(topic);
  // TODO: 需要进行数据驱动设计
  return true;
}

export function changeParent(vt: Topic, parent: Topic | Mind = vt.vm, index: number): boolean {
  if (parent instanceof Mind) {
    vt.parent = undefined;
    vt.branch = vt;
    vt.index = 0;
    vt.isBranch = false;
    vt.isClone = false;
    // TODO: 待完成mind中插入自由主题功能
    return parent.freeTopic(vt);
  }
  const op = queryTopic(vt.vm, vt.parent) as Topic;
  if (op.id === parent.id) return false;
  op.removeChildById(vt.id);
  vt.parent = parent;
  vt.branch = parent.isRoot ? vt : parent.branch;
  // change index
  vt.index = index;
  return !!parent.addChild(vt);
}

export function removeChildById(vt: Topic, id: string): boolean {
  const childVt = vt.vm.getTopicById(id);
  if (!childVt) return false;
  const childIndex = vt.getChildIndexById(id);
  if (childIndex === -1) return false;
  // start to remove target child,and destroy it.
  vt.$beforeUpdate();
  // remove vtopic from parent vtopic child list
  vt.children.splice(childIndex, 1)[0];
  // unmount elements
  childVt.view.unmount();
  // reindex children
  reindexChildren(vt);
  // call hook
  vt.$updated();
  return true;
}

// just self remove can destroy itself.
export function selfRemove(vt: Topic) {
  // can not remove root topic
  if (vt.isRoot) return false;
  const pvt = vt.parent;
  if (!pvt) return false;
  // remove from parent
  pvt.removeChildById(vt.id);
  // destroy instance
  pvt.$destroy();
  return true;
}

// get some Topic's data
export function getTopicData(vt: Topic): IMTopicExportData {
  return {
    id: vt.id,
    index: vt.index,
    topic: vt.topic,
    direction: vt.direction,
    isRoot: vt.isRoot,
    parentId: vt.parent!.id,
    expanded: vt.expanded,
    data: vt.data
  };
}

// add a child Topic to a parent Topic
export function addChild(vt: Topic, cvt: Topic) {
  vt.$beforeUpdate();
  if (!vt.isRoot) {
    // if parent isn't root,extends parent's direction
    cvt.direction = vt.direction;
    cvt.branch = vt.branch;
  } else {
    // calculate direction
    // TODO: Topic Direction compute
    // cvt.direction = computeRootChildDirection(vt);
    // is branch topic
    cvt.isBranch = true;
    cvt.branch = cvt;
  }
  cvt.parent = vt;
  // vt value [Infinity] can just show once,then
  if (Number.isFinite(cvt.index)) {
    vt.children.push(cvt);
  } else {
    vt.children.splice(cvt.index, 0, cvt);
  }
  // update children index, after pushed or inserted.
  reindexChildren(vt);
  // reset some attrs
  cvt.isClone = false;
  cvt.isFree = false;
  cvt.isRoot = false;
  cvt.view.mount();
  vt.$updated();
  return vt;
}

function reindexChildren(vt: Topic) {
  vt.children.map((child, idx) => {
    child.index = idx;
  });
}

// tool methods
export function branch(rvt: Topic) {
  const rid = rvt.id;
  return {
    // To determine vt topic weather belongs to some parent topic;
    hasChild(cvt: Topic, findDeep: boolean = false): boolean {
      if (!(cvt instanceof Topic)) {
        throw Error(`The target child should be an instance of Topic!`);
      }
      // parent is root vtopic
      if (rvt.isRoot) return true;
      // same vtopic
      if (rvt.id === cvt.id) return true;
      // internal searching
      let _pvt = cvt.parent;
      do {
        if (!_pvt) return false;
        if (_pvt.id === rid) return true;
        // deep searching
        if (findDeep) _pvt = _pvt.parent;
        else _pvt = undefined;
      } while (!!_pvt);
      return false;
    },
    // find some topic from a declared parent topic
    findChild(id: string, findDeep: boolean = false): null | Topic {
      for (const child of rvt.children) {
        if (child.id === id) return child;
        else if (findDeep && child.children.length > 0) {
          const _fd = branch(child).findChild(id);
          if (_fd) return _fd;
        }
      }
      return null;
    }
  };
}

export function setAttribute(topic: Topic, attr: IMChangeTopicAttrKey, value: any) {
  switch (attr) {
    case "index": {
      if (value !== topic.index && topic.parent) {
        topic.parent;
      }
      break;
    }
    case "direction": {
      if (value !== topic.direction) {
        topic.direction = value;
        topic.view.changeModeClassName();
      }
    }
  }
}
