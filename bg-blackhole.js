(function(){
  const canvas = document.getElementById('webgl');
  if (!canvas || typeof THREE === 'undefined') return;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 8;
  const COUNT = 1100;
  const positions = new Float32Array(COUNT * 3);
  const basePos = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const phases = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    const inDisk = Math.random() < 0.55;
    let x, y, z;
    if (inDisk) {
      const r = 0.8 + Math.random() * 5.5;
      const a = Math.random() * Math.PI * 2;
      x = Math.cos(a) * r; y = (Math.random() - 0.5) * 0.55 * (1 + Math.random()); z = Math.sin(a) * r * 0.9;
    } else {
      const r = 2 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      x = r * Math.sin(phi) * Math.cos(theta);
      y = r * Math.sin(phi) * Math.sin(theta) * 0.65;
      z = r * Math.cos(phi) * 0.8;
    }
    positions[i3] = basePos[i3] = x;
    positions[i3 + 1] = basePos[i3 + 1] = y;
    positions[i3 + 2] = basePos[i3 + 2] = z;
    phases[i] = Math.random() * Math.PI * 2;
    const t = Math.random();
    if (t > 0.72) { colors[i3] = 0.96; colors[i3+1] = 0.72; colors[i3+2] = 0.18; }
    else if (t > 0.4) { colors[i3] = 0.2; colors[i3+1] = 0.85; colors[i3+2] = 0.68; }
    else { colors[i3] = 0.7; colors[i3+1] = 0.75; colors[i3+2] = 0.9; }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({ size: 0.042, vertexColors: true, transparent: true, opacity: 0.78, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
  const points = new THREE.Points(geo, mat);
  scene.add(points);
  const MAX_LINKS = 420;
  const linePositions = new Float32Array(MAX_LINKS * 6);
  const lineColors = new Float32Array(MAX_LINKS * 6);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
  const lineMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false });
  scene.add(new THREE.LineSegments(lineGeo, lineMat));
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.18, 32, 32), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  scene.add(core);
  function makeRing(inner, outer, color, opacity) {
    const g = new THREE.RingGeometry(inner, outer, 64);
    const m = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
    const mesh = new THREE.Mesh(g, m);
    mesh.rotation.x = Math.PI / 2.4;
    scene.add(mesh);
    return mesh;
  }
  const ring1 = makeRing(0.35, 0.55, 0xf0b429, 0.18);
  const ring2 = makeRing(0.65, 1.15, 0x2dd4a8, 0.08);
  const ring3 = makeRing(1.3, 1.9, 0xf0b429, 0.04);
  const halo = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), new THREE.MeshBasicMaterial({ color: 0xf0b429, transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(halo);
  let mouseX = 0, mouseY = 0, scrollY = 0, lastScrollY = 0, scrollVel = 0, scrollDir = 0, suction = 0, connect = 0.35;
  window.addEventListener('mousemove', e => { mouseX = (e.clientX / window.innerWidth - 0.5) * 0.45; mouseY = (e.clientY / window.innerHeight - 0.5) * 0.3; });
  window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
  window.addEventListener('scroll', () => { scrollY = window.scrollY || 0; }, { passive: true });
  const clock = new THREE.Clock();
  let linkTick = 0;
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const dy = scrollY - lastScrollY;
    scrollVel += (dy - scrollVel) * 0.14;
    lastScrollY = scrollY;
    if (Math.abs(scrollVel) > 0.35) scrollDir = scrollVel > 0 ? 1 : -1;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, scrollY / maxScroll);
    const velMag = Math.min(1, Math.abs(scrollVel) / 24);
    let suctionTarget, connectTarget;
    if (scrollDir >= 0) { suctionTarget = Math.min(1, progress * 0.9 + velMag * 0.6); connectTarget = Math.max(0.08, 0.4 - progress * 0.35 - velMag * 0.2); }
    else { suctionTarget = Math.max(0, progress * 0.3 - velMag * 0.45); connectTarget = Math.min(1, 0.45 + velMag * 0.55 + (1 - progress) * 0.35); }
    suction += (suctionTarget - suction) * 0.05;
    connect += (connectTarget - connect) * 0.055;
    const arr = geo.attributes.position.array;
    const pull = suction * suction;
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const ph = phases[i] + t * (0.12 + pull * 0.8);
      const bx = basePos[i3], by = basePos[i3+1], bz = basePos[i3+2];
      const spin = t * 0.08 * (1 + pull * 2);
      const cos = Math.cos(spin + phases[i] * 0.01), sin = Math.sin(spin + phases[i] * 0.01);
      let tx = bx * cos - bz * sin, tz = bx * sin + bz * cos, ty = by + Math.sin(ph) * 0.08;
      const factor = 1 - pull * 0.95;
      tx *= factor; ty *= factor * (1 - pull * 0.3); tz *= factor;
      if (pull > 0.08) {
        const ang = t * (1.2 + pull * 3) + phases[i];
        const r = Math.sqrt(tx*tx + tz*tz) + 0.001;
        tx += Math.cos(ang) * pull * 0.15 / r;
        tz += Math.sin(ang) * pull * 0.15 / r;
      }
      const ease = 0.05 + pull * 0.14;
      arr[i3] += (tx - arr[i3]) * ease;
      arr[i3+1] += (ty - arr[i3+1]) * ease;
      arr[i3+2] += (tz - arr[i3+2]) * ease;
    }
    geo.attributes.position.needsUpdate = true;
    linkTick++;
    if (linkTick % 2 === 0) {
      let linkCount = 0;
      const sample = 85, threshold = 1.0 + (1 - connect) * 1.1;
      lineMat.opacity = 0.08 + connect * 0.32 * (1 - suction * 0.7);
      for (let a = 0; a < sample && linkCount < MAX_LINKS; a++) {
        const ia = (a * 17 + linkTick) % COUNT, a3 = ia * 3;
        for (let b = 0; b < 6 && linkCount < MAX_LINKS; b++) {
          const ib = (ia + 11 + b * 23) % COUNT;
          if (ia === ib) continue;
          const b3 = ib * 3;
          const dx = arr[a3] - arr[b3], dy = arr[a3+1] - arr[b3+1], dz = arr[a3+2] - arr[b3+2];
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (dist < threshold && dist > 0.12) {
            const l = linkCount * 6;
            linePositions[l] = arr[a3]; linePositions[l+1] = arr[a3+1]; linePositions[l+2] = arr[a3+2];
            linePositions[l+3] = arr[b3]; linePositions[l+4] = arr[b3+1]; linePositions[l+5] = arr[b3+2];
            const c = (ia % 3) / 3;
            lineColors[l] = 0.2 + c * 0.7; lineColors[l+1] = 0.75; lineColors[l+2] = 0.5 + c * 0.2;
            lineColors[l+3] = 0.9; lineColors[l+4] = 0.7; lineColors[l+5] = 0.2;
            linkCount++;
          }
        }
      }
      for (let i = linkCount * 6; i < MAX_LINKS * 6; i++) linePositions[i] = 0;
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;
      lineGeo.setDrawRange(0, linkCount * 2);
    }
    const cs = 0.6 + suction * 3.2;
    core.scale.setScalar(cs);
    ring1.scale.setScalar(0.9 + suction * 1.8);
    ring2.scale.setScalar(1 + suction * 1.4);
    ring3.scale.setScalar(1 + suction * 1.1);
    ring1.material.opacity = 0.12 + suction * 0.35;
    ring2.material.opacity = 0.06 + suction * 0.18;
    ring3.material.opacity = 0.03 + suction * 0.1;
    ring1.rotation.z = t * 0.15; ring2.rotation.z = -t * 0.08; ring3.rotation.z = t * 0.05;
    halo.scale.setScalar(0.9 + suction * 2.5);
    halo.material.opacity = 0.04 + suction * 0.14;
    mat.opacity = 0.5 + (1 - suction) * 0.35;
    mat.size = 0.03 + (1 - suction) * 0.02 + connect * 0.012;
    points.rotation.y = t * 0.015;
    camera.position.x += (mouseX - camera.position.x) * 0.04;
    camera.position.y += (-mouseY - camera.position.y) * 0.04;
    camera.position.z = 8 - suction * 1.8;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  animate();
})();
