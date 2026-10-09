/**
 * Renolt — Avatar emits particles, then gravity pulls everything into a black hole.
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
    this.count = opts.count || 220;
    this.avatarSrc = opts.avatarSrc || window.RENOLT_AVATAR_SRC || 'assets/renolt-avatar.jpg';
    this.particles = [];
    this.t = 0;
    this.cycle = 0;
    this.mouse = { x: 0, y: 0, active: false };
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.avatar = new Image();
    this.avatarReady = false;
    this.avatar.onload = function () { this.avatarReady = true; }.bind(this);
    this.avatar.src = this.avatarSrc;

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
    this.ax = w * 0.42;
    this.ay = h * 0.52;
    this.hx = w * 0.62;
    this.hy = h * 0.42;
    this.avatarH = Math.min(w, h) * 0.38;
  };

  AvatarGravity.prototype.seed = function () {
    this.particles = [];
    for (var i = 0; i < this.count; i++) this.particles.push(this.spawn(true));
  };

  AvatarGravity.prototype.spawn = function (anywhere) {
    var angle = Math.random() * Math.PI * 2;
    var dist = anywhere ? 20 + Math.random() * Math.min(this.w, this.h) * 0.4 : 12 + Math.random() * 50;
    var kind = Math.random();
    return {
      x: this.ax + Math.cos(angle) * dist * 0.7,
      y: this.ay + Math.sin(angle) * dist * 0.55 - this.avatarH * 0.15,
      vx: Math.cos(angle) * (0.2 + Math.random() * 0.6),
      vy: Math.sin(angle) * (0.15 + Math.random() * 0.4) - 0.3,
      r: kind > 0.9 ? 2.6 : kind > 0.55 ? 1.5 : 0.85,
      life: 1, age: Math.random() * 0.3, phase: Math.random() * Math.PI * 2,
      gold: kind > 0.65, trail: []
    };
  };

  AvatarGravity.prototype.onMove = function (e) {
    var rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
    this.mouse.active = true;
  };

  AvatarGravity.prototype.onLeave = function () { this.mouse.active = false; };

  AvatarGravity.prototype.story = function () {
    this.cycle = (this.t % 1080) / 1080;
    var c = this.cycle, pull = 0, holeSize = 0, avatarPull = 0, emit = 1;
    if (c < 0.28) {
      pull = 0.05; holeSize = 0.15 + c * 0.5; emit = 1.2;
    } else if (c < 0.55) {
      var t = (c - 0.28) / 0.27;
      pull = 0.05 + t * 0.55; holeSize = 0.3 + t * 0.7; emit = 1 - t * 0.3;
    } else if (c < 0.88) {
      var t2 = (c - 0.55) / 0.33;
      pull = 0.6 + t2 * 1.4; holeSize = 1 + t2 * 1.1;
      avatarPull = Math.pow(t2, 1.35); emit = 0.4;
    } else {
      var t3 = (c - 0.88) / 0.12;
      pull = 2 - t3 * 1.5; holeSize = 2.1 * (1 - t3 * 0.4);
      avatarPull = 1 - t3 * 0.15; emit = 0.2 + t3 * 0.5;
    }
    return { pull: pull, holeSize: holeSize, avatarPull: avatarPull, emit: emit, c: c };
  };

  AvatarGravity.prototype.step = function (dt, story) {
    var i, p, dx, dy, dist, force, mx, my, md;
    var hx = this.hx, hy = this.hy, G = 0.55 * story.pull;
    if (story.emit > 0.5 && Math.random() < 0.12 * story.emit) {
      this.particles[Math.floor(Math.random() * this.particles.length)] = this.spawn(false);
    }
    for (i = 0; i < this.particles.length; i++) {
      p = this.particles[i];
      dx = hx - p.x; dy = hy - p.y;
      dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
      force = G * 1200 / (dist * dist + 60);
      p.vx += dx * force * dt * 0.08;
      p.vy += dy * force * dt * 0.08;
      if (dist < 180 * story.holeSize) {
        p.vx += (-dy / dist) * 0.12 * story.pull * dt;
        p.vy += (dx / dist) * 0.12 * story.pull * dt;
      }
      if (story.pull < 0.4) {
        p.vx += (p.x - this.ax) * 0.00015;
        p.vy += (p.y - this.ay) * 0.0001 - 0.01;
      }
      if (this.mouse.active) {
        mx = this.mouse.x - p.x; my = this.mouse.y - p.y;
        md = Math.sqrt(mx * mx + my * my) || 1;
        if (md < 120) { p.vx += (mx / md) * 0.05 * dt; p.vy += (my / md) * 0.05 * dt; }
      }
      p.vx *= 0.988; p.vy *= 0.988;
      p.x += p.vx * (1 + story.pull * 0.35);
      p.y += p.vy * (1 + story.pull * 0.35);
      p.age += 0.002 * dt; p.phase += 0.025;
      if (p.trail.length > 8) p.trail.shift();
      p.trail.push({ x: p.x, y: p.y });
      var holeR = 28 * story.holeSize;
      if (dist < holeR || p.age > 1.6 || p.x < -50 || p.x > this.w + 50 || p.y < -50 || p.y > this.h + 50) {
        this.particles[i] = this.spawn(story.pull < 0.5);
      }
    }
  };

  AvatarGravity.prototype.drawBlackHole = function (story) {
    var ctx = this.ctx, hx = this.hx, hy = this.hy, s = story.holeSize;
    var R = Math.min(this.w, this.h) * 0.08 * s;
    var g = ctx.createRadialGradient(hx, hy, R * 0.3, hx, hy, R * 5.5);
    g.addColorStop(0, 'rgba(0,0,0,0.95)');
    g.addColorStop(0.18, 'rgba(20,12,8,0.85)');
    g.addColorStop(0.35, 'rgba(212,160,23,0.12)');
    g.addColorStop(0.55, 'rgba(120,80,40,0.06)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(hx, hy, R * 5.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(hx, hy, R * 1.55, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(232,180,70,' + (0.15 + 0.35 * Math.min(1, s)) + ')';
    ctx.lineWidth = 2 + s; ctx.stroke();
    var core = ctx.createRadialGradient(hx, hy, 0, hx, hy, R * 1.2);
    core.addColorStop(0, '#000'); core.addColorStop(0.7, '#050508');
    core.addColorStop(1, 'rgba(0,0,0,0.9)');
    ctx.beginPath(); ctx.arc(hx, hy, R * 1.15, 0, Math.PI * 2);
    ctx.fillStyle = core; ctx.fill();
  };

  AvatarGravity.prototype.drawAvatar = function (story) {
    var ctx = this.ctx, pull = story.avatarPull;
    var x = this.ax + (this.hx - this.ax) * pull * 0.92;
    var y = this.ay + (this.hy - this.ay) * pull * 0.92;
    var scale = Math.max(0.06, 1 - pull * 0.88);
    var rot = pull * 0.55;
    var alpha = 1 - Math.pow(pull, 2.2) * 0.85;
    ctx.save();
    ctx.translate(x, y); ctx.rotate(rot);
    ctx.globalAlpha = Math.max(0, alpha); ctx.scale(scale, scale);
    if (pull < 0.5) {
      var glow = ctx.createRadialGradient(0, this.avatarH * 0.35, 10, 0, this.avatarH * 0.35, this.avatarH * 0.55);
      glow.addColorStop(0, 'rgba(212,160,23,0.12)'); glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.ellipse(0, this.avatarH * 0.38, this.avatarH * 0.38, this.avatarH * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    if (this.avatarReady && this.avatar.complete && this.avatar.naturalWidth > 0) {
      var h = this.avatarH;
      var nw = this.avatar.naturalWidth;
      var nh = this.avatar.naturalHeight;
      var w = h * (nw / nh);
      ctx.drawImage(this.avatar, 0, 0, nw, nh, -w / 2, -h / 2, w, h);
    } else {
      ctx.beginPath(); ctx.arc(0, 0, this.avatarH * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = '#1a2233'; ctx.fill();
    }
    ctx.restore();
  };

  AvatarGravity.prototype.drawParticles = function () {
    var ctx = this.ctx, i, p, j, tr, a, spd;
    for (i = 0; i < this.particles.length; i++) {
      p = this.particles[i];
      spd = Math.min(1, Math.sqrt(p.vx * p.vx + p.vy * p.vy) / 4);
      for (j = 0; j < p.trail.length; j++) {
        tr = p.trail[j];
        a = (j / p.trail.length) * 0.3 * (0.5 + spd);
        ctx.beginPath(); ctx.arc(tr.x, tr.y, p.r * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = p.gold ? 'rgba(212,160,23,' + a + ')' : 'rgba(170,185,210,' + a + ')';
        ctx.fill();
      }
      a = 0.35 + 0.55 * Math.min(1, 1 - p.age * 0.5);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 + spd * 0.4), 0, Math.PI * 2);
      ctx.fillStyle = p.gold ? 'rgba(232,180,70,' + a + ')' : 'rgba(200,210,230,' + a + ')';
      ctx.fill();
    }
  };

  AvatarGravity.prototype.loop = function () {
    requestAnimationFrame(this.loop);
    this.t += this.reduce ? 0.35 : 1;
    var story = this.story();
    if (!this.reduce) this.step(1, story);
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.drawBlackHole(story);
    this.drawParticles();
    this.drawAvatar(story);
  };

  AvatarGravity.prototype.destroy = function () {
    window.removeEventListener('resize', this._onResize);
    this.canvas.removeEventListener('mousemove', this._onMove);
    this.canvas.removeEventListener('mouseleave', this._onLeave);
  };

  global.RenoltAvatarGravity = AvatarGravity;
})(typeof window !== 'undefined' ? window : this);
