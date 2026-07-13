// Mobile navigation menu (hamburger).
// Builds a mobile menu from the existing desktop <nav>, so each page keeps its
// own correct links automatically. Fully self-styled: it does NOT rely on
// Tailwind utility classes being generated for dynamically-injected elements
// (the Play CDN only generates classes that already exist in the static HTML).
(function () {
  var OPEN_ICON =
    '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M4 12h16M4 17h16"/></svg>';
  var CLOSE_ICON =
    '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18"/></svg>';

  var CSS =
    '#mobileMenuToggle{display:none;background:none;border:0;color:#fff;padding:8px;margin-right:-8px;cursor:pointer;line-height:0;}' +
    '#mobileMenu{display:none;background:#0d1f14;border-top:1px solid rgba(255,255,255,.1);}' +
    '#mobileMenu.open{display:block;}' +
    '#mobileMenu .mm-list{display:flex;flex-direction:column;padding:8px 32px 20px;}' +
    '#mobileMenu a{padding:16px 0;color:#d1d5db;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;border-bottom:1px solid rgba(255,255,255,.06);transition:color .2s ease;}' +
    '#mobileMenu a:hover{color:#fff;}' +
    '#mobileMenu a.mm-cta{margin-top:18px;background:#3B5B43;color:#fff;text-align:center;padding:14px 20px;border-radius:9999px;font-weight:600;font-size:.72rem;border-bottom:0;}' +
    '#mobileMenu a.mm-cta:hover{background:#2d4533;}' +
    '@media (max-width:767px){' +
    '#mobileMenuToggle{display:inline-flex;align-items:center;justify-content:center;}' +
    '#navQuoteBtn{display:none !important;}' +
    '}' +
    '@media (min-width:768px){#mobileMenu{display:none !important;}}';

  function injectStyles() {
    if (document.getElementById('mobileNavStyles')) return;
    var style = document.createElement('style');
    style.id = 'mobileNavStyles';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function init() {
    var header = document.querySelector('header');
    if (!header) return;

    var bar = header.querySelector('.max-w-7xl') || header.firstElementChild;
    var desktopNav = header.querySelector('nav.hidden');
    if (!bar || !desktopNav) return;
    if (header.querySelector('#mobileMenuToggle')) return; // already initialised

    injectStyles();

    // Hamburger button (shown only below the md breakpoint via CSS above).
    var btn = document.createElement('button');
    btn.id = 'mobileMenuToggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Toggle navigation menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = OPEN_ICON;
    bar.appendChild(btn);

    // Tag the "Request Quote" button so CSS can hide it on mobile
    // (it is duplicated inside the menu instead).
    var quote = bar.querySelector('a[href*="quote"]');
    if (quote) quote.id = 'navQuoteBtn';

    // Collapsible mobile panel.
    var panel = document.createElement('div');
    panel.id = 'mobileMenu';

    var listEl = document.createElement('nav');
    listEl.className = 'mm-list';

    desktopNav.querySelectorAll('a').forEach(function (a) {
      var link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = a.textContent.trim();
      listEl.appendChild(link);
    });

    if (quote) {
      var cta = document.createElement('a');
      cta.href = quote.getAttribute('href');
      cta.textContent = 'Request Quote';
      cta.className = 'mm-cta';
      listEl.appendChild(cta);
    }

    panel.appendChild(listEl);
    header.appendChild(panel);

    function close() {
      panel.classList.remove('open');
      btn.innerHTML = OPEN_ICON;
      btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', function () {
      var isOpen = panel.classList.toggle('open');
      btn.innerHTML = isOpen ? CLOSE_ICON : OPEN_ICON;
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    listEl.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
