type IMListener<Target = any> = IMAnyCall<[{ type: string; target: Target; data: any }]>;
interface IMEventArrayItem {
  listener: IMListener;
  data: any;
}

const events: Map<string, IMEventArrayItem[]> = new Map();

export class MindEvent {
  on<Target = any>(type: string, listener: IMListener<Target>, data: IMKeyValue = {}) {
    const exist = events.get(type);
    if (!exist) events.set(type, [{ listener, data }]);
    else {
      exist.push({
        listener,
        data
      });
    }
  }
  off(type: string, listner: IMListener) {
    const event = events.get(type);
    if (event) {
      events.set(type, event.filter(e => e.listener !== listner));
    }
  }
  tragger<Target = any>(target: Target, type: string, data: IMKeyValue = {}) {
    const event = events.get(type);
    if (event) {
      event.map(e =>
        e.listener({
          type: type,
          target,
          data: { ...data, ...e.data }
        })
      );
    }
  }
}
