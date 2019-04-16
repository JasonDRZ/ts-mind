import { Topic, IMTopicProps, IMTopic } from "../Topic";
import { IMMindEntryOptions } from "./defs";
import { addTopic, moveTopicTo, removeTopic, selectTopic, deselectTopic, collectTopic, initProviders } from "./mind";
import { MindView } from "./view";
import { MindLifecircle } from "./lifecircle";
import { whileFor } from "../../utils/tools";
import { Layout } from "../layout";
export * from "./mind";

export class Mind extends MindLifecircle {
  // static APIs
  static Topic = Topic;

  view: MindView;
  layout: Layout;

  constructor(options: IMMindEntryOptions) {
    super(options);
    this.initProviders();
    // TODO: 重新整理Hooks，删掉不必要的hook。
    this.$created();
    // mount hooks
    this.layout = new Layout(this);
    this.view = new MindView(this);
    this.view.mount();
    window["tsmind"] = this;
  }
  initProviders = () => {
    initProviders(this);
  };
  /**
   * load
   */
  load(data: any[]) {
    whileFor(data, (item, idx) => {
      this.addTopic(item);
    });
    this.rootTopic.view.mount();
    setTimeout(() => {
      this.layout.centerCanvas();
      this.layout.centerRoot();
      this.layout.layout(true);
    }, 0);
  }

  collectTopic(vt: Topic) {
    return collectTopic(this, vt);
  }

  // get Topic item by id;
  getTopicById = (id: string) => {
    return this.topicCollectedMap.get(id);
  };

  // add a child topic topic
  addTopic = (topicData: IMTopicProps): boolean => {
    return addTopic(this, topicData);
  };

  moveTopicTo = (targetTopic: IMTopic, toParentId?: string, toIndex?: number) => {
    return moveTopicTo(this, targetTopic, toParentId, toIndex);
  };

  freeTopic = (vt: Topic) => {
    // TODO: Mind free Topic
    return true;
  };

  removeTopic = (topic: IMTopic) => {
    return removeTopic(this, topic);
  };
  // support multiple selection
  selectTopic = (topic: IMTopic) => {
    return selectTopic(this, topic);
  };
  deselectTopic = (topic: IMTopic) => {
    return deselectTopic(this, topic);
  };
  getSelectedTopics = () => {
    return Array.from(this.topicSelectedMap.values());
  };
  // get all collected topics
  getCollectedTopics = () => {
    return Array.from(this.topicCollectedMap.values());
  };
}
