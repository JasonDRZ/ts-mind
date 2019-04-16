export const doc = window.document;
// getElementById
export function eleByID(id: string) {
  return doc.getElementById(id);
}
// append text child
export function appendText(parent: HTMLElement, txt: string) {
  if (parent.hasChildNodes()) {
    parent.firstChild!.nodeValue = txt;
  } else parent.appendChild(doc.createTextNode(txt));
}
// append any type of child
export function appendChild(parent: HTMLElement, child: any) {
  if (child instanceof HTMLElement) {
    parent.innerHTML = "";
    parent.appendChild(child);
  } else {
    parent.innerHTML = child;
  }
}
// add an element event listener
export function addEvent<Target extends Element | Window, K extends keyof GlobalEventHandlersEventMap>(
  target: Target,
  event: K,
  listener: (this: GlobalEventHandlers, ev: GlobalEventHandlersEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
) {
  target.addEventListener(event, listener, options);
}
export function removeEvent<Target extends Element, K extends keyof GlobalEventHandlersEventMap>(
  target: Target,
  event: K,
  listener: (this: GlobalEventHandlers, ev: GlobalEventHandlersEventMap[K]) => any
) {
  target.removeEventListener(event, listener);
}
// get CSSStyleDeclaration property value
export function getStyleValue(cstyle: CSSStyleDeclaration, property_name: string) {
  return cstyle.getPropertyValue(property_name);
}
// get element visible state
export function isEleVisible(cstyle: CSSStyleDeclaration) {
  const visibility = getStyleValue(cstyle, "visibility");
  const display = getStyleValue(cstyle, "display");
  getStyleValue(cstyle, "backface-visibility");
  return visibility !== "hidden" && display !== "none";
}

export function eleInvisible(ele: HTMLElement) {
  ele.style.visibility = "hidden";
}
export function eleVisible(ele: HTMLElement) {
  ele.style.visibility = "visible";
}
export function eleDisplay(ele: HTMLElement, type: "block" | "inline-block" | "inline" = "block") {
  ele.style.display = type;
}
export function eleDisplayNone(ele: HTMLElement) {
  ele.style.display = "none";
}
