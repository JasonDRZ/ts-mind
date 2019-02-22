export const dom = {
  // target,eventType,handler
  add_event(target: Document | Element, event: string, call: ITSMAnyCall) {
    target.addEventListener(event, call, false);
  },
  css(cstyle: CSSStyleDeclaration, property_name: string) {
    return cstyle.getPropertyValue(property_name);
  },
  is_visible(cstyle: CSSStyleDeclaration) {
    const visibility = dom.css(cstyle, "visibility");
    const display = dom.css(cstyle, "display");
    dom.css(cstyle, "backface-visibility");
    return visibility !== "hidden" && display !== "none";
  }
};
