/**
 * EaseWorks — Modern Software Development Agency
 * Interactions, Micro-animations, Hero Parallax, Custom Cursor & Form Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. SELECTORS & STATE
  // ==========================================================================
  const header = document.getElementById('siteHeader');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const customCursor = document.getElementById('customCursor');
  const cursorTrailer = document.getElementById('cursorTrailer');
  const heroVisual = document.getElementById('heroVisual');
  const parallaxCanvas = document.getElementById('parallaxCanvas');
  const contactForm = document.getElementById('contactForm');
  const toastContainer = document.getElementById('toastContainer');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const serviceCards = document.querySelectorAll('.service-card');
  const projectTypeSelect = document.getElementById('projectType');

  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth < 992;

  // ==========================================================================
  // 2. CUSTOM CURSOR (Desktop only with Lerp Smoothing)
  // ==========================================================================
  if (!isTouchDevice && customCursor && cursorTrailer) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let trailerX = mouseX;
    let trailerY = mouseY;
    let isCursorVisible = false;

    // Direct position update for main dot
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isCursorVisible) {
        customCursor.style.opacity = '1';
        cursorTrailer.style.opacity = '1';
        isCursorVisible = true;
      }

      customCursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    // Smooth linear interpolation for cursor trailer ring
    function renderCursorTrailer() {
      trailerX += (mouseX - trailerX) * 0.18;
      trailerY += (mouseY - trailerY) * 0.18;

      cursorTrailer.style.transform = `translate3d(${trailerX}px, ${trailerY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursorTrailer);
    }
    requestAnimationFrame(renderCursorTrailer);

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      customCursor.style.opacity = '0';
      cursorTrailer.style.opacity = '0';
      isCursorVisible = false;
    });

    // Interactive hover triggers
    // A) Buttons
    const buttons = document.querySelectorAll('button, .btn, .social-link, .mobile-toggle');
    buttons.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover-button'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover-button'));
    });

    // B) Links
    const links = document.querySelectorAll('a:not(.btn)');
    links.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover-link'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover-link'));
    });

    // C) Service & Interactive Cards
    const interactiveCards = document.querySelectorAll('.service-card, .direct-card, .why-card, .team-card');
    interactiveCards.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover-card'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover-card'));
    });
  }

  // ==========================================================================
  // 3. STICKY NAVBAR & SCROLL BEHAVIOR
  // ==========================================================================
  function handleNavbarScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // Active section tracker on scroll
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNavOnScroll() {
    const scrollY = window.scrollY;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNavOnScroll, { passive: true });

  // ==========================================================================
  // 4. MOBILE HAMBURGER MENU
  // ==========================================================================
  if (mobileToggle && mobileDrawer) {
    function toggleMobileMenu() {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    }

    function openMobileMenu() {
      mobileDrawer.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
      mobileDrawer.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    mobileToggle.addEventListener('click', toggleMobileMenu);

    // Auto-close menu when a mobile nav link is clicked
    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    const mobileDrawerBtn = document.querySelector('.mobile-drawer-btn');
    if (mobileDrawerBtn) {
      mobileDrawerBtn.addEventListener('click', closeMobileMenu);
    }

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // ==========================================================================
  // 5. HERO VISUAL PARALLAX INTERACTION (Smooth subtle tilt & shift)
  // ==========================================================================
  if (heroVisual && parallaxCanvas && !isTouchDevice) {
    const parallaxElements = heroVisual.querySelectorAll('[data-parallax-depth]');
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHoveringHero = false;

    const heroSection = document.getElementById('hero');

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const mouseRelX = e.clientX - rect.left;
      const mouseRelY = e.clientY - rect.top;

      // Range -1 to 1 from center
      targetX = ((mouseRelX / rect.width) - 0.5) * 2;
      targetY = ((mouseRelY / rect.height) - 0.5) * 2;
      isHoveringHero = true;
    });

    heroSection.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      isHoveringHero = false;
    });

    function updateParallax() {
      // Smooth interpolation for subtle feel
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      parallaxElements.forEach((el) => {
        const depth = parseFloat(el.getAttribute('data-parallax-depth')) || 20;
        const moveX = currentX * depth;
        const moveY = currentY * depth;
        el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });

      requestAnimationFrame(updateParallax);
    }
    requestAnimationFrame(updateParallax);
  }

  // ==========================================================================
  // 6. SERVICE CARDS: SELECTION SHORTCUT TO CONTACT FORM
  // ==========================================================================
  serviceCards.forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.service-title');
      if (title && projectTypeSelect) {
        const serviceName = title.textContent.trim();
        // Match option in dropdown
        for (let i = 0; i < projectTypeSelect.options.length; i++) {
          if (projectTypeSelect.options[i].value.toLowerCase() === serviceName.toLowerCase()) {
            projectTypeSelect.selectedIndex = i;
            break;
          }
        }
      }

      // Smooth scroll to contact section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        // Briefly highlight the dropdown
        setTimeout(() => {
          projectTypeSelect.focus();
          projectTypeSelect.parentElement.classList.add('highlight-glow');
          setTimeout(() => {
            projectTypeSelect.parentElement.classList.remove('highlight-glow');
          }, 1200);
        }, 600);
      }
    });
  });

  // ==========================================================================
  // 7. SCROLL-REVEAL ANIMATIONS (IntersectionObserver)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el, index) => {
      // Add slight staggered transition delay if in a grid
      const parentGrid = el.closest('.services-grid, .why-grid, .team-grid, .process-timeline');
      if (parentGrid) {
        const siblingIndex = Array.from(parentGrid.children).indexOf(el);
        if (siblingIndex >= 0) {
          el.style.transitionDelay = `${(siblingIndex % 4) * 0.08}s`;
        }
      }
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show immediately
    revealElements.forEach(el => el.classList.add('in-view'));
  }

  // ==========================================================================
  // 8. CONTACT FORM VALIDATION & ENQUIRY DISPATCH
  // ==========================================================================
  if (contactForm) {
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const whatsappInput = document.getElementById('userWhatsApp');
    const detailsInput = document.getElementById('projectDetails');
    const submitBtn = document.getElementById('submitBtn');

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function clearErrors() {
      const errorGroups = contactForm.querySelectorAll('.has-error');
      errorGroups.forEach(g => g.classList.remove('has-error'));
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();
      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      // Validate Email
      if (!validateEmail(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      // Validate WhatsApp Number
      if (!whatsappInput.value.trim() || whatsappInput.value.trim().length < 7) {
        whatsappInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      // Validate Project Type
      if (!projectTypeSelect.value) {
        projectTypeSelect.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      // Validate Details
      if (!detailsInput.value.trim()) {
        detailsInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      if (!isValid) {
        showToast('Please fill out all required fields correctly.', 'warning');
        return;
      }

      // Format WhatsApp pre-filled message
      const clientName = nameInput.value.trim();
      const clientEmail = emailInput.value.trim();
      const clientPhone = whatsappInput.value.trim();
      const clientService = projectTypeSelect.value;
      const clientDetails = detailsInput.value.trim();

      const formattedMessage = `Hi EaseWorks, I would like to discuss a project:%0A%0A` +
        `• *Name:* ${encodeURIComponent(clientName)}%0A` +
        `• *Email:* ${encodeURIComponent(clientEmail)}%0A` +
        `• *WhatsApp:* ${encodeURIComponent(clientPhone)}%0A` +
        `• *Service:* ${encodeURIComponent(clientService)}%0A` +
        `• *Project Details:* ${encodeURIComponent(clientDetails)}`;

      const whatsappUrl = `https://wa.me/918084444842?text=${formattedMessage}`;

      // Provide responsive UI feedback
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Preparing Consultation...</span>`;

      showToast('Enquiry details recorded! Opening WhatsApp to start our conversation...', 'success');

      setTimeout(() => {
        // Open WhatsApp directly in new window
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        
        // Reset form & button
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span class="btn-text">Send Enquiry</span><span class="btn-arrow" aria-hidden="true">→</span>`;
      }, 1000);
    });

    // Real-time error clearance on input
    [nameInput, emailInput, whatsappInput, detailsInput, projectTypeSelect].forEach((input) => {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group && group.classList.contains('has-error')) {
          group.classList.remove('has-error');
        }
      });
    });
  }

  // ==========================================================================
  // 9. TOAST NOTIFICATION UTILITY
  // ==========================================================================
  function showToast(message, type = 'info') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  }
});
