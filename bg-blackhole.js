(function () {
  const canvas = document.getElementById('webgl');
  if (!canvas) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1;
  let scrubProgress = 0;
  let mouseX = 0.5, mouseY = 0.5;
  let time = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / w;
    mouseY = e.clientY / h;
  }, { passive: true });

  window.addEventListener('blackhole:scrub', (e) => {
    scrubProgress = (e.detail && typeof e.detail.progress === 'number') ? e.detail.progress : 0;
  });

  const orbs = [];
  for (let i = 0; i < 5; i++) {
    orbs.push({
      x: 0.15 + Math.random() * 0.7,
      y: 0.1 + Math.random() * 0.8,
      r: 120 + Math.random() * 180,
      vx: (Math.random() - 0.5) * 0.00015,
      vy: (Math.random() - 0.5) * 0.00012,
      hue: i % 2 === 0 ? 38 : 28,
      alpha: 0.04 + Math.random() * 0.03
    });
  }

  const N = 90;
  const particles = [];
  for (let i = 0; i < N; i++) {
    particles.push({
      x: Math.random(),
      y: Math.random(),
      z: 0.3 + Math.random() * 0.7,
      s: 0.6 + Math.random() * 1.4,
      drift: (Math.random() - 0.5) * 0.00008
    });
  }

  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,200,120,0.03)';
    ctx.lineWidth = 1;
    const gap = 80;
    const ox = (mouseX - 0.5) * 12;
    const oy = (mouseY - 0.5) * 8;
    for (let x = -gap; x < w + gap; x += gap) {
      ctx.beginPath();
      ctx.moveTo(x + ox, 0);
      ctx.lineTo(x + ox, h);
      ctx.stroke();
    }
    for (let y = -gap; y < h + gap; y += gap) {
      ctx.beginPath();
      ctx.moveTo(0, y + oy);
      ctx.lineTo(w, y + oy);
      ctx.stroke();
    }
    ctx.restore();
  }

  function frame(ts) {
    if (!reduceMotion) requestAnimationFrame(frame);
    time = ts * 0.001;

    ctx.fillStyle = '#08090c';
    ctx.fillRect(0, 0, w, h);

    const vg = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.4, w * 0.75);
    vg.addColorStop(0, 'rgba(18,16,14,0.9)');
    vg.addColorStop(1, 'rgba(5,6,8,0)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);

    for (const o of orbs) {
      if (!reduceMotion) {
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < -0.1 || o.x > 1.1) o.vx *= -1;
        if (o.y < -0.1 || o.y > 1.1) o.vy *= -1;
      }
      const px = o.x * w + (mouseX - 0.5) * 20;
      const py = o.y * h + (mouseY - 0.5) * 14;
      const g = ctx.createRadialGradient(px, py, 0, px, py, o.r);
      const a = o.alpha * (1 - scrubProgress * 0.35);
      g.addColorStop(0, 'hsla(' + o.hue + ',70%,55%,' + a + ')');
      g.addColorStop(0.45, 'hsla(' + o.hue + ',60%,40%,' + (a * 0.35) + ')');
      g.addColorStop(1, 'hsla(' + o.hue + ',50%,20%,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, o.r, 0, Math.PI * 2);
      ctx.fill();
    }

    drawGrid();

    for (const p of particles) {
      if (!reduceMotion) {
        p.x += p.drift;
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
      }
      const px = p.x * w + (mouseX - 0.5) * 8 * p.z;
      const py = p.y * h + Math.sin(time * 0.3 + p.x * 6) * 4 * p.z;
      const size = p.s * p.z;
      const alpha = 0.15 + p.z * 0.35;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(245, 210, 160,' + alpha + ')';
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }

    const bot = ctx.createLinearGradient(0, h * 0.6, 0, h);
    bot.addColorStop(0, 'rgba(8,9,12,0)');
    bot.addColorStop(1, 'rgba(8,9,12,0.55)');
    ctx.fillStyle = bot;
    ctx.fillRect(0, 0, w, h);
  }

  if (reduceMotion) {
    frame(0);
  } else {
    requestAnimationFrame(frame);
  }
})();
