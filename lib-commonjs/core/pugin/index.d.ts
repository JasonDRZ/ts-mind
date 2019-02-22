import { ITSMPlugin } from "..";
export declare const GLOBAl_PLUGIN_LIST: {
    [k: string]: ITSMPlugin;
};
/**
 * register global plugin list
 * @param initializer: ITSMPlugin
 */
export declare function globalUse(pname: string, initializer: ITSMPlugin): void;
export default globalUse;
