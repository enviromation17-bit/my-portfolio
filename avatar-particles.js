/**
 * Renolt — Avatar gravity particle field
 * Particles drift toward the avatar, sling past, then fly into space.
 */
(function (global) {
  'use strict';

  function AvatarGravity(opts) {
    opts = opts || {};
    this.canvas = typeof opts.canvas === 'string'
      ? document.querySelector(opts.canvas)
      : opts.canvas;
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.count = opts.count || 160;
    this.colors = opts.colors || {
      core: '#d4a017',
      soft: 'rgba(212,160,23,0.55)',
      dust: 'rgba(180,190,210,0.55)',
      bright: 'rgba(238,241,246,0.75)',
      bg: null
    };
    this.particles = [];
    this.t = 0;
    this.mouse = { x: 0, y: 0, active: false };
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this._onResize = this.resize.bind(this);
    this._onMove = this.onMove.bind(this);
    this._onLeave = this.onLeave.bind(this);

    window.addEventListener('resize', this._onResize);
    this.canvas.addEventListener('mousemove', this._onMove, { passive: true });
    this.canvas.addEventListener('mouseleave', this._onLeave);

    this.resize();
    this.seed();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  AvatarGravity.prototype.resize = function () {
    var rect = this.canvas.getBoundingClientRect();
    var w = Math.max(1, rect.width | 0);
    var h = Math.max(1, rect.height | 0);
    this.w = w;
    this.h = h;
    this.canvas.width = Math.floor(w * this.dpr);
    this.canvas.height = Math.floor(h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.cx = w * 0.5;
    this.cy = h * 0.48;
    this.R = Math.min(w, h) * 0.11;
  };

  AvatarGravity.prototype.seed = function () {
    this.particles = [];
    for (var i = 0; i < this.count; i++) {
      this.particles.push(this.spawn(true));
    }
  };

  AvatarGravity.prototype.spawn = function (anywhere) {
    var angle = Math.random() * Math.PI * 2;
    var dist = anywhere
      ? this.R * 1.4 + Math.random() * Math.max(this.w, this.h) * 0.55
      : this.R * 2.2 + Math.random() * Math.min(this.w, this.h) * 0.35;
    var x = this.cx + Math.cos(angle) * dist;
    var y = this.cy + Math.sin(angle) * dist * 0.85;
    var kind = Math.random();
    return {
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: kind > 0.88 ? 2.2 : kind > 0.55 ? 1.4 : 0.9,
      life: 0.55 + Math.random() * 0.45,
      age: Math.random(),
      phase: Math.random() * Math.PI * 2,
      gold: kind > 0.72,
      trail: []
    };
  };

  AvatarGravity.prototype.onMove = function (e) {
    var rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
    this.mouse.active = true;
  };

  AvatarGravity.prototype.onLeave = function () {
    this.mouse.active = false;
  };

  AvatarGravity.prototype.step = function (dt) {
    var i, p, dx, dy, dist, inv, force, pull, sling, mx, my, md;
    var G = 0.42;
    var escape = this.R * 1.15;

    for (i = 0; i < this.particles.length; i++) {
      p = this.particles[i];
      dx = this.cx - p.x;
      dy = this.cy - p.y;
      dist = Math.sqrt(dx * dx + dy * dy) || 0.001;

      inv = 1 / (dist * dist + 80);
      force = G * 900 * inv;
      p.vx += dx * force * dt;
      p.vy += dy * force * dt;

      if (dist < this.R * 2.8) {
        pull = (this.R * 2.8 - dist) / (this.R * 2.8);
        p.vx += (-dy / dist) * pull * 0.18 * dt;
        p.vy += (dx / dist) * pull * 0.18 * dt;
      }

      if (dist < escape) {
        sling = (escape - dist) / escape;
        p.vx -= (dx / dist) * sling * 2.8;
        p.vy -= (dy / dist) * sling * 2.8;
        p.age += 0.02;
      }

      if (this.mouse.active) {
        mx = this.mouse.x - p.x;
        my = this.mouse.y - p.y;
        md = Math.sqrt(mx * mx + my * my) || 1;
        if (md < 140) {
          p.vx += (mx / md) * 0.06 * dt;
          p.vy += (my / md) * 0.06 * dt;
        }
      }

      p.vx *= 0.992;
      p.vy *= 0.992;
      p.x += p.vx;
      p.y += p.vy;
      p.age += 0.0015 * dt;
      p.phase += 0.02;

      if (p.trail.length > 6) p.trail.shift();
      p.trail.push({ x: p.x, y: p.y, a: p.life });

      var far =
        p.x < -40 || p.x > this.w + 40 ||
        p.y < -40 || p.y > this.h + 40 ||
        dist > Math.max(this.w, this.h) * 0.85 ||
        p.age > 1.4;
      if (far) {
        this.particles[i] = this.spawn(false);
      }
    }
  };

  AvatarGravity.prototype.drawAvatar = function () {
    var ctx = this.ctx;
    var r = this.R;
    var x = this.cx;
    var y = this.cy;
    var pulse = 1 + Math.sin(this.t * 0.035) * 0.025;

    var g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 3.2);
    g.addColorStop(0, 'rgba(212,160,23,0.14)');
    g.addColorStop(0.45, 'rgba(212,160,23,0.04)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r * 3.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, r * 1.35 * pulse, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(212,160,23,0.28)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    var body = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
    body.addColorStop(0, '#1a2233');
    body.addColorStop(1, '#0c1018');
    ctx.beginPath();
    ctx.arc(x, y, r * pulse, 0, Math.PI * 2);
    ctx.fillStyle = body;
    ctx.fill();
    ctx.strokeStyle = 'rgba(212,160,23,0.55)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#d4a017';
    ctx.beginPath();
    ctx.arc(x, y - r * 0.18, r * 0.32, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - r * 0.55, y + r * 0.75);
    ctx.quadraticCurveTo(x - r * 0.5, y + r * 0.1, x, y + r * 0.12);
    ctx.quadraticCurveTo(x + r * 0.5, y + r * 0.1, x + r * 0.55, y + r * 0.75);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + r * 0.72, y + r * 0.55, r * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = '#25d366';
    ctx.fill();
    ctx.strokeStyle = '#0c1018';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  AvatarGravity.prototype.drawParticles = function () {
    var ctx = this.ctx;
    var i, p, j, tr, a;
    for (i = 0; i < this.particles.length; i++) {
      p = this.particles[i];
      for (j = 0; j < p.trail.length; j++) {
        tr = p.trail[j];
        a = (j / p.trail.length) * 0.25 * p.life;
        ctx.beginPath();
        ctx.arc(tr.x, tr.y, p.r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? 'rgba(212,160,23,' + a + ')'
          : 'rgba(180,190,210,' + a + ')';
        ctx.fill();
      }
      a = Math.min(1, p.life * (0.4 + 0.6 * Math.sin(p.phase) * 0.15 + 0.6));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      if (p.gold) {
        ctx.fillStyle = 'rgba(212,160,23,' + (0.35 + a * 0.55) + ')';
      } else {
        ctx.fillStyle = 'rgba(200,210,230,' + (0.2 + a * 0.5) + ')';
      }
      ctx.fill();
    }
  };

  AvatarGravity.prototype.loop = function () {
    requestAnimationFrame(this.loop);
    this.t += 1;
    var dt = this.reduce ? 0.35 : 1;
    if (!this.reduce) this.step(dt);

    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    this.drawParticles();
    this.drawAvatar();
  };

  AvatarGravity.prototype.destroy = function () {
    window.removeEventListener('resize', this._onResize);
    this.canvas.removeEventListener('mousemove', this._onMove);
    this.canvas.removeEventListener('mouseleave', this._onLeave);
  };

  global.RenoltAvatarGravity = AvatarGravity;
})(typeof window !== 'undefined' ? window : this);
