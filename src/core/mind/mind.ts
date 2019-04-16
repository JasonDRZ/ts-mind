import { IMTopicProps, IMTopic, Topic } from "../Topic";
import { Mind } from ".";
import { initAnyProviders } from "../../utils/tools";

export function initProviders(vm: Mind) {
  initAnyProviders(vm, vm.options.providers, vm.data.providers);
}

export function queryTopic(vm: Mind, topic: IMTopic) {
  return typeof topic === "string" ? vm.getTopicById(topic) : topic;
}

function _createTopic(vm: Mind, data: IMTopicProps) {
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

// if no parent topic,that means vm topic is a root topic;
export function addTopic(vm: Mind, topicData: IMTopicProps): boolean {
  const parentId = topicData.parentId;
  // TODO: vm method is to add topic to mind container element.
  if (topicData.id in vm.topicCollectedMap) {
    vm.logger.warn(`The topic[id:${topicData.id}] already exist!`);
    return false;
  }
  let topic;
  if (!vm.rootTopic) {
    // add first topic as root topic
    topic = _createTopic(vm, topicData);
    vm.rootTopic = topic;
  } else if (!parentId) {
    // add free topic
    topic = _createTopic(vm, { ...topicData, rootId: vm.rootTopic.id });
  } else {
    // add normal topic
    const parent = queryTopic(vm, parentId);
    if (!parent) return false;
    // add child topic
    // const direction = parent.isRoot ? computeRootChildDirection(parent.children) : parent.direction;
    // create current topic instance
    topic = _createTopic(vm, { ...topicData, parentId: parent.id, rootId: parent.root.id, branchId: parent.branch ? parent.branch.id : undefined });
    // add topic to its parent
    parent.addChild(topic);
  }
  // add topic to global topicCollectedMap
  vm.collectTopic(topic);
  return true;
}

// move topic to someone else parent topic
export function moveTopicTo(vm: Mind, targetTopic: IMTopic, toParentId?: string, toIndex?: number) {
  // get topics
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
  topic.select(true);
  return true;
}
export function deselectTopic(vm: Mind, topic: IMTopic) {
  topic = queryTopic(vm, topic);
  if (!topic) {
    vm.logger.error("Deselecttopic", `The topic can not be found!`);
    return false;
  }
  vm.topicSelectedMap.delete(topic.id);
  topic.select(false);
  return true;
}
