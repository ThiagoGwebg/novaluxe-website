document.addEventListener('DOMContentLoaded', () => {
    // --- Configuração dos links das redes/plataformas ---
    const THUMBTACK_URL = "https://www.thumbtack.com/instant-results/?query=NovaLuxe%20HomeCleaning";
    // O link do Nextdoor costuma ser algo como https://nextdoor.com/pages/novaluxe-h/
    // Substitua a URL abaixo pelo link exato copiado do seu painel comercial do Nextdoor.
    const NEXTDOOR_URL = "https://nextdoor.com/pages/novaluxe-h";

    // Atualiza os links de avaliação dinamicamente
    document.getElementById('thumbtack-text-link')?.setAttribute('href', THUMBTACK_URL);
    document.getElementById('thumbtack-btn-link')?.setAttribute('href', THUMBTACK_URL);
    document.getElementById('nextdoor-text-link')?.setAttribute('href', NEXTDOOR_URL);
    document.getElementById('nextdoor-btn-link')?.setAttribute('href', NEXTDOOR_URL);

    // --- Navbar hide on scroll ---
    let lastScroll = 0;
    const nav = document.querySelector('header'); // Usar querySelector para pegar o header em todas as páginas
    if (nav) {
        window.addEventListener('scroll', () => {
            const cur = window.scrollY;
            if (cur > lastScroll && cur > 100) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }
            if (cur > 60 && nav.id === 'navbar') { // Adiciona sombra apenas na navbar da home
                nav.style.boxShadow = '0 2px 20px rgba(0,0,0,.35)';
            } else if (nav.id === 'navbar') {
                nav.style.boxShadow = 'none';
            }
            lastScroll = cur;
        });
    }

    // --- Back to top button ---
    const btn = document.getElementById('back-to-top');
    if (btn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
            } else {
                btn.style.opacity = '0';
                btn.style.transform = 'translateY(16px)';
            }
        });
    }

    // --- Scroll reveal ---
    const revealEls = document.querySelectorAll('.reveal, .hero-kicker, .hero-h1, .hero-sub, .hero-btns, .hero-trust');
    if (revealEls.length > 0) {
        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    revealObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(el => revealObs.observe(el));
    }

    // --- Count-up animation for stats ---
    const statEls = document.querySelectorAll('[data-count]');
    if (statEls.length > 0) {
        const countObs = new IntersectionObserver((entries, observer) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const el = e.target;
                    const target = parseInt(el.getAttribute('data-count'));
                    const suffix = el.getAttribute('data-suffix') || '';
                    let cur = 0;
                    const inc = target / 60; // Animation speed
                    const timer = setInterval(() => {
                        cur = Math.min(cur + inc, target);
                        el.textContent = Math.round(cur) + suffix;
                        if (cur >= target) {
                            clearInterval(timer);
                        }
                    }, 20);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        statEls.forEach(el => countObs.observe(el));
    }
});

function backToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}