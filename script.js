function initApp() {
  // 1. Lenis Smooth Scroll Setup
  try {
    let lenis;
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.2,
        smoothWheel: true,
        smoothTouch: false
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Intercept internal anchors to scroll with Lenis
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          const target = document.querySelector(targetId);
          if (target) {
            lenis.scrollTo(target);
          }
        });
      });
    } else {
      // Fallback smooth scroll
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          const target = document.querySelector(targetId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    }
  } catch (e) {
    console.error("Lenis setup failed:", e);
  }

  // 2. Hero Staggered Animation
  try {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isReducedMotion) {
      const heroStaggerItems = document.querySelectorAll('.hero .fade-in-up');
      heroStaggerItems.forEach((item, idx) => {
        setTimeout(() => {
          item.classList.add('visible');
        }, 200 * idx);
      });
    } else {
      document.querySelectorAll('.fade-in-up').forEach(item => item.classList.add('visible'));
    }
  } catch (e) {
    console.error("Hero animation failed:", e);
  }

  // 3. Reveal on Scroll (IntersectionObserver)
  try {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealElements = document.querySelectorAll('.reveal');
    if (!isReducedMotion && 'IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
      });

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('active'));
    }
  } catch (e) {
    console.error("Scroll reveal failed:", e);
  }

  // 4. Testimonials Carousel
  try {
    const track = document.querySelector('.testimonial-track');
    const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
    const prevBtn = document.querySelector('.btn-nav.prev');
    const nextBtn = document.querySelector('.btn-nav.next');
    const dotsContainer = document.querySelector('.testimonial-dots');

    if (track && slides.length > 0 && prevBtn && nextBtn && dotsContainer) {
      let currentIndex = 0;
      let autoplayInterval;
      const autoplayDelay = 3000; // Fast and dynamic transitions

      // Clear existing dots first to avoid duplicates
      dotsContainer.innerHTML = '';

      // Generate dots
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Ir para depoimento ${idx + 1}`);
        dot.setAttribute('role', 'tab');
        dot.addEventListener('click', () => {
          goToSlide(idx);
          resetAutoplay();
        });
        dotsContainer.appendChild(dot);
      });

      const dots = Array.from(dotsContainer.querySelectorAll('.dot'));

      function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        slides.forEach((slide, idx) => {
          if (idx === currentIndex) {
            slide.classList.add('active');
            slide.setAttribute('aria-hidden', 'false');
          } else {
            slide.classList.remove('active');
            slide.setAttribute('aria-hidden', 'true');
          }
        });
        dots.forEach((dot, idx) => {
          if (idx === currentIndex) {
            dot.classList.add('active');
            dot.setAttribute('aria-selected', 'true');
          } else {
            dot.classList.remove('active');
            dot.setAttribute('aria-selected', 'false');
          }
        });
      }

      function goToSlide(index) {
        if (index < 0) {
          currentIndex = slides.length - 1;
        } else if (index >= slides.length) {
          currentIndex = 0;
        } else {
          currentIndex = index;
        }
        updateCarousel();
      }

      prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        resetAutoplay();
      });

      nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        resetAutoplay();
      });

      function startAutoplay() {
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
          goToSlide(currentIndex + 1);
        }, autoplayDelay);
      }

      function stopAutoplay() {
        clearInterval(autoplayInterval);
      }

      function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
      }

      // Autoplay visibility handler
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          stopAutoplay();
        } else {
          startAutoplay();
        }
      });

      // Keyboard navigation for carousel
      window.addEventListener('keydown', (e) => {
        const carouselSection = document.getElementById('depoimentos');
        if (carouselSection) {
          const rect = carouselSection.getBoundingClientRect();
          const inViewport = rect.top < window.innerHeight && rect.bottom >= 0;
          if (inViewport) {
            if (e.key === 'ArrowLeft') {
              goToSlide(currentIndex - 1);
              resetAutoplay();
            } else if (e.key === 'ArrowRight') {
              goToSlide(currentIndex + 1);
              resetAutoplay();
            }
          }
        }
      });

      updateCarousel();
      startAutoplay();
    }
  } catch (e) {
    console.error("Testimonials carousel setup failed:", e);
  }

  // 5. Floating WhatsApp Behavior relative to CTA visibility
  try {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    const ctaSection = document.querySelector('.cta-section');

    if ('IntersectionObserver' in window && whatsappBtn && ctaSection) {
      const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            whatsappBtn.classList.add('hidden');
          } else {
            whatsappBtn.classList.remove('hidden');
          }
        });
      }, {
        threshold: 0.1
      });
      ctaObserver.observe(ctaSection);
    }
  } catch (e) {
    console.error("WhatsApp floating button logic failed:", e);
  }

  // 6. Dynamic Year
  try {
    const yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  } catch (e) {
    console.error("Dynamic year generation failed:", e);
  }
}

// Executa assim que o script é carregado ou quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
