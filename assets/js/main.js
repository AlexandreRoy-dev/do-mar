(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

})();

/**
 * Holiday / vacation closure banners (auto-show during each period)
 * - Fête du Canada : 3 juillet
 * - Vacances estivales : 17 juillet midi → 31 juillet inclusivement
 * - Vacances hivernales : 18 décembre midi → 1er janvier inclusivement
 */
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('#header');
  if (!header) return;

  const now = new Date();
  const year = now.getFullYear();

  const closures = [
    {
      start: new Date(year, 5, 20), // 20 juin
      end: new Date(year, 6, 4), // fin du 3 juillet
      message: 'Notez que nous serons fermés le 3 juillet pour la Fête du Canada'
    },
    {
      start: new Date(year, 6, 4), // dès le 4 juillet
      end: new Date(year, 7, 1), // fin du 31 juillet
      message: 'Vacances estivales : nous serons fermés du 17 juillet midi au 31 juillet inclusivement'
    },
    {
      start: new Date(year, 11, 1), // 1er décembre
      end: new Date(year + 1, 0, 2), // fin du 1er janvier
      message: 'Vacances hivernales : nous serons fermés du 18 décembre midi au 1er janvier inclusivement'
    },
    // Couverture début janvier (période commencée l’année précédente)
    {
      start: new Date(year - 1, 11, 1),
      end: new Date(year, 0, 2),
      message: 'Vacances hivernales : nous serons fermés du 18 décembre midi au 1er janvier inclusivement'
    }
  ];

  const active = closures.find((c) => now >= c.start && now < c.end);
  if (!active) return;

  const banner = document.createElement('div');
  banner.id = 'closure-banner';
  banner.className = 'closure-banner';
  banner.setAttribute('role', 'status');
  banner.setAttribute('aria-live', 'polite');
  banner.innerHTML = `<span class="closure-banner__text">${active.message}</span>`;

  document.body.insertBefore(banner, header);
  document.body.classList.add('has-closure-banner');

  const setBannerHeight = () => {
    document.documentElement.style.setProperty('--closure-banner-height', `${banner.offsetHeight}px`);
  };

  setBannerHeight();
  window.addEventListener('resize', setBannerHeight);
});

/**
 * Cookie Consent Logic
 */
document.addEventListener('DOMContentLoaded', () => {
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  // 1. Check if user has already made a choice
  const consent = localStorage.getItem('domar_cookie_consent');

  // 2. If no choice found, show the banner after a short delay
  if (!consent) {
    setTimeout(() => {
      cookieBanner.classList.add('show');
    }, 1000); // 1 second delay
  }

  // 3. Handle Accept
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('domar_cookie_consent', 'accepted');
      hideBanner();
      // Optional: Load analytics scripts here
    });
  }

  // 4. Handle Decline
  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('domar_cookie_consent', 'declined');
      hideBanner();
    });
  }

  // Helper function to hide banner with animation
  function hideBanner() {
    cookieBanner.classList.remove('show');
    // Remove from DOM after transition ensures no layout shift
    setTimeout(() => {
      cookieBanner.style.display = 'none';
    }, 500);
  }
});