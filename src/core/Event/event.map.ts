import { Mind } from '../Mind/vm';
import { Topic } from '../Topic/vt';

export interface EventMap {
  "layout": Mind,
  "created": Mind | Topic,
  "created.mind": Mind,
  "created.topic": Topic,
  "mount": Mind | Topic,
  "mount.mind": Mind,
  "mount.topic": Mind,
}
