class AnimatedCounter {
  constructor(selector = '[data-js-stat]') {
    this.elements = document.querySelectorAll(selector);
    this.formatter = new Intl.NumberFormat('en-EN');
    this.observer = new IntersectionObserver(this.handleIntersect.bind(this), {
      threshold: 1
    });

    this.observeElements();
  }

  observeElements() {
    this.elements.forEach(el => this.observer.observe(el));
  }

  handleIntersect(entries) {
    for (const { isIntersecting, target } of entries) {
      if (!isIntersecting) continue;
      this.animate(target);
      this.observer.unobserve(target);
    }
  }

  animate(el) {
    const start = 0;
    const end = parseFloat(el.dataset.jsStat);
    const duration = parseInt(el.dataset.jsDuration) || 1500;
    const prefix = el.dataset.jsPrefix ?? "";
    const suffix = el.dataset.jsSuffix ?? "";
    const isInteger = Number.isInteger(end);
    const startTime = performance.now();

    const easeOut = t => 1 - Math.pow(1 - t, 3);

    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = easeOut(progress);
      const value = start + (end - start) * eased;

      el.textContent = prefix + this.formatter.format(isInteger ? Math.floor(value) : value) + suffix;

      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }
}

export default AnimatedCounter;