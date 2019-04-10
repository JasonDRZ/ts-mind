import { Mind } from "../core/Mind";
import { eleAbsolute } from "./view";
import { precision } from "./tools";

// set root topic to center position
export function centerRoot(vm: Mind, force: boolean = false) {
  eleAbsolute(vm.rootTopic.view.$els.container);
  const { w: cw, h: ch } = vm.view.getSize();
  const {
    topicBox: { w: rcw, h: rch }
  } = vm.rootTopic.view.getSize();
  const position = {
    x: precision(cw / 2 - rcw / 2),
    y: precision(ch / 2 - rch / 2)
  };
  vm.rootTopic.view.setPosition(position);
}
// center scroll position
export function centerCanvas(vm: Mind, force: boolean = false) {
  if (!force) return;
  const { container } = vm.view.$el;
  container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;
  container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
}
