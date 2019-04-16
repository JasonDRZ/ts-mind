import { TopicProvider, Topic } from "../../core/Topic";

export class TopicSelect extends TopicProvider {
  constructor(vt: Topic) {
    super(vt);
    vt;
  }
}
