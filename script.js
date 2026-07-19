// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Scroll-linked hero reveal
const heroSection = document.getElementById('hero');
const headlineEl = document.getElementById('heroHeadline');
const subEl = document.getElementById('heroSub');
const ctaEl = document.getElementById('heroCta');
const artEl = document.getElementById('heroArt');

const HEADLINE_WORDS = ['Dental', 'care', 'kids', 'actually', 'look', 'forward', 'to.'];
headlineEl.innerHTML = HEADLINE_WORDS.map((w) => `<span>${w}</span>`).join(' ');
const wordEls = headlineEl.querySelectorAll('span');

function clamp01(n) {
  return Math.min(1, Math.max(0, n));
}

let raf = null;
function updateHero() {
  raf = null;
  const rect = heroSection.getBoundingClientRect();
  const total = rect.height - window.innerHeight;
  const progress = total > 0 ? clamp01(-rect.top / total) : 0;

  const n = wordEls.length;
  wordEls.forEach((el, i) => {
    const start = (i / n) * 0.65;
    const t = clamp01((progress - start) / 0.09);
    el.style.opacity = t;
    el.style.transform = `translateY(${(1 - t) * 14}px)`;
  });

  const subOpacity = clamp01((progress - 0.72) / 0.15);
  subEl.style.opacity = subOpacity;
  subEl.style.transform = `translateY(${(1 - subOpacity) * 10}px)`;

  const ctaOpacity = clamp01((progress - 0.85) / 0.15);
  ctaEl.style.opacity = ctaOpacity;
  ctaEl.style.transform = `translateY(${(1 - ctaOpacity) * 10}px)`;
  ctaEl.style.pointerEvents = ctaOpacity > 0.5 ? 'auto' : 'none';

  artEl.style.transform = `translateY(${progress * -24}px) rotate(${progress * 3}deg)`;
}

window.addEventListener('scroll', () => {
  if (raf) return;
  raf = requestAnimationFrame(updateHero);
}, { passive: true });
updateHero();

// Tip selector (Meet Spark section)
const tips = document.querySelectorAll('.tip');
tips.forEach((tip) => {
  tip.addEventListener('click', () => {
    tips.forEach((t) => t.classList.remove('active'));
    tip.classList.add('active');
  });
});
tips[0]?.classList.add('active');

// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  item.querySelector('.faq-row').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    faqItems.forEach((f) => f.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});
faqItems[0]?.classList.add('open');

// Contact form (submits to Netlify Forms via AJAX)
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(new FormData(contactForm)).toString(),
  })
    .then(() => {
      formMsg.hidden = false;
      contactForm.reset();
    })
    .catch((err) => console.error('Form submission failed', err));
});

// Scroll-pin cover: "Why Us" (#why) pins in place while "Meet Spark" (#spark)
// slides up from below and covers it, then normal scroll resumes.
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    trigger: '#why',
    start: 'top top',
    end: 'bottom top',
    pin: true,
    pinSpacing: false,
    anticipatePin: 1,
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}
