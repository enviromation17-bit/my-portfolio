(function () {
  const canvas = document.getElementById('webgl');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.05, 400);
  camera.position.set(0, 2.2, 9.5);
  camera.lookAt(0, 0, 0);

  const Rs = 1.85;
  const R_PHOTON = Rs * 1.52;
  const R_ISCO = Rs * 2.6;
  const R_OUT = Rs * 5.2;

  const STAR_N = 1100;
  const starPos = new Float32Array(STAR_N * 3);
  const starCol = new Float32Array(STAR_N * 3);
  for (let i = 0; i < STAR_N; i++) {
    const i3 = i * 3;
    const r = 30 + Math.random() * 70;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    starPos[i3] = r * Math.sin(ph) * Math.cos(th);
    starPos[i3 + 1] = r * Math.sin(ph) * Math.sin(th);
    starPos[i3 + 2] = r * Math.cos(ph);
    const b = 0.35 + Math.random() * 0.65;
    const tint = Math.random();
    starCol[i3] = b * (tint > 0.75 ? 1 : tint > 0.4 ? 0.92 : 0.8);
    starCol[i3 + 1] = b * (tint > 0.75 ? 0.82 : 0.95);
    starCol[i3 + 2] = b * (tint > 0.75 ? 0.55 : tint > 0.4 ? 1 : 0.88);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
    size: 0.07, vertexColors: true, transparent: true, opacity: 0.6,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  }));
  scene.add(stars);

  const DISK = 3600;
  const dPos = new Float32Array(DISK * 3);
  const dBase = new Float32Array(DISK * 4);
  const dCol = new Float32Array(DISK * 3);

  for (let i = 0; i < DISK; i++) {
    const u = Math.random();
    const r = R_ISCO + Math.pow(u, 1.6) * (R_OUT - R_ISCO);
    const theta = Math.random() * Math.PI * 2;
    const h = (Math.random() - 0.5) * 0.06 * (r / R_OUT);
    dBase[i * 4] = r;
    dBase[i * 4 + 1] = theta;
    dBase[i * 4 + 2] = h;
    dBase[i * 4 + 3] = 0.65 + Math.random() * 0.35;

    const t = (r - R_ISCO) / (R_OUT - R_ISCO);
    let cr, cg, cb;
    if (t < 0.12) { cr = 1.0; cg = 0.97; cb = 0.9; }
    else if (t < 0.35) {
      const k = (t - 0.12) / 0.23;
      cr = 1.0; cg = 0.97 - k * 0.32; cb = 0.9 - k * 0.55;
    } else if (t < 0.65) {
      const k = (t - 0.35) / 0.3;
      cr = 1.0; cg = 0.65 - k * 0.28; cb = 0.35 - k * 0.18;
    } else {
      const k = (t - 0.65) / 0.35;
      cr = 1.0 - k * 0.3; cg = 0.37 - k * 0.22; cb = 0.17 - k * 0.1;
    }
    dCol[i * 3] = cr;
    dCol[i * 3 + 1] = Math.max(0.04, cg);
    dCol[i * 3 + 2] = Math.max(0.02, cb);
    dPos[i * 3] = Math.cos(theta) * r;
    dPos[i * 3 + 1] = h;
    dPos[i * 3 + 2] = Math.sin(theta) * r;
  }

  const diskGeo = new THREE.BufferGeometry();
  diskGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
  diskGeo.setAttribute('color', new THREE.BufferAttribute(dCol, 3));
  const diskMat = new THREE.PointsMaterial({
    size: 0.055, vertexColors: true, transparent: true, opacity: 0.95,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  });
  scene.add(new THREE.Points(diskGeo, diskMat));

  const LENS = 2200;
  const lPos = new Float32Array(LENS * 3);
  const lBase = new Float32Array(LENS * 4);
  const lCol = new Float32Array(LENS * 3);

  for (let i = 0; i < LENS; i++) {
    const u = Math.random();
    const r = R_ISCO + Math.pow(u, 1.35) * (R_OUT * 0.9 - R_ISCO);
    const theta = Math.random() * Math.PI * 2;
    const side = Math.random() > 0.5 ? 1 : -1;
    lBase[i * 4] = r;
    lBase[i * 4 + 1] = theta;
    lBase[i * 4 + 2] = side;
    lBase[i * 4 + 3] = 0.5 + Math.random() * 0.5;
    const t = (r - R_ISCO) / (R_OUT - R_ISCO);
    lCol[i * 3] = 1.0;
    lCol[i * 3 + 1] = Math.max(0.12, 0.8 - t * 0.42);
    lCol[i * 3 + 2] = Math.max(0.05, 0.45 - t * 0.32);
  }

  const lensGeo = new THREE.BufferGeometry();
  lensGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));
  lensGeo.setAttribute('color', new THREE.BufferAttribute(lCol, 3));
  const lensMat = new THREE.PointsMaterial({
    size: 0.048, vertexColors: true, transparent: true, opacity: 0.75,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  });
  scene.add(new THREE.Points(lensGeo, lensMat));

  const horizon = new THREE.Mesh(
    new THREE.SphereGeometry(Rs, 80, 80),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );
  scene.add(horizon);

  const shadow = new THREE.Mesh(
    new THREE.SphereGeometry(Rs * 1.06, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.75, depthWrite: false })
  );
  scene.add(shadow);

  function ring(inner, outer, color, opacity, segs) {
    const g = new THREE.RingGeometry(inner, outer, segs || 160);
    const m = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.rotation.x = -Math.PI / 2 + 0.1;
    scene.add(mesh);
    return mesh;
  }

  const photonCore = ring(R_PHOTON * 0.97, R_PHOTON * 1.1, 0xfff8e8, 1.0, 200);
  const photonBloom = ring(R_PHOTON * 0.9, R_PHOTON * 1.25, 0xffd090, 0.4, 160);
  const photonOuter = ring(R_PHOTON * 0.85, R_PHOTON * 1.4, 0xffb050, 0.15, 128);
  const iscoGlow = ring(R_ISCO * 0.95, R_ISCO * 1.3, 0xffc060, 0.25, 120);
  const midGlow = ring(R_ISCO * 1.35, R_OUT * 0.55, 0xe07020, 0.1, 96);
  const outerGlow = ring(R_OUT * 0.5, R_OUT * 1.0, 0xc04810, 0.04, 80);

  const aura = new THREE.Mesh(
    new THREE.SphereGeometry(Rs * 1.85, 40, 40),
    new THREE.MeshBasicMaterial({
      color: 0xffa040, transparent: true, opacity: 0.07,
      blending: THREE.AdditiveBlending, depthWrite: false
    })
  );
  scene.add(aura);

  const diskPlane = new THREE.Mesh(
    new THREE.RingGeometry(R_ISCO * 0.98, R_OUT * 0.98, 128),
    new THREE.MeshBasicMaterial({
      color: 0xd06018, transparent: true, opacity: 0.06,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
    })
  );
  diskPlane.rotation.x = -Math.PI / 2 + 0.1;
  scene.add(diskPlane);

  let mouseX = 0, mouseY = 0;
  let scrollY = 0, lastScrollY = 0, scrollVel = 0, scrollDir = 0;
  let suction = 0, connect = 0.2;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.45;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.28;
  });
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  window.addEventListener('scroll', () => { scrollY = window.scrollY || 0; }, { passive: true });

  const clock = new THREE.Clock();

  function doppler(cr, cg, cb, vz) {
    const los = -vz;
    const beta = Math.max(-0.5, Math.min(0.5, los * 0.1));
    const boost = Math.pow(1 + beta, 2.4);
    return [
      Math.min(1.5, cr * boost * (1 - beta * 0.12)),
      Math.min(1.35, cg * boost),
      Math.min(1.2, cb * boost * 0.88)
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
      sTarget = Math.min(1, progress * 0.92 + velMag * 0.5);
      cTarget = Math.max(0.05, 0.22 - progress * 0.18);
    } else {
      sTarget = Math.max(0, progress * 0.2 - velMag * 0.38);
      cTarget = Math.min(0.75, 0.28 + velMag * 0.4);
    }
    suction += (sTarget - suction) * 0.04;
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

      const omega = 0.48 / Math.pow(r / Rs + 0.2, 1.5);
      theta += omega * dt * (1 + pull * 1.4);
      dBase[i4 + 1] = theta;

      if (pull > 0.02) {
        r -= pull * 0.018 * (Rs / (r + 0.3));
        if (r < Rs * 1.1) {
          r = R_OUT * (0.72 + Math.random() * 0.28);
          theta = Math.random() * Math.PI * 2;
        }
        dBase[i4] = r;
        dBase[i4 + 1] = theta;
      }

      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      arr[i3] = cos * r;
      arr[i3 + 1] = h * (1 - pull * 0.35);
      arr[i3 + 2] = sin * r;

      const grav = Math.max(0.28, Math.min(1, (r - Rs) / (R_OUT - Rs)));
      const vz = cos * omega * r;
      const d = doppler(dCol[i3], dCol[i3 + 1], dCol[i3 + 2], vz);
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

      const omega = 0.4 / Math.pow(r / Rs + 0.25, 1.5);
      theta += omega * dt * 0.9 * (1 + pull);
      lBase[i4 + 1] = theta;

      if (pull > 0.02) {
        r -= pull * 0.012;
        if (r < R_ISCO * 0.95) r = R_OUT * 0.75;
        lBase[i4] = r;
      }

      const far = Math.sin(theta);
      const backFactor = Math.max(0, far);
      const phi = Math.cos(theta) * Math.PI * 0.58;
      const lensR = R_PHOTON * 1.08 + (r - R_ISCO) * 0.14;
      const arcHeight = side * (0.25 + (r / R_OUT) * 1.55) * (0.5 + backFactor * 0.5);
      const blend = 0.4 + backFactor * 0.55;
      const trueX = Math.cos(theta) * r;
      const trueZ = Math.sin(theta) * r;
      const lensX = Math.sin(phi) * lensR;
      const lensZ = -Math.cos(phi) * lensR * 0.28 - Rs * 0.4;

      larr[i3] = trueX * (1 - blend) + lensX * blend;
      larr[i3 + 1] = arcHeight * blend;
      larr[i3 + 2] = trueZ * (1 - blend) + lensZ * blend;

      const vis = 0.22 + backFactor * 0.78;
      const grav = Math.max(0.32, (r - Rs) / (R_OUT - Rs));
      const vz = Math.cos(theta) * omega * r;
      const d = doppler(lCol[i3], lCol[i3 + 1], lCol[i3 + 2], vz);
      lcols[i3] = d[0] * grav * br * vis;
      lcols[i3 + 1] = d[1] * grav * br * vis;
      lcols[i3 + 2] = d[2] * grav * br * vis;
    }
    lensGeo.attributes.position.needsUpdate = true;
    lensGeo.attributes.color.needsUpdate = true;

    const hs = 1 + suction * 0.55;
    horizon.scale.setScalar(hs);
    shadow.scale.setScalar(hs);
    photonCore.scale.setScalar(hs);
    photonBloom.scale.setScalar(hs);
    photonOuter.scale.setScalar(hs);
    aura.scale.setScalar(hs * 1.05);
    diskPlane.scale.setScalar(1 + suction * 0.15);

    photonCore.material.opacity = 0.9 + suction * 0.1;
    photonBloom.material.opacity = 0.35 + suction * 0.15;
    aura.material.opacity = 0.05 + suction * 0.08;
    diskPlane.material.opacity = 0.05 + (1 - suction) * 0.04;

    photonCore.rotation.z = t * 0.04;
    iscoGlow.rotation.z = t * 0.025;
    midGlow.rotation.z = -t * 0.012;
    diskPlane.rotation.z = t * 0.008;

    diskMat.opacity = 0.65 + (1 - suction) * 0.3;
    lensMat.opacity = 0.5 + (1 - suction) * 0.28 + connect * 0.12;
    diskMat.size = 0.045 + (1 - suction) * 0.015;

    const camR = 9.5 - suction * 2.8;
    const camY = 2.2 - suction * 0.4 + mouseY * 0.35;
    camera.position.x += (mouseX * 1.1 - camera.position.x) * 0.03;
    camera.position.y += (camY - camera.position.y) * 0.03;
    camera.position.z += (camR - camera.position.z) * 0.03;
    camera.lookAt(0, 0, 0);

    stars.rotation.y = t * 0.005;
    stars.material.opacity = 0.3 + (1 - suction) * 0.35;

    renderer.render(scene, camera);
  }
  animate();
})();
