import { $extend, $logger } from "./tools";

export const json = {
  json2string(json: JSON) {
    if (!!JSON) {
      try {
        const json_str = JSON.stringify(json);
        return json_str;
      } catch (e) {
        $logger.warn(e);
        $logger.warn("can not convert to string");
        return null;
      }
    }
    return null;
  },
  string2json(json_str: string) {
    if (!!JSON) {
      try {
        const json = JSON.parse(json_str);
        return json;
      } catch (e) {
        $logger.warn(e);
        $logger.warn("can not parse to json");
        return null;
      }
    }
  },
  merge(b: object, a: object) {
    return $extend(b, a);
  }
};
