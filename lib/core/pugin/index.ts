import { ITSMPlugin } from "..";
import draggable from "./draggable";
import screenshot from './screenshot';

// global plugin list
export const GLOBAl_PLUGIN_LIST: { [k: string]: ITSMPlugin } = {};

/**
 * register global plugin list
 * @param initializer: ITSMPlugin
 */
export function globalUse(pname: string, initializer: ITSMPlugin) {
  GLOBAl_PLUGIN_LIST[pname] = initializer;
}
export default globalUse;

// global regiter drag support
globalUse("draggable", draggable);
globalUse("screenshot", screenshot);
