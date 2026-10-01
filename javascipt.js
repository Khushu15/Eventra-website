// Mobile navigation expands and collapses the section links.
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');

// Mobile navigation: keep the menu state and accessibility label in sync.
menuToggle?.addEventListener('click', () => {
  const isOpen = navbar.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

// Hero carousel: coordinate the visible slide, arrows, and indicators.
const slides = [...document.querySelectorAll('.hero-slide')];
const indicators = [...document.querySelectorAll('.hero-indicator')];
const hero = document.querySelector('.hero');
let activeSlide = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
let slideTimer;

const showSlide = (index) => {
  if (!slides.length) return;
  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === (index + slides.length) % slides.length;
    slide.classList.toggle('is-active', isActive);
    slide.setAttribute('aria-hidden', String(!isActive));
    indicators[slideIndex]?.classList.toggle('is-active', isActive);
    indicators[slideIndex]?.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
  activeSlide = (index + slides.length) % slides.length;
};

document
  .querySelector('.hero-arrow-left')
  ?.addEventListener('click', () => showSlide(activeSlide - 1));
document
  .querySelector('.hero-arrow-right')
  ?.addEventListener('click', () => showSlide(activeSlide + 1));
indicators.forEach((indicator, index) => {
  indicator.addEventListener('click', () => showSlide(index));
});
showSlide(activeSlide);

// Pause autoplay while the pointer is over the hero and resume when it leaves.
const startSlideTimer = () => {
  if (slides.length > 1 && !slideTimer) {
    slideTimer = setInterval(() => showSlide(activeSlide + 1), 5000);
  }
};

const stopSlideTimer = () => {
  clearInterval(slideTimer);
  slideTimer = null;
};

hero?.addEventListener('mouseenter', stopSlideTimer);
hero?.addEventListener('mouseleave', startSlideTimer);
startSlideTimer();

// Feedback carousel: rotate guest reviews every three seconds with manual controls.
const feedbackSlides = [...document.querySelectorAll('.feedback-slide')];
const feedbackIndicators = [...document.querySelectorAll('.feedback-indicator')];
const feedbackCarousel = document.querySelector('.feedback-carousel');
const feedbackInterval = 3000;
let activeFeedback = 0;
let feedbackTimer;

const showFeedback = (index) => {
  if (!feedbackSlides.length) return;

  activeFeedback = (index + feedbackSlides.length) % feedbackSlides.length;
  feedbackSlides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeFeedback;
    slide.hidden = !isActive;
    slide.setAttribute('aria-hidden', String(!isActive));
    slide.classList.toggle('is-active', isActive);
    feedbackIndicators[slideIndex]?.classList.toggle('is-active', isActive);
    feedbackIndicators[slideIndex]?.setAttribute('aria-current', String(isActive));
  });
};

const startFeedbackTimer = () => {
  if (feedbackSlides.length > 1 && !feedbackTimer) {
    feedbackTimer = setInterval(() => showFeedback(activeFeedback + 1), feedbackInterval);
  }
};

const stopFeedbackTimer = () => {
  clearInterval(feedbackTimer);
  feedbackTimer = null;
};

document
  .querySelector('.feedback-arrow-left')
  ?.addEventListener('click', () => showFeedback(activeFeedback - 1));
document
  .querySelector('.feedback-arrow-right')
  ?.addEventListener('click', () => showFeedback(activeFeedback + 1));
feedbackIndicators.forEach((indicator, index) => {
  indicator.addEventListener('click', () => showFeedback(index));
});
feedbackCarousel?.addEventListener('mouseenter', stopFeedbackTimer);
feedbackCarousel?.addEventListener('mouseleave', startFeedbackTimer);
feedbackCarousel?.addEventListener('focusin', stopFeedbackTimer);
feedbackCarousel?.addEventListener('focusout', (event) => {
  if (!feedbackCarousel.contains(event.relatedTarget)) startFeedbackTimer();
});
showFeedback(activeFeedback);
startFeedbackTimer();

// Theme control: apply the chosen mode and update its accessible state.
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

const setDarkMode = (isDark) => {
  document.body.classList.toggle('dark-mode', isDark);
  themeToggle?.setAttribute('aria-pressed', String(isDark));
  themeToggle?.setAttribute('aria-label', isDark ? 'Disable dark mode' : 'Enable dark mode');
  if (themeIcon) themeIcon.textContent = isDark ? '☀' : '☾';
};

themeToggle?.addEventListener('click', () => {
  setDarkMode(!document.body.classList.contains('dark-mode'));
});

// Restore the visitor's saved theme, falling back when storage is unavailable.
try {
  setDarkMode(localStorage.getItem('eventra-theme') === 'dark');
} catch (error) {
  setDarkMode(false);
}

// Remember theme changes when browser storage is available.
themeToggle?.addEventListener('click', () => {
  try {
    localStorage.setItem('eventra-theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  } catch (error) {
    // Dark mode still works when browser storage is unavailable.
  }
});

// Schedule tab controls map each selected day to its matching panel.
const tabs = document.querySelectorAll('.schedule-tab');
const panels = document.querySelectorAll('.schedule-panel');

// Schedule tabs: show only the panel selected by the visitor.
tabs.forEach((tab) => tab.addEventListener('click', () => {
  tabs.forEach((item) => item.classList.toggle('is-active', item === tab));
  panels.forEach((panel) => {
    panel.hidden = panel.id !== tab.dataset.day;
  });
}));

// Enquiry form: show a local confirmation and reset the submitted fields.
const form = document.querySelector('#registration-form');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = form.elements.name.value.trim();
  form.querySelector('.form-message').textContent =
    `Thanks${name ? `, ${name}` : ''}. You are on the Eventra list.`;
  form.reset();
});
