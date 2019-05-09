import { Topic } from "../Topic/vt";
// import { whileFor } from "../../utils/tools";
import { Mind } from "../Mind/vm";
import { LeftMode } from "./LeftMode";
import { RightMode } from "./RightMode";
import { SidesMode } from "./SidesMode";
import { fastDom } from "../../utils/view";
import { centerCanvas } from "../../utils/layout";

export interface IMLayoutMindBorder {
  leftTop: [number, number];
  rightBottom: [number, number];
}

// 100px
export const ROOT_SPACE = 120;
export const BRANCH_BETWEEN = 10;

// 画布相对于窗口的倍率大小
const CANVAS_SIZE = 5;

// mind direction value
export type IMLayoutModeValue = -1 | 0 | 1 | 2 | 3 | 4;
// supported direction mode
export type IMLayoutMode = "left" | "center" | "right" | "sides" | "top" | "bottom";

export enum LayoutModeEnum {
  "left" = -1,
  "center" = 0,
  "right" = 1,
  "sides" = 2,
  "top" = 3,
  "bottom" = 4
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
  centerCanvas?(vm: Mind): void;
  direction(topic: Topic): void;
  position(vm: Mind): IMLayoutMindBorder;
  layout(vm: Mind, force?: boolean): IMLayoutMindBorder;
}
export interface IMLayoutConstructor {
  new(): IMLayoutApi;
}

const DefaultLayoutMode = new RightMode();
const LayoutModeMap = new Map<string, IMLayoutApi>([["left", new LeftMode()], ["right", DefaultLayoutMode], ["sides", new SidesMode()]]);

export function registerLayoutMode(layoutApi: IMLayoutApi | IMLayoutConstructor) {
  const _layout = typeof layoutApi === "function" ? new layoutApi() : layoutApi;
  LayoutModeMap.set(_layout.mode, _layout);
}

export class Layout {
  mode: IMLayoutModeValue;
  viewBorder: IMLayoutMindBorder;
  constructor(public vm: Mind) {
    this.vm = vm;
    this.mode = LayoutModeEnum[vm.options.mode];
  }
  // 获取当前模式下的布局方案
  getModeLayout = (mode: IMLayoutModeValue = this.mode): IMLayoutApi => {
    console.info(mode)
    return LayoutModeMap.get(LayoutModeEnum[mode]) || DefaultLayoutMode;
  };
  /**
   * 改变布局模式
   * 将重新进行一次强制布局
   */
  changeMode = (newMode: IMLayoutMode) => {
    this.mode = LayoutModeEnum[newMode];
    this.layout(true);
  };
  centerCanvas = () => {
    // 可被覆盖
    (this.getModeLayout().centerCanvas || centerCanvas)(this.vm);
  };
  // 布局主函数
  layout = (force: boolean = false) => {
    return fastDom.mutate(() => {
      console.info("LAYOUT");
      // if (force) this._changeAllTopicDirection();
      this.viewBorder = this.getModeLayout().layout(this.vm, force);
      // 当canvas的size更新后，需要重新进行布局
      this.updateCanvasSize({
        width: this.viewBorder.leftTop[0] - this.viewBorder.rightBottom[0],
        height: this.viewBorder.leftTop[1] - this.viewBorder.rightBottom[1]
      }).then((update) => {
        console.info(update)
        this.layout(force);
      });
      return this.viewBorder;
    });
  };
  // computing topic's view direction width current layout mode.
  computeTopicDirection = (topic: Topic) => {
    this.getModeLayout().direction(topic);
  };
  // 更新画布大小
  updateCanvasSize = (size: { width: number; height: number }): Promise<any> => {
    const mindView = this.vm.view;
    const { width: lastWidth, height: lastHeight } = mindView.getEleRect();
    const { width: stageWidth, height: stageHeight } = mindView.getEleRect("stage");
    console.info(lastWidth, lastHeight)
    return mindView.setCanvasSize({
      width: Math.max(Math.max(size.width, stageWidth), lastWidth / CANVAS_SIZE) * CANVAS_SIZE,
      height: Math.max(Math.max(size.height, stageHeight), lastHeight / CANVAS_SIZE) * CANVAS_SIZE
    });
  };
}
