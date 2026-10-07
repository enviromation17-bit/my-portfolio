(function () {
  (function initGlobal() {
    const canvas = document.getElementById('webgl');
    if (!canvas || typeof THREE === 'undefined') return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x08090c, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 120);
    camera.position.set(0, 0, 14);

    const COUNT = 900;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const r = 5 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.65;
      positions[i3 + 2] = r * Math.cos(phi);
      const t = Math.random();
      if (t > 0.85) { colors[i3] = 0.95; colors[i3+1] = 0.78; colors[i3+2] = 0.35; }
      else if (t > 0.65) { colors[i3] = 0.8; colors[i3+1] = 0.85; colors[i3+2] = 0.95; }
      else { const g = 0.4 + Math.random() * 0.3; colors[i3] = g; colors[i3+1] = g * 0.98; colors[i3+2] = g * 0.9; }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.05, vertexColors: true, transparent: true, opacity: 0.45,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0, scrollP = 0;
    window.addEventListener('mousemove', (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
    window.addEventListener('scroll', () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollP = Math.min(1, (window.scrollY || 0) / max);
    }, { passive: true });
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function animate() {
      requestAnimationFrame(animate);
      if (!reduceMotion) {
        mouseX += (targetX - mouseX) * 0.04;
        mouseY += (targetY - mouseY) * 0.04;
        points.rotation.y = scrollP * Math.PI * 1.2 + mouseX * 0.08;
        points.rotation.x = mouseY * 0.05 + scrollP * 0.15;
      }
      camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.7 + scrollP * 0.4 - camera.position.y) * 0.05;
      camera.position.z += (14 - scrollP * 3 - camera.position.z) * 0.05;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
    animate();
  })();

  (function initPinned3D() {
    const canvas = document.getElementById('scrub3d');
    if (!canvas || typeof THREE === 'undefined') return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x08090c, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0.5, 10);

    function resize() {
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    const N = 2600;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const baseR = new Float32Array(N);
    const baseTheta = new Float32Array(N);
    const baseY = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      const r = 1.35 + Math.pow(Math.random(), 0.65) * 5.8;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 0.12 * (r / 6);
      baseR[i] = r;
      baseTheta[i] = theta;
      baseY[i] = y;
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * r;
      const t = (r - 1.35) / 5.8;
      if (t < 0.18) { col[i*3] = 1; col[i*3+1] = 0.96; col[i*3+2] = 0.8; }
      else if (t < 0.45) { col[i*3] = 0.98; col[i*3+1] = 0.75; col[i*3+2] = 0.32; }
      else if (t < 0.75) { col[i*3] = 0.85; col[i*3+1] = 0.55; col[i*3+2] = 0.22; }
      else { col[i*3] = 0.55; col[i*3+1] = 0.4; col[i*3+2] = 0.2; }
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.042, vertexColors: true, transparent: true, opacity: 0.88,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    });
    scene.add(new THREE.Points(pGeo, pMat));

    const hole = new THREE.Mesh(
      new THREE.SphereGeometry(1.12, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    scene.add(hole);

    const photon = new THREE.Mesh(
      new THREE.TorusGeometry(1.42, 0.028, 12, 140),
      new THREE.MeshBasicMaterial({ color: 0xfff0c8, transparent: true, opacity: 0.95 })
    );
    photon.rotation.x = Math.PI / 2;
    scene.add(photon);

    const ringA = new THREE.Mesh(
      new THREE.TorusGeometry(3.1, 0.012, 8, 120),
      new THREE.MeshBasicMaterial({ color: 0xd4a017, transparent: true, opacity: 0.22 })
    );
    ringA.rotation.x = Math.PI / 2 + 0.1;
    scene.add(ringA);

    const ringB = new THREE.Mesh(
      new THREE.TorusGeometry(4.9, 0.009, 6, 120),
      new THREE.MeshBasicMaterial({ color: 0x8b92a5, transparent: true, opacity: 0.12 })
    );
    ringB.rotation.x = Math.PI / 2 - 0.08;
    scene.add(ringB);

    const glow = new THREE.Mesh(
      new THREE.CircleGeometry(4.2, 48),
      new THREE.MeshBasicMaterial({
        color: 0xd4a017, transparent: true, opacity: 0.05,
        side: THREE.DoubleSide, depthWrite: false
      })
    );
    glow.rotation.x = -Math.PI / 2;
    scene.add(glow);

    let scrubTarget = 0;
    let scrub = 0;
    let mouseX = 0, mouseY = 0;

    window.addEventListener('blackhole:scrub', (e) => {
      scrubTarget = (e.detail && typeof e.detail.progress === 'number') ? e.detail.progress : 0;
    });
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    const TOTAL_SPIN = Math.PI * 5;

    function applyScrub(p) {
      const e = p * p * (3 - 2 * p);

      const arr = pGeo.attributes.position.array;
      for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        const kepler = Math.pow(2.2 / (baseR[i] + 0.4), 1.25);
        const theta = baseTheta[i] + e * TOTAL_SPIN * kepler;
        const r = baseR[i] * (1 - e * 0.35) + 1.2 * e * 0.15;
        const y = baseY[i] * (1 - e * 0.5);
        arr[i3] = Math.cos(theta) * r;
        arr[i3 + 1] = y;
        arr[i3 + 2] = Math.sin(theta) * r;
      }
      pGeo.attributes.position.needsUpdate = true;

      photon.rotation.z = e * TOTAL_SPIN * 0.6;
      ringA.rotation.z = e * TOTAL_SPIN * 0.35;
      ringB.rotation.z = -e * TOTAL_SPIN * 0.25;
      ringA.rotation.x = Math.PI / 2 + 0.1 + e * 0.15;
      ringB.rotation.x = Math.PI / 2 - 0.08 - e * 0.1;

      const s = 1 + e * 0.35;
      hole.scale.setScalar(s);
      photon.scale.setScalar(1 + e * 0.2);

      const camZ = 10 - e * 5.5;
      const camY = 0.5 + e * 1.4;
      const camX = mouseX * (1.2 - e * 0.4);
      camera.position.x += (camX - camera.position.x) * 0.12;
      camera.position.y += (camY + mouseY * 0.25 - camera.position.y) * 0.12;
      camera.position.z += (camZ - camera.position.z) * 0.12;
      camera.lookAt(0, e * 0.15, 0);

      pMat.opacity = 0.65 + e * 0.3;
      photon.material.opacity = 0.75 + e * 0.25;
      glow.material.opacity = 0.04 + e * 0.06;
    }

    function animate() {
      requestAnimationFrame(animate);
      const lerp = reduceMotion ? 1 : 0.14;
      scrub += (scrubTarget - scrub) * lerp;
      applyScrub(scrub);
      renderer.render(scene, camera);
    }
    animate();
  })();
})();
