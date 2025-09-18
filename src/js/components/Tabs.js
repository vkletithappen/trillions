// связть кнопок и контента через aria-controls у кнопок и id у контент-блоков
const ROOT_SELECTOR = "[data-js-tabs]";

class Tabs {
  selectors = {
    button: "[data-js-tabs-button]",
    content: "[data-js-tabs-content]",
  };

  stateClasses = {
    isActive: "is-active",
  };

  stateAttributes = {
    ariaSelected: "aria-selected",
    tabIndex: "tabindex",
  };

  constructor(rootElement) {
    this.root = rootElement;
    this.buttons = [...this.root.querySelectorAll(this.selectors.button)];
    this.contents = [...document.querySelectorAll(this.selectors.content)];
    this.state = this.buttons.findIndex((btn) =>
      btn.classList.contains(this.stateClasses.isActive)
    );
    if (this.state === -1) this.state = 0;
    this.init();
  }

  updateUI() {
    this.buttons.forEach((button, index) => {
      const isActive = index === this.state;
      const controlId = button.getAttribute("aria-controls");

      button.classList.toggle(this.stateClasses.isActive, isActive);
      button.setAttribute(this.stateAttributes.ariaSelected, isActive);
      button.setAttribute(this.stateAttributes.tabIndex, isActive ? "0" : "-1");

      const content = document.getElementById(controlId);
      if (content) {
        content.classList.toggle(this.stateClasses.isActive, isActive);
      }
    });
  }

  setActiveTab(buttonIndex) {
    this.state = buttonIndex;
    this.updateUI();
  }

  init() {
    this.updateUI();

    this.buttons.forEach((buttonElement, index) => {
      buttonElement.addEventListener("click", () => this.setActiveTab(index));
    });
  }
}

class TabsCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(ROOT_SELECTOR).forEach((tabs) => new Tabs(tabs));
  }
}

export default TabsCollection;
