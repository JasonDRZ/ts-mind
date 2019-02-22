import { $logger } from "../../util/tools";
import { node_array } from "../format/node_array";
import { node_tree } from "../format/node_tree";
import { freemind } from "../format/freemind";
export class data_provider {
    constructor(tsm) {
        this.reset = () => {
            $logger.debug("data.reset");
        };
        this.load = (mind_data) => {
            let df = null;
            let mind = null;
            if (typeof mind_data === "object") {
                if (!!mind_data.format) {
                    df = mind_data.format;
                }
                else {
                    df = "node_tree";
                }
            }
            else {
                df = "freemind";
            }
            if (df === "node_array") {
                mind = node_array.get_mind(mind_data);
            }
            else if (df === "node_tree") {
                mind = node_tree.get_mind(mind_data);
            }
            else if (df === "freemind") {
                mind = freemind.get_mind(mind_data);
            }
            else {
                $logger.warn("unsupported format");
            }
            return mind;
        };
        this.get_data = (data_format) => {
            let data = null;
            if (!this.tsm.mind)
                return data;
            if (data_format === "node_array") {
                data = node_array.get_data(this.tsm.mind);
            }
            else if (data_format === "node_tree") {
                data = node_tree.get_data(this.tsm.mind);
            }
            else if (data_format === "freemind") {
                data = freemind.get_data(this.tsm.mind);
            }
            else {
                $logger.error("unsupported " + data_format + " format");
            }
            return data;
        };
        this.tsm = tsm;
        $logger.debug("data.init");
    }
}
