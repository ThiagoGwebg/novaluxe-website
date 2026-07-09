document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Navbar: shrink + shadow once the page is scrolled
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const onScroll = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Subtle hero parallax (background-position — does not fight the zoom animation)
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg && !prefersReducedMotion && window.innerWidth > 768) {
        let ticking = false;
        const updateParallax = () => {
            const offset = Math.round(window.scrollY * 0.3);
            heroBg.style.backgroundPosition = `center calc(50% + ${offset}px)`;
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    // Directional scroll-reveal with stagger (works on every page)
    const revealSelectors = [
        '.services-intro-content',
        '.service-card',
        '.eco-strip',
        '.why-us-image',
        '.why-us-content',
        '.testimonial-card',
        '.city-tag',
        '.cta-desc',
        '.footer-col',
        '.blog-post-card',
        '.blog-widget',
        '.single-post-content > p',
        '.single-post-content > h2',
        '.single-post-content > h3',
        '.post-footer-nav'
    ];

    const revealEls = document.querySelectorAll(revealSelectors.join(','));
    const alternating = '.testimonial-card, .service-card, .city-tag, .blog-post-card';

    revealEls.forEach((el, index) => {
        el.classList.add('reveal');
        if (el.matches(alternating)) {
            el.classList.add(index % 2 === 0 ? 'reveal-left' : 'reveal-right');
        }
    });

    if (prefersReducedMotion) {
        revealEls.forEach(el => el.classList.add('is-visible'));
    } else {
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Small stagger based on position within its row
                    const delay = (Array.prototype.indexOf.call(revealEls, entry.target) % 4) * 90;
                    entry.target.style.transitionDelay = `${delay}ms`;
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealEls.forEach(el => revealObserver.observe(el));
    }

    // Animated counter for the satisfaction badge (e.g. "500+")
    const badge = document.querySelector('.satisfaction-badge strong');
    if (badge && !prefersReducedMotion) {
        const raw = badge.textContent.trim();
        const target = parseInt(raw.replace(/\D/g, ''), 10);
        const suffix = raw.replace(/[\d\s]/g, ''); // keeps "+" etc.

        if (!isNaN(target)) {
            const countObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    obs.unobserve(entry.target);

                    const duration = 1600;
                    const start = performance.now();
                    const tick = now => {
                        const progress = Math.min((now - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                        badge.textContent = Math.round(eased * target) + suffix;
                        if (progress < 1) requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                });
            }, { threshold: 0.5 });

            countObserver.observe(badge);
        }
    }

    // Generic reveal for the new gallery & process sections (own is-visible styling)
    const staggerEls = document.querySelectorAll('.gallery-item, .process-step');
    if (prefersReducedMotion) {
        staggerEls.forEach(el => el.classList.add('is-visible'));
    } else {
        const staggerObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const siblings = entry.target.parentElement.children;
                const idx = Array.prototype.indexOf.call(siblings, entry.target);
                entry.target.style.transitionDelay = `${(idx % 5) * 110}ms`;
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.15 });
        staggerEls.forEach(el => staggerObserver.observe(el));
    }

    // Animated counters for the stats band
    const statNums = document.querySelectorAll('.stat-num[data-count]');
    if (statNums.length) {
        const runCount = el => {
            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            if (prefersReducedMotion || isNaN(target)) {
                el.textContent = target + suffix;
                return;
            }
            const duration = 1800;
            const start = performance.now();
            const tick = now => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(eased * target) + suffix;
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };

        const statObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                runCount(entry.target);
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.5 });

        statNums.forEach(el => statObserver.observe(el));
    }

    // Scroll reading-progress bar
    if (!prefersReducedMotion) {
        const progress = document.createElement('div');
        progress.className = 'scroll-progress';
        document.body.appendChild(progress);
        let progressTicking = false;
        const updateProgress = () => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
            progress.style.width = pct + '%';
            progressTicking = false;
        };
        updateProgress();
        window.addEventListener('scroll', () => {
            if (!progressTicking) {
                window.requestAnimationFrame(updateProgress);
                progressTicking = true;
            }
        }, { passive: true });
    }

    // Smooth 3D cursor tilt on cards (desktop, pointer-capable devices only)
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!prefersReducedMotion && finePointer && window.innerWidth > 768) {
        const tiltEls = document.querySelectorAll('.service-card, .process-step, .testimonial-card');
        const MAX = 6; // degrees
        tiltEls.forEach(card => {
            card.classList.add('tilt');
            let rafId = null;

            const onMove = e => {
                const rect = card.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width;
                const py = (e.clientY - rect.top) / rect.height;
                const rotY = (px - 0.5) * (MAX * 2);
                const rotX = (0.5 - py) * (MAX * 2);
                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    card.style.transform =
                        `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-6px) scale(1.01)`;
                });
            };

            card.addEventListener('mouseenter', () => card.classList.add('tilting'));
            card.addEventListener('mousemove', onMove);
            card.addEventListener('mouseleave', () => {
                if (rafId) cancelAnimationFrame(rafId);
                card.classList.remove('tilting');
                card.style.transform = '';
            });
        });
    }

    // Back-to-top button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        const toggleBackToTop = () => {
            backToTop.classList.toggle('show', window.scrollY > 500);
        };
        toggleBackToTop();
        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    }
});
