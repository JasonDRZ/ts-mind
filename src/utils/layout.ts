import { Mind } from "../core/Mind";
import { eleAbsolute } from "./view";
import { precision } from "./tools";

// set root topic to center position
export function centerRoot(vm: Mind) {
  eleAbsolute(vm.rootTopic.view.$els.container);
  const { w: cw, h: ch } = vm.view.getCanvasSize();
  const { w: rcw, h: rch } = vm.rootTopic.view.getSize("topicBox");
  const position = {
    x: precision(cw / 2 - rcw / 2),
    y: precision(ch / 2 - rch / 2)
  };
  vm.rootTopic.view.setPosition(position);
}
// center scroll position
export function centerCanvas(vm: Mind) {
  const { stage } = vm.view.$els;
  stage.scrollTop = (stage.scrollHeight - stage.clientHeight) / 2;
  stage.scrollLeft = (stage.scrollWidth - stage.clientWidth) / 2;
}
