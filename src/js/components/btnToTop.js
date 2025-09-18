const btnToTop = document.querySelector('[data-js-btn-to-top]');
const SHOW_SCROLL = 700;
const MIN_WIDTH = 1024;

function toggleBtn() {
  const shouldShow = window.scrollY >= SHOW_SCROLL && window.innerWidth >= MIN_WIDTH;
  btnToTop.classList.toggle('is-visible', shouldShow);
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      toggleBtn();
      ticking = false;
    });
    ticking = true;
  }
});

window.addEventListener('resize', toggleBtn);

btnToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  btnToTop.classList.remove('is-visible');
});

toggleBtn();
