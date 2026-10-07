(function () {
  // Clean professional 3D field — cursor parallax + scroll depth
  // Free: Three.js r128 (CDN)
  const canvas = document.getElementById('webgl');
  if (!canvas || typeof THREE === 'undefined') return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x08090c, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.set(0, 0, 14);

  const COUNT = 1400;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    const r = 4 + Math.random() * 22;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
    positions[i3 + 2] = r * Math.cos(phi);

    const t = Math.random();
    if (t > 0.82) {
      colors[i3] = 0.95; colors[i3 + 1] = 0.78; colors[i3 + 2] = 0.35;
    } else if (t > 0.6) {
      colors[i3] = 0.85; colors[i3 + 1] = 0.88; colors[i3 + 2] = 0.95;
    } else {
      const g = 0.45 + Math.random() * 0.35;
      colors[i3] = g; colors[i3 + 1] = g * 0.98; colors[i3 + 2] = g * 0.9;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const ringGeo = new THREE.TorusGeometry(5.2, 0.012, 8, 180);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xd4a017,
    transparent: true,
    opacity: 0.14,
    depthWrite: false
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI * 0.42;
  ring.rotation.y = 0.15;
  scene.add(ring);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(7.8, 0.008, 6, 160),
    new THREE.MeshBasicMaterial({
      color: 0x8b92a5,
      transparent: true,
      opacity: 0.07,
      depthWrite: false
    })
  );
  ring2.rotation.x = Math.PI * 0.38;
  ring2.rotation.z = 0.2;
  scene.add(ring2);

  const glow = new THREE.Mesh(
    new THREE.CircleGeometry(2.2, 48),
    new THREE.MeshBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0.035,
      depthWrite: false,
      side: THREE.DoubleSide
    })
  );
  glow.position.z = -2;
  scene.add(glow);

  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let scrub = 0;
  let scrollY = 0;

  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY || 0;
  }, { passive: true });

  window.addEventListener('blackhole:scrub', (e) => {
    scrub = (e.detail && typeof e.detail.progress === 'number') ? e.detail.progress : 0;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  const reduceMotionFlag = reduceMotion;

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (!reduceMotionFlag) {
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;
      points.rotation.y = t * 0.018 + mouseX * 0.08;
      points.rotation.x = mouseY * 0.05 + Math.sin(t * 0.1) * 0.02;
    }

    ring.rotation.z = t * 0.06;
    ring2.rotation.z = -t * 0.035;
    ring.rotation.x = Math.PI * 0.42 + mouseY * 0.06;
    ring2.rotation.x = Math.PI * 0.38 + mouseY * 0.04;

    glow.position.x = mouseX * 0.4;
    glow.position.y = -mouseY * 0.3;

    mat.opacity = 0.55 + (1 - scrub) * 0.15;
    ringMat.opacity = 0.1 + scrub * 0.08;
    glow.material.opacity = 0.03 + scrub * 0.04;

    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const pageP = Math.min(1, scrollY / maxScroll);
    const camZ = 14 - pageP * 2.2 - scrub * 1.8;
    const camX = mouseX * 1.4;
    const camY = -mouseY * 0.9 + pageP * 0.3;

    camera.position.x += (camX - camera.position.x) * 0.05;
    camera.position.y += (camY - camera.position.y) * 0.05;
    camera.position.z += (camZ - camera.position.z) * 0.05;
    camera.lookAt(mouseX * 0.3, -mouseY * 0.2, 0);

    renderer.render(scene, camera);
  }

  animate();
})();
