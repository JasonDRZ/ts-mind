import { Topic, IMTopicProps, IMTopic } from "../Topic";
import { IMMindEntryOptions } from "./defs";
import { addTopic, moveTopicTo, removeTopic, selectTopic, deselectTopic, collectTopic } from "./mind";
import { MindView } from "./view";
import { MindLayout } from "./layout";
import { MindLifecircle } from "./lifecircle";
import { whileFor } from 'utils/tools';
export * from "./mind";

export const TSMindSupportedModes = ["left", "sides", "right", "bottom"];

export class Mind extends MindLifecircle {
  // static APIs
  static Topic = Topic;

  public view: MindView = new MindView(this);
  public layout: MindLayout = new MindLayout(this);

  constructor(options: IMMindEntryOptions) {
    super(options);
  }

  /**
   * load
   */
  public load(data: any[]) {
    whileFor(data, (item, idx) => {
      this.addTopic(item);
    })
  }

  public collectTopic(vt: Topic) {
    return collectTopic(this, vt);
  }

  // get Topic item by id;
  public getTopicById = (id: string) => {
    return this.topicCollectedMap.get(id);
  };

  // add a child topic topic
  public addTopic = (topicData: IMTopicProps): boolean => {
    return addTopic(this, topicData);
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
