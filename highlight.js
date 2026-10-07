/* Scroll highlight system — key phrases light up as they enter view */
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.utils.toArray('.hl-scroll').forEach(function (el) {
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
})();
