/**
 * Nexus Landing Page - Vanilla JavaScript
 * Features:
 * - Mobile Hamburger Navigation Toggle & Accessibility
 * - Header Scroll Effect
 * - Active Navigation Link Tracking (IntersectionObserver)
 * - Smooth Scrolling fallback
 * - Interactive Feature Cards (Hover glow tracking)
 * - Contact Form Validation (Real-time & on submit in Georgian)
 * - Back to Top Button
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.getElementById('siteHeader');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('backToTop');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  // Input groups & error labels
  const inputs = {
    name: {
      field: document.getElementById('userName'),
      group: document.getElementById('group-name'),
      error: document.getElementById('nameError')
    },
    email: {
      field: document.getElementById('userEmail'),
      group: document.getElementById('group-email'),
      error: document.getElementById('emailError')
    },
    message: {
      field: document.getElementById('userMessage'),
      group: document.getElementById('group-message'),
      error: document.getElementById('messageError')
    }
  };

  /* ==========================================================================
     1. Mobile Hamburger Menu Toggle
     ========================================================================== */
  const toggleMenu = (open) => {
    const shouldOpen = open !== undefined ? open : !navMenu.classList.contains('open');
    navMenu.classList.toggle('open', shouldOpen);
    hamburgerBtn.classList.toggle('active', shouldOpen);
    hamburgerBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');

    if (shouldOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          toggleMenu(false);
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });

    // Reset overflow on desktop resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  /* ==========================================================================
     2. Header Background on Scroll & Back-to-Top Button
     ========================================================================== */
  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Header styling
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     3. Active Nav Link on Scroll (IntersectionObserver)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));
  }

  /* ==========================================================================
     4. Feature Cards Subtle Cursor Glow Effect
     ========================================================================== */
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const glow = card.querySelector('.feature-glow');
      if (glow) {
        glow.style.left = `${x - 70}px`;
        glow.style.top = `${y - 70}px`;
      }
    });
  });

  /* ==========================================================================
     5. Contact Form Validation Logic
     ========================================================================== */
  // Email validation regex (RFC 5322 standard compatible)
  const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  // Set field error
  const setError = (inputObj, message) => {
    inputObj.group.classList.add('has-error');
    inputObj.error.textContent = message;
  };

  // Clear field error
  const clearError = (inputObj) => {
    inputObj.group.classList.remove('has-error');
    inputObj.error.textContent = '';
  };

  // Real-time error clearing when user types
  Object.values(inputs).forEach(inputObj => {
    if (inputObj.field) {
      inputObj.field.addEventListener('input', () => {
        if (inputObj.group.classList.contains('has-error')) {
          clearError(inputObj);
        }
      });
    }
  });

  // Comprehensive Form Validation
  const validateForm = () => {
    let isValid = true;

    // Validate Name
    const nameVal = inputs.name.field.value.trim();
    if (nameVal === '') {
      setError(inputs.name, 'გთხოვთ მიუთითოთ თქვენი სახელი');
      isValid = false;
    } else if (nameVal.length < 2) {
      setError(inputs.name, 'სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს');
      isValid = false;
    } else {
      clearError(inputs.name);
    }

    // Validate Email
    const emailVal = inputs.email.field.value.trim();
    if (emailVal === '') {
      setError(inputs.email, 'გთხოვთ მიუთითოთ ელ-ფოსტის მისამართი');
      isValid = false;
    } else if (!isValidEmail(emailVal)) {
      setError(inputs.email, 'გთხოვთ შეიყვანოთ სწორი ელ-ფოსტა (მაგ: info@domain.ge)');
      isValid = false;
    } else {
      clearError(inputs.email);
    }

    // Validate Message
    const messageVal = inputs.message.field.value.trim();
    if (messageVal === '') {
      setError(inputs.message, 'გთხოვთ ჩაწეროთ შეტყობინება');
      isValid = false;
    } else if (messageVal.length < 10) {
      setError(inputs.message, 'შეტყობინება უნდა შეიცავდეს მინიმუმ 10 სიმბოლოს');
      isValid = false;
    } else {
      clearError(inputs.message);
    }

    return isValid;
  };

  // Handle Form Submit
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateForm()) {
        // Focus first invalid element
        const firstErrorField = contactForm.querySelector('.has-error .form-control');
        if (firstErrorField) {
          firstErrorField.focus();
        }
        return;
      }

      // Show loading spinner state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Simulate sending to server (1 second delay)
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        // Show success alert
        if (formSuccess) {
          formSuccess.style.display = 'flex';
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Reset form inputs
        contactForm.reset();

        // Automatically hide success alert after 6 seconds
        setTimeout(() => {
          if (formSuccess) {
            formSuccess.style.display = 'none';
          }
        }, 6000);
      }, 1000);
    });
  }
});
