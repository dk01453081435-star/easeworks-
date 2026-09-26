/**
 * EaseWorks — Modern Software Development & Engineering Agency
 * Interactions, Hero Parallax, Responsive Navigation, Service Sync & Form Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. SELECTORS & STATE
  // ==========================================================================
  const header = document.getElementById('siteHeader');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const customCursor = document.getElementById('customCursor');
  const cursorTrailer = document.getElementById('cursorTrailer');
  const heroVisual = document.getElementById('heroVisual');
  const parallaxCanvas = document.getElementById('parallaxCanvas');
  const contactForm = document.getElementById('contactForm');
  const toastContainer = document.getElementById('toastContainer');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const serviceCards = document.querySelectorAll('.service-bento-card');
  const projectTypeSelect = document.getElementById('projectType');
  const serviceSelectGroup = document.getElementById('serviceSelectGroup');

  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth < 992;

  // ==========================================================================
  // 2. CUSTOM CURSOR (Desktop Non-Touch Only with Smooth Lerp)
  // ==========================================================================
  if (!isTouchDevice && customCursor && cursorTrailer) {
    customCursor.style.display = 'block';
    cursorTrailer.style.display = 'block';

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let trailerX = mouseX;
    let trailerY = mouseY;
    let isCursorVisible = false;

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

    function renderCursorTrailer() {
      trailerX += (mouseX - trailerX) * 0.18;
      trailerY += (mouseY - trailerY) * 0.18;

      cursorTrailer.style.transform = `translate3d(${trailerX}px, ${trailerY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursorTrailer);
    }
    requestAnimationFrame(renderCursorTrailer);

    document.addEventListener('mouseleave', () => {
      customCursor.style.opacity = '0';
      cursorTrailer.style.opacity = '0';
      isCursorVisible = false;
    });

    // Interactive Hover States
    const interactiveElements = document.querySelectorAll('button, a, .service-bento-card, .archetype-card, .why-card, .team-card, .channel-card, input, select, textarea');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // ==========================================================================
  // 3. STICKY NAVBAR & SCROLL BEHAVIOR
  // ==========================================================================
  function handleNavbarScroll() {
    if (window.scrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // Scrollspy: Highlight Active Nav Link
  const trackedSections = document.querySelectorAll('section[id]');
  function updateActiveNavOnScroll() {
    const scrollY = window.scrollY;
    trackedSections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      const sectionId = section.getAttribute('id');

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
  // 4. MOBILE DRAWER NAVIGATION
  // ==========================================================================
  if (mobileToggle && mobileDrawer) {
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

    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) closeMobileMenu();
      else openMobileMenu();
    });

    if (drawerClose) drawerClose.addEventListener('click', closeMobileMenu);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMobileMenu);

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    const mobileDrawerBtn = document.querySelector('.mobile-drawer-btn');
    if (mobileDrawerBtn) {
      mobileDrawerBtn.addEventListener('click', closeMobileMenu);
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // ==========================================================================
  // 5. HERO VISUAL 3D PARALLAX TILT
  // ==========================================================================
  if (heroVisual && parallaxCanvas && !isTouchDevice) {
    const heroSection = document.getElementById('hero');
    const satellites = heroVisual.querySelectorAll('[data-parallax-depth]');
    const consoleWindow = heroVisual.querySelector('.console-window');

    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    let targetShiftX = 0;
    let targetShiftY = 0;
    let currentShiftX = 0;
    let currentShiftY = 0;

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      targetRotX = -relY * 12; // tilt up/down
      targetRotY = relX * 14;  // tilt left/right
      targetShiftX = relX * 2;
      targetShiftY = relY * 2;
    });

    heroSection.addEventListener('mouseleave', () => {
      targetRotX = 0;
      targetRotY = 0;
      targetShiftX = 0;
      targetShiftY = 0;
    });

    function updateHeroParallax() {
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;
      currentShiftX += (targetShiftX - currentShiftX) * 0.08;
      currentShiftY += (targetShiftY - currentShiftY) * 0.08;

      if (consoleWindow) {
        consoleWindow.style.transform = `rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
      }

      satellites.forEach((sat) => {
        const depth = parseFloat(sat.getAttribute('data-parallax-depth')) || 20;
        const moveX = currentShiftX * depth;
        const moveY = currentShiftY * depth;
        sat.style.transform = `translate3d(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px, 0)`;
      });

      requestAnimationFrame(updateHeroParallax);
    }
    requestAnimationFrame(updateHeroParallax);
  }

  // ==========================================================================
  // 6. SERVICE BENTO CARDS -> FORM SYNC & SMOOTH SCROLL
  // ==========================================================================
  serviceCards.forEach((card) => {
    // Mouse spotlight effect on card
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    // Click to select in contact dropdown
    card.addEventListener('click', () => {
      const serviceName = card.getAttribute('data-service');
      if (serviceName && projectTypeSelect) {
        for (let i = 0; i < projectTypeSelect.options.length; i++) {
          if (projectTypeSelect.options[i].value.toLowerCase() === serviceName.toLowerCase()) {
            projectTypeSelect.selectedIndex = i;
            break;
          }
        }
      }

      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          if (projectTypeSelect) projectTypeSelect.focus();
          if (serviceSelectGroup) {
            serviceSelectGroup.classList.add('highlight-pulse');
            setTimeout(() => {
              serviceSelectGroup.classList.remove('highlight-pulse');
            }, 1200);
          }
        }, 600);
      }
    });
  });

  // ==========================================================================
  // 7. SCROLL-REVEAL OBSERVER
  // ==========================================================================
  const revealItems = document.querySelectorAll('.reveal-item');
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
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach((el) => {
      revealObserver.observe(el);
    });
  } else {
    revealItems.forEach(el => el.classList.add('in-view'));
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

      // 1. Name Validation
      if (!nameInput.value.trim()) {
        nameInput.closest('.input-field-group').classList.add('has-error');
        isValid = false;
      }

      // 2. Email Validation
      if (!validateEmail(emailInput.value.trim())) {
        emailInput.closest('.input-field-group').classList.add('has-error');
        isValid = false;
      }

      // 3. WhatsApp / Phone Validation
      if (!whatsappInput.value.trim() || whatsappInput.value.trim().length < 7) {
        whatsappInput.closest('.input-field-group').classList.add('has-error');
        isValid = false;
      }

      // 4. Project Category Validation
      if (!projectTypeSelect.value) {
        projectTypeSelect.closest('.input-field-group').classList.add('has-error');
        isValid = false;
      }

      // 5. Details Validation
      if (!detailsInput.value.trim()) {
        detailsInput.closest('.input-field-group').classList.add('has-error');
        isValid = false;
      }

      if (!isValid) {
        showToast('Please complete all required fields.', 'warning');
        return;
      }

      // Construct WhatsApp Deep Link Message
      const clientName = nameInput.value.trim();
      const clientEmail = emailInput.value.trim();
      const clientPhone = whatsappInput.value.trim();
      const clientService = projectTypeSelect.value;
      const clientDetails = detailsInput.value.trim();

      const formattedMessage = `Hi EaseWorks, I would like to discuss a project:%0A%0A` +
        `• *Client Name:* ${encodeURIComponent(clientName)}%0A` +
        `• *Email:* ${encodeURIComponent(clientEmail)}%0A` +
        `• *WhatsApp/Phone:* ${encodeURIComponent(clientPhone)}%0A` +
        `• *Service Required:* ${encodeURIComponent(clientService)}%0A` +
        `• *Project Scope:* ${encodeURIComponent(clientDetails)}`;

      const whatsappUrl = `https://wa.me/918084444842?text=${formattedMessage}`;

      // Button Feedback State
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Preparing Project Brief...</span>`;

      showToast('Project inquiry recorded! Opening WhatsApp to start direct communication...', 'success');

      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span class="btn-text">Send Project Inquiry</span>
          <svg class="btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        `;
      }, 900);
    });

    // Real-time clearance of error states
    [nameInput, emailInput, whatsappInput, detailsInput, projectTypeSelect].forEach((input) => {
      input.addEventListener('input', () => {
        const group = input.closest('.input-field-group');
        if (group && group.classList.contains('has-error')) {
          group.classList.remove('has-error');
        }
      });
    });
  }

  // ==========================================================================
  // 9. TOAST NOTIFICATION UTILITY (Zero Emoji, Clean Vector Icons)
  // ==========================================================================
  function showToast(message, type = 'info') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      <span class="toast-icon">${iconSvg}</span>
      <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4200);
  }
});
