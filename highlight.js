/* Scroll highlight system — key phrases light up as they enter view */
(function () {
  function bindHighlights(root) {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    var scope = root || document;
    gsap.utils.toArray(scope.querySelectorAll ? scope.querySelectorAll('.hl-scroll') : '.hl-scroll').forEach(function (el) {
      gsap.set(el, { backgroundSize: '0% 88%' });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        onEnter: function () {
          gsap.to(el, { backgroundSize: '100% 88%', duration: 0.55, ease: 'power2.out' });
          el.classList.add('is-lit', 'hl-pulse');
        },
        onLeaveBack: function () {
          gsap.to(el, { backgroundSize: '0% 88%', duration: 0.35, ease: 'power2.in' });
          el.classList.remove('is-lit', 'hl-pulse');
        }
      });
    });
  }

  function injectSections() {
    var nav = document.getElementById('navLinks');
    if (nav) {
      nav.innerHTML = '<a href="#process">Process</a><a href="#see">How it works</a><a href="#projects">Workers</a><a href="#control">Control</a><a href="contact.html">Contact</a>';
    }
    var anchor = document.getElementById('projects');
    if (!anchor || document.getElementById('see')) return;
    fetch('sections-extra.html')
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var wrap = document.createElement('div');
        wrap.innerHTML = html;
        while (wrap.firstChild) anchor.parentNode.insertBefore(wrap.firstChild, anchor);
        bindHighlights(document.getElementById('see'));
        bindHighlights(document.getElementById('control'));
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          try {
            document.querySelectorAll('#see [data-reveal], #control [data-reveal]').forEach(function (el) {
              gsap.from(el, {
                opacity: 0,
                y: 24,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 88%' }
              });
            });
          } catch (e) {}
        }
      })
      .catch(function () {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      bindHighlights(document);
      injectSections();
    });
  } else {
    bindHighlights(document);
    injectSections();
  }
})();
