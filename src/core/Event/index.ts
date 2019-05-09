import { whileFor } from '../../utils/tools';
import { Mind } from '../Mind/vm';
import { Topic } from '../Topic/vt';

interface IMEvent<Target extends EventManager<any> = any> {
  type: string;
  target?: Target;
  data?: any;
  path: Target[];// 结束emit冒泡
  stopEmit: IMAnyCall;
}
type IMListener<Target extends EventManager<any> = any> = IMAnyCall<[IMEvent<Target>]>;
interface IMEventArrayItem {
  listener: IMListener;
  // 是否只运行一次；
  isOnce: boolean;
}
type IMEventMap = Map<string, IMEventArrayItem[]>;

const globalEventMap: IMEventMap = new Map();

export abstract class EventManager<Target extends EventManager<any>> {
  // Topic属性
  vm?: Mind;
  parent?: Target;
  children?: Target[];
  // Mind属性
  rootTopic?: Topic;

  readonly _eventMap: IMEventMap = new Map();
  /**
   * 绑定当前模块的事件
   * @param type
   * @param listener
   * @param data
   */
  bindEvent(type: string, listener: IMListener<Target>): Target {
    addEvent<Target>(this._eventMap, type, listener, false);
    return this as any;
  }
  /**
   * 解绑模块事件
   * @param type
   * @param listener
   */
  unbindEvent(type: string, listener: IMListener<Target>): Target {
    removeEvent<Target>(this._eventMap, type, listener);
    return this as any;
  }
  /**
   * 绑定一次性模块事件
   * @param type
   * @param listener
   * @param data
   */
  bindOnceEvent(type: string, listener: IMListener<Target>): Target {
    addEvent<Target>(this._eventMap, type, listener, true);
    return this as any;
  }
  /**
   * 仅触发当前模块的事件，事件通常来自当前模块、广播事件或冒泡事件
   * @param type
   * @param data
   * @param path
   * @param triggerGlobal
   */
  triggerBindEvent(event: string | IMEvent, data?: any, path: Target[] = [this as any]): Target {
    // 优先触发本体事件
    triggerEvent<Target>(typeof event === "string" ? createEvent(event, data, path, path[0]) : event, this._eventMap);
    return this as any;
  }
  /**
   * 添加全局事件
   * @param type
   * @param listener
   * @param data
   */
  onEvent(type: string, listener: IMListener<Target>): Target {
    addEvent<Target>(globalEventMap, type, listener, false);
    return this as any;
  }
  /**
   * 关闭全局事件
   * @param type
   * @param listener
   */
  offEvent(type: string, listener: IMListener<Target>): Target {
    removeEvent<Target>(globalEventMap, type, listener);
    return this as any;
  }
  /**
   * 添加一次性全局事件
   * @param type
   * @param listener
   * @param data
   */
  onceEvent(type: string, listener: IMListener<Target>): Target {
    addEvent<Target>(globalEventMap, type, listener, true);
    return this as any;
  }
  /**
   * 触发全局和模块事件
   * 模块事件的触发是，触发触发的target等于当前模块的target
   * @param type 事件类型
   * @param data 事件数据
   * @param path 内部使用
   */
  triggerEvent(event: string | IMEvent, data?: any, path: Target[] = [this as any]): Target {
    const _event = typeof event === "string" ? createEvent(event, data, path, path[0]) : event;
    // 优先触发本体事件
    triggerEvent<Target>(_event, this._eventMap);
    // 触发全局事件
    triggerEvent<Target>(_event, globalEventMap);
    return this as any;
  }
  /**
   * 触发上串的冒泡事件，直到冒泡到Mind类，可通过调用event.stopEmit()方法来停止继续进行事件冒泡
   * @param event
   * @param data
   * @returns boolean: 表示是否有父组件可以进行事件传递
   */
  emitEvent(event: string | IMEvent, data?: IMKeyValue, path: any[] = []): Target {
    const pathCopy = [...path];
    let continueEmit = true;
    // 仅按续触发上层组件事件，不触发全局同名事件
    if (pathCopy.length > 0) this.triggerBindEvent(createEvent(event, data, pathCopy, pathCopy[0], () => {
      // 阻止事件继续冒泡
      continueEmit = false;
    }));
    const target = this.parent || this.vm;
    if (continueEmit && target) {
      path.unshift(this);
      // path的顺序[parent <- child]
      target.emitEvent(event, data, path)
    }
    return this as any;
  }
  /**
   * 触发下发的广播事件，广播事件不可被中断
   * @param event
   * @param data
   * @param path
   */
  broadcastEvent(event: string | IMEvent, data?: IMKeyValue, path: any[] = []): Target {
    // 不触发全局同名事件
    if (path.length > 0) this.triggerBindEvent(createEvent(event, data, [...path]));
    // path的顺序[parent -> target]
    path.push(this as any);
    // 从Mind开始广播事件
    if (!this.children) this.rootTopic!.broadcastEvent(event, data, path)
    else {
      // topic向子topic广播
      whileFor(this.children || this.vm || this as any, child => {
        child.broadcastEvent(event, data, path);
      })
    }
    return this as any;
  }
}

/**
 * 创建event对象结构
 * @param target
 * @param type
 * @param data
 * @param path
 */
function createEvent<Target extends EventManager<any>>(type: string | IMEvent, data?: any, path: Target[] = [], target?: Target, stopEmit?: IMAnyCall): IMEvent<Target> {
  return typeof type === "string" ? {
    type,
    target,
    data,
    path,
    stopEmit() {
      stopEmit && stopEmit()
    }
  } : type;
}

/**
 * 添加事件监听到指定的事件map对象上
 * @param target
 * @param eventMap
 * @param type
 * @param listener
 */
function addEvent<Target extends EventManager<any>>(eventMap: IMEventMap, type: string, listener: IMListener<Target>, isOnce: boolean) {
  const eventList = eventMap.get(type);
  const eventItem = { listener, isOnce };
  if (Array.isArray(eventList))
    eventList.push(eventItem);
  else eventMap.set(type, [eventItem]);
}

/**
 * 移除指定事件map对象上的事件监听函数
 * @param eventMap
 * @param type
 * @param listener
 */
function removeEvent<Target extends EventManager<any>>(eventMap: IMEventMap, type: string, listener: IMListener<Target>) {
  const eventList = eventMap.get(type);
  if (eventList) {
    eventMap.set(type, eventList.filter(e => e.listener !== listener));
  }
}

/**
 * 触发分级事件列表
 * 如：
 * var A = on('1');
 * var B = on('1.2');
 * var C = on('2');
 * triggerEvent('1'); => A - triggered;
 * triggerEvent('1.2'); => A & B - triggered;
 *
 * @param target
 * @param eventMap
 * @param eventType
 * @param data
 * @param path
 */
function triggerEvent<Target extends EventManager<any>>(event: IMEvent<Target>, eventMap: IMEventMap) {
  const eventLevel = event.type.split(".");
  whileFor(eventLevel, ($, idx) => {
    const type = eventLevel.slice(0, idx + 1).join(".");
    const handlerList = eventMap.get(type);
    if (handlerList) {
      whileFor(handlerList, ({ listener, isOnce }) => {
        listener(event);
        // 移除一次性事件
        isOnce && removeEvent(eventMap, type, listener);
      });
    }
  })
}

