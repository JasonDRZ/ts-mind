import { Topic, IMTopicProps, IMTopic } from "../Topic";
import { IMMindEntryOptions } from "./defs";
import { addTopic, moveTopicTo, removeTopic, selectTopic, deselectTopic, collectTopic, initProviders } from "./mind";
import { MindView } from "./view";
import { MindLifecircle } from "./lifecircle";
import { whileFor } from "../../utils/tools";
import { Layout } from "../layouts";
export * from "./mind";

export class Mind extends MindLifecircle {
  // static APIs
  static Topic = Topic;

  public view: MindView;
  public layout: Layout;

  constructor(options: IMMindEntryOptions) {
    super(options);
    this.initProviders();
    // TODO: 重新整理Hooks，删掉不必要的hook。
    this.$beforeCreate();
    this.$created();
    // mount hooks
    this.$beforeMount();
    this.layout = new Layout(this);
    this.view = new MindView(this);
    this.$mounted();
  }
  public initProviders = () => {
    initProviders(this);
  };
  /**
   * load
   */
  public load(data: any[]) {
    whileFor(data, (item, idx) => {
      this.addTopic(item);
    });
    this.rootTopic.view.mount();
    setTimeout(() => {
      this.layout.layout(true);
    }, 0);
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
