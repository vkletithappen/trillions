export default class LanguagesSwitcher {

  selectors = {
    dropdownSelector: '[data-js-lang-switcher]',
    buttonSelector: '[data-js-lang-switcher-btn]',
    menuItemSelector: '[data-js-lang-switcher-language]'
  }
  openClass = 'is-open'

  constructor() {
    this.localesPath = "/locales";
    this.supportedLangs = ["ru", "en"];
    this.defaultLang = "ru";

    const saved = localStorage.getItem("lang");
    const browserLang = navigator.language?.slice(0, 2);
    this.lang = saved || (this.supportedLangs.includes(browserLang) ? browserLang : this.defaultLang);

    this.textElements = Array.from(document.querySelectorAll("[data-i18n]"));
    this.attrElements = Array.from(document.querySelectorAll("[data-i18n-attr]"));
    this.langDropdown = document.querySelector(this.selectors.dropdownSelector);
    this.langButton = this.langDropdown?.querySelector(this.selectors.buttonSelector);
    this.langMenuItems = Array.from(document.querySelectorAll(this.selectors.menuItemSelector));

    this.init();
  }

  async init() {
    await this.updateContent(this.lang);
    this.addListeners();
  }

  async loadTranslations(lang) {
    try {
      const res = await fetch(`${this.localesPath}/${lang}.json`);
      if (!res.ok) throw new Error(`Failed to load locale ${lang} (${res.status})`);
      return await res.json();
    } catch (err) {
      console.error("loadTranslations:", err);
      return {};
    }
  }

  getValue(obj, path) {
    if (!path) return undefined;
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  }

  setNodeText(el, value) {
    if (typeof value !== "string") return;

    const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(value);

    if (hasHtmlTags) {
      el.innerHTML = value;
    } else {
      el.textContent = value.replace(/&nbsp;/g, '\u00A0');
    }
  }

  async updateContent(lang) {
    const translations = await this.loadTranslations(lang);

    // html lang
    document.documentElement.setAttribute("lang", lang);

    // title
    if (translations.page?.title) document.title = translations.page.title;

    // TEXT nodes (data-i18n)
    for (const el of this.textElements) {
      const key = el.dataset.i18n;
      const value = this.getValue(translations, key);
      if (value == null) continue;
      if (el.children.length > 0) {
        const innerTarget = el.querySelector("[data-i18n-text]") || el.querySelector("[data-i18n-inner]");
        if (innerTarget) {
          this.setNodeText(innerTarget, value);
          continue;
        }

        const textNode = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
        if (textNode) {
          textNode.nodeValue = value;
          continue;
        }

        const span = document.createElement("span");
        span.textContent = value;
        el.appendChild(span);
      } else {
        this.setNodeText(el, value);
      }
    }

    // ATTRIBUTES (data-i18n-attr)
    for (const el of this.attrElements) {
      const key = el.dataset.i18nAttr;
      const attrObj = this.getValue(translations, key);
      if (attrObj && typeof attrObj === "object") {
        Object.entries(attrObj).forEach(([attr, val]) => {
          if (val == null) return;
          el.setAttribute(attr, val);
        });
      }
    }

    this.langMenuItems.forEach(item => {
      item.classList.toggle("active", item.dataset.lang === lang);
    });

    this.lang = lang;
    localStorage.setItem("lang", lang);
  }

  addListeners() {
    if (this.langButton && this.langDropdown) {
      this.langButton.addEventListener("click", e => {
        e.stopPropagation();
        const open = this.langDropdown.classList.toggle(this.openClass);
        this.langButton.setAttribute("aria-expanded", String(open));
      });
    }

    this.langMenuItems.forEach(item => {
      item.addEventListener("click", e => {
        const lang = item.dataset.lang;
        if (!lang) return;
        if (lang !== this.lang) this.updateContent(lang);
        this.langDropdown?.classList.remove(this.openClass);
        this.langButton?.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", e => {
      if (!this.langDropdown) return;
      if (!this.langDropdown.contains(e.target)) {
        this.langDropdown.classList.remove(this.openClass);
        this.langButton?.setAttribute("aria-expanded", "false");
      }
    });
  }
}