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

    // Tap a photo to see it large. Photos inside links keep their link.
    var pics = Array.prototype.slice.call(document.querySelectorAll(
        '.fp-card img, .content-wrapper img, .carousel-slide img, .gallery-item img, .beekeeping-item img, .workshop-gallery img'
    )).filter(function (img) { return !img.closest('a'); });
    if (!pics.length) return;

    var lb = document.createElement('div');
    lb.className = 'lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Photo viewer');
    lb.innerHTML =
        '<img alt="">' +
        '<p class="lb-cap"></p>' +
        '<button type="button" class="lb-close" aria-label="Close"><i class="fas fa-xmark"></i></button>' +
        '<button type="button" class="lb-prev" aria-label="Previous photo"><i class="fas fa-chevron-left"></i></button>' +
        '<button type="button" class="lb-next" aria-label="Next photo"><i class="fas fa-chevron-right"></i></button>';
    document.body.appendChild(lb);
    var big = lb.querySelector('img'), cap = lb.querySelector('.lb-cap');
    var cur = 0, opener = null;

    var open = function (i) {
        cur = (i + pics.length) % pics.length;
        var p = pics[cur];
        big.src = p.currentSrc || p.src;
        big.alt = p.alt || '';
        cap.textContent = p.alt || '';
        lb.classList.add('lb-open');
        document.body.style.overflow = 'hidden';
        lb.querySelector('.lb-close').focus();
    };
    var close = function () {
        lb.classList.remove('lb-open');
        document.body.style.overflow = '';
        if (opener) opener.focus();
    };
    pics.forEach(function (img, i) {
        img.classList.add('zoomable');
        img.setAttribute('tabindex', '0');
        img.addEventListener('click', function () { opener = img; open(i); });
        img.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); opener = img; open(i); }
        });
    });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function () { open(cur - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { open(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('lb-open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') open(cur - 1);
        if (e.key === 'ArrowRight') open(cur + 1);
    });
    // Swipe on phones.
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 50) open(cur + (dx < 0 ? 1 : -1));
        x0 = null;
    });
})();
