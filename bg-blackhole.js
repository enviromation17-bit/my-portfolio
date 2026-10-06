(function () {
  const canvas = document.getElementById('webgl');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.05, 500);
  camera.position.set(0, 1.8, 10);
  camera.lookAt(0, 0, 0);

  const Rs = 1.7;
  const R_PHOTON = Rs * 1.55;
  const R_ISCO = Rs * 2.4;
  const R_OUT = Rs * 5.5;

  const COSMOS = 1800;
  const cPos = new Float32Array(COSMOS * 3);
  const cCol = new Float32Array(COSMOS * 3);
  const cSpd = new Float32Array(COSMOS);
  for (let i = 0; i < COSMOS; i++) {
    const i3 = i * 3;
    const r = 12 + Math.random() * 80;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    cPos[i3] = r * Math.sin(ph) * Math.cos(th);
    cPos[i3 + 1] = r * Math.sin(ph) * Math.sin(th);
    cPos[i3 + 2] = r * Math.cos(ph);
    cSpd[i] = 0.002 + Math.random() * 0.008;
    const t = Math.random();
    if (t > 0.85) { cCol[i3] = 1; cCol[i3+1] = 0.85; cCol[i3+2] = 0.5; }
    else if (t > 0.7) { cCol[i3] = 0.7; cCol[i3+1] = 0.85; cCol[i3+2] = 1; }
    else { const b = 0.5 + Math.random() * 0.5; cCol[i3] = b; cCol[i3+1] = b; cCol[i3+2] = b * 0.95; }
  }
  const cosmosGeo = new THREE.BufferGeometry();
  cosmosGeo.setAttribute('position', new THREE.BufferAttribute(cPos, 3));
  cosmosGeo.setAttribute('color', new THREE.BufferAttribute(cCol, 3));
  const cosmos = new THREE.Points(cosmosGeo, new THREE.PointsMaterial({
    size: 0.08, vertexColors: true, transparent: true, opacity: 0.75,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  }));
  scene.add(cosmos);

  const KIN = 900;
  const kPos = new Float32Array(KIN * 3);
  const kBase = new Float32Array(KIN * 4);
  const kCol = new Float32Array(KIN * 3);
  for (let i = 0; i < KIN; i++) {
    const r = R_ISCO + Math.random() * (R_OUT * 1.4 - R_ISCO);
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 0.8;
    kBase[i * 4] = r;
    kBase[i * 4 + 1] = theta;
    kBase[i * 4 + 2] = y;
    kBase[i * 4 + 3] = 0.4 + Math.random() * 0.9;
    kPos[i * 3] = Math.cos(theta) * r;
    kPos[i * 3 + 1] = y;
    kPos[i * 3 + 2] = Math.sin(theta) * r;
    const hot = Math.random();
    kCol[i * 3] = 1.0;
    kCol[i * 3 + 1] = 0.7 + hot * 0.3;
    kCol[i * 3 + 2] = 0.35 + hot * 0.4;
  }
  const kinGeo = new THREE.BufferGeometry();
  kinGeo.setAttribute('position', new THREE.BufferAttribute(kPos, 3));
  kinGeo.setAttribute('color', new THREE.BufferAttribute(kCol, 3));
  const kinMat = new THREE.PointsMaterial({
    size: 0.05, vertexColors: true, transparent: true, opacity: 0.85,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  });
  scene.add(new THREE.Points(kinGeo, kinMat));

  const DISK = 2400;
  const dPos = new Float32Array(DISK * 3);
  const dBase = new Float32Array(DISK * 4);
  const dCol = new Float32Array(DISK * 3);
  for (let i = 0; i < DISK; i++) {
    const u = Math.random();
    const r = R_ISCO + Math.pow(u, 1.5) * (R_OUT - R_ISCO);
    const theta = Math.random() * Math.PI * 2;
    const h = (Math.random() - 0.5) * 0.05 * (r / R_OUT);
    dBase[i * 4] = r;
    dBase[i * 4 + 1] = theta;
    dBase[i * 4 + 2] = h;
    dBase[i * 4 + 3] = 0.7 + Math.random() * 0.3;
    const t = (r - R_ISCO) / (R_OUT - R_ISCO);
    let cr, cg, cb;
    if (t < 0.15) { cr = 1; cg = 0.98; cb = 0.92; }
    else if (t < 0.4) { const k = (t - 0.15) / 0.25; cr = 1; cg = 0.98 - k * 0.3; cb = 0.92 - k * 0.55; }
    else if (t < 0.7) { const k = (t - 0.4) / 0.3; cr = 1; cg = 0.68 - k * 0.28; cb = 0.37 - k * 0.18; }
    else { const k = (t - 0.7) / 0.3; cr = 1 - k * 0.28; cg = 0.4 - k * 0.22; cb = 0.19 - k * 0.1; }
    dCol[i * 3] = cr; dCol[i * 3 + 1] = Math.max(0.05, cg); dCol[i * 3 + 2] = Math.max(0.02, cb);
    dPos[i * 3] = Math.cos(theta) * r;
    dPos[i * 3 + 1] = h;
    dPos[i * 3 + 2] = Math.sin(theta) * r;
  }
  const diskGeo = new THREE.BufferGeometry();
  diskGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
  diskGeo.setAttribute('color', new THREE.BufferAttribute(dCol, 3));
  const diskMat = new THREE.PointsMaterial({
    size: 0.048, vertexColors: true, transparent: true, opacity: 0.9,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  });
  scene.add(new THREE.Points(diskGeo, diskMat));

  const LENS = 1400;
  const lPos = new Float32Array(LENS * 3);
  const lBase = new Float32Array(LENS * 4);
  const lCol = new Float32Array(LENS * 3);
  for (let i = 0; i < LENS; i++) {
    const r = R_ISCO + Math.pow(Math.random(), 1.3) * (R_OUT * 0.85 - R_ISCO);
    const theta = Math.random() * Math.PI * 2;
    const side = Math.random() > 0.5 ? 1 : -1;
    lBase[i * 4] = r; lBase[i * 4 + 1] = theta; lBase[i * 4 + 2] = side; lBase[i * 4 + 3] = 0.5 + Math.random() * 0.5;
    const t = (r - R_ISCO) / (R_OUT - R_ISCO);
    lCol[i * 3] = 1; lCol[i * 3 + 1] = Math.max(0.15, 0.85 - t * 0.4); lCol[i * 3 + 2] = Math.max(0.05, 0.45 - t * 0.3);
  }
  const lensGeo = new THREE.BufferGeometry();
  lensGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));
  lensGeo.setAttribute('color', new THREE.BufferAttribute(lCol, 3));
  const lensMat = new THREE.PointsMaterial({
    size: 0.042, vertexColors: true, transparent: true, opacity: 0.7,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  });
  scene.add(new THREE.Points(lensGeo, lensMat));

  function glowRing(inner, outer, color, opacity, segs) {
    const g = new THREE.RingGeometry(inner, outer, segs || 128);
    const m = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.rotation.x = -Math.PI / 2 + 0.12;
    scene.add(mesh);
    return mesh;
  }

  const horizon = new THREE.Mesh(
    new THREE.SphereGeometry(Rs, 80, 80),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );
  scene.add(horizon);
  const shadow = new THREE.Mesh(
    new THREE.SphereGeometry(Rs * 1.05, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.8, depthWrite: false })
  );
  scene.add(shadow);

  const photonCore = glowRing(R_PHOTON * 0.98, R_PHOTON * 1.12, 0xfffaf0, 1.0, 200);
  const photonBloom = glowRing(R_PHOTON * 0.9, R_PHOTON * 1.28, 0xffe0a0, 0.45, 160);
  const photonSoft = glowRing(R_PHOTON * 0.82, R_PHOTON * 1.45, 0xffb060, 0.18, 128);
  const diskR1 = glowRing(R_ISCO * 0.95, R_ISCO * 1.35, 0xffe8c0, 0.35, 128);
  const diskR2 = glowRing(R_ISCO * 1.3, R_OUT * 0.45, 0xffb040, 0.2, 100);
  const diskR3 = glowRing(R_OUT * 0.4, R_OUT * 0.75, 0xe07020, 0.1, 80);
  const diskR4 = glowRing(R_OUT * 0.7, R_OUT * 1.05, 0xc04810, 0.045, 64);

  const diskPlane = new THREE.Mesh(
    new THREE.RingGeometry(R_ISCO * 0.98, R_OUT * 1.0, 128),
    new THREE.MeshBasicMaterial({
      color: 0xd86818, transparent: true, opacity: 0.07,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
    })
  );
  diskPlane.rotation.x = -Math.PI / 2 + 0.12;
  scene.add(diskPlane);

  const aura = new THREE.Mesh(
    new THREE.SphereGeometry(Rs * 2.0, 40, 40),
    new THREE.MeshBasicMaterial({
      color: 0xffa040, transparent: true, opacity: 0.06,
      blending: THREE.AdditiveBlending, depthWrite: false
    })
  );
  scene.add(aura);

  let mouseX = 0, mouseY = 0;
  let scrollY = 0, lastScrollY = 0, scrollVel = 0, scrollDir = 0;
  let suction = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.25;
  });
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  window.addEventListener('scroll', () => { scrollY = window.scrollY || 0; }, { passive: true });

  const clock = new THREE.Clock();

  function doppler(cr, cg, cb, vz) {
    const beta = Math.max(-0.45, Math.min(0.45, -vz * 0.09));
    const boost = Math.pow(1 + beta, 2.2);
    return [
      Math.min(1.45, cr * boost * (1 - beta * 0.1)),
      Math.min(1.3, cg * boost),
      Math.min(1.15, cb * boost * 0.9)
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
    const sTarget = scrollDir >= 0
      ? Math.min(1, progress * 0.9 + velMag * 0.5)
      : Math.max(0, progress * 0.2 - velMag * 0.35);
    suction += (sTarget - suction) * 0.04;
    const pull = suction * suction;

    const carr = cosmosGeo.attributes.position.array;
    for (let i = 0; i < COSMOS; i++) {
      const i3 = i * 3;
      const x = carr[i3], z = carr[i3 + 2];
      const ang = cSpd[i] * (1 + pull * 0.5);
      const cos = Math.cos(ang), sin = Math.sin(ang);
      carr[i3] = x * cos - z * sin;
      carr[i3 + 2] = x * sin + z * cos;
      if (pull > 0.1) {
        carr[i3] *= 1 - pull * 0.0008;
        carr[i3 + 1] *= 1 - pull * 0.0008;
        carr[i3 + 2] *= 1 - pull * 0.0008;
      }
    }
    cosmosGeo.attributes.position.needsUpdate = true;

    const karr = kinGeo.attributes.position.array;
    const kcols = kinGeo.attributes.color.array;
    for (let i = 0; i < KIN; i++) {
      const i3 = i * 3;
      const i4 = i * 4;
      let r = kBase[i4];
      let theta = kBase[i4 + 1];
      let y = kBase[i4 + 2];
      const spd = kBase[i4 + 3];
      const omega = (0.55 * spd) / Math.pow(r / Rs + 0.3, 1.4);
      theta += omega * dt * (1 + pull * 2);
      r -= (0.008 + pull * 0.025) * spd * (Rs / (r + 0.4));
      y *= 0.999;
      if (r < Rs * 1.15) {
        r = R_OUT * (0.9 + Math.random() * 0.5);
        theta = Math.random() * Math.PI * 2;
        y = (Math.random() - 0.5) * 0.9;
      }
      kBase[i4] = r; kBase[i4 + 1] = theta; kBase[i4 + 2] = y;
      karr[i3] = Math.cos(theta) * r;
      karr[i3 + 1] = y;
      karr[i3 + 2] = Math.sin(theta) * r;
      const near = Math.max(0.4, 1 - (r - Rs) / (R_OUT * 1.5));
      kcols[i3] = near;
      kcols[i3 + 1] = near * (0.65 + near * 0.3);
      kcols[i3 + 2] = near * 0.35;
    }
    kinGeo.attributes.position.needsUpdate = true;
    kinGeo.attributes.color.needsUpdate = true;

    const arr = diskGeo.attributes.position.array;
    const cols = diskGeo.attributes.color.array;
    for (let i = 0; i < DISK; i++) {
      const i3 = i * 3;
      const i4 = i * 4;
      let r = dBase[i4];
      let theta = dBase[i4 + 1];
      const h = dBase[i4 + 2];
      const br = dBase[i4 + 3];
      const omega = 0.5 / Math.pow(r / Rs + 0.2, 1.5);
      theta += omega * dt * (1 + pull * 1.3);
      dBase[i4 + 1] = theta;
      if (pull > 0.02) {
        r -= pull * 0.016 * (Rs / (r + 0.3));
        if (r < Rs * 1.12) { r = R_OUT * (0.75 + Math.random() * 0.25); theta = Math.random() * Math.PI * 2; }
        dBase[i4] = r; dBase[i4 + 1] = theta;
      }
      const cos = Math.cos(theta), sin = Math.sin(theta);
      arr[i3] = cos * r; arr[i3 + 1] = h * (1 - pull * 0.3); arr[i3 + 2] = sin * r;
      const grav = Math.max(0.3, Math.min(1, (r - Rs) / (R_OUT - Rs)));
      const d = doppler(dCol[i3], dCol[i3 + 1], dCol[i3 + 2], cos * omega * r);
      cols[i3] = d[0] * grav * br; cols[i3 + 1] = d[1] * grav * br; cols[i3 + 2] = d[2] * grav * br;
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
      const omega = 0.42 / Math.pow(r / Rs + 0.25, 1.5);
      theta += omega * dt * 0.9 * (1 + pull);
      lBase[i4 + 1] = theta;
      if (pull > 0.02) {
        r -= pull * 0.01;
        if (r < R_ISCO * 0.95) r = R_OUT * 0.75;
        lBase[i4] = r;
      }
      const far = Math.sin(theta);
      const back = Math.max(0, far);
      const phi = Math.cos(theta) * Math.PI * 0.55;
      const lensR = R_PHOTON * 1.1 + (r - R_ISCO) * 0.13;
      const arcH = side * (0.22 + (r / R_OUT) * 1.4) * (0.5 + back * 0.5);
      const blend = 0.4 + back * 0.55;
      const trueX = Math.cos(theta) * r, trueZ = Math.sin(theta) * r;
      const lensX = Math.sin(phi) * lensR;
      const lensZ = -Math.cos(phi) * lensR * 0.28 - Rs * 0.35;
      larr[i3] = trueX * (1 - blend) + lensX * blend;
      larr[i3 + 1] = arcH * blend;
      larr[i3 + 2] = trueZ * (1 - blend) + lensZ * blend;
      const vis = 0.25 + back * 0.75;
      const grav = Math.max(0.35, (r - Rs) / (R_OUT - Rs));
      const d = doppler(lCol[i3], lCol[i3 + 1], lCol[i3 + 2], Math.cos(theta) * omega * r);
      lcols[i3] = d[0] * grav * br * vis;
      lcols[i3 + 1] = d[1] * grav * br * vis;
      lcols[i3 + 2] = d[2] * grav * br * vis;
    }
    lensGeo.attributes.position.needsUpdate = true;
    lensGeo.attributes.color.needsUpdate = true;

    const hs = 1 + suction * 0.5;
    horizon.scale.setScalar(hs);
    shadow.scale.setScalar(hs);
    photonCore.scale.setScalar(hs);
    photonBloom.scale.setScalar(hs);
    photonSoft.scale.setScalar(hs);
    aura.scale.setScalar(hs * 1.05);

    photonCore.material.opacity = 0.92 + suction * 0.08;
    photonBloom.material.opacity = 0.4 + suction * 0.15;
    diskPlane.material.opacity = 0.055 + (1 - suction) * 0.03;
    aura.material.opacity = 0.05 + suction * 0.07;

    photonCore.rotation.z = t * 0.03;
    diskR1.rotation.z = t * 0.02;
    diskR2.rotation.z = -t * 0.012;
    diskR3.rotation.z = t * 0.008;
    diskPlane.rotation.z = t * 0.006;

    diskMat.opacity = 0.65 + (1 - suction) * 0.28;
    kinMat.opacity = 0.55 + pull * 0.35;
    kinMat.size = 0.04 + pull * 0.025;
    lensMat.opacity = 0.5 + (1 - suction) * 0.25;
    cosmos.material.opacity = 0.4 + (1 - suction) * 0.35;

    const camR = 10 - suction * 2.5;
    const camY = 1.8 - suction * 0.35 + mouseY * 0.3;
    camera.position.x += (mouseX * 1.0 - camera.position.x) * 0.03;
    camera.position.y += (camY - camera.position.y) * 0.03;
    camera.position.z += (camR - camera.position.z) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();
})();
