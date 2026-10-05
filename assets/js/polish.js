// Shared touches for every page: hero slideshow, fade-in on scroll and a
// photo viewer. Works on its own; does nothing where a page has no match.
(function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Home hero: crossfade through the forest photos.
    var slides = document.querySelectorAll('.hero-slide');
    var dots = document.querySelector('.hero-dots');
    if (slides.length > 1) {
        var at = 0, timer = null;
        var buttons = [];
        var show = function (i) {
            slides[at].classList.remove('is-on');
            if (buttons[at]) buttons[at].setAttribute('aria-selected', 'false');
            at = (i + slides.length) % slides.length;
            // Restart the slow zoom on the photo that comes in.
            void slides[at].offsetWidth;
            slides[at].classList.add('is-on');
            if (buttons[at]) buttons[at].setAttribute('aria-selected', 'true');
        };
        var start = function () {
            if (reduce) return;
            clearInterval(timer);
            timer = setInterval(function () { show(at + 1); }, 6500);
        };
        if (dots) {
            slides.forEach(function (_, i) {
                var b = document.createElement('button');
                b.type = 'button';
                b.setAttribute('role', 'tab');
                b.setAttribute('aria-label', 'Photo ' + (i + 1));
                b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
                b.addEventListener('click', function () { show(i); start(); });
                dots.appendChild(b);
                buttons.push(b);
            });
        }
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) clearInterval(timer); else start();
        });
        start();
    }

    // Fade sections in as they scroll into view.
    var revealSel = [
        '.section-header', '.content-wrapper', '.fp-card', '.equity-paybill-card', '.equity-commitment',
        '.contact-form', '.newsletter .container', '.footer-grid > *', '.achievement-card', '.cta-box'
    ].join(',');
    var toReveal = Array.prototype.slice.call(document.querySelectorAll(revealSel));
    if ('IntersectionObserver' in window && !reduce && toReveal.length) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                e.target.classList.add('rv-in');
                io.unobserve(e.target);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        toReveal.forEach(function (el, i) {
            // Things already on screen stay visible; only later ones fade in.
            if (el.getBoundingClientRect().top < window.innerHeight) return;
            el.classList.add('rv');
            el.style.transitionDelay = ((i % 4) * 70) + 'ms';
            io.observe(el);
        });
    }

    // Photo viewer: opens a list of photos large, with arrows, keys and swipe.
    // Other pages can use it through window.olViewer.open(list, index), where
    // list is [{ src, alt }].
    var lb = null, big, cap, count, list = [], cur = 0, opener = null;
    var build = function () {
        lb = document.createElement('div');
        lb.className = 'lb';
        lb.setAttribute('role', 'dialog');
        lb.setAttribute('aria-modal', 'true');
        lb.setAttribute('aria-label', 'Photo viewer');
        lb.innerHTML =
            '<img alt="">' +
            '<p class="lb-cap"><span class="lb-text"></span> <span class="lb-count"></span></p>' +
            '<button type="button" class="lb-close" aria-label="Close"><i class="fas fa-xmark"></i></button>' +
            '<button type="button" class="lb-prev" aria-label="Previous photo"><i class="fas fa-chevron-left"></i></button>' +
            '<button type="button" class="lb-next" aria-label="Next photo"><i class="fas fa-chevron-right"></i></button>';
        document.body.appendChild(lb);
        big = lb.querySelector('img');
        cap = lb.querySelector('.lb-text');
        count = lb.querySelector('.lb-count');
        lb.querySelector('.lb-close').addEventListener('click', lbClose);
        lb.querySelector('.lb-prev').addEventListener('click', function () { lbShow(cur - 1); });
        lb.querySelector('.lb-next').addEventListener('click', function () { lbShow(cur + 1); });
        lb.addEventListener('click', function (e) { if (e.target === lb) lbClose(); });
        document.addEventListener('keydown', function (e) {
            if (!lb.classList.contains('lb-open')) return;
            if (e.key === 'Escape') lbClose();
            if (e.key === 'ArrowLeft') lbShow(cur - 1);
            if (e.key === 'ArrowRight') lbShow(cur + 1);
        });
        var x0 = null;
        lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
        lb.addEventListener('touchend', function (e) {
            if (x0 === null) return;
            var dx = e.changedTouches[0].clientX - x0;
            if (Math.abs(dx) > 50) lbShow(cur + (dx < 0 ? 1 : -1));
            x0 = null;
        });
    };
    var lbShow = function (i) {
        cur = (i + list.length) % list.length;
        big.src = list[cur].src;
        big.alt = list[cur].alt || '';
        cap.textContent = list[cur].alt || '';
        count.textContent = list.length > 1 ? (cur + 1) + ' / ' + list.length : '';
        // Load the next photo early so swiping feels instant.
        if (list.length > 1) { var pre = new Image(); pre.src = list[(cur + 1) % list.length].src; }
    };
    var lbOpen = function (items, i, from) {
        if (!lb) build();
        list = items;
        opener = from || document.activeElement;
        lbShow(i);
        lb.classList.add('lb-open');
        document.body.style.overflow = 'hidden';
        lb.querySelector('.lb-close').focus();
    };
    var lbClose = function () {
        lb.classList.remove('lb-open');
        document.body.style.overflow = '';
        if (opener && opener.focus) opener.focus();
    };
    window.olViewer = { open: lbOpen };

    // Tap a photo on the page to see it large. Photos inside links keep their link.
    var pics = Array.prototype.slice.call(document.querySelectorAll(
        '.fp-card img, .content-wrapper img, .carousel-slide img, .gallery-item img, .beekeeping-item img, .workshop-gallery img'
    )).filter(function (img) { return !img.closest('a'); });
    var items = pics.map(function (img) { return { src: img.currentSrc || img.src, alt: img.alt }; });
    pics.forEach(function (img, i) {
        img.classList.add('zoomable');
        img.setAttribute('tabindex', '0');
        img.addEventListener('click', function () { lbOpen(items, i, img); });
        img.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lbOpen(items, i, img); }
        });
    });

    // Big carousels: a "12 / 220" counter instead of hundreds of dots.
    // script.js makes the dots when the page is ready, so wait for that.
    var countSlides = function () { document.querySelectorAll('.carousel-nav').forEach(function (nav) {
        var dots = nav.children;
        if (dots.length <= 15) return;
        nav.classList.add('carousel-nav--count');
        var label = document.createElement('p');
        label.className = 'carousel-count';
        nav.parentNode.insertBefore(label, nav.nextSibling);
        var update = function () {
            var at = Array.prototype.findIndex.call(dots, function (d) { return d.classList.contains('current-slide'); });
            label.textContent = (at + 1) + ' / ' + dots.length;
        };
        update();
        new MutationObserver(update).observe(nav, { attributes: true, subtree: true, attributeFilter: ['class'] });
    }); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', countSlides);
    else countSlides();
})();
