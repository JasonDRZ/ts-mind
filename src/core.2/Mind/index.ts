import { Topic, IMTopicProps, IMTopic } from "core.2/Topic";
import { Logger, extend } from "utils/tools";
import { IMMindOptionsDef, IMMindOptions } from "./defs";
import { addTopic, moveTopicTo, removeTopic, selectTopic, deselectTopic, collectTopic } from "./mind";
import { DEFAULT_OPTIONS } from "util/constants";
export * from "./mind";

export class Mind {
  public meta: IMSourceMeta;
  public options: IMMindOptionsDef;

  public data: IMMindPrivateData = {};

  // mind private partners
  public logger = new Logger(this.options.debug);
  // support multiple roots,each other root could be other topic's child topic.
  public rootTopic: Topic;
  // manage all selected topics
  public topicSelectedMap: Map<string, Topic> = new Map();
  // all registered topics map,key is topic's id;
  public topicCollectedMap: Map<string, Topic> = new Map();

  constructor(options: IMMindOptions) {
    this.options = extend(true, DEFAULT_OPTIONS, options);
  }

  collectTopic(vt: Topic) {
    return collectTopic(this, vt);
  }

  // get Topic item by id;
  public getTopicById = (id: string) => {
    return this.topicCollectedMap.get(id);
  };

  // add a child topic topic
  public addTopic = (topicData: IMTopicProps, parent?: IMTopic): boolean => {
    return addTopic(this, topicData, parent);
  };

  public moveTopicTo = (targetTopic: IMTopic, toParentId?: string, toIndex?: number) => {
    return moveTopicTo(this, targetTopic, toParentId, toIndex);
  };

  public appendTopic = (vt: Topic) => {
    // TODO: Mind add Topic
    return true;
  };

  public removeTopic = (topic: IMTopic) => {
    return removeTopic(this, topic);
  };
  // support multiple selection
  public selectTopic = (topic: IMTopic) => {
    return selectTopic(this, topic);
  };
  public deselectTopic = (topic: IMTopic) => {
    return deselectTopic(this, topic);
  };
  public getSelectedTopics = () => {
    return this.topicSelectedMap.values();
  };
  // get all collected topics
  public getCollectedTopics = () => {
    return this.topicCollectedMap.values();
  };
}
