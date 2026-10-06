(function () {
  const canvas = document.getElementById('webgl');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.05, 200);
  camera.position.set(0, 2.8, 11);
  camera.lookAt(0, 0, 0);

  const STAR_N = 600;
  const starPos = new Float32Array(STAR_N * 3);
  const starCol = new Float32Array(STAR_N * 3);
  for (let i = 0; i < STAR_N; i++) {
    const i3 = i * 3;
    const r = 18 + Math.random() * 40;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    starPos[i3] = r * Math.sin(ph) * Math.cos(th);
    starPos[i3 + 1] = r * Math.sin(ph) * Math.sin(th);
    starPos[i3 + 2] = r * Math.cos(ph);
    const b = 0.55 + Math.random() * 0.45;
    starCol[i3] = b;
    starCol[i3 + 1] = b * (0.9 + Math.random() * 0.1);
    starCol[i3 + 2] = b * (0.85 + Math.random() * 0.15);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({
      size: 0.06, vertexColors: true, transparent: true, opacity: 0.7,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    })
  );
  scene.add(stars);

  const DISK = 2200;
  const dPos = new Float32Array(DISK * 3);
  const dBase = new Float32Array(DISK * 3);
  const dCol = new Float32Array(DISK * 3);
  const dPhase = new Float32Array(DISK);

  const Rs = 0.55;
  const R_ISCO = Rs * 3.0;
  const R_OUT = 7.5;

  for (let i = 0; i < DISK; i++) {
    const u = Math.random();
    const r = R_ISCO + Math.pow(u, 1.4) * (R_OUT - R_ISCO);
    const theta = Math.random() * Math.PI * 2;
    const h = (Math.random() - 0.5) * 0.08 * (r / R_OUT);
    dBase[i * 3] = r;
    dBase[i * 3 + 1] = theta;
    dBase[i * 3 + 2] = h;
    dPhase[i] = Math.random() * Math.PI * 2;

    const t = (r - R_ISCO) / (R_OUT - R_ISCO);
    let cr, cg, cb;
    if (t < 0.25) {
      const k = t / 0.25;
      cr = 0.85 + k * 0.15;
      cg = 0.9 - k * 0.15;
      cb = 1.0 - k * 0.3;
    } else if (t < 0.55) {
      const k = (t - 0.25) / 0.3;
      cr = 1.0;
      cg = 0.75 - k * 0.25;
      cb = 0.7 - k * 0.4;
    } else {
      const k = (t - 0.55) / 0.45;
      cr = 1.0 - k * 0.15;
      cg = 0.5 - k * 0.35;
      cb = 0.3 - k * 0.2;
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
    size: 0.038, vertexColors: true, transparent: true, opacity: 0.9,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  });
  const disk = new THREE.Points(diskGeo, diskMat);
  scene.add(disk);

  const COR = 400;
  const cPos = new Float32Array(COR * 3);
  const cBase = new Float32Array(COR * 3);
  const cCol = new Float32Array(COR * 3);
  const cPhase = new Float32Array(COR);
  for (let i = 0; i < COR; i++) {
    const r = R_ISCO + Math.random() * 2.5;
    const theta = Math.random() * Math.PI * 2;
    const h = (Math.random() - 0.5) * 1.8;
    cBase[i * 3] = r;
    cBase[i * 3 + 1] = theta;
    cBase[i * 3 + 2] = h;
    cPhase[i] = Math.random() * Math.PI * 2;
    cPos[i * 3] = Math.cos(theta) * r * 0.3;
    cPos[i * 3 + 1] = h;
    cPos[i * 3 + 2] = Math.sin(theta) * r * 0.3;
    const hot = Math.random();
    cCol[i * 3] = 0.6 + hot * 0.4;
    cCol[i * 3 + 1] = 0.7 + hot * 0.2;
    cCol[i * 3 + 2] = 1.0;
  }
  const corGeo = new THREE.BufferGeometry();
  corGeo.setAttribute('position', new THREE.BufferAttribute(cPos, 3));
  corGeo.setAttribute('color', new THREE.BufferAttribute(cCol, 3));
  const corona = new THREE.Points(
    corGeo,
    new THREE.PointsMaterial({
      size: 0.028, vertexColors: true, transparent: true, opacity: 0.35,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    })
  );
  scene.add(corona);

  const horizon = new THREE.Mesh(
    new THREE.SphereGeometry(Rs, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );
  scene.add(horizon);

  const shadow = new THREE.Mesh(
    new THREE.SphereGeometry(Rs * 1.15, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.55, depthWrite: false })
  );
  scene.add(shadow);

  function glowRing(inner, outer, color, opacity, segments) {
    const g = new THREE.RingGeometry(inner, outer, segments || 128);
    const m = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.rotation.x = -Math.PI / 2 + 0.18;
    scene.add(mesh);
    return mesh;
  }

  const photonRing = glowRing(Rs * 1.48, Rs * 1.62, 0xfff0c8, 0.85, 160);
  const photonSoft = glowRing(Rs * 1.35, Rs * 1.75, 0xffd080, 0.25, 128);
  const diskGlow1 = glowRing(R_ISCO * 0.95, R_ISCO * 1.4, 0xffb040, 0.18, 96);
  const diskGlow2 = glowRing(R_ISCO * 1.5, R_OUT * 0.55, 0xe08020, 0.08, 80);
  const diskGlow3 = glowRing(R_OUT * 0.5, R_OUT * 0.95, 0xc04010, 0.04, 64);

  const lensGlow = new THREE.Mesh(
    new THREE.SphereGeometry(Rs * 2.2, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0xffc060, transparent: true, opacity: 0.06,
      blending: THREE.AdditiveBlending, depthWrite: false
    })
  );
  scene.add(lensGlow);

  const MAX_LINKS = 220;
  const linePos = new Float32Array(MAX_LINKS * 6);
  const lineCol = new Float32Array(MAX_LINKS * 6);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lineCol, 3));
  const lineMat = new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.15,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  scene.add(new THREE.LineSegments(lineGeo, lineMat));

  let mouseX = 0, mouseY = 0;
  let scrollY = 0, lastScrollY = 0, scrollVel = 0, scrollDir = 0;
  let suction = 0, connect = 0.25;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.55;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.35;
  });
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  window.addEventListener('scroll', () => { scrollY = window.scrollY || 0; }, { passive: true });

  const clock = new THREE.Clock();
  let linkTick = 0;

  function applyDoppler(cr, cg, cb, vx, vz, viewX, viewZ) {
    const los = vx * viewX + vz * viewZ;
    const beta = Math.max(-0.35, Math.min(0.35, los * 0.08));
    const boost = 1 + beta * 1.4;
    return [
      Math.min(1.2, cr * (1 - beta * 0.5)),
      Math.min(1.2, cg * boost * 0.95),
      Math.min(1.3, cb * boost)
    ];
  }

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    const dy = scrollY - lastScrollY;
    scrollVel += (dy - scrollVel) * 0.12;
    lastScrollY = scrollY;
    if (Math.abs(scrollVel) > 0.3) scrollDir = scrollVel > 0 ? 1 : -1;

    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, scrollY / maxScroll);
    const velMag = Math.min(1, Math.abs(scrollVel) / 22);

    let suctionTarget, connectTarget;
    if (scrollDir >= 0) {
      suctionTarget = Math.min(1, progress * 0.88 + velMag * 0.6);
      connectTarget = Math.max(0.04, 0.3 - progress * 0.28 - velMag * 0.12);
    } else {
      suctionTarget = Math.max(0, progress * 0.25 - velMag * 0.45);
      connectTarget = Math.min(1, 0.35 + velMag * 0.55 + (1 - progress) * 0.28);
    }
    suction += (suctionTarget - suction) * 0.045;
    connect += (connectTarget - connect) * 0.05;

    const pull = suction * suction;
    const arr = diskGeo.attributes.position.array;
    const cols = diskGeo.attributes.color.array;
    const viewX = Math.sin(mouseX * 0.3);
    const viewZ = Math.cos(mouseX * 0.3);

    for (let i = 0; i < DISK; i++) {
      const i3 = i * 3;
      let r = dBase[i3];
      let theta = dBase[i3 + 1];
      const h = dBase[i3 + 2];

      const omega = 0.55 / Math.pow(r + 0.15, 1.5);
      theta += omega * 0.016 * (1 + pull * 1.8);
      dBase[i3 + 1] = theta;

      if (pull > 0.02) {
        r -= pull * 0.012 * (1.2 / (r + 0.3));
        if (r < Rs * 1.05) {
          r = R_OUT * (0.7 + Math.random() * 0.3);
          theta = Math.random() * Math.PI * 2;
        }
        dBase[i3] = r;
        dBase[i3 + 1] = theta;
      }

      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      let x = cos * r;
      let z = sin * r;
      let y = h * (1 - pull * 0.5);

      if (r < Rs * 4) {
        const drag = (1 - r / (Rs * 4)) * pull * 0.4;
        const a2 = theta + drag * 2;
        x = Math.cos(a2) * r;
        z = Math.sin(a2) * r;
      }

      arr[i3] = x;
      arr[i3 + 1] = y;
      arr[i3 + 2] = z;

      const grav = Math.max(0.35, Math.min(1, (r - Rs) / (R_OUT - Rs)));
      const vx = -sin * omega * r;
      const vz = cos * omega * r;
      let cr = dCol[i3], cg = dCol[i3 + 1], cb = dCol[i3 + 2];
      const dop = applyDoppler(cr, cg, cb, vx, vz, viewX, viewZ);
      cols[i3] = dop[0] * grav;
      cols[i3 + 1] = dop[1] * grav;
      cols[i3 + 2] = dop[2] * grav * (0.7 + grav * 0.3);
    }
    diskGeo.attributes.position.needsUpdate = true;
    diskGeo.attributes.color.needsUpdate = true;

    const carr = corGeo.attributes.position.array;
    for (let i = 0; i < COR; i++) {
      const i3 = i * 3;
      let r = cBase[i3];
      let theta = cBase[i3 + 1] + t * (0.15 / (r + 0.5)) + cPhase[i] * 0.001;
      let h = cBase[i3 + 2];
      const fall = 1 - pull * 0.85;
      r = cBase[i3] * fall + Rs * 1.2 * pull;
      h *= fall;
      carr[i3] = Math.cos(theta) * r * 0.5;
      carr[i3 + 1] = h;
      carr[i3 + 2] = Math.sin(theta) * r * 0.5;
    }
    corGeo.attributes.position.needsUpdate = true;

    linkTick++;
    if (linkTick % 3 === 0) {
      let n = 0;
      const thresh = 0.9 + (1 - connect) * 1.0;
      lineMat.opacity = 0.05 + connect * 0.22 * (1 - suction * 0.7);
      for (let a = 0; a < 60 && n < MAX_LINKS; a++) {
        const ia = (a * 37 + linkTick) % DISK;
        const a3 = ia * 3;
        for (let b = 0; b < 3 && n < MAX_LINKS; b++) {
          const ib = (ia + 41 + b * 17) % DISK;
          const b3 = ib * 3;
          const dx = arr[a3] - arr[b3];
          const dy = arr[a3 + 1] - arr[b3 + 1];
          const dz = arr[a3 + 2] - arr[b3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < thresh && dist > 0.12) {
            const l = n * 6;
            linePos[l] = arr[a3]; linePos[l + 1] = arr[a3 + 1]; linePos[l + 2] = arr[a3 + 2];
            linePos[l + 3] = arr[b3]; linePos[l + 4] = arr[b3 + 1]; linePos[l + 5] = arr[b3 + 2];
            lineCol[l] = 1; lineCol[l + 1] = 0.7; lineCol[l + 2] = 0.3;
            lineCol[l + 3] = 0.9; lineCol[l + 4] = 0.4; lineCol[l + 5] = 0.15;
            n++;
          }
        }
      }
      for (let i = n * 6; i < MAX_LINKS * 6; i++) linePos[i] = 0;
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;
      lineGeo.setDrawRange(0, n * 2);
    }

    const hs = 1 + suction * 1.35;
    horizon.scale.setScalar(hs);
    shadow.scale.setScalar(hs);
    photonRing.scale.setScalar(hs);
    photonSoft.scale.setScalar(hs);
    photonRing.material.opacity = 0.7 + suction * 0.25;
    photonSoft.material.opacity = 0.18 + suction * 0.2;
    lensGlow.scale.setScalar(hs * 1.1);
    lensGlow.material.opacity = 0.04 + suction * 0.12;

    photonRing.rotation.z = t * 0.08;
    diskGlow1.rotation.z = t * 0.04;
    diskGlow2.rotation.z = -t * 0.02;

    diskMat.opacity = 0.55 + (1 - suction) * 0.4;
    diskMat.size = 0.028 + (1 - suction) * 0.016;

    const camR = 11 - suction * 3.5;
    const camY = 2.8 - suction * 0.8 + mouseY * 0.5;
    const targetX = mouseX * 1.2;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (camY - camera.position.y) * 0.04;
    camera.position.z += (camR - camera.position.z) * 0.04;
    camera.lookAt(0, 0, 0);

    stars.rotation.y = t * 0.008;
    stars.material.opacity = 0.45 + (1 - suction) * 0.3;

    renderer.render(scene, camera);
  }
  animate();
})();
