import draggable from "./draggable";
import screenshot from './screenshot';
// global plugin list
export const GLOBAl_PLUGIN_LIST = {};
/**
 * register global plugin list
 * @param initializer: ITSMPlugin
 */
export function globalUse(pname, initializer) {
    GLOBAl_PLUGIN_LIST[pname] = initializer;
}
export default globalUse;
// global regiter drag support
globalUse("draggable", draggable);
globalUse("screenshot", screenshot);
