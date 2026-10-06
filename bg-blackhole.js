(function () {
  const canvas = document.getElementById('webgl');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.05, 300);
  camera.position.set(0, 1.6, 12);
  camera.lookAt(0, 0, 0);

  const Rs = 0.72;
  const R_PHOTON = Rs * 1.5;
  const R_ISCO = Rs * 2.8;
  const R_OUT = 6.8;

  const STAR_N = 900;
  const starPos = new Float32Array(STAR_N * 3);
  const starCol = new Float32Array(STAR_N * 3);
  for (let i = 0; i < STAR_N; i++) {
    const i3 = i * 3;
    const r = 25 + Math.random() * 55;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    starPos[i3] = r * Math.sin(ph) * Math.cos(th);
    starPos[i3 + 1] = r * Math.sin(ph) * Math.sin(th);
    starPos[i3 + 2] = r * Math.cos(ph);
    const b = 0.4 + Math.random() * 0.6;
    const tint = Math.random();
    starCol[i3] = b * (tint > 0.7 ? 1 : tint > 0.4 ? 0.9 : 0.75);
    starCol[i3 + 1] = b * (tint > 0.7 ? 0.85 : 0.95);
    starCol[i3 + 2] = b * (tint > 0.7 ? 0.6 : tint > 0.4 ? 1 : 0.9);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
    size: 0.055, vertexColors: true, transparent: true, opacity: 0.65,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  }));
  scene.add(stars);

  const DISK = 2800;
  const dPos = new Float32Array(DISK * 3);
  const dBase = new Float32Array(DISK * 4);
  const dCol = new Float32Array(DISK * 3);

  for (let i = 0; i < DISK; i++) {
    const u = Math.random();
    const r = R_ISCO + Math.pow(u, 1.55) * (R_OUT - R_ISCO);
    const theta = Math.random() * Math.PI * 2;
    const h = (Math.random() - 0.5) * 0.045 * (r / R_OUT);
    dBase[i * 4] = r;
    dBase[i * 4 + 1] = theta;
    dBase[i * 4 + 2] = h;
    dBase[i * 4 + 3] = 0.7 + Math.random() * 0.3;

    const t = (r - R_ISCO) / (R_OUT - R_ISCO);
    let cr, cg, cb;
    if (t < 0.15) { cr = 1.0; cg = 0.95; cb = 0.85; }
    else if (t < 0.4) {
      const k = (t - 0.15) / 0.25;
      cr = 1.0; cg = 0.95 - k * 0.35; cb = 0.85 - k * 0.55;
    } else if (t < 0.7) {
      const k = (t - 0.4) / 0.3;
      cr = 1.0; cg = 0.6 - k * 0.25; cb = 0.3 - k * 0.15;
    } else {
      const k = (t - 0.7) / 0.3;
      cr = 1.0 - k * 0.25; cg = 0.35 - k * 0.2; cb = 0.15 - k * 0.1;
    }
    dCol[i * 3] = cr;
    dCol[i * 3 + 1] = Math.max(0.05, cg);
    dCol[i * 3 + 2] = Math.max(0.02, cb);
    dPos[i * 3] = Math.cos(theta) * r;
    dPos[i * 3 + 1] = h;
    dPos[i * 3 + 2] = Math.sin(theta) * r;
  }

  const diskGeo = new THREE.BufferGeometry();
  diskGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
  diskGeo.setAttribute('color', new THREE.BufferAttribute(dCol, 3));
  const diskMat = new THREE.PointsMaterial({
    size: 0.042, vertexColors: true, transparent: true, opacity: 0.92,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  });
  scene.add(new THREE.Points(diskGeo, diskMat));

  const LENS = 1600;
  const lPos = new Float32Array(LENS * 3);
  const lBase = new Float32Array(LENS * 4);
  const lCol = new Float32Array(LENS * 3);

  for (let i = 0; i < LENS; i++) {
    const u = Math.random();
    const r = R_ISCO + Math.pow(u, 1.3) * (R_OUT * 0.85 - R_ISCO);
    const theta = Math.random() * Math.PI * 2;
    const side = Math.random() > 0.5 ? 1 : -1;
    lBase[i * 4] = r;
    lBase[i * 4 + 1] = theta;
    lBase[i * 4 + 2] = side;
    lBase[i * 4 + 3] = 0.5 + Math.random() * 0.5;
    const t = (r - R_ISCO) / (R_OUT - R_ISCO);
    lCol[i * 3] = 1.0;
    lCol[i * 3 + 1] = Math.max(0.1, 0.75 - t * 0.4);
    lCol[i * 3 + 2] = Math.max(0.05, 0.4 - t * 0.3);
  }

  const lensGeo = new THREE.BufferGeometry();
  lensGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));
  lensGeo.setAttribute('color', new THREE.BufferAttribute(lCol, 3));
  const lensMat = new THREE.PointsMaterial({
    size: 0.036, vertexColors: true, transparent: true, opacity: 0.7,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  });
  scene.add(new THREE.Points(lensGeo, lensMat));

  const horizon = new THREE.Mesh(
    new THREE.SphereGeometry(Rs, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );
  scene.add(horizon);

  const shadow = new THREE.Mesh(
    new THREE.SphereGeometry(Rs * 1.08, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.7, depthWrite: false })
  );
  scene.add(shadow);

  function ring(inner, outer, color, opacity, segs, tilt) {
    const g = new THREE.RingGeometry(inner, outer, segs || 128);
    const m = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.rotation.x = tilt != null ? tilt : -Math.PI / 2 + 0.12;
    scene.add(mesh);
    return mesh;
  }

  const photonCore = ring(R_PHOTON * 0.96, R_PHOTON * 1.08, 0xfff5e0, 0.95, 180);
  const photonBloom = ring(R_PHOTON * 0.88, R_PHOTON * 1.2, 0xffd090, 0.35, 128);
  const iscoGlow = ring(R_ISCO * 0.92, R_ISCO * 1.25, 0xffc060, 0.22, 96);
  const midGlow = ring(R_ISCO * 1.3, R_OUT * 0.5, 0xe07020, 0.08, 80);
  const outerGlow = ring(R_OUT * 0.45, R_OUT * 0.95, 0xc05010, 0.035, 64);

  const aura = new THREE.Mesh(
    new THREE.SphereGeometry(Rs * 1.9, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0xffb050, transparent: true, opacity: 0.05,
      blending: THREE.AdditiveBlending, depthWrite: false
    })
  );
  scene.add(aura);

  let mouseX = 0, mouseY = 0;
  let scrollY = 0, lastScrollY = 0, scrollVel = 0, scrollDir = 0;
  let suction = 0, connect = 0.2;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.3;
  });
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  window.addEventListener('scroll', () => { scrollY = window.scrollY || 0; }, { passive: true });

  const clock = new THREE.Clock();

  function doppler(cr, cg, cb, vx, vz) {
    const los = -vz;
    const beta = Math.max(-0.45, Math.min(0.45, los * 0.12));
    const boost = Math.pow(1 + beta, 2.2);
    return [
      Math.min(1.4, cr * boost * (1 - beta * 0.15)),
      Math.min(1.3, cg * boost),
      Math.min(1.2, cb * boost * 0.9)
    ];
  }

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const dt = 0.016;

    const dy = scrollY - lastScrollY;
    scrollVel += (dy - scrollVel) * 0.12;
    lastScrollY = scrollY;
    if (Math.abs(scrollVel) > 0.3) scrollDir = scrollVel > 0 ? 1 : -1;

    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, scrollY / maxScroll);
    const velMag = Math.min(1, Math.abs(scrollVel) / 22);

    let sTarget, cTarget;
    if (scrollDir >= 0) {
      sTarget = Math.min(1, progress * 0.9 + velMag * 0.55);
      cTarget = Math.max(0.05, 0.25 - progress * 0.2);
    } else {
      sTarget = Math.max(0, progress * 0.22 - velMag * 0.4);
      cTarget = Math.min(0.8, 0.3 + velMag * 0.4);
    }
    suction += (sTarget - suction) * 0.045;
    connect += (cTarget - connect) * 0.05;
    const pull = suction * suction;

    const arr = diskGeo.attributes.position.array;
    const cols = diskGeo.attributes.color.array;

    for (let i = 0; i < DISK; i++) {
      const i3 = i * 3;
      const i4 = i * 4;
      let r = dBase[i4];
      let theta = dBase[i4 + 1];
      const h = dBase[i4 + 2];
      const br = dBase[i4 + 3];

      const omega = 0.62 / Math.pow(r + 0.12, 1.5);
      theta += omega * dt * (1 + pull * 1.5);
      dBase[i4 + 1] = theta;

      if (pull > 0.02) {
        r -= pull * 0.014 * (1.5 / (r + 0.25));
        if (r < Rs * 1.08) {
          r = R_OUT * (0.75 + Math.random() * 0.25);
          theta = Math.random() * Math.PI * 2;
        }
        dBase[i4] = r;
        dBase[i4 + 1] = theta;
      }

      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      arr[i3] = cos * r;
      arr[i3 + 1] = h * (1 - pull * 0.4);
      arr[i3 + 2] = sin * r;

      const grav = Math.max(0.3, Math.min(1, (r - Rs) / (R_OUT - Rs)));
      const vx = -sin * omega * r;
      const vz = cos * omega * r;
      const d = doppler(dCol[i3], dCol[i3 + 1], dCol[i3 + 2], vx, vz);
      cols[i3] = d[0] * grav * br;
      cols[i3 + 1] = d[1] * grav * br;
      cols[i3 + 2] = d[2] * grav * br;
    }
    diskGeo.attributes.position.needsUpdate = true;
    diskGeo.attributes.color.needsUpdate = true;

    const larr = lensGeo.attributes.position.array;
    const lcols = lensGeo.attributes.color.array;

    for (let i = 0; i < LENS; i++) {
      const i3 = i * 3;
      const i4 = i * 4;
      let r = lBase[i4];
      let theta = lBase[i4 + 1];
      const side = lBase[i4 + 2];
      const br = lBase[i4 + 3];

      const omega = 0.5 / Math.pow(r + 0.15, 1.5);
      theta += omega * dt * 0.85 * (1 + pull);
      lBase[i4 + 1] = theta;

      if (pull > 0.02) {
        r -= pull * 0.01;
        if (r < R_ISCO * 0.95) r = R_OUT * 0.7;
        lBase[i4] = r;
      }

      const far = Math.sin(theta);
      const backFactor = Math.max(0, far);
      const phi = Math.cos(theta) * Math.PI * 0.55;
      const lensR = R_PHOTON * 1.05 + (r - R_ISCO) * 0.12;
      const arcHeight = side * (0.15 + (r / R_OUT) * 1.1) * (0.55 + backFactor * 0.45);
      const blend = 0.35 + backFactor * 0.55;
      const trueX = Math.cos(theta) * r;
      const trueZ = Math.sin(theta) * r;
      const lensX = Math.sin(phi) * lensR;
      const lensZ = -Math.cos(phi) * lensR * 0.3 - Rs * 0.5;

      larr[i3] = trueX * (1 - blend) + lensX * blend;
      larr[i3 + 1] = arcHeight * blend;
      larr[i3 + 2] = trueZ * (1 - blend) + lensZ * blend;

      const vis = 0.25 + backFactor * 0.75;
      const grav = Math.max(0.35, (r - Rs) / (R_OUT - Rs));
      const vx = -Math.sin(theta) * omega * r;
      const vz = Math.cos(theta) * omega * r;
      const d = doppler(lCol[i3], lCol[i3 + 1], lCol[i3 + 2], vx, vz);
      lcols[i3] = d[0] * grav * br * vis;
      lcols[i3 + 1] = d[1] * grav * br * vis;
      lcols[i3 + 2] = d[2] * grav * br * vis;
    }
    lensGeo.attributes.position.needsUpdate = true;
    lensGeo.attributes.color.needsUpdate = true;

    const hs = 1 + suction * 1.15;
    horizon.scale.setScalar(hs);
    shadow.scale.setScalar(hs);
    photonCore.scale.setScalar(hs);
    photonBloom.scale.setScalar(hs);
    aura.scale.setScalar(hs * 1.05);

    photonCore.material.opacity = 0.85 + suction * 0.12;
    photonBloom.material.opacity = 0.28 + suction * 0.2;
    aura.material.opacity = 0.04 + suction * 0.1;

    photonCore.rotation.z = t * 0.05;
    iscoGlow.rotation.z = t * 0.03;
    midGlow.rotation.z = -t * 0.015;

    diskMat.opacity = 0.6 + (1 - suction) * 0.35;
    lensMat.opacity = 0.45 + (1 - suction) * 0.3 + connect * 0.15;

    const camR = 12 - suction * 4;
    const camY = 1.6 - suction * 0.5 + mouseY * 0.4;
    camera.position.x += (mouseX * 1.4 - camera.position.x) * 0.035;
    camera.position.y += (camY - camera.position.y) * 0.035;
    camera.position.z += (camR - camera.position.z) * 0.035;
    camera.lookAt(0, 0, 0);

    stars.rotation.y = t * 0.006;
    stars.material.opacity = 0.35 + (1 - suction) * 0.35;

    renderer.render(scene, camera);
  }
  animate();
})();
