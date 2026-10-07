(function () {
  if (document.getElementById('renoltHi')) return;
  var wrap = document.createElement('div');
  wrap.className = 'renolt-hi';
  wrap.id = 'renoltHi';
  wrap.setAttribute('aria-live', 'polite');
  wrap.innerHTML =
    '<div class="renolt-hi-bubble" id="renoltHiBubble">' +
    '<button type="button" class="hi-x" id="renoltHiClose" aria-label="Dismiss">×</button>' +
    '<p>Hi — how can Renolt help today?</p>' +
    '<span>One stuck process. Fixed properly.</span>' +
    '</div>' +
    '<a class="renolt-hi-av" href="https://wa.me/923207289443?text=Hello%20Renolt%2C%20Hi" target="_blank" rel="noopener" aria-label="Say hi on WhatsApp">' +
    '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<circle cx="32" cy="32" r="32" fill="#1a2233"/>' +
    '<circle cx="32" cy="24" r="11" fill="#d4a017"/>' +
    '<path d="M14 52c2.5-12 12-18 18-18s15.5 6 18 18" fill="#d4a017"/>' +
    '<circle cx="28" cy="22" r="1.6" fill="#08090c"/>' +
    '<circle cx="36" cy="22" r="1.6" fill="#08090c"/>' +
    '<path d="M28 28c1.5 2 6.5 2 8 0" stroke="#08090c" stroke-width="1.4" stroke-linecap="round"/>' +
    '</svg><span class="dot" title="Online"></span></a>';
  document.body.appendChild(wrap);
  var key = 'renolt_hi_dismissed';
  if (sessionStorage.getItem(key)) {
    wrap.style.display = 'none';
    return;
  }
  setTimeout(function () { wrap.classList.add('is-on'); }, 900);
  var close = document.getElementById('renoltHiClose');
  if (close) {
    close.addEventListener('click', function () {
      wrap.classList.remove('is-on');
      sessionStorage.setItem(key, '1');
      setTimeout(function () { wrap.style.display = 'none'; }, 400);
    });
  }
})();
