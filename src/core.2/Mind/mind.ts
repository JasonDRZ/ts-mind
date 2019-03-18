import { IMTopicProps, IMTopic, Topic } from "../Topic";
import { Mind } from ".";

export function queryTopic(vm: Mind, node: IMTopic) {
  return typeof node === "string" ? vm.getTopicById(node) : node;
}

function _createNode(vm: Mind, data: IMTopicProps) {
  return new Topic(vm, data, vm.options.topic);
}

export function collectTopic(vm: Mind, vt: Topic) {
  const exist = vm.topicCollectedMap.get(vt.id);
  if (exist) {
    vm.logger.error(`Duplicated topic ID：${vt.id}`, vt);
    return false;
  }
  vm.topicCollectedMap.set(vt.id, vt);
  return true;
}

// if no parent node,that means vm node is a root node;
export function addTopic(vm: Mind, topicData: IMTopicProps, parent?: IMTopic): boolean {
  // TODO: vm method is to add topic to mind container element.
  if (topicData.id in vm.topicCollectedMap) {
    vm.logger.warn(`The node[id:${topicData.id}] already exist!`);
    return false;
  }
  let node;
  if (!vm.rootTopic) {
    // add first topic as root node
    node = _createNode(vm, topicData);
    vm.rootTopic = node;
  } else if (!parent) {
    // add free topic
    node = _createNode(vm, { ...topicData, rootId: vm.rootTopic.id });
  } else {
    // add normal topic
    parent = queryTopic(vm, parent);
    if (!parent) return false;
    // add child node
    // const direction = parent.isRoot ? computeRootChildDirection(parent.children) : parent.direction;
    // create current node instance
    node = _createNode(vm, { ...topicData, parentId: parent.id, rootId: parent.root.id, branchId: parent.branch!.id });
    // add node to its parent
    parent.addChild(node);
  }
  // add node to global topicCollectedMap
  vm.collectTopic(node);
  return true;
}

// move topic to someone else parent topic
export function moveTopicTo(vm: Mind, targetTopic: IMTopic, toParentId?: string, toIndex?: number) {
  // get nodes
  targetTopic = queryTopic(vm, targetTopic);
  if (!targetTopic) return false;
  if (!toParentId) {
    // TODO: to be an free topic
  }
  const toParent = vm.getTopicById(toParentId as string) as Topic;
  // insert child
  return targetTopic.changeParent(toParent);
}

export function removeTopic(vm: Mind, topic: IMTopic) {
  const _logger_act = `Removetopic`;
  topic = queryTopic(vm, topic);
  if (!topic) {
    vm.logger.error(_logger_act, `The topic can not be found!`);
    return false;
  }
  if (topic.isRoot) {
    vm.logger.error(_logger_act, `Root topic can not be removed!`);
    return false;
  }
  const flag = topic.remove();
  // clear cache
  topic = null as any;
  return flag;
}

export function selectTopic(vm: Mind, topic: IMTopic) {
  topic = queryTopic(vm, topic);
  if (!topic) {
    vm.logger.error("Selecttopic", `The topic can not be found!`);
    return false;
  }
  vm.topicSelectedMap.set(topic.id, topic);
  topic.toggleSelect(true);
  return true;
}
export function deselectTopic(vm: Mind, topic: IMTopic) {
  topic = queryTopic(vm, topic);
  if (!topic) {
    vm.logger.error("Deselecttopic", `The topic can not be found!`);
    return false;
  }
  vm.topicSelectedMap.delete(topic.id);
  topic.toggleSelect(false);
  return true;
}
