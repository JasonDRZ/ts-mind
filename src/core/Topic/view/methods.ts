import { addEvent, removeEvent } from "../../../utils/dom";
import { TopicView } from ".";
import { Topic } from "../vt";
import { whileFor, whileMap } from "../../../utils/tools";
/**
 * 私有方法集
 */
export const checkClassNames = (view: TopicView) => {
  const _boxClass = view.$els.topicBox.classList;
  // add branch className
  if (view.vt.isBranch) {
    _boxClass.add("branch-topic");
  } else _boxClass.remove("branch-topic");
  // add root className
  if (view.vt.isRoot) {
    view.$els.topicBox.classList.add("root-topic");
  }
  if (view.vt.children.length === 0) {
    view.$els.children.style.display = "none";
  }
};
export const bindNodeEvents = (view: TopicView) => {
  view.$els.expander && addEvent(view.$els.expander, "click", expanderHandler.bind(view));
  addEvent(view.$els.topicBox, "click", selectTopicHandler.bind(view));
  addEvent(view.vt.vm.view.$els.canvas, "click", deselecteTopic.bind(view));
};
export const unbindEvents = (view: TopicView) => {
  view.$els.expander && removeEvent(view.$els.expander, "click", expanderHandler.bind(view));
  removeEvent(view.$els.topicBox, "click", selectTopicHandler.bind(view));
  removeEvent(view.vt.vm.view.$els.canvas, "click", deselecteTopic.bind(view));
};

function selectTopicHandler(this: TopicView, e: MouseEvent) {
  e.stopPropagation();
  e.isTrusted && this.vt.select();
}
function deselecteTopic(this: TopicView, e: MouseEvent) {
  if (e.isTrusted && e.target !== this.$els.topicBox) {
    this.vt.selected && this.vt.select(false);
    this.vt.vm.topicCurrentFocus && this.vt.vm.topicCurrentFocus.focus(false);
  }
}
function expanderHandler(this: TopicView, e: MouseEvent) {
  e.stopPropagation();
  this.vt.expand();
}

export function updateRectSyncDeep(topic: Topic) {
  topic.view.updateEleRectSync();
  whileFor(topic.children, updateRectSyncDeep);
}
export function updateRectDeep(topic: Topic): Promise<any> {
  const que = _updateRectDeep(topic);
  return Promise.all(que).then((modifies: boolean[]) => {
    // 若有一个更新了需要更新
    return modifies.find(modify => modify);
  });
}

function _updateRectDeep(topic: Topic): Array<Promise<any>> {
  let que = [topic.view.updateEleRect(true)];
  whileMap(topic.children, _topic => {
    que = que.concat(_updateRectDeep(_topic));
  });
  return que;
}
