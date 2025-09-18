const ROOT_SELECTOR = '[data-js-accordion]';

class Accordion {
  constructor(element) {
    this.accordion = element;
    this.control = this.accordion.querySelector('.accordion__control');
    this.content = this.accordion.querySelector('.accordion__content');

    this.init();
    this.addEventListeners();
  }

  init() {
    if (this.accordion.classList.contains('open')) {
      this.open();
    } else {
      this.close();
    }
  }

  addEventListeners() {
    this.control.addEventListener('click', () => this.toggle());
  }

  open() {
    this.accordion.classList.add('open');
    this.control.setAttribute('aria-expanded', true);
    this.content.setAttribute('aria-hidden', false);
    this.content.style.maxHeight = `${this.content.scrollHeight}px`;
  }

  close() {
    this.accordion.classList.remove('open');
    this.control.setAttribute('aria-expanded', false);
    this.content.setAttribute('aria-hidden', true);
    this.content.style.maxHeight = null;
  }

  toggle() {
    if (this.accordion.classList.contains('open')) {
      this.close();
    } else {
      this.open();
    }
  }
}

class AccordionCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(ROOT_SELECTOR).forEach((accordion) => new Accordion(accordion));
  }
}

export default AccordionCollection;