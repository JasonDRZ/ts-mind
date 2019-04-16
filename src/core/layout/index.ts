import { Topic } from "../Topic";
import { whileFor } from "../../utils/tools";
import { Mind } from "../Mind";
import { LeftMode } from "./LeftMode";
import { RightMode } from "./RightMode";
import { SidesMode } from "./SidesMode";
import { centerCanvas, centerRoot } from "../../utils/layout";

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
  mode: IMLayoutModeValue;
  viewBorder: IMLayoutMindBorder;
  constructor(public vm: Mind) {
    this.vm = vm;
    this.mode = LayoutModeEnum[vm.options.mode];
  }
  private _changeAllTopicDirection(topic: Topic = this.vm.rootTopic) {
    topic.direction = LayoutModeEnum.center;
    this.computeTopicDirection(topic);
    whileFor(topic.children, _topic => this._changeAllTopicDirection(_topic));
  }
  // 获取当前模式下的布局方案
  getModeLayout = (mode: IMLayoutModeValue = this.mode): IMLayoutApi => {
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
  // 画布窗口居中
  centerCanvas = () => {
    centerCanvas(this.vm);
  };
  // 根节点画布居中
  centerRoot = () => {
    centerRoot(this.vm);
  };
  // 布局主函数
  layout = (force: boolean = false) => {
    console.info("LAYOUT");
    if (force) this._changeAllTopicDirection();
    this.viewBorder = this.getModeLayout().layout(this.vm, force);
    this.updateCanvasSize({
      width: this.viewBorder.leftTop[0] - this.viewBorder.rightBottom[0],
      height: this.viewBorder.leftTop[1] - this.viewBorder.rightBottom[1]
    });
    return this.viewBorder;
  };
  // computing topic's view direction width current layout mode.
  computeTopicDirection = (topic: Topic) => {
    this.getModeLayout().direction(topic);
  };
  // 更新画布大小
  updateCanvasSize = (size: { width: number; height: number }): Promise<any> => {
    const mindView = this.vm.view;
    const { w, h } = mindView.getCanvasSize();
    const { clientWidth, clientHeight } = mindView.$els.stage;
    const view = {
      width: Math.max(size.width, clientWidth),
      height: Math.max(size.height, clientHeight)
    };
    const newSize = {
      w,
      h
    };
    let shouldUpdate = false;
    if (view.width > w / CANVAS_SIZE) {
      newSize.w = view.width * CANVAS_SIZE;
      shouldUpdate = true;
    }
    if (view.height > h / CANVAS_SIZE) {
      newSize.h = view.height * CANVAS_SIZE;
      shouldUpdate = true;
    }
    if (shouldUpdate) {
      mindView.setCanvasSize(newSize);
      return Promise.resolve();
    }
    return Promise.reject();
  };
}
