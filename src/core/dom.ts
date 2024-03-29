export type SelectorType = Element | string;
export type DomType = Dom;

class Dom {
  private $el: Element | HTMLElement;

  constructor(selector: SelectorType) {
    if (typeof selector === 'string') {
      const element = document.querySelector(selector);

      if (element) {
        this.$el = element;
      } else {
        throw new Error(`Element by selector "${selector}" is not founded`);
      }
    } else {
      this.$el = selector;
    }
  }

  get element() {
    return this.$el;
  }

  html(html: SelectorType) {
    if (typeof html === 'string') {
      this.$el.innerHTML = html;

      return this;
    }

    return this.$el.outerHTML.trim();
  }

  text(text?: string) {
    if (typeof text === 'string') {
      this.$el.textContent = text;
    }

    if (this.$el instanceof HTMLInputElement) {
      return this.$el.value.trim();
    }

    return this.$el.textContent?.trim() ?? '';
  }

  clear() {
    this.html('');
    return this;
  }

  append(node: Dom | Element) {
    if (node instanceof Dom) {
      node = node.$el;
    }
    this.$el.append(node);

    return this;
  }

  closest(selector: string) {
    const $closest = this.$el.closest(selector);
    if (!$closest) return null;

    return $($closest);
  }

  getCoordinates() {
    return this.$el.getBoundingClientRect();
  }

  find(selector: string) {
    const element = this.$el.querySelector(selector);
    if (!element) return null;

    return $(element);
  }

  findAll(selector: string) {
    return this.$el.querySelectorAll(selector);
  }

  addClass(className: string) {
    this.$el.classList.add(className);

    return this;
  }

  removeClass(className: string) {
    this.$el.classList.remove(className);

    return this;
  }

  focus() {
    if (!(this.$el instanceof HTMLElement)) return;

    this.$el.focus();
    return this;
  }

  coords(parse?: boolean) {
    if (parse) {
      const [row, col] = this.coords()?.toString().split(':') as Array<string>;

      return {
        row: Number(row),
        col: Number(col),
      };
    }

    if (!this.data) return;

    return this.data.coords;
  }

  get data() {
    if (!(this.$el instanceof HTMLElement)) return;

    return this.$el.dataset;
  }

  css(styles: { [key: string]: string | number }) {
    if (!(this.$el instanceof HTMLElement)) return;

    Object.assign(this.$el.style, styles);
  }

  on(eventType: string, callback: EventListenerOrEventListenerObject) {
    this.$el.addEventListener(eventType, callback);
  }

  of(eventType: string, callback: EventListenerOrEventListenerObject) {
    this.$el.removeEventListener(eventType, callback);
  }
}

export function $(selector: SelectorType) {
  return new Dom(selector);
}

$.create = (tagName: keyof HTMLElementTagNameMap, classes = '') => {
  const el = document.createElement(tagName);
  if (classes) {
    el.classList.add(classes);
  }

  return $(el);
};
