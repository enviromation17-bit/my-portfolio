(function(){
  var anchor = document.getElementById('projects');
  if (!anchor) return;
  fetch('sections-extra.html').then(function(r){ return r.text(); }).then(function(html){
    var wrap = document.createElement('div');
    wrap.innerHTML = html;
    while (wrap.firstChild) anchor.parentNode.insertBefore(wrap.firstChild, anchor);
    if (window.gsap && window.ScrollTrigger) {
      try {
        document.querySelectorAll('#see [data-reveal], #control [data-reveal]').forEach(function(el){
          gsap.from(el, {opacity:0, y:24, duration:0.7, ease:'power2.out',
            scrollTrigger:{trigger:el, start:'top 88%'}});
        });
      } catch(e) {}
    }
  }).catch(function(){});
})();
