import TSMind from "..";
import { $logger } from "../../util/tools";
import { node_array } from "../format/node_array";
import { node_tree } from "../format/node_tree";
import { freemind } from "../format/freemind";

export class data_provider {
  private tsm: TSMind;
  constructor(tsm: TSMind) {
    this.tsm = tsm;
    $logger.debug("data.init");
  }

  reset = () => {
    $logger.debug("data.reset");
  };

  load = (mind_data: ITSMSourceData<any>) => {
    let df = null;
    let mind = null;
    if (typeof mind_data === "object") {
      if (!!mind_data.format) {
        df = mind_data.format;
      } else {
        df = "node_tree";
      }
    } else {
      df = "freemind";
    }

    if (df === "node_array") {
      mind = node_array.get_mind(mind_data);
    } else if (df === "node_tree") {
      mind = node_tree.get_mind(mind_data);
    } else if (df === "freemind") {
      mind = freemind.get_mind(mind_data);
    } else {
      $logger.warn("unsupported format");
    }
    return mind;
  };

  get_data = (data_format: ITSMDataFormat | ITSMEmpty) => {
    let data = null;
    if (!this.tsm.mind) return data;
    if (data_format === "node_array") {
      data = node_array.get_data(this.tsm.mind);
    } else if (data_format === "node_tree") {
      data = node_tree.get_data(this.tsm.mind);
    } else if (data_format === "freemind") {
      data = freemind.get_data(this.tsm.mind);
    } else {
      $logger.error("unsupported " + data_format + " format");
    }
    return data;
  };
}
