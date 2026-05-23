/**
 * NAAM PRODUCTIONS - PREMIUM EVENT PRODUCTION WEBSITES
 * INTERACTION LOGIC & EFFECTS (VANILLA JAVASCRIPT)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Disable scrollbar while loading
  document.body.style.overflow = 'hidden';

  // Initialize all core controllers
  initLoader();
  initNavbar();
  initScrollAnimations();
  initPortfolio();
  initInquiryForm();
  initTestimonialSlider();
});

/* ==========================================================================
   1. CINEMATIC LOADING CONTROLLER
   ========================================================================== */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Let the CSS progress bar and reveal animations run their course
  // and trigger loaded transition after 2.4 seconds.
  setTimeout(() => {
    loader.classList.add('loaded');
    
    // Smoothly restore scroll bar after screen fade animation
    setTimeout(() => {
      document.body.style.overflow = '';
    }, 1000);
  }, 2400);
}

/* ==========================================================================
   2. STICKY NAVBAR & MOBILE NAVIGATION
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const navLinks = document.querySelectorAll('.nav-menu a, .mobile-menu a');

  if (!navbar) return;

  // Header background transition on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Highlight current active section in nav links
    highlightNavOnScroll();
  });

  // Toggle Hamburger menu
  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburgerBtn.classList.toggle('active');
      mobileNav.classList.toggle('active');
      
      // Toggle body scrolling when menu is open
      if (mobileNav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close mobile menu clicking outside
    document.addEventListener('click', (e) => {
      if (mobileNav.classList.contains('active') && !mobileNav.contains(e.target) && e.target !== hamburgerBtn) {
        hamburgerBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Smooth scroll links and menu auto-close
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        
        // Close mobile drawer if active
        if (mobileNav && mobileNav.classList.contains('active')) {
          hamburgerBtn.classList.remove('active');
          mobileNav.classList.remove('active');
          document.body.style.overflow = '';
        }

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          // Adjust scroll offset due to sticky header
          const navHeight = navbar.offsetHeight;
          const targetPosition = targetSection.offsetTop - (navHeight - 10);
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Hero section mouse click scroll behavior
  const scrollIndicator = document.getElementById('scroll-btn');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        const offset = navbar.offsetHeight;
        window.scrollTo({
          top: servicesSection.offsetTop - (offset - 10),
          behavior: 'smooth'
        });
      }
    });
  }
}

// Active link highlighting on scroll
function highlightNavOnScroll() {
  const sections = document.querySelectorAll('section, footer');
  const navItems = document.querySelectorAll('.nav-menu li');
  let currentActiveId = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentActiveId = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    const link = item.querySelector('a');
    if (link && link.getAttribute('href') === `#${currentActiveId}`) {
      item.classList.add('active');
    }
  });
}

/* ==========================================================================
   3. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal, .reveal-stagger');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once animated, no need to track it anymore
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    reveals.forEach(element => observer.observe(element));
  } else {
    // Fallback if browser doesn't support Observer
    reveals.forEach(element => element.classList.add('visible'));
  }
}

/* ==========================================================================
   4. PORTFOLIO FILTER & LUXURY LIGHTBOX MODAL
   ========================================================================== */
function initPortfolio() {
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const lightbox = document.getElementById('portfolio-lightbox');
  const lightboxMediaContainer = document.getElementById('lightbox-media-container');
  const lightboxCat = document.getElementById('lightbox-cat');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

  // 4b. Lightbox trigger
  portfolioItems.forEach(item => {
    item.addEventListener('click', function() {
      const mediaUrl = this.getAttribute('data-media');
      const title = this.getAttribute('data-title');
      const desc = this.getAttribute('data-desc');
      const category = this.getAttribute('data-category');

      if (lightboxMediaContainer && mediaUrl) {
        // Clear previous content
        lightboxMediaContainer.innerHTML = '';

        // Check if the URL is a video file
        if (mediaUrl.toLowerCase().endsWith('.mp4') || mediaUrl.includes('/video/')) {
          const videoElement = document.createElement('video');
          videoElement.src = mediaUrl;
          videoElement.autoplay = true;
          videoElement.loop = true;
          videoElement.controls = true;
          videoElement.playsInline = true;
          videoElement.style.width = '100%';
          videoElement.style.height = '100%';
          videoElement.style.objectFit = 'contain';
          lightboxMediaContainer.appendChild(videoElement);
        } else {
          const imgElement = document.createElement('img');
          imgElement.src = mediaUrl;
          imgElement.alt = title;
          imgElement.style.width = '100%';
          imgElement.style.height = '100%';
          imgElement.style.objectFit = 'contain';
          lightboxMediaContainer.appendChild(imgElement);
        }

        if (lightboxCat) lightboxCat.textContent = category.toUpperCase();
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxDesc) lightboxDesc.textContent = desc;

        // Launch lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // lock background
      }
    });
  });

  // Close lightbox modal
  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // restore scrolling
      setTimeout(() => {
        if (lightboxMediaContainer) lightboxMediaContainer.innerHTML = '';
      }, 300);
    }
  };

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      // Close only if click is outside the content box
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   5. BOOKING & INQUIRY FORM CONTROLLER
   ========================================================================== */
