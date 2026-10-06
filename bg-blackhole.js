(function(){
  const canvas = document.getElementById('webgl');
  if (!canvas || typeof THREE === 'undefined') return;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 9;

  const COUNT = 1400;
  const positions = new Float32Array(COUNT * 3);
  const basePos = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const phases = new Float32Array(COUNT);
  const radii = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    const inDisk = Math.random() < 0.7;
    let x, y, z, r;
    if (inDisk) {
      r = 0.5 + Math.pow(Math.random(), 0.6) * 6.5;
      const a = Math.random() * Math.PI * 2;
      const h = (Math.random() - 0.5) * (0.15 + r * 0.04);
      x = Math.cos(a) * r; y = h; z = Math.sin(a) * r * 0.92;
    } else {
      r = 1.5 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      x = r * Math.sin(phi) * Math.cos(theta);
      y = r * Math.sin(phi) * Math.sin(theta) * 0.5;
      z = r * Math.cos(phi) * 0.75;
    }
    positions[i3] = basePos[i3] = x;
    positions[i3 + 1] = basePos[i3 + 1] = y;
    positions[i3 + 2] = basePos[i3 + 2] = z;
    phases[i] = Math.random() * Math.PI * 2;
    radii[i] = r || 3;
    const dist = Math.sqrt(x*x + z*z);
    if (dist < 1.2) { colors[i3] = 1; colors[i3+1] = 0.85; colors[i3+2] = 0.4; }
    else if (Math.random() > 0.55) { colors[i3] = 0.95; colors[i3+1] = 0.7; colors[i3+2] = 0.15; }
    else if (Math.random() > 0.4) { colors[i3] = 0.25; colors[i3+1] = 0.85; colors[i3+2] = 0.7; }
    else { colors[i3] = 0.6; colors[i3+1] = 0.65; colors[i3+2] = 0.85; }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.045, vertexColors: true, transparent: true, opacity: 0.85,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );
  scene.add(core);

  const photon = new THREE.Mesh(
    new THREE.RingGeometry(0.44, 0.52, 64),
    new THREE.MeshBasicMaterial({
      color: 0xffe4a0, transparent: true, opacity: 0.55,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
    })
  );
  photon.rotation.x = Math.PI / 2.15;
  scene.add(photon);

  function makeRing(inner, outer, color, opacity, tilt) {
    const g = new THREE.RingGeometry(inner, outer, 96);
    const m = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.rotation.x = tilt || Math.PI / 2.2;
    scene.add(mesh);
    return mesh;
  }
  const ring1 = makeRing(0.55, 0.95, 0xf0b429, 0.22, Math.PI / 2.2);
  const ring2 = makeRing(1.0, 1.8, 0xe8a020, 0.1, Math.PI / 2.25);
  const ring3 = makeRing(1.9, 3.2, 0x2dd4a8, 0.05, Math.PI / 2.3);
  const ring4 = makeRing(3.3, 4.8, 0xf0b429, 0.025, Math.PI / 2.35);

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(0.9, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0xf0b429, transparent: true, opacity: 0.08,
      blending: THREE.AdditiveBlending, depthWrite: false
    })
  );
  scene.add(halo);

  const MAX_LINKS = 380;
  const linePositions = new Float32Array(MAX_LINKS * 6);
  const lineColors = new Float32Array(MAX_LINKS * 6);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
  const lineMat = new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.2,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  scene.add(new THREE.LineSegments(lineGeo, lineMat));

  let mouseX = 0, mouseY = 0, scrollY = 0, lastScrollY = 0, scrollVel = 0, scrollDir = 0;
  let suction = 0, connect = 0.3;
  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
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
      suctionTarget = Math.min(1, progress * 0.92 + velMag * 0.65);
      connectTarget = Math.max(0.05, 0.35 - progress * 0.3 - velMag * 0.15);
    } else {
      suctionTarget = Math.max(0, progress * 0.28 - velMag * 0.5);
      connectTarget = Math.min(1, 0.4 + velMag * 0.6 + (1 - progress) * 0.3);
    }
    suction += (suctionTarget - suction) * 0.048;
    connect += (connectTarget - connect) * 0.05;

    const arr = geo.attributes.position.array;
    const pull = suction * suction;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const bx = basePos[i3], by = basePos[i3+1], bz = basePos[i3+2];
      const r0 = radii[i] || 3;
      const omega = (0.08 + 0.35 / (r0 + 0.3)) * (1 + pull * 2.5);
      const spin = t * omega + phases[i];
      const cos = Math.cos(spin), sin = Math.sin(spin);
      let tx = bx * cos - bz * sin;
      let tz = bx * sin + bz * cos;
      let ty = by + Math.sin(phases[i] + t * 0.2) * 0.04;

      const factor = 1 - pull * 0.97;
      tx *= factor; ty *= factor * (1 - pull * 0.4); tz *= factor;

      if (pull > 0.05) {
        const ang = t * (2 + pull * 5) + phases[i];
        const rr = Math.sqrt(tx*tx + tz*tz) + 0.001;
        tx += Math.cos(ang) * pull * 0.2 / Math.sqrt(rr);
        tz += Math.sin(ang) * pull * 0.2 / Math.sqrt(rr);
      }

      const ease = 0.04 + pull * 0.16;
      arr[i3] += (tx - arr[i3]) * ease;
      arr[i3+1] += (ty - arr[i3+1]) * ease;
      arr[i3+2] += (tz - arr[i3+2]) * ease;
    }
    geo.attributes.position.needsUpdate = true;

    linkTick++;
    if (linkTick % 2 === 0) {
      let linkCount = 0;
      const sample = 90;
      const threshold = 0.95 + (1 - connect) * 1.2;
      lineMat.opacity = 0.06 + connect * 0.28 * (1 - suction * 0.75);
      for (let a = 0; a < sample && linkCount < MAX_LINKS; a++) {
        const ia = (a * 19 + linkTick) % COUNT;
        const a3 = ia * 3;
        for (let b = 0; b < 5 && linkCount < MAX_LINKS; b++) {
          const ib = (ia + 13 + b * 29) % COUNT;
          if (ia === ib) continue;
          const b3 = ib * 3;
          const dx = arr[a3]-arr[b3], dy = arr[a3+1]-arr[b3+1], dz = arr[a3+2]-arr[b3+2];
          const dist = Math.sqrt(dx*dx+dy*dy+dz*dz);
          if (dist < threshold && dist > 0.1) {
            const l = linkCount * 6;
            linePositions[l]=arr[a3]; linePositions[l+1]=arr[a3+1]; linePositions[l+2]=arr[a3+2];
            linePositions[l+3]=arr[b3]; linePositions[l+4]=arr[b3+1]; linePositions[l+5]=arr[b3+2];
            const c = (ia % 3) / 3;
            lineColors[l]=0.9; lineColors[l+1]=0.65+c*0.2; lineColors[l+2]=0.2;
            lineColors[l+3]=0.2; lineColors[l+4]=0.8; lineColors[l+5]=0.65;
            linkCount++;
          }
        }
      }
      for (let i = linkCount * 6; i < MAX_LINKS * 6; i++) linePositions[i] = 0;
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;
      lineGeo.setDrawRange(0, linkCount * 2);
    }

    const cs = 1 + suction * 1.8;
    core.scale.setScalar(cs);
    photon.scale.setScalar(cs);
    photon.material.opacity = 0.4 + suction * 0.4;
    ring1.scale.setScalar(0.95 + suction * 1.2);
    ring2.scale.setScalar(1 + suction * 0.9);
    ring3.scale.setScalar(1 + suction * 0.6);
    ring4.scale.setScalar(1 + suction * 0.4);
    ring1.material.opacity = 0.15 + suction * 0.4;
    ring2.material.opacity = 0.08 + suction * 0.2;
    ring1.rotation.z = t * 0.25;
    ring2.rotation.z = -t * 0.12;
    ring3.rotation.z = t * 0.06;
    ring4.rotation.z = -t * 0.03;
    photon.rotation.z = t * 0.4;
    halo.scale.setScalar(1 + suction * 2.2);
    halo.material.opacity = 0.05 + suction * 0.18;
    mat.opacity = 0.55 + (1 - suction) * 0.35;
    mat.size = 0.032 + (1 - suction) * 0.02 + connect * 0.01;

    points.rotation.y = t * 0.01;
    camera.position.x += (mouseX - camera.position.x) * 0.035;
    camera.position.y += (-mouseY - camera.position.y) * 0.035;
    camera.position.z = 9 - suction * 2.2;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  animate();
})();
