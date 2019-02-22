export const dom = {
    // target,eventType,handler
    add_event(target, event, call) {
        target.addEventListener(event, call, false);
    },
    css(cstyle, property_name) {
        return cstyle.getPropertyValue(property_name);
    },
    is_visible(cstyle) {
        const visibility = dom.css(cstyle, "visibility");
        const display = dom.css(cstyle, "display");
        dom.css(cstyle, "backface-visibility");
        return visibility !== "hidden" && display !== "none";
    }
};