function initInquiryForm() {
  const form = document.getElementById('bookingForm');
  const budgetInput = document.getElementById('form-budget');
  const budgetValue = document.getElementById('budget-current');
  const successOverlay = document.getElementById('formSuccess');

  if (!form) return;

  // Dynamic slider values
  if (budgetInput && budgetValue) {
    budgetInput.addEventListener('input', function() {
      const val = parseInt(this.value);
      budgetValue.textContent = `₹${val.toLocaleString()}`;
    });
  }

  // Handle form submit
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Reset styles
    let isValid = true;
    const requiredInputs = form.querySelectorAll('[required]');
    
    requiredInputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderBottomColor = '#ff4a4a';
      } else {
        input.style.borderBottomColor = '';
      }
    });

    // Special validation for email
    const emailInput = document.getElementById('form-email');
    if (emailInput && emailInput.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        isValid = false;
        emailInput.style.borderBottomColor = '#ff4a4a';
      }
    }

    if (isValid) {
      // Gather inquiry data for direct hookups
      const name = document.getElementById('form-name').value;
      const phone = document.getElementById('form-phone').value;
      const email = emailInput.value;
      const type = document.getElementById('form-type').value;
      const date = document.getElementById('form-date').value;
      const location = document.getElementById('form-location').value;
      const budget = budgetValue.textContent;
      const requirements = document.getElementById('form-reqs').value;

      // Show gorgeous success overlay
      if (successOverlay) {
        successOverlay.classList.add('active');
      }

      // Generate pre-filled WhatsApp link and trigger redirection after 2.5s
      const waMessage = `Hello Naam Productions! I'd like to book an event.
Name: ${name}
Phone: ${phone}
Email: ${email}
Event Type: ${type}
Date: ${date}
Location: ${location}
Budget: ${budget}
Requirements: ${requirements || 'None specified'}`;

      const encodedMessage = encodeURIComponent(waMessage);
      const waLink = `https://wa.me/919633767691?text=${encodedMessage}`;

      // Open WhatsApp link in new tab after showing success
      setTimeout(() => {
        window.open(waLink, '_blank');
      }, 2500);
    }
  });
}

// Reset booking form view
window.resetBookingForm = function() {
  const form = document.getElementById('bookingForm');
  const successOverlay = document.getElementById('formSuccess');
  const budgetInput = document.getElementById('form-budget');
  const budgetValue = document.getElementById('budget-current');

  if (form) {
    form.reset();
    if (budgetInput && budgetValue) {
      budgetInput.value = 50000;
      budgetValue.textContent = '$50,000';
    }
  }
  
  if (successOverlay) {
    successOverlay.classList.remove('active');
  }
};

/* ==========================================================================
   6. TESTIMONIALS SLIDER CAROUSEL
   ========================================================================== */
function initTestimonialSlider() {
  const track = document.getElementById('testimonials-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  const btnPrev = document.getElementById('test-prev');
  const btnNext = document.getElementById('test-next');

  if (!track || slides.length === 0) return;

  let currentSlide = 0;
  const slideCount = slides.length;
  let autoplayInterval;

  // Render transitions
  const updateSlider = (index) => {
    currentSlide = index;
    
    // Shift track
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Sync dots
    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  // Click next slide
  const nextSlide = () => {
    let nextIdx = currentSlide + 1;
    if (nextIdx >= slideCount) nextIdx = 0;
    updateSlider(nextIdx);
  };

  // Click prev slide
  const prevSlide = () => {
    let prevIdx = currentSlide - 1;
    if (prevIdx < 0) prevIdx = slideCount - 1;
    updateSlider(prevIdx);
  };

  // Setup event listeners for arrows
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });
  }

  // Setup dot clicking
  dots.forEach(dot => {
    dot.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      updateSlider(index);
      resetAutoplay();
    });
  });

  // Autoplay intervals
  const startAutoplay = () => {
    autoplayInterval = setInterval(nextSlide, 8000);
  };

  const resetAutoplay = () => {
    clearInterval(autoplayInterval);
    startAutoplay();
  };

  // Initialize
  startAutoplay();

  // Handle touch swiping for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      // Swipe Left (Next)
      nextSlide();
      resetAutoplay();
    } else if (touchEndX - touchStartX > swipeThreshold) {
      // Swipe Right (Prev)
      prevSlide();
      resetAutoplay();
    }
  };
}
