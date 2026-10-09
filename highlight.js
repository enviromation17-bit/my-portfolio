/* Scroll highlight system — key phrases light up as they enter view */
(function () {
  function bindHighlights(root) {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    var scope = root || document;
    var nodes = scope.querySelectorAll ? scope.querySelectorAll('.hl-scroll') : [];
    gsap.utils.toArray(nodes).forEach(function (el) {
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

  function injectVideoCapability() {
    var grid = document.querySelector('.work-grid');
    if (grid && !document.getElementById('proj-remotion')) {
      var card = document.createElement('article');
      card.className = 'proj';
      card.id = 'proj-remotion';
      card.setAttribute('data-reveal', '');
      card.innerHTML =
        '<div class="proj-top"><div class="proj-meta"><span class="tag">MOTION VIDEO</span><span class="pill live">Live promo</span></div>' +
        '<h3>How Renolt solves the problem</h3></div>' +
        '<p>22s promo: real business pain → each worker → clear fix. Messages, leads, posts, email — problem in, worker on, solved.</p>' +
        '<div class="proj-foot"><span class="tag">Remotion · 22s</span>' +
        '<a href="https://litter.catbox.moe/a0pcdn.mp4" target="_blank" rel="noopener">Watch promo →</a></div>';
      grid.appendChild(card);
    }

    var services = document.getElementById('services');
    if (services && !document.getElementById('svc-video')) {
      var faq = services.querySelector('.faq');
      var row = document.createElement('div');
      row.className = 'service';
      row.id = 'svc-video';
      row.setAttribute('data-reveal', '');
      row.innerHTML =
        '<div class="side"><b>PRODUCT VIDEO</b><h3>Your offer looks flat on a static page.</h3></div>' +
        '<div class="fix"><strong>How Renolt fixes it:</strong> cinematic product clips with <span class="hl-scroll">Remotion</span> + <span class="hl-scroll">video-shotcraft</span> — storyboarded motion and launch-ready promos for ads and social.</div>';
      if (faq) services.querySelector('.wrap').insertBefore(row, faq);
      else services.querySelector('.wrap').appendChild(row);
    }

    var note = document.querySelector('#projects .note');
    if (note && !document.getElementById('video-stack-note')) {
      var stack = document.createElement('p');
      stack.className = 'note';
      stack.id = 'video-stack-note';
      stack.setAttribute('data-reveal', '');
      stack.innerHTML =
        'Video stack: <span class="hl-scroll">Remotion</span> + problem→worker→solution storytelling. Watch the Renolt promo or request a custom one for your product.';
      if (note.parentNode) note.parentNode.insertBefore(stack, note.nextSibling);
    }
  }

  function injectSections() {
    var nav = document.getElementById('navLinks');
    if (nav) {
      nav.innerHTML =
        '<a href="#process">Process</a><a href="#see">How it works</a><a href="#projects">Workers</a><a href="#control">Control</a><a href="contact.html">Contact</a>';
    }
    injectVideoCapability();

    var anchor = document.getElementById('projects');
    if (!anchor || document.getElementById('see')) return;
    fetch('sections-extra.html')
      .then(function (r) {
        return r.text();
      })
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
