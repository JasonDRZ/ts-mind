import { Topic } from "../Topic";
import { whileFor } from "../../utils/tools";
import { Mind } from "../Mind";
import { LeftMode } from "./LeftMode";
import { RightMode } from "./RightMode";
import { SidesMode } from "./SidesMode";
import { IMLayoutMindBorder } from "../Mind/layout";

// 100px
export const ROOT_SPACE = 120;
export const BRANCH_BETWEEN = 10;

// mind direction value
export type IMLayoutModeValue = -1 | 0 | 1 | 2;
// supported direction mode
export type IMLayoutMode = "left" | "center" | "right" | "sides";

export enum LayoutModeEnum {
  "left" = -1,
  "center" = 0,
  "right" = 1,
  "sides" = 2
}

// side order rule
/**
 * left:
 * emp - 1
 * emp - 2
 * emp - 3
 * emp - 4
 *
 * right:
 * 1 - emp
 * 2 - emp
 * 3 - emp
 * 4 - emp
 *
 * bottom:
 *    -
 * 1 2 3 4
 *
 * sides:
 * 2 - 1
 * 4 - 3
 */
export interface IMLayoutApi {
  mode: string;
  direction(topic: Topic): void;
  layout(vm: Mind, force: boolean): IMLayoutMindBorder;
}
export interface IMLayoutConstructor {
  new (): IMLayoutApi;
}

const DefaultLayoutMode = new RightMode();
const LayoutModeMap = new Map<string, IMLayoutApi>([["left", new LeftMode()], ["right", DefaultLayoutMode], ["sides", new SidesMode()]]);

export function registerLayoutMode(layoutApi: IMLayoutApi | IMLayoutConstructor) {
  const _layout = typeof layoutApi === "function" ? new layoutApi() : layoutApi;
  LayoutModeMap.set(_layout.mode, _layout);
}

export class Layout {
  vm: Mind;
  mode: IMLayoutModeValue;
  constructor(vm: Mind) {
    this.vm = vm;
    this.mode = LayoutModeEnum[vm.options.mode];
  }
  private _changeAllTopicDirection(topic: Topic = this.vm.rootTopic) {
    topic.direction = LayoutModeEnum.center;
    this.computeTopicDirection(topic);
    whileFor(topic.children, _topic => this._changeAllTopicDirection(_topic));
  }
  getLayoutMode = (mode: IMLayoutModeValue = this.mode): IMLayoutApi => {
    return LayoutModeMap.get(LayoutModeEnum[mode]) || DefaultLayoutMode;
  };
  changeMode = (newMode: IMLayoutMode) => {
    this.mode = LayoutModeEnum[newMode];
    this.layout(true);
  };
  layout = (force: boolean = false) => {
    if (force) this._changeAllTopicDirection();
    const viewBorder = this.getLayoutMode().layout(this.vm, force);
    this.vm.view.updateSize({
      width: viewBorder.leftTop[0] - viewBorder.rightBottom[0],
      height: viewBorder.leftTop[1] - viewBorder.rightBottom[1]
    });
    return viewBorder;
  };
  // computing topic's view direction width current layout mode.
  computeTopicDirection = (topic: Topic) => {
    this.getLayoutMode().direction(topic);
  };
}
