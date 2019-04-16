export function createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K] {
  return document.createElement(tagName, options);
}

export function createElementWidthClassName<K extends keyof HTMLElementTagNameMap>(className: string, tagName: K): HTMLElementTagNameMap[K] {
  const el = createElement(tagName);
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
