/**
 * ELVYN – LUXURY FRAGRANCE SITE 2025
 * Fully working • No context loss • Hover + Click + Animated Dropdowns
 */

class SiteNavigation {
  constructor() {
    this.boundCloseAll = this.closeAllDropdowns.bind(this);
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupSearchOverlay();
    this.setupDropdownMenus();
    this.setupGlobalClickAndEscapeHandlers();
  }

  // ==================== 1. MOBILE DRAWER ====================
  setupMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const drawerOverlay = document.querySelector('.drawer-overlay');
    const drawerClose = document.querySelector('.drawer-close');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    if (!menuToggle || !mobileDrawer) return;

    const openMenu = () => {
      mobileDrawer.classList.add('active');
      drawerOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      mobileDrawer.classList.remove('active');
      drawerOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    menuToggle.addEventListener('click', openMenu);
    drawerClose?.addEventListener('click', closeMenu);
    drawerOverlay?.addEventListener('click', closeMenu);

    // Smart Link Closing
    drawerLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // If clicking the category toggle, DON'T close the drawer
        if (link.classList.contains('dropdown-toggle-mobile') || link.closest('.dropdown-toggle-mobile')) {
          return; 
        }
        closeMenu();
      });
    });

    // Mobile Accordion Logic
    document.querySelectorAll('.dropdown-toggle-mobile').forEach(toggle => {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const submenu = this.nextElementSibling;
        submenu.classList.toggle('active');
        this.classList.toggle('active'); // Rotates arrow
      });
    });
  }

  // ==================== 2. SEARCH OVERLAY ====================
  setupSearchOverlay() {
    const searchIcon = document.getElementById("search-icon");
    const searchForm = document.getElementById("search-form");
    const closeBtn = document.getElementById("close"); // Fixed ID selection

    if (!searchIcon || !searchForm) return;

    const openSearch = e => {
      e?.preventDefault();
      searchForm.classList.add("active");
      setTimeout(() => searchForm.querySelector("input")?.focus(), 300);
    };

    const closeSearch = () => searchForm.classList.remove("active");

    searchIcon.addEventListener("click", openSearch);
    closeBtn?.addEventListener("click", closeSearch);

    // Close when clicking background
    document.addEventListener("click", e => {
      if (searchForm.classList.contains("active") &&
          !searchForm.contains(e.target) &&
          !searchIcon.contains(e.target)) {
        closeSearch();
      }
    });
  }

  // ==================== 3. DESKTOP DROPDOWNS (THE FIX) ====================
  setupDropdownMenus() {
    // Only run this logic on Desktop
    const isDesktop = () => window.matchMedia('(min-width: 992px)').matches;

    document.querySelectorAll(".mega-dropdown").forEach(dropdown => {
      const toggle = dropdown.querySelector(".mega-toggle");
      const menu = dropdown.querySelector(".mega-panel");
      
      if (!toggle || !menu) return;

      // Variables
      let hideTimeout = null;
      const HIDE_DELAY = 600; // <--- INCREASED TO 600ms (More forgiving)

      // ARIA
      toggle.setAttribute("role", "button");
      toggle.setAttribute("aria-haspopup", "true");
      toggle.setAttribute("aria-expanded", "false");

      // --- OPEN FUNCTION ---
      const openMenu = () => {
        if (hideTimeout) clearTimeout(hideTimeout);

        // Close neighbors
        document.querySelectorAll(".mega-panel").forEach(m => {
          if (m !== menu) m.classList.remove("show");
        });
        document.querySelectorAll(".mega-toggle").forEach(t => {
          if (t !== toggle) t.setAttribute("aria-expanded", "false");
        });

        menu.classList.add("show");
        toggle.setAttribute("aria-expanded", "true");
      };

      // --- CLOSE (IMMEDIATE) ---
      const closeMenuImmediate = () => {
        if (hideTimeout) clearTimeout(hideTimeout);
        menu.classList.remove("show");
        toggle.setAttribute("aria-expanded", "false");
      };

      // --- CLOSE (DELAYED) ---
      const closeMenuDelayed = () => {
        hideTimeout = setTimeout(() => {
          closeMenuImmediate();
        }, HIDE_DELAY);
      };

      // --- LISTENERS ---

      // 1. Click (Toggle)
      toggle.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        menu.classList.contains("show") ? closeMenuImmediate() : openMenu();
      });

      // 2. Mouse Enter (Open + Cancel Close)
      dropdown.addEventListener("mouseenter", () => {
        if (isDesktop()) openMenu();
      });

      // 3. Mouse Leave (Start Timer)
      dropdown.addEventListener("mouseleave", () => {
        if (isDesktop()) closeMenuDelayed();
      });

      // 4. Menu Safety (If mouse is inside menu, definitely don't close)
      menu.addEventListener("mouseenter", () => {
        if (hideTimeout) clearTimeout(hideTimeout);
      });
    });
  }

  // Global Closer
  closeAllDropdowns() {
    document.querySelectorAll(".mega-panel.show").forEach(menu => menu.classList.remove("show"));
    document.querySelectorAll(".mega-toggle[aria-expanded='true']").forEach(toggle => toggle.setAttribute("aria-expanded", "false"));
  }

  setupGlobalClickAndEscapeHandlers() {
    document.addEventListener("click", (e) => {
      // If clicking outside of any dropdown, close them
      if (!e.target.closest('.mega-dropdown')) {
        this.closeAllDropdowns();
      }
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        this.closeAllDropdowns();
        document.getElementById("search-form")?.classList.remove("active");
      }
    });
  }
}

// ===================== INITIALIZE EVERYTHING =====================
document.addEventListener("DOMContentLoaded", () => {
  
  // 1. START NAVIGATION (This was missing in your snippet!)
  new SiteNavigation();

  // 2. HERO SLIDER
  if (typeof Swiper !== 'undefined' && document.querySelector('.home-slider')) {
    const heroSlider = new Swiper(".home-slider", {
      loop: true,
      speed: 1500,
      parallax: true,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true
      },
      keyboard: { enabled: true }
    });
  }
});