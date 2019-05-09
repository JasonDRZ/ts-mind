import { objValues } from './tools';

// type IMProxyProperty = string;
type IMObserveCallback<Target extends object> = (target: Target, property: string, value: any, oldValue: any) => any;
// export function createSetProxy<Target extends object>(obj: Target, callback: IMObserveCallback<Target> = () => { }, deep: boolean = false, prefix: IMProxyProperty = ""): Target {
//   const proxy = new Proxy(obj, {
//     set(target: Target, property: IMProxyProperty, value, receiver) {
//       // console.warn(target, property, value, receiver)
//       if (deep && value instanceof Object && !value.__isproxyed__) {
//         // 如果数据为对象，则继续代理【暂不考虑数组类型数据代理】
//         value = createSetProxy(value, callback, deep, `${prefix + property}.`);
//       }
//       const setSuc = Reflect.set(target, property, value, receiver);
//       // 数据更新成功后调用回调
//       setSuc && callback(target, `${prefix + property}`, value);

//       return setSuc;
//     }
//   });
//   Reflect.defineProperty(proxy, '__isproxyed__', {
//     value: true,
//     configurable: false,
//     writable: false,
//     enumerable: false
//   });
//   return proxy;
// }
// // 对象订阅
// export function observeObjSet<Target extends object>(o: Target, callback: IMObserveCallback<Target>, deep: boolean = false, prefix?: IMProxyProperty) {
//   return createSetProxy(o, callback, deep, prefix);
// }

export function observeWidthDefaultValue<Target extends object>(target: Target, propertyName: string, defaultValue: any, callback: IMObserveCallback<Target> = () => { }) {
  Reflect.defineProperty(target, propertyName, {
    set(value) {
      // 仅在有更新时调用
      if (defaultValue !== value) {
        const oldValue = defaultValue;
        // 更新初始值
        defaultValue = value;
        callback(target, propertyName, value, oldValue);
      }
      return value;
    },
    get() {
      return defaultValue;
    }
  })
}

// 通过有默认值的同名字段对象，批量订阅目标对象字段
export function observeWidthDefaultValueMap<Target extends object>(target: Target, defaultObject: object, callback: IMObserveCallback<Target> = () => { }) {
  objValues(defaultObject, (defaultValue, propertyName) => {
    observeWidthDefaultValue(target, propertyName, defaultValue, callback);
  })
}

// export function observeProperties<Target extends object>(target: Target, propertyNames: string[], callback: IMObserveCallback<Target> = () => { }): object {
//   const obj = {};
//   whileFor(propertyNames, property => Reflect.defineProperty(obj, property, {
//     set(value) {
//       callback(target, property, value);
//       return target[property] = value;
//     },
//     get() {
//       return target[property];
//     }
//   }))
//   return obj;
// }
