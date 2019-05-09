import { Mind } from "../core/Mind/vm";
import { precision } from "./tools";
// import { Topic } from "core/Topic";

// set root topic to center position
export function centerRoot(vm: Mind) {
  const { width: cw, height: ch } = vm.view.getEleRect();
  const { width: rcw, height: rch } = vm.rootTopic.view.getEleRect();
  vm.rootTopic.view.setPosition({
    left: precision(cw / 2 - rcw / 2),
    top: precision(ch / 2 - rch / 2)
  });
}
// center scroll position
export function centerCanvas(vm: Mind) {
  const { stage } = vm.view.$els;
  stage.scrollTop = (stage.scrollHeight - stage.clientHeight) / 2;
  stage.scrollLeft = (stage.scrollWidth - stage.clientWidth) / 2;
}

// export function locationTopic(topic: Topic) {
//   const vm = topic.vm;
//   const { stage } = vm.view.$els;
//   const { topicBox: currentTopic } = topic.view.$els;
//   const { topicBox: rootTopic } = vm.rootTopic.view.$els;
//   // 获取root节点相对于当前屏幕的位置信息
//   const rootRect = rootTopic.getBoundingClientRect();
//   // 获取当前Topic在屏幕中的位置信息
//   const currentRect = currentTopic.getBoundingClientRect();
//   const stageRect = stage.getBoundingClientRect();

//   stage.scrollTop = (stage.scrollHeight - stage.clientHeight) / 2;
//   stage.scrollLeft = (stage.scrollWidth - stage.clientWidth) / 2;
// }
