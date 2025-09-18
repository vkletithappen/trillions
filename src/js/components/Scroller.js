const ROOT_SELECTOR = '[data-js-scroller]';

class Scroller {
  selectors = {
    root: ROOT_SELECTOR,
    scrollerInner: '[data-js-scroller-inner]'
  }

  stateAtrributes = {
    ariaHidden: 'aria-hidden'
  }

  constructor(rootElement) {
    this.root = rootElement;
    this.rootInner = this.root.querySelector(this.selectors.scrollerInner);
    this.init();
  }

  init() {
    this.duplicateItems();
  }

  duplicateItems() {
    [...this.rootInner.querySelectorAll(`[${this.stateAtrributes.ariaHidden}]`)]
      .forEach(el => el.remove());

    const copyOfItems = [...this.rootInner.children];
    copyOfItems.forEach(item => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute(this.stateAtrributes.ariaHidden, true);
      this.rootInner.append(duplicatedItem);
    });
  }

  update() {
    this.duplicateItems();
  }
}

class ScrollerCollection {
  constructor() {
    this.scrollers = [];
    this.init();
  }

  init() {
    document.querySelectorAll(ROOT_SELECTOR).forEach(element => {
      this.scrollers.push(new Scroller(element));
    });
  }

  updateAll() {
    this.scrollers.forEach(s => s.update());
  }
}

export function updateScroller(container) {
  const scrollerRoot = container.closest(ROOT_SELECTOR);
  if (!scrollerRoot) return;

  if (window._scrollerCollection) {
    window._scrollerCollection.updateAll();
  }
}

export default ScrollerCollection;
