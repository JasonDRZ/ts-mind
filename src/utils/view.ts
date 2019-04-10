import { doc, addEvent } from "./dom";

export function createDivElement() {
  return doc.createElement("div");
}

// add event width context
export function addEcopedEvent(target: Element, ename: IMEventType, ehandler: IMAnyCall, ctx: object | null = null) {
  addEvent(target, ename, function(e = event) {
    ehandler.call(ctx, e);
  });
}
export function createElementWidthClassName(className: string) {
  const el = createDivElement();
  el.className = className;
  return el;
}

export function applyElementStyle(el: HTMLElement, style: IMCSSStyleMap) {
  Object.keys(style).map(sn => (el.style[sn] = style[sn]));
}

export function updateElePosition(ele: HTMLElement, position: IMPositionDefect) {
  "y" in position && (ele.style.top = `${position.y}px`);
  "x" in position && (ele.style.left = `${position.x}px`);
}

export function eleAbsolute(ele: HTMLElement) {
  ele.style.position !== "absolute" && (ele.style.position = "absolute");
}
